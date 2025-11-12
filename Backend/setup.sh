#!/bin/bash

# ============================================================================
# Way2Rare Backend Setup Script
# ============================================================================
# This script sets up the Python backend environment
# It creates a virtual environment, installs dependencies, and sets up .env file
# 
# Usage: ./setup.sh
# ============================================================================

echo "============================================================================"
echo "Setting up Way2Rare Backend..."
echo "============================================================================"

# ============================================================================
# Check if Python 3 is installed
# ============================================================================
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# ============================================================================
# Create virtual environment
# ============================================================================
# A virtual environment isolates Python packages for this project
# This prevents conflicts with other Python projects on your system
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# ============================================================================
# Activate virtual environment
# ============================================================================
# This activates the virtual environment so packages are installed here
echo "Activating virtual environment..."
source venv/bin/activate

# ============================================================================
# Upgrade pip
# ============================================================================
# pip is the Python package installer
# We upgrade it to ensure we have the latest version
echo "Upgrading pip..."
pip install --upgrade pip

# ============================================================================
# Install dependencies
# ============================================================================
# This installs all packages listed in requirements.txt
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# ============================================================================
# Create .env file if it doesn't exist
# ============================================================================
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your database credentials!"
    echo "   Edit Backend/.env and set your DATABASE_URL"
else
    echo ""
    echo "✅ .env file already exists"
fi

# ============================================================================
# Setup complete message
# ============================================================================
echo ""
echo "============================================================================"
echo "Setup complete! Next steps:"
echo "============================================================================"
echo ""
echo "1. Update .env with your DATABASE_URL:"
echo "   DATABASE_URL=postgresql://username:password@host:5432/database"
echo ""
echo "2. Run database schema:"
echo "   psql \$DATABASE_URL -f database/schema.sql"
echo ""
echo "3. Run migration to populate products:"
echo "   python scripts/migrate_products.py"
echo ""
echo "4. Start the server:"
echo "   python run.py"
echo ""
echo "============================================================================"
echo "To activate virtual environment in the future, run:"
echo "source venv/bin/activate"
echo "============================================================================"


