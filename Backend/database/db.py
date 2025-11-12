# ============================================================================
# Database Connection Module
# ============================================================================
# This module handles all database connections to PostgreSQL
# It creates a connection pool to efficiently manage database connections
# ============================================================================

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool
from contextlib import contextmanager
from dotenv import load_dotenv

# Load environment variables from .env file
# This reads the DATABASE_URL from your .env file
load_dotenv()

# ============================================================================
# Database Configuration
# ============================================================================
# DATABASE_URL format: postgresql://username:password@host:port/database
# Example: postgresql://user:pass@localhost:5432/mydb
# ============================================================================
DATABASE_URL = os.getenv('DATABASE_URL')

# ============================================================================
# Connection Pool
# ============================================================================
# A connection pool reuses database connections instead of creating new ones
# This is more efficient because creating connections is expensive
# We'll initialize this when the application starts
# ============================================================================
pool = None

def init_db_pool():
    """
    Initialize the database connection pool.
    
    This function creates a pool of database connections that can be reused.
    - minconn: Minimum number of connections to maintain (1)
    - maxconn: Maximum number of connections allowed (10)
    - dsn: Data Source Name (connection string from DATABASE_URL)
    
    Call this when your application starts.
    """
    global pool
    if pool is None:
        pool = SimpleConnectionPool(
            minconn=1,      # Keep at least 1 connection open
            maxconn=10,     # Allow up to 10 concurrent connections
            dsn=DATABASE_URL  # Connection string from environment variable
        )
    return pool

def get_db_pool():
    """
    Get the database connection pool.
    
    If the pool doesn't exist, create it first.
    Returns the connection pool object.
    """
    if pool is None:
        init_db_pool()
    return pool

@contextmanager
def get_db_connection():
    """
    Get a database connection from the pool.
    
    This is a context manager, which means you use it with 'with' statement:
    
    with get_db_connection() as conn:
        # Use connection here
        # Connection is automatically returned to pool when done
    
    The context manager ensures:
    - Connection is returned to pool even if an error occurs
    - Transactions are committed on success
    - Transactions are rolled back on error
    """
    pool = get_db_pool()
    conn = pool.getconn()  # Get a connection from the pool
    try:
        yield conn         # Give the connection to the caller
        conn.commit()      # Save changes if everything worked
    except Exception as e:
        conn.rollback()    # Undo changes if there was an error
        raise e            # Re-raise the error so caller knows something went wrong
    finally:
        pool.putconn(conn) # Always return connection to pool when done

def get_db_cursor():
    """
    Get a database cursor with RealDictCursor.
    
    RealDictCursor returns results as dictionaries instead of tuples.
    This makes it easier to access data by column name.
    
    Example:
        cursor.execute("SELECT name FROM users WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        print(row['name'])  # Access by name instead of row[0]
    
    Note: You must manually close the connection when done.
    """
    conn = get_db_pool().getconn()
    return conn, conn.cursor(cursor_factory=RealDictCursor)
