-- ============================================================================
-- Way2Rare Database Schema
-- ============================================================================
-- This file creates all tables, indexes, and triggers for the Way2Rare database
-- 
-- Usage: psql $DATABASE_URL -f database/schema.sql
-- ============================================================================

-- ============================================================================
-- Enable UUID Extension
-- ============================================================================
-- This allows us to use UUID (Universally Unique Identifier) as primary keys
-- UUIDs are better than auto-incrementing integers for distributed systems
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Users Table
-- ============================================================================
-- Stores user account information
-- Can be integrated with AWS Cognito (cognito_user_id) or custom authentication
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Unique user ID (UUID)
    cognito_user_id VARCHAR(255) UNIQUE,              -- AWS Cognito user ID (optional)
    email VARCHAR(255) UNIQUE NOT NULL,               -- User email (unique, required)
    name VARCHAR(255),                                -- User's full name (optional)
    phone VARCHAR(20),                                -- User's phone number (optional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- When user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- When user was last updated
);

-- ============================================================================
-- User Addresses Table
-- ============================================================================
-- Stores shipping addresses for users
-- Users can have multiple addresses
-- One address can be marked as default
-- ============================================================================
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- Unique address ID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Foreign key to users
    street VARCHAR(255) NOT NULL,                     -- Street address (required)
    city VARCHAR(100) NOT NULL,                       -- City (required)
    state VARCHAR(50) NOT NULL,                       -- State/Province (required)
    zip VARCHAR(20) NOT NULL,                         -- ZIP/Postal code (required)
    country VARCHAR(100) NOT NULL DEFAULT 'USA',      -- Country (default: USA)
    is_default BOOLEAN DEFAULT FALSE,                 -- Whether this is the default address
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- When address was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- When address was last updated
);

-- ============================================================================
-- Products Table
-- ============================================================================
-- Stores product information
-- Products have an ID (string like "0001"), not a UUID
-- This makes it easier to reference products in URLs
-- ============================================================================
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,                       -- Product ID (e.g., "0001")
    name VARCHAR(255) NOT NULL,                       -- Product name (required)
    description TEXT,                                 -- Product description (optional)
    price DECIMAL(10, 2) NOT NULL,                    -- Product price (required, 2 decimal places)
    category VARCHAR(100) NOT NULL,                   -- Product category (e.g., "Hoodies")
    current BOOLEAN DEFAULT TRUE,                     -- Whether product is currently available
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- When product was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- When product was last updated
);

-- ============================================================================
-- Product Images Table
-- ============================================================================
-- Stores images for products
-- Products can have multiple images
-- Images have a display order (which image to show first)
-- ============================================================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- Unique image ID
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,  -- Foreign key to products
    image_url VARCHAR(500) NOT NULL,                  -- URL or path to image (required)
    display_order INTEGER DEFAULT 0,                  -- Order in which to display images (0 = first)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- When image was added
);

-- ============================================================================
-- Product Sizes Table
-- ============================================================================
-- Stores available sizes for products
-- Products can have multiple sizes (S, M, L, XL, XXL)
-- UNIQUE constraint prevents duplicate sizes for the same product
-- ============================================================================
CREATE TABLE product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- Unique size ID
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,  -- Foreign key to products
    size VARCHAR(10) NOT NULL,                        -- Size (e.g., "S", "M", "L")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- When size was added
    UNIQUE(product_id, size)                          -- Prevent duplicate sizes for same product
);

-- ============================================================================
-- Orders Table
-- ============================================================================
-- Stores order information
-- Each order belongs to a user
-- Orders have a unique order number (human-readable)
-- Shipping address is stored directly in the orders table (denormalized)
-- ============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- Unique order ID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Foreign key to users
    order_number VARCHAR(50) UNIQUE NOT NULL,         -- Human-readable order number (e.g., "ORD-1234567890-ABC123")
    subtotal DECIMAL(10, 2) NOT NULL,                 -- Subtotal before delivery fee
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 10.00,  -- Delivery fee (default: $10)
    total DECIMAL(10, 2) NOT NULL,                    -- Total amount (subtotal + delivery_fee)
    status VARCHAR(50) NOT NULL DEFAULT 'pending',    -- Order status (pending, processing, shipped, delivered, cancelled)
    shipping_street VARCHAR(255) NOT NULL,            -- Shipping street address
    shipping_city VARCHAR(100) NOT NULL,              -- Shipping city
    shipping_state VARCHAR(50) NOT NULL,              -- Shipping state
    shipping_zip VARCHAR(20) NOT NULL,                -- Shipping ZIP code
    shipping_country VARCHAR(100) NOT NULL DEFAULT 'USA',  -- Shipping country (default: USA)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- When order was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- When order was last updated
);

-- ============================================================================
-- Order Items Table
-- ============================================================================
-- Stores items in each order
-- We store product details at the time of order (in case product prices change later)
-- Each order can have multiple items
-- ============================================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- Unique order item ID
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,  -- Foreign key to orders
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),  -- Foreign key to products
    product_name VARCHAR(255) NOT NULL,               -- Product name at time of order
    product_price DECIMAL(10, 2) NOT NULL,            -- Product price at time of order
    quantity INTEGER NOT NULL,                        -- Quantity ordered
    size VARCHAR(10) NOT NULL,                        -- Size ordered (e.g., "M")
    image_url VARCHAR(500),                           -- Product image URL (optional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- When item was added to order
);

-- ============================================================================
-- Indexes
-- ============================================================================
-- Indexes speed up database queries
-- They allow the database to find records faster
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);                    -- Speed up email lookups
CREATE INDEX idx_users_cognito_user_id ON users(cognito_user_id);  -- Speed up Cognito ID lookups

-- User addresses indexes
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);  -- Speed up address lookups by user

-- Product indexes
CREATE INDEX idx_products_category ON products(category);        -- Speed up category filtering
CREATE INDEX idx_products_current ON products(current);          -- Speed up filtering by availability

-- Product images indexes
CREATE INDEX idx_product_images_product_id ON product_images(product_id);  -- Speed up image lookups by product

-- Product sizes indexes
CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);    -- Speed up size lookups by product

-- Order indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);              -- Speed up order lookups by user
CREATE INDEX idx_orders_status ON orders(status);                -- Speed up filtering by status
CREATE INDEX idx_orders_created_at ON orders(created_at);        -- Speed up sorting by date

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);  -- Speed up item lookups by order
CREATE INDEX idx_order_items_product_id ON order_items(product_id);  -- Speed up item lookups by product

-- ============================================================================
-- Trigger Function
-- ============================================================================
-- This function automatically updates the updated_at timestamp
-- It runs before each UPDATE operation
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;  -- Set updated_at to current timestamp
    RETURN NEW;                          -- Return the updated row
END;
$$ language 'plpgsql';

-- ============================================================================
-- Triggers
-- ============================================================================
-- Triggers automatically call the update_updated_at_column function
-- They run before each UPDATE operation on the specified tables
-- ============================================================================

-- Update updated_at on users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on user_addresses table
CREATE TRIGGER update_user_addresses_updated_at 
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on products table
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on orders table
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Schema Creation Complete
-- ============================================================================
-- All tables, indexes, and triggers have been created
-- You can now run the migration script to populate products
-- ============================================================================


