# Way2Rare Backend Setup Guide

This guide explains how to set up and understand the entire backend system.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure Explained](#project-structure-explained)
3. [How Each Component Works](#how-each-component-works)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Understanding the Code](#understanding-the-code)

## 🎯 Overview

The Way2Rare backend is a REST API built with:
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database (on AWS RDS)
- **Pydantic** - Data validation
- **psycopg2** - PostgreSQL database adapter

The backend handles:
- Product management (CRUD operations)
- Order processing
- User management
- Database connections

## 📁 Project Structure Explained

### `/database` - Database Connection

**`db.py`** - Manages database connections
- Creates a connection pool (reuses connections for efficiency)
- Provides functions to get database connections
- Handles connection cleanup

**`schema.sql`** - Database structure
- Defines all tables (users, products, orders, etc.)
- Creates indexes for performance
- Sets up triggers for automatic timestamp updates

### `/models` - Data Models

**`schemas.py`** - Defines data structure
- **ProductCreate** - What data is needed to create a product
- **ProductResponse** - What data is returned when getting a product
- **OrderCreate** - What data is needed to create an order
- **UserCreate** - What data is needed to create a user

These models:
- Validate incoming data (ensure required fields are present)
- Generate automatic API documentation
- Convert data between Python and JSON

### `/services` - Business Logic

**`products.py`** - Product operations
- `get_all_products()` - Get all products from database
- `get_product(id)` - Get one product by ID
- `create_product(data)` - Add new product to database
- `update_product(id, data)` - Update existing product

**`orders.py`** - Order operations
- `create_order(data)` - Create a new order
- `get_user_orders(user_id)` - Get all orders for a user
- `get_order_by_id(order_id)` - Get one order by ID
- `update_order_status(order_id, status)` - Update order status

**`users.py`** - User operations
- `get_user(user_id)` - Get user by ID
- `create_user(data)` - Create new user
- `update_user(user_id, data)` - Update user information
- `add_user_address(user_id, address)` - Add shipping address

### `/scripts` - Utility Scripts

**`migrate_products.py`** - Migrates products from asset.js to database
- Reads product data from the script
- Inserts products into PostgreSQL database
- Handles errors gracefully

### Root Files

**`main.py`** - FastAPI application
- Defines all API endpoints (routes)
- Handles HTTP requests
- Calls service functions
- Returns JSON responses

**`run.py`** - Server runner
- Starts the FastAPI server
- Enables hot-reload (auto-restart on code changes)

**`requirements.txt`** - Python dependencies
- Lists all Python packages needed
- Includes versions for consistency

**`.env`** - Environment variables
- Stores database connection string
- Stores configuration settings
- **Never commit this file** (contains secrets)

## 🔄 How Each Component Works

### 1. Request Flow

```
Frontend Request
    ↓
FastAPI Endpoint (main.py)
    ↓
Service Function (services/*.py)
    ↓
Database Query (database/db.py)
    ↓
PostgreSQL Database
    ↓
Response back to Frontend
```

### 2. Data Flow

```
Frontend sends JSON
    ↓
Pydantic Model validates data (models/schemas.py)
    ↓
Service function processes data (services/*.py)
    ↓
Database stores data (PostgreSQL)
    ↓
Service function formats response
    ↓
FastAPI returns JSON to Frontend
```

### 3. Database Connection Flow

```
Application starts
    ↓
init_db_pool() creates connection pool
    ↓
Request comes in
    ↓
get_db_connection() gets connection from pool
    ↓
Execute database query
    ↓
Return connection to pool
```

## 🚀 Step-by-Step Setup

### Step 1: Install Python Dependencies

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**What this does:**
- Creates a virtual environment (isolated Python environment)
- Activates the virtual environment
- Installs all required Python packages

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

**What this does:**
- Creates `.env` file from template
- You fill in your database connection details

### Step 3: Set Up Database

```bash
psql "postgresql://way2rare:w2rdb2005@way2rare.cw3caoi8ypsm.us-east-1.rds.amazonaws.com:5432/postgres" -f database/schema.sql
```

**What this does:**
- Connects to your PostgreSQL database
- Runs the schema.sql file
- Creates all tables, indexes, and triggers

### Step 4: Migrate Products

```bash
python scripts/migrate_products.py
```

**What this does:**
- Reads product data from the script
- Inserts products into the database
- You should see "✅ Migrated product" messages

### Step 5: Start Server

```bash
python run.py
```

**What this does:**
- Starts the FastAPI server
- Server runs on http://localhost:8000
- API documentation at http://localhost:8000/docs

## 💡 Understanding the Code

### Database Connection (`database/db.py`)

```python
# Connection pool - reuses database connections
pool = SimpleConnectionPool(
    minconn=1,      # Keep at least 1 connection open
    maxconn=10,     # Allow up to 10 concurrent connections
    dsn=DATABASE_URL  # Connection string
)

# Context manager - automatically handles connection cleanup
with get_db_connection() as conn:
    # Use connection here
    # Connection automatically returned to pool when done
```

### Service Functions (`services/products.py`)

```python
def get_all_products():
    # Get connection from pool
    with get_db_connection() as conn:
        # Execute SQL query
        cur.execute("SELECT * FROM products...")
        # Fetch results
        rows = cur.fetchall()
        # Convert to Python dictionaries
        return products
```

### API Endpoints (`main.py`)

```python
@app.get("/api/products")
async def get_all_products():
    # Call service function
    products_list = products.get_all_products()
    # Return JSON response
    return products_list
```

### Data Models (`models/schemas.py`)

```python
class ProductCreate(BaseModel):
    id: str          # Required field
    name: str        # Required field
    price: float     # Required field
    description: Optional[str] = None  # Optional field
```

## 🔍 Key Concepts

### Connection Pooling

Instead of creating a new database connection for each request, we use a connection pool that reuses connections. This is much more efficient.

### Context Managers

The `with get_db_connection()` statement ensures connections are always returned to the pool, even if an error occurs.

### Pydantic Validation

Pydantic models automatically validate incoming data. If data doesn't match the model, FastAPI returns an error before your code runs.

### SQL Injection Prevention

We use parameterized queries (`%s` placeholders) instead of string concatenation. This prevents SQL injection attacks.

### Error Handling

Service functions return `None` if something isn't found. API endpoints check for `None` and return 404 errors to the frontend.

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/tutorial/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Pydantic**: https://docs.pydantic.dev/
- **SQL**: https://www.postgresqltutorial.com/

## ❓ Common Questions

### Q: Why use a connection pool?

A: Creating database connections is expensive. A pool reuses connections, making the API faster.

### Q: Why use Pydantic models?

A: They automatically validate data, generate API documentation, and convert between Python and JSON.

### Q: Why separate services from endpoints?

A: Separation of concerns. Services handle business logic, endpoints handle HTTP requests. This makes code easier to test and maintain.

### Q: What happens if the database is down?

A: The connection will fail, and FastAPI will return a 500 error. You should add error handling and retry logic for production.

### Q: How do I add a new endpoint?

A: 
1. Add a function in the appropriate service file
2. Add an endpoint in `main.py` that calls the service function
3. Test it using the API documentation at `/docs`

## 🐛 Troubleshooting

### Database Connection Fails

1. Check `.env` file has correct `DATABASE_URL`
2. Verify database is accessible from your network
3. Check AWS RDS security group allows your IP
4. Ensure database is running

### Products Don't Show Up

1. Run migration script: `python scripts/migrate_products.py`
2. Check database has products: `SELECT * FROM products;`
3. Verify API endpoint works: `curl http://localhost:8000/api/products`

### CORS Errors

1. Update CORS origins in `main.py` to match your frontend URL
2. Ensure frontend is making requests to the correct API URL

## 📝 Next Steps

1. **Add Authentication** - Implement user authentication with JWT or AWS Cognito
2. **Add Image Upload** - Store product images in S3
3. **Add Pagination** - Limit number of results returned
4. **Add Filtering** - Filter products by category, price, etc.
5. **Add Search** - Search products by name or description
6. **Add Caching** - Cache frequently accessed data
7. **Add Logging** - Log API requests and errors
8. **Add Tests** - Write unit tests for services and endpoints

---

**Happy Coding! 🚀**


