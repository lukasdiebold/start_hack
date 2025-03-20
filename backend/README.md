# Innovation Ecosystem Backend

This repository contains the backend API for the Innovation Ecosystem application.

## Project Structure

The backend is split into two parts:

- `backend_python/`: Python FastAPI application with SQLite database
- `src/`: TypeScript Node.js API (if used)

## Python Backend Setup

The Python backend uses FastAPI with SQLite database and JWT authentication.

### Prerequisites

- Python 3.8+
- pip
- virtualenv (optional, but recommended)

### Setup Instructions

1. Navigate to the Python backend directory:

```bash
cd backend/app
```

2. Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate on macOS/Linux
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the server
```bash
python app.py
```



The API will be available at http://localhost:8000

API Documentation is automatically generated and available at http://localhost:8000/docs