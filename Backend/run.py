# ============================================================================
# Server Runner Script
# ============================================================================
# This script starts the FastAPI server with hot-reload enabled
# Hot-reload automatically restarts the server when you change code
# 
# Usage: python run.py
# ============================================================================

import uvicorn

if __name__ == "__main__":
    # Run the FastAPI app with uvicorn
    # main:app means "import app from main.py"
    # host="0.0.0.0" means accept connections from any IP (not just localhost)
    # port=8000 is the port the server will run on
    # reload=True enables hot-reload (server restarts on code changes)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


