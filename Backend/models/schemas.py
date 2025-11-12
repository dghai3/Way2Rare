# ============================================================================
# Pydantic Models (Data Schemas)
# ============================================================================
# These models define the structure of data for requests and responses
# FastAPI uses these to:
# 1. Validate incoming request data
# 2. Generate automatic API documentation
# 3. Convert data to/from JSON
# ============================================================================

from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# ============================================================================
# Product Models
# ============================================================================

class ProductImage(BaseModel):
    """Represents a product image with its display order"""
    url: str                    # URL or path to the image
    display_order: int = 0      # Order in which to display images (0 = first)

class ProductBase(BaseModel):
    """Base product model with common fields"""
    name: str                   # Product name (required)
    description: Optional[str] = None  # Product description (optional)
    price: float                # Product price (required)
    category: str               # Product category like "Hoodies", "T-Shirts" (required)
    current: bool = True        # Whether product is currently available (default: True)
    sizes: List[str] = []       # Available sizes like ["S", "M", "L"] (default: empty list)

class ProductCreate(ProductBase):
    """
    Model for creating a new product.
    Extends ProductBase and adds product ID and images.
    """
    id: str                     # Product ID (like "0001")
    image: List[str] = []       # List of image URLs/paths

class ProductResponse(ProductBase):
    """
    Model for product API responses.
    This is what gets returned when you fetch a product.
    """
    id: str                     # Product ID
    _id: str                    # Duplicate of id for backward compatibility with frontend
    image: List[str]            # List of image URLs
    sizes: List[str]            # Available sizes
    created_at: Optional[datetime] = None  # When product was created
    updated_at: Optional[datetime] = None  # When product was last updated

    class Config:
        from_attributes = True  # Allow creation from database objects

# ============================================================================
# User Models
# ============================================================================

class UserAddress(BaseModel):
    """Represents a user's shipping address"""
    id: Optional[UUID] = None   # Address ID (UUID)
    street: str                 # Street address
    city: str                   # City
    state: str                  # State/Province
    zip: str                    # ZIP/Postal code
    country: str = "USA"        # Country (default: USA)
    is_default: bool = False    # Whether this is the default address

class UserBase(BaseModel):
    """Base user model with common fields"""
    email: EmailStr             # User email (validated as email format)
    name: Optional[str] = None  # User's full name (optional)
    phone: Optional[str] = None # User's phone number (optional)

class UserCreate(UserBase):
    """
    Model for creating a new user.
    Extends UserBase and adds Cognito user ID (if using AWS Cognito for auth).
    """
    cognito_user_id: Optional[str] = None  # AWS Cognito user ID (if using Cognito)

class UserResponse(UserBase):
    """
    Model for user API responses.
    This is what gets returned when you fetch a user.
    """
    id: UUID                    # User ID (UUID)
    cognito_user_id: Optional[str] = None  # AWS Cognito user ID
    addresses: List[UserAddress] = []      # List of user's addresses
    created_at: Optional[datetime] = None  # When user was created
    updated_at: Optional[datetime] = None  # When user was last updated

    class Config:
        from_attributes = True  # Allow creation from database objects

# ============================================================================
# Order Models
# ============================================================================

class OrderItem(BaseModel):
    """Represents an item in an order"""
    product_id: str             # ID of the product
    name: str                   # Product name (stored at time of order)
    price: float                # Price at time of order (in case price changes later)
    quantity: int               # Number of items
    size: str                   # Size of the item (e.g., "M", "L")
    image: Optional[List[str]] = None  # Product image URLs

class ShippingAddress(BaseModel):
    """Shipping address for an order"""
    street: str                 # Street address
    city: str                   # City
    state: str                  # State/Province
    zip: str                    # ZIP/Postal code
    country: str = "USA"        # Country (default: USA)

class OrderCreate(BaseModel):
    """
    Model for creating a new order.
    This is what the frontend sends when a user places an order.
    """
    user_id: UUID               # ID of the user placing the order
    items: List[OrderItem]      # List of items in the order
    subtotal: float             # Subtotal before delivery fee
    delivery_fee: float = 10.0  # Delivery fee (default: $10)
    total: float                # Total amount (subtotal + delivery_fee)
    shipping_address: ShippingAddress  # Where to ship the order
    status: str = "pending"     # Order status (default: "pending")

class OrderResponse(BaseModel):
    """
    Model for order API responses.
    This is what gets returned when you fetch an order.
    """
    id: UUID                    # Order ID (UUID)
    user_id: UUID               # ID of the user who placed the order
    order_number: str           # Human-readable order number (e.g., "ORD-1234567890-ABC123")
    items: List[OrderItem]      # List of items in the order
    subtotal: float             # Subtotal before delivery fee
    delivery_fee: float         # Delivery fee
    total: float                # Total amount
    status: str                 # Order status (pending, processing, shipped, delivered, cancelled)
    shipping_address: ShippingAddress  # Shipping address
    created_at: datetime        # When order was created
    updated_at: datetime        # When order was last updated

    class Config:
        from_attributes = True  # Allow creation from database objects


