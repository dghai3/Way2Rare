# ============================================================================
# Products Service
# ============================================================================
# This module contains all database operations for products
# Functions here handle: getting products, creating products, updating products
# ============================================================================

from database.db import get_db_connection
from typing import List, Optional
import json

def get_all_products() -> List[dict]:
    """
    Get all products from the database with their images and sizes.
    
    This function:
    1. Queries the products table
    2. Joins with product_images to get all images for each product
    3. Joins with product_sizes to get all sizes for each product
    4. Groups everything together and returns a list of products
    
    Returns:
        List of product dictionaries, each containing:
        - id, _id, name, description, price, category, current
        - image: List of image URLs
        - sizes: List of available sizes
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # SQL query to get all products with images and sizes
            # COALESCE returns an empty array if no images/sizes exist
            # json_agg aggregates multiple rows into a JSON array
            cur.execute("""
                SELECT 
                    p.*,
                    -- Aggregate all images into a JSON array
                    COALESCE(
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'url', pi.image_url,
                                'display_order', pi.display_order
                            )
                        ) FILTER (WHERE pi.image_url IS NOT NULL),
                        '[]'::json
                    ) as images,
                    -- Aggregate all sizes into a JSON array
                    COALESCE(
                        json_agg(DISTINCT ps.size) FILTER (WHERE ps.size IS NOT NULL),
                        '[]'::json
                    ) as sizes
                FROM products p
                LEFT JOIN product_images pi ON p.id = pi.product_id
                LEFT JOIN product_sizes ps ON p.id = ps.product_id
                GROUP BY p.id
                ORDER BY p.created_at DESC
            """)
            rows = cur.fetchall()
            
            # Convert database rows to Python dictionaries
            products = []
            for row in rows:
                # Extract images from JSON array
                images = row['images'] if row['images'] else []
                image_urls = [img['url'] for img in images] if images else []
                
                # Extract sizes from JSON array
                sizes = row['sizes'] if row['sizes'] else []
                
                # Build product dictionary
                products.append({
                    'id': row['id'],
                    '_id': row['id'],  # For backward compatibility with frontend
                    'name': row['name'],
                    'description': row['description'],
                    'price': float(row['price']),  # Convert Decimal to float
                    'category': row['category'],
                    'current': row['current'],
                    'image': image_urls,
                    'sizes': sizes,
                })
            
            return products

def get_product(product_id: str) -> Optional[dict]:
    """
    Get a single product by ID.
    
    Args:
        product_id: The ID of the product to retrieve (e.g., "0001")
    
    Returns:
        Product dictionary if found, None if not found
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Query for a specific product by ID
            cur.execute("""
                SELECT 
                    p.*,
                    COALESCE(
                        json_agg(
                            DISTINCT jsonb_build_object(
                                'url', pi.image_url,
                                'display_order', pi.display_order
                            )
                        ) FILTER (WHERE pi.image_url IS NOT NULL),
                        '[]'::json
                    ) as images,
                    COALESCE(
                        json_agg(DISTINCT ps.size) FILTER (WHERE ps.size IS NOT NULL),
                        '[]'::json
                    ) as sizes
                FROM products p
                LEFT JOIN product_images pi ON p.id = pi.product_id
                LEFT JOIN product_sizes ps ON p.id = ps.product_id
                WHERE p.id = %s
                GROUP BY p.id
            """, (product_id,))
            
            row = cur.fetchone()
            if not row:
                return None  # Product not found
            
            # Extract images and sizes
            images = row['images'] if row['images'] else []
            image_urls = [img['url'] for img in images] if images else []
            sizes = row['sizes'] if row['sizes'] else []
            
            # Return product dictionary
            return {
                'id': row['id'],
                '_id': row['id'],
                'name': row['name'],
                'description': row['description'],
                'price': float(row['price']),
                'category': row['category'],
                'current': row['current'],
                'image': image_urls,
                'sizes': sizes,
            }

def create_product(product_data: dict) -> dict:
    """
    Create a new product in the database.
    
    This function:
    1. Inserts the product into the products table
    2. Inserts all product images into the product_images table
    3. Inserts all product sizes into the product_sizes table
    
    Args:
        product_data: Dictionary containing product information:
            - id: Product ID (required)
            - name: Product name (required)
            - description: Product description (optional)
            - price: Product price (required)
            - category: Product category (required)
            - current: Whether product is available (optional, default: True)
            - image: List of image URLs (optional)
            - sizes: List of sizes (optional)
    
    Returns:
        Dictionary of the created product
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Step 1: Insert the product
            cur.execute("""
                INSERT INTO products (id, name, description, price, category, current)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                product_data['id'],
                product_data['name'],
                product_data.get('description'),  # Use .get() for optional fields
                product_data['price'],
                product_data['category'],
                product_data.get('current', True),  # Default to True if not provided
            ))
            product = cur.fetchone()
            
            # Step 2: Insert product images (if any)
            if product_data.get('image'):
                for index, image_url in enumerate(product_data['image']):
                    cur.execute("""
                        INSERT INTO product_images (product_id, image_url, display_order)
                        VALUES (%s, %s, %s)
                    """, (product_data['id'], image_url, index))
            
            # Step 3: Insert product sizes (if any)
            if product_data.get('sizes'):
                for size in product_data['sizes']:
                    # ON CONFLICT DO NOTHING prevents errors if size already exists
                    cur.execute("""
                        INSERT INTO product_sizes (product_id, size)
                        VALUES (%s, %s)
                        ON CONFLICT (product_id, size) DO NOTHING
                    """, (product_data['id'], size))
            
            # Return the created product as a dictionary
            return dict(product)

def update_product(product_id: str, updates: dict) -> Optional[dict]:
    """
    Update an existing product.
    
    Args:
        product_id: ID of the product to update
        updates: Dictionary of fields to update (e.g., {"price": 65, "current": False})
                 Cannot update: id, image, sizes (these have separate functions)
    
    Returns:
        Updated product dictionary if found, None if not found
    """
    # Remove fields that shouldn't be updated directly
    # Images and sizes are managed separately through their own tables
    updates = {k: v for k, v in updates.items() if k not in ['image', 'sizes', 'id']}
    
    if not updates:
        return None  # Nothing to update
    
    # Build dynamic UPDATE query
    # This creates: UPDATE products SET field1 = %s, field2 = %s WHERE id = %s
    set_clause = ", ".join([f"{key} = %s" for key in updates.keys()])
    values = list(updates.values()) + [product_id]
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(f"""
                UPDATE products 
                SET {set_clause}, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            """, values)
            
            result = cur.fetchone()
            return dict(result) if result else None


