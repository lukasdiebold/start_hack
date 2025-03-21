# Innovation Ecosystem Platform

A platform for exploring and connecting with the innovation ecosystem in St. Gallen.

## Project Structure

This project consists of:

- **Frontend**: Next.js application with React and TypeScript
- **Backend**: Python Flask API with SQLite database

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.9+ (for local backend development)

### Running with Docker

```bash
# Start both frontend and backend
docker-compose up

# Build and start (if you've made changes to Dockerfiles)
docker-compose up --build
```

### Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Features

- Interactive visualization of the innovation ecosystem
- Chat interface for exploring data
- Roadmap visualization
- User authentication

## Data

The project uses the Canton of St. Gallen innovation ecosystem dataset.
