# Way2Rare Backend API

Python FastAPI backend for Way2Rare e-commerce platform with PostgreSQL database.

## 📁 Project Structure

```
Backend/
├── database/
│   ├── __init__.py          # Makes database a Python package
│   ├── db.py                # Database connection and pool management
│   └── schema.sql           # PostgreSQL database schema (tables, indexes, etc.)
├── models/
│   ├── __init__.py          # Makes models a Python package
│   └── schemas.py           # Pydantic models for request/response validation
├── services/
│   ├── __init__.py          # Makes services a Python package
│   ├── products.py          # Product database operations (CRUD)
│   ├── orders.py            # Order database operations (CRUD)
│   └── users.py             # User database operations (CRUD)
├── scripts/
│   ├── __init__.py          # Makes scripts a Python package
│   └── migrate_products.py  # Script to migrate products from asset.js to database
├── main.py                  # FastAPI application (API endpoints)
├── run.py                   # Server runner script
├── requirements.txt         # Python dependencies
├── setup.sh                 # Setup script for easy installation
├── .env.example             # Environment variables template
├── .env                     # Environment variables (create this, don't commit)
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

Or use the setup script:

```bash
./setup.sh
```

### 2. Environment Configuration

Create a `.env` file in the Backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL=postgresql://username:password@host:5432/way2rare_db
PORT=8000
NODE_ENV=development
```

### 3. Database Setup

#### Option A: Using AWS RDS PostgreSQL

1. Create an RDS PostgreSQL instance on AWS
2. Get the connection endpoint
3. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://admin:your-password@way2rare-db.xxxxx.us-east-1.rds.amazonaws.com:5432/postgres
   ```

#### Option B: Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE way2rare_db;
   ```
3. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/way2rare_db
   ```

### 4. Run Database Schema

```bash
# Using psql
psql $DATABASE_URL -f database/schema.sql

# Or if you have the connection string
psql "postgresql://user:password@host:5432/dbname" -f database/schema.sql
```

### 5. Migrate Products

Run the migration script to populate products from asset.js:

```bash
python scripts/migrate_products.py
```

### 6. Run the Server

```bash
# Using run.py
python run.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **Alternative docs**: `http://localhost:8000/redoc`

## 📚 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{product_id}` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/{product_id}` - Update a product

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/user/{user_id}` - Get all orders for a user
- `GET /api/orders/{order_id}` - Get a single order
- `PATCH /api/orders/{order_id}/status` - Update order status

### Users

- `GET /api/users/{user_id}` - Get a user
- `POST /api/users` - Create a new user
- `PUT /api/users/{user_id}` - Update a user
- `POST /api/users/{user_id}/addresses` - Add an address to a user

## 🔧 How It Works

### Database Connection

The `database/db.py` module manages database connections using a connection pool. This is more efficient than creating a new connection for each request.

### Services

Services (`services/products.py`, `services/orders.py`, `services/users.py`) contain all database operations. They handle:
- Querying the database
- Inserting new records
- Updating existing records
- Converting database results to Python dictionaries

### API Endpoints

The `main.py` file defines all API endpoints using FastAPI. Each endpoint:
1. Receives HTTP requests
2. Validates request data using Pydantic models
3. Calls service functions to interact with the database
4. Returns JSON responses

### Models

Pydantic models in `models/schemas.py` define the structure of request and response data. FastAPI uses these to:
- Validate incoming data
- Generate automatic API documentation
- Convert data to/from JSON

## 🗄️ Database Schema

The database includes the following tables:

- **users** - User accounts
- **user_addresses** - User shipping addresses
- **products** - Product information
- **product_images** - Product images (multiple per product)
- **product_sizes** - Available sizes per product
- **orders** - Order information
- **order_items** - Items in each order

See `database/schema.sql` for the complete schema definition.

## 🔒 Security Notes

1. **Never commit `.env` file** - It contains sensitive information like database passwords
2. **Use environment variables** - Store secrets in `.env`, not in code
3. **Validate input** - Pydantic models automatically validate request data
4. **Use HTTPS in production** - Encrypt data in transit
5. **Secure database connections** - Use SSL/TLS for database connections in production

## 🚀 Frontend Integration

Update your frontend `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

The frontend `ShopContext` has been updated to fetch products from the API.

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct in `.env`
- Check database is accessible from your network
- Ensure PostgreSQL is running
- Check firewall rules for RDS
- Verify security group allows connections from your IP

### Migration Issues

- Ensure database schema is created first
- Check for existing products before migrating
- Verify product data format matches schema

### CORS Issues

- Update CORS origins in `main.py` to match your frontend URL
- Ensure frontend is making requests to the correct API URL

## 📝 Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest
```

### Code Formatting

```bash
# Install formatter
pip install black

# Format code
black .
```

## 🚀 Deployment

### AWS Deployment Options

1. **AWS Elastic Beanstalk** - Easy deployment for FastAPI
2. **AWS ECS/Fargate** - Containerized deployment
3. **AWS Lambda** - Serverless (requires adjustments)
4. **EC2** - Traditional server deployment

### Environment Variables for Production

Make sure to set:
- `DATABASE_URL` - Production database URL
- `NODE_ENV=production`
- CORS origins for your frontend domain
- SSL/TLS configuration for database connections

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 📄 License

MIT


