# ============================================================================
# Orders Service
# ============================================================================
# This module contains all database operations for orders
# Functions here handle: creating orders, getting orders, updating order status
# ============================================================================

from database.db import get_db_connection
from typing import List, Optional
from uuid import UUID
import uuid
import random
import string
from datetime import datetime

def generate_order_number() -> str:
    """
    Generate a unique order number.
    
    Format: ORD-{timestamp}-{random_string}
    Example: ORD-1702312345678-ABC123XYZ
    
    This ensures each order has a unique, human-readable identifier.
    """
    timestamp = int(datetime.now().timestamp() * 1000)  # Current time in milliseconds
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=9))
    return f"ORD-{timestamp}-{random_str}"

def create_order(order_data: dict) -> dict:
    """
    Create a new order in the database.
    
    This function:
    1. Generates a unique order number
    2. Inserts the order into the orders table
    3. Inserts all order items into the order_items table
    
    Args:
        order_data: Dictionary containing order information:
            - user_id: UUID of the user placing the order
            - items: List of order items (products being ordered)
            - subtotal: Subtotal before delivery fee
            - delivery_fee: Delivery fee (default: 10.0)
            - total: Total amount (subtotal + delivery_fee)
            - shipping_address: Dictionary with shipping address details
            - status: Order status (default: "pending")
    
    Returns:
        Dictionary of the created order with all items
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Step 1: Generate unique order number
            order_number = generate_order_number()
            
            # Step 2: Insert the order
            # We store shipping address fields separately in the orders table
            cur.execute("""
                INSERT INTO orders (
                    user_id, order_number, subtotal, delivery_fee, total, status,
                    shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                str(order_data['user_id']),
                order_number,
                order_data['subtotal'],
                order_data.get('delivery_fee', 10.0),  # Default delivery fee
                order_data['total'],
                order_data.get('status', 'pending'),   # Default status
                order_data['shipping_address']['street'],
                order_data['shipping_address']['city'],
                order_data['shipping_address']['state'],
                order_data['shipping_address']['zip'],
                order_data['shipping_address'].get('country', 'USA'),  # Default country
            ))
            order = cur.fetchone()
            order_id = order['id']
            
            # Step 3: Insert order items
            # We store product details at the time of order (in case prices change later)
            items = []
            for item in order_data['items']:
                # Get first image URL if available
                image_url = item.get('image', [None])[0] if item.get('image') else None
                
                cur.execute("""
                    INSERT INTO order_items (
                        order_id, product_id, product_name, product_price, quantity, size, image_url
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    order_id,
                    item['product_id'],
                    item['name'],
                    item['price'],
                    item['quantity'],
                    item['size'],
                    image_url,
                ))
                order_item = cur.fetchone()
                
                # Build item dictionary for response
                items.append({
                    'product_id': order_item['product_id'],
                    'name': order_item['product_name'],
                    'price': float(order_item['product_price']),
                    'quantity': order_item['quantity'],
                    'size': order_item['size'],
                    'image': [order_item['image_url']] if order_item['image_url'] else [],
                })
            
            # Step 4: Return complete order with items
            return {
                'id': str(order['id']),
                'user_id': str(order['user_id']),
                'order_number': order['order_number'],
                'items': items,
                'subtotal': float(order['subtotal']),
                'delivery_fee': float(order['delivery_fee']),
                'total': float(order['total']),
                'status': order['status'],
                'shipping_address': {
                    'street': order['shipping_street'],
                    'city': order['shipping_city'],
                    'state': order['shipping_state'],
                    'zip': order['shipping_zip'],
                    'country': order['shipping_country'],
                },
                'created_at': order['created_at'].isoformat() if hasattr(order['created_at'], 'isoformat') else str(order['created_at']) if order['created_at'] else None,
                'updated_at': order['updated_at'].isoformat() if hasattr(order['updated_at'], 'isoformat') else str(order['updated_at']) if order['updated_at'] else None,
            }

def get_order_by_id(order_id: UUID) -> Optional[dict]:
    """
    Get a single order by ID.
    
    Args:
        order_id: UUID of the order to retrieve
    
    Returns:
        Order dictionary with all items if found, None if not found
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Get the order
            cur.execute("""
                SELECT * FROM orders WHERE id = %s
            """, (str(order_id),))
            order = cur.fetchone()
            
            if not order:
                return None  # Order not found
            
            # Get all items for this order
            cur.execute("""
                SELECT * FROM order_items WHERE order_id = %s
            """, (str(order_id),))
            order_items = cur.fetchall()
            
            # Build items list
            items = []
            for item in order_items:
                items.append({
                    'product_id': item['product_id'],
                    'name': item['product_name'],
                    'price': float(item['product_price']),
                    'quantity': item['quantity'],
                    'size': item['size'],
                    'image': [item['image_url']] if item['image_url'] else [],
                })
            
            # Return complete order
            return {
                'id': str(order['id']),
                'user_id': str(order['user_id']),
                'order_number': order['order_number'],
                'items': items,
                'subtotal': float(order['subtotal']),
                'delivery_fee': float(order['delivery_fee']),
                'total': float(order['total']),
                'status': order['status'],
                'shipping_address': {
                    'street': order['shipping_street'],
                    'city': order['shipping_city'],
                    'state': order['shipping_state'],
                    'zip': order['shipping_zip'],
                    'country': order['shipping_country'],
                },
                'created_at': order['created_at'].isoformat() if hasattr(order['created_at'], 'isoformat') else str(order['created_at']) if order['created_at'] else None,
                'updated_at': order['updated_at'].isoformat() if hasattr(order['updated_at'], 'isoformat') else str(order['updated_at']) if order['updated_at'] else None,
            }

def get_user_orders(user_id: UUID) -> List[dict]:
    """
    Get all orders for a specific user.
    
    Args:
        user_id: UUID of the user
    
    Returns:
        List of order dictionaries, ordered by creation date (newest first)
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Get all orders for this user
            cur.execute("""
                SELECT * FROM orders 
                WHERE user_id = %s 
                ORDER BY created_at DESC
            """, (str(user_id),))
            orders = cur.fetchall()
            
            result = []
            # For each order, get its items
            for order in orders:
                # Get order items
                cur.execute("""
                    SELECT * FROM order_items WHERE order_id = %s
                """, (order['id'],))
                order_items = cur.fetchall()
                
                # Build items list
                items = []
                for item in order_items:
                    items.append({
                        'product_id': item['product_id'],
                        'name': item['product_name'],
                        'price': float(item['product_price']),
                        'quantity': item['quantity'],
                        'size': item['size'],
                        'image': [item['image_url']] if item['image_url'] else [],
                    })
                
                # Add order to result list
                result.append({
                    'id': str(order['id']),
                    'user_id': str(order['user_id']),
                    'order_number': order['order_number'],
                    'items': items,
                    'subtotal': float(order['subtotal']),
                    'delivery_fee': float(order['delivery_fee']),
                    'total': float(order['total']),
                    'status': order['status'],
                    'shipping_address': {
                        'street': order['shipping_street'],
                        'city': order['shipping_city'],
                        'state': order['shipping_state'],
                        'zip': order['shipping_zip'],
                        'country': order['shipping_country'],
                    },
                    'created_at': order['created_at'].isoformat() if hasattr(order['created_at'], 'isoformat') else str(order['created_at']) if order['created_at'] else None,
                    'updated_at': order['updated_at'].isoformat() if hasattr(order['updated_at'], 'isoformat') else str(order['updated_at']) if order['updated_at'] else None,
                })
            
            return result

def update_order_status(order_id: UUID, status: str) -> Optional[dict]:
    """
    Update the status of an order.
    
    Common statuses: "pending", "processing", "shipped", "delivered", "cancelled"
    
    Args:
        order_id: UUID of the order to update
        status: New status for the order
    
    Returns:
        Updated order dictionary if found, None if not found
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE orders 
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            """, (status, str(order_id)))
            result = cur.fetchone()
            return dict(result) if result else None


