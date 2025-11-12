# ============================================================================
# FastAPI Main Application
# ============================================================================
# This is the main entry point for the Way2Rare backend API
# It defines all the API endpoints and routes HTTP requests to service functions
# ============================================================================

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from uuid import UUID
from models.schemas import (
    ProductCreate, ProductResponse, OrderCreate, OrderResponse,
    UserCreate, UserResponse
)
from services import products, orders, users
from database.db import init_db_pool, get_db_pool

# ============================================================================
# Initialize FastAPI Application
# ============================================================================
# FastAPI automatically generates API documentation at /docs and /redoc
# title: Appears in the API documentation
# description: Description of the API
# version: API version number
# ============================================================================
app = FastAPI(
    title="Way2Rare API",
    description="API for Way2Rare e-commerce platform",
    version="1.0.0"
)

# ============================================================================
# CORS Middleware
# ============================================================================
# CORS (Cross-Origin Resource Sharing) allows your frontend (running on different port)
# to make requests to this API
# 
# allow_origins: List of frontend URLs that can access this API
# allow_credentials: Allows cookies/auth headers
# allow_methods: HTTP methods allowed (* = all)
# allow_headers: HTTP headers allowed (* = all)
# ============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Startup Event
# ============================================================================
# This function runs when the server starts
# We use it to initialize the database connection pool
# ============================================================================
@app.on_event("startup")
async def startup_event():
    """Initialize database connection pool when server starts"""
    try:
        init_db_pool()
        print("✅ Database connection pool initialized")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        print("Make sure your DATABASE_URL in .env is correct and database is accessible")

# ============================================================================
# Shutdown Event
# ============================================================================
# This function runs when the server stops
# We use it to clean up database connections
# ============================================================================
@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection pool when server stops"""
    try:
        pool = get_db_pool()
        if pool:
            pool.closeall()
        print("✅ Database connection pool closed")
    except Exception as e:
        print(f"❌ Error closing database pool: {e}")

# ============================================================================
# Health Check Endpoint
# ============================================================================
# This endpoint allows you to check if the API is running
# Useful for monitoring and deployment checks
# ============================================================================
@app.get("/api/health")
async def health_check():
    """Check if API is running and database is connected"""
    return {"status": "ok", "database": "connected"}

# ============================================================================
# Product Endpoints
# ============================================================================

@app.get("/api/products")
async def get_all_products():
    """
    Get all products.
    
    Returns a list of all products with their images and sizes.
    This is the main endpoint your frontend will use to display products.
    """
    try:
        products_list = products.get_all_products()
        return products_list
    except Exception as e:
        # If something goes wrong, return a 500 error with the error message
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    """
    Get a single product by ID.
    
    Args:
        product_id: The ID of the product (e.g., "0001")
    
    Returns:
        Product details if found, 404 error if not found
    """
    product = products.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate):
    """
    Create a new product.
    
    This endpoint is typically used by admin users to add new products.
    The product data is validated using the ProductCreate model.
    
    Args:
        product: Product data (validated by Pydantic)
    
    Returns:
        Created product with all details
    """
    try:
        product_data = product.dict()
        created_product = products.create_product(product_data)
        # Fetch the complete product to return with images and sizes
        return products.get_product(product_data['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product_updates: dict):
    """
    Update an existing product.
    
    Args:
        product_id: ID of the product to update
        product_updates: Dictionary of fields to update (e.g., {"price": 65})
    
    Returns:
        Updated product if found, 404 error if not found
    """
    updated_product = products.update_product(product_id, product_updates)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Fetch the complete product to return with images and sizes
    return products.get_product(product_id)

# ============================================================================
# Order Endpoints
# ============================================================================

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate):
    """
    Create a new order.
    
    This is called when a user places an order from the frontend.
    The order data includes:
    - User ID
    - List of items (products, quantities, sizes)
    - Shipping address
    - Totals (subtotal, delivery fee, total)
    
    Args:
        order: Order data (validated by Pydantic)
    
    Returns:
        Created order with order number
    """
    try:
        order_data = order.dict()
        created_order = orders.create_order(order_data)
        return created_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/orders/user/{user_id}")
async def get_user_orders(user_id: UUID):
    """
    Get all orders for a specific user.
    
    This is used to display a user's order history.
    
    Args:
        user_id: UUID of the user
    
    Returns:
        List of orders for the user, ordered by date (newest first)
    """
    try:
        orders_list = orders.get_user_orders(user_id)
        return orders_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/orders/{order_id}")
async def get_order(order_id: UUID):
    """
    Get a single order by ID.
    
    Args:
        order_id: UUID of the order
    
    Returns:
        Order details if found, 404 error if not found
    """
    order = orders.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.patch("/api/orders/{order_id}/status")
async def update_order_status(order_id: UUID, status_data: dict):
    """
    Update the status of an order.
    
    This is typically used by admin users to update order status
    (e.g., from "pending" to "shipped").
    
    Args:
        order_id: UUID of the order
        status_data: Dictionary with "status" key (e.g., {"status": "shipped"})
    
    Returns:
        Updated order if found, 404 error if not found
    """
    status_value = status_data.get("status")
    if not status_value:
        raise HTTPException(status_code=400, detail="Status is required")
    updated_order = orders.update_order_status(order_id, status_value)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated_order

# ============================================================================
# User Endpoints
# ============================================================================

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """
    Get a user by ID or Cognito user ID.
    
    Args:
        user_id: Either UUID or Cognito user ID
    
    Returns:
        User details with addresses if found, 404 error if not found
    """
    user = users.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/users", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """
    Create a new user.
    
    This is typically called when a new user signs up.
    
    Args:
        user: User data (validated by Pydantic)
    
    Returns:
        Created user
    """
    try:
        user_data = user.dict()
        created_user = users.create_user(user_data)
        return created_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/users/{user_id}")
async def update_user(user_id: str, user_updates: dict):
    """
    Update user information.
    
    Args:
        user_id: Either UUID or Cognito user ID
        user_updates: Dictionary of fields to update (e.g., {"name": "John Doe"})
    
    Returns:
        Updated user if found, 404 error if not found
    """
    updated_user = users.update_user(user_id, user_updates)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    # Fetch the complete user to return with addresses
    return users.get_user(user_id)

@app.post("/api/users/{user_id}/addresses")
async def add_user_address(user_id: str, address: dict):
    """
    Add a shipping address to a user.
    
    Args:
        user_id: Either UUID or Cognito user ID
        address: Dictionary with address details (street, city, state, zip, etc.)
    
    Returns:
        Created address
    """
    try:
        created_address = users.add_user_address(user_id, address)
        return created_address
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Run Server
# ============================================================================
# This code runs if you execute this file directly (python main.py)
# For production, you'd typically use: uvicorn main:app --host 0.0.0.0 --port 8000
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


