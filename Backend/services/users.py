# ============================================================================
# Users Service
# ============================================================================
# This module contains all database operations for users
# Functions here handle: getting users, creating users, updating users, managing addresses
# ============================================================================

from database.db import get_db_connection, get_db_pool
from typing import List, Optional
from uuid import UUID

def get_user(user_id: str) -> Optional[dict]:
    """
    Get a user by ID or Cognito user ID.
    
    This function can find users by:
    1. UUID (the database user ID)
    2. Cognito user ID (if using AWS Cognito for authentication)
    
    Args:
        user_id: Either a UUID string or Cognito user ID
    
    Returns:
        User dictionary with addresses if found, None if not found
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Try to find user by UUID first, then by Cognito user ID
            try:
                # Try converting to UUID (will fail if it's a Cognito ID)
                user_uuid = UUID(user_id)
                cur.execute("""
                    SELECT * FROM users WHERE id = %s
                """, (str(user_uuid),))
            except ValueError:
                # Not a UUID, try Cognito user ID
                cur.execute("""
                    SELECT * FROM users WHERE cognito_user_id = %s
                """, (user_id,))
            
            user = cur.fetchone()
            if not user:
                return None  # User not found
            
            # Get user addresses
            cur.execute("""
                SELECT * FROM user_addresses 
                WHERE user_id = %s
                ORDER BY is_default DESC, created_at ASC
            """, (user['id'],))
            addresses = cur.fetchall()
            
            # Build user dictionary with addresses
            return {
                'id': str(user['id']),
                'cognito_user_id': user['cognito_user_id'],
                'email': user['email'],
                'name': user['name'],
                'phone': user['phone'],
                'addresses': [
                    {
                        'id': str(addr['id']),
                        'street': addr['street'],
                        'city': addr['city'],
                        'state': addr['state'],
                        'zip': addr['zip'],
                        'country': addr['country'],
                        'isDefault': addr['is_default'],  # camelCase for frontend compatibility
                    }
                    for addr in addresses
                ],
                'created_at': user['created_at'].isoformat() if hasattr(user['created_at'], 'isoformat') else str(user['created_at']) if user['created_at'] else None,
                'updated_at': user['updated_at'].isoformat() if hasattr(user['updated_at'], 'isoformat') else str(user['updated_at']) if user['updated_at'] else None,
            }

def get_user_by_email(email: str) -> Optional[dict]:
    """
    Get a user by email address.
    
    Args:
        email: User's email address
    
    Returns:
        User dictionary if found, None if not found
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM users WHERE email = %s
            """, (email,))
            user = cur.fetchone()
            return dict(user) if user else None

def create_user(user_data: dict) -> dict:
    """
    Create a new user in the database.
    
    Args:
        user_data: Dictionary containing user information:
            - cognito_user_id: AWS Cognito user ID (optional, if using Cognito)
            - email: User's email address (required)
            - name: User's full name (optional)
            - phone: User's phone number (optional)
    
    Returns:
        Dictionary of the created user
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO users (cognito_user_id, email, name, phone)
                VALUES (%s, %s, %s, %s)
                RETURNING *
            """, (
                user_data.get('cognito_user_id'),  # Optional
                user_data['email'],                # Required
                user_data.get('name'),             # Optional
                user_data.get('phone'),            # Optional
            ))
            user = cur.fetchone()
            return {
                'id': str(user['id']),
                'cognito_user_id': user['cognito_user_id'],
                'email': user['email'],
                'name': user['name'],
                'phone': user['phone'],
                'created_at': user['created_at'].isoformat() if hasattr(user['created_at'], 'isoformat') else str(user['created_at']) if user['created_at'] else None,
            }

def update_user(user_id: str, updates: dict) -> Optional[dict]:
    """
    Update user information.
    
    Args:
        user_id: Either UUID or Cognito user ID
        updates: Dictionary of fields to update (e.g., {"name": "John Doe", "phone": "123-456-7890"})
                 Cannot update: addresses (use add_user_address function)
    
    Returns:
        Updated user dictionary if found, None if not found
    """
    # Remove addresses from updates (they're managed separately)
    updates = {k: v for k, v in updates.items() if k != 'addresses'}
    
    if not updates:
        return None  # Nothing to update
    
    # Build dynamic UPDATE query
    set_clause = ", ".join([f"{key} = %s" for key in updates.keys()])
    values = list(updates.values()) + [user_id]
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Try UUID first, then Cognito user ID
            try:
                user_uuid = UUID(user_id)
                cur.execute(f"""
                    UPDATE users 
                    SET {set_clause}, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                    RETURNING *
                """, values)
            except ValueError:
                # Not a UUID, try Cognito user ID
                cur.execute(f"""
                    UPDATE users 
                    SET {set_clause}, updated_at = CURRENT_TIMESTAMP
                    WHERE cognito_user_id = %s
                    RETURNING *
                """, values)
            
            result = cur.fetchone()
            return dict(result) if result else None

def add_user_address(user_id: str, address_data: dict) -> dict:
    """
    Add a shipping address to a user.
    
    If the address is marked as default, all other addresses for that user
    will be set to not default.
    
    Args:
        user_id: Either UUID or Cognito user ID
        address_data: Dictionary containing address information:
            - street: Street address (required)
            - city: City (required)
            - state: State/Province (required)
            - zip: ZIP/Postal code (required)
            - country: Country (optional, default: "USA")
            - is_default: Whether this is the default address (optional, default: False)
    
    Returns:
        Dictionary of the created address
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # If this is the default address, unset other defaults
            if address_data.get('is_default'):
                try:
                    user_uuid = UUID(user_id)
                    cur.execute("""
                        UPDATE user_addresses 
                        SET is_default = FALSE 
                        WHERE user_id = %s
                    """, (str(user_uuid),))
                except ValueError:
                    # Not a UUID, get user by Cognito user ID first
                    cur.execute("SELECT id FROM users WHERE cognito_user_id = %s", (user_id,))
                    user = cur.fetchone()
                    if user:
                        cur.execute("""
                            UPDATE user_addresses 
                            SET is_default = FALSE 
                            WHERE user_id = %s
                        """, (str(user['id']),))
            
            # Get user UUID (convert Cognito ID to UUID if needed)
            try:
                user_uuid = UUID(user_id)
            except ValueError:
                # Not a UUID, get user by Cognito user ID
                cur.execute("SELECT id FROM users WHERE cognito_user_id = %s", (user_id,))
                user = cur.fetchone()
                if not user:
                    raise ValueError("User not found")
                user_uuid = user['id']
            
            # Insert the new address
            cur.execute("""
                INSERT INTO user_addresses (user_id, street, city, state, zip, country, is_default)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                str(user_uuid),
                address_data['street'],
                address_data['city'],
                address_data['state'],
                address_data['zip'],
                address_data.get('country', 'USA'),      # Default to USA
                address_data.get('is_default', False),   # Default to False
            ))
            address = cur.fetchone()
            return {
                'id': str(address['id']),
                'street': address['street'],
                'city': address['city'],
                'state': address['state'],
                'zip': address['zip'],
                'country': address['country'],
                'is_default': address['is_default'],
            }


