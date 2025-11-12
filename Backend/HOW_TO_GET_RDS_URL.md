# How to Get Your RDS Database URL

This guide explains how to find your RDS database connection URL in the AWS Console.

## Step-by-Step Instructions

### 1. Log into AWS Console

1. Go to https://console.aws.amazon.com/
2. Sign in with your AWS account

### 2. Navigate to RDS

1. In the AWS Console, search for "RDS" in the search bar
2. Click on "RDS" service
3. Or go directly to: https://console.aws.amazon.com/rds/

### 3. Find Your Database Instance

1. Click on "Databases" in the left sidebar
2. You should see your database instance listed (e.g., "way2rare")
3. Click on your database instance name

### 4. Get Connection Information

On the database details page, you'll find connection information in the "Connectivity & security" section:

#### Database Endpoint (Host)

- **Endpoint**: `way2rare.cw3caoi8ypsm.us-east-1.rds.amazonaws.com`
- This is your database host address

#### Port

- **Port**: `5432` (default for PostgreSQL)
- This is the port your database listens on

#### Database Name

- Usually `postgres` (default) or the database name you created
- You can find this in the "Configuration" tab under "DB name"

#### Username

- **Master username**: `way2rare` (or whatever you set)
- This is in the "Configuration" tab

#### Password

- You set this when creating the RDS instance
- If you forgot it, you'll need to reset it (requires database restart)

### 5. Construct the Database URL

The format for the database URL is:

```
postgresql://[username]:[password]@[endpoint]:[port]/[database_name]
```

**Example:**

```
postgresql://way2rare:w2rdb2005@way2rare.cw3caoi8ypsm.us-east-1.rds.amazonaws.com:5432/postgres
```

**Breaking it down:**

- `postgresql://` - Protocol (always starts with this)
- `way2rare` - Username
- `w2rdb2005` - Password
- `way2rare.cw3caoi8ypsm.us-east-1.rds.amazonaws.com` - Endpoint (host)
- `5432` - Port
- `postgres` - Database name

## Quick Copy Method

### Option 1: From RDS Console

1. Go to your RDS instance
2. Click on "Connectivity & security" tab
3. Look for the endpoint
4. Copy the endpoint
5. Construct the full URL manually

### Option 2: Use AWS CLI

If you have AWS CLI installed:

```bash
aws rds describe-db-instances --db-instance-identifier way2rare --query 'DBInstances[0].Endpoint.Address' --output text
```

## Your Current Database URL

Based on what we set up earlier, your database URL is:

```
postgresql://way2rare:w2rdb2005@way2rare.cw3caoi8ypsm.us-east-1.rds.amazonaws.com:5432/postgres
```

This should already be in your `.env` file.

## Verify Your Database URL

You can test your database URL by running:

```bash
# Test connection
psql "postgresql://way2rare:w2rdb2005@way2rare.cw3caoi8ypsm.us-east-1.rds.amazonaws.com:5432/postgres" -c "SELECT version();"
```

Or test from Python:

```bash
cd Backend
source venv/bin/activate
python -c "import os; from dotenv import load_dotenv; load_dotenv(); import psycopg2; conn = psycopg2.connect(os.getenv('DATABASE_URL')); print('✅ Connected!'); conn.close()"
```

## Important Notes

1. **Security**: Never share your database URL or commit it to version control
2. **Password**: If you forgot your password, you can reset it in RDS (requires restart)
3. **Public Access**: Make sure your RDS instance is publicly accessible if connecting from outside AWS
4. **Security Group**: Ensure your security group allows connections from your IP on port 5432

## Troubleshooting

### Can't Connect?

1. **Check Public Accessibility**:

   - Go to RDS → Your instance → Modify
   - Under "Connectivity", ensure "Publicly accessible" is set to "Yes"
   - Apply changes (may require restart)

2. **Check Security Group**:

   - Go to RDS → Your instance → Connectivity & security
   - Click on the security group
   - Add inbound rule:
     - Type: PostgreSQL
     - Port: 5432
     - Source: Your IP address (or 0.0.0.0/0 for testing)

3. **Check VPC Settings**:
   - Ensure your RDS instance is in a public subnet
   - Check route tables have internet gateway

### Find Your Current IP

To find your IP address to add to the security group:

```bash
curl https://api.ipify.org
```

## Alternative: Use AWS Secrets Manager

For production, consider storing database credentials in AWS Secrets Manager instead of `.env` file for better security.

