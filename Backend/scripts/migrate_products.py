# ============================================================================
# Product Migration Script
# ============================================================================
# This script migrates products from asset.js to the PostgreSQL database
# 
# Usage: python scripts/migrate_products.py
# 
# This reads the product data from asset.js and inserts it into the database
# ============================================================================

import sys
import os

# Add parent directory to path so we can import services
# This allows us to import from the services module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services import products

# ============================================================================
# Product Data from asset.js
# ============================================================================
# This is the product data that was in your frontend asset.js file
# Note: Image paths are relative - you may need to update these to actual URLs
# or S3 paths when you deploy to production
# ============================================================================
PRODUCTS_DATA = [
    {
        "id": "0001",
        "name": "Way2Rare Zip Hoodie",
        "description": "Zip Hoodie with Way2Rare Logo",
        "price": 60,
        "image": ["/product_pics/NavyZip.png"],
        "category": "Hoodies",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "current": True,
    },
    {
        "id": "0002",
        "name": "Way2Rare Summer Tee",
        "description": "Lightweight summer t-shirt with Way2Rare Logo",
        "price": 25,
        "image": ["/product_pics/SummerTee.png"],
        "category": "T-Shirts",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "current": False,
    },
    {
        "id": "0003",
        "name": "Way2Rare Pullover Hoodie",
        "description": "Pullover Hoodie with Bubble Way2Rare Logo",
        "price": 50,
        "image": ["/product_pics/Pullover.png"],
        "category": "Hoodies",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "current": False,
    },
    {
        "id": "0004",
        "name": "Way2Rare Retro Zip Hoodie",
        "description": "Retro Style Zip Hoodie with Way2Rare Logo",
        "price": 65,
        "image": ["/product_pics/NavyZip.png"],
        "category": "Hoodies",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "current": False,
    },
    {
        "id": "0005",
        "name": "Way2Rare Logo Sweatpants",
        "description": "Comfortable Sweatpants with Way2Rare Logo",
        "price": 40,
        "image": ["/product_pics/NavyZip.png"],
        "category": "Bottoms",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "current": False,
    }
]

def migrate_products():
    """
    Migrate products from asset.js to PostgreSQL database.
    
    This function:
    1. Loops through each product in PRODUCTS_DATA
    2. Tries to create the product in the database
    3. Prints success or error messages
    4. Counts successes and errors
    """
    print("=" * 60)
    print("Starting product migration...")
    print("=" * 60)
    
    success_count = 0
    error_count = 0
    
    # Loop through each product and try to insert it
    for product_data in PRODUCTS_DATA:
        try:
            # Create the product in the database
            products.create_product(product_data)
            print(f"✅ Migrated product: {product_data['name']} (ID: {product_data['id']})")
            success_count += 1
        except Exception as e:
            # If there's an error (e.g., product already exists), print it
            print(f"❌ Error migrating product {product_data['id']}: {str(e)}")
            error_count += 1
    
    # Print summary
    print("=" * 60)
    print(f"Migration complete! Success: {success_count}, Errors: {error_count}")
    print("=" * 60)
    
    # If there were errors, it might mean products already exist
    if error_count > 0:
        print("\nNote: Errors may indicate products already exist in the database.")
        print("This is normal if you've run the migration before.")

if __name__ == "__main__":
    # Run the migration when this script is executed
    migrate_products()


