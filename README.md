# Crypto BL

A full-stack cryptocurrency application built with modern technologies.

## Tech Stack

- **Frontend**: React 18 + Vite + Styled Components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Containerization**: Docker Compose

## Features

- Modern React frontend with Vite for fast development
- Styled Components for component-based styling
- Express.js backend with CORS and security middleware
- PostgreSQL database with Docker
- Hot reloading for both frontend and backend
- Reset CSS styles for consistent cross-browser experience

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd crypto-bl
```

2. Start the application with Docker Compose:
```bash
docker compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3001
- Frontend on port 3000

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### Development

The application is configured for development with:
- Hot reloading for both frontend and backend
- Volume mounting for live code changes
- Environment variables for configuration

### API Endpoints

- `GET /api/health` - Health check endpoint (includes database status)
- `GET /api/test` - Test endpoint with environment info
- `GET /api/quotes` - Get recent quotes
- `POST /api/quotes` - Create a new quote (requires symbol_id and convert_id)

### Database Initialization

The database is automatically initialized with the required tables when the PostgreSQL container starts. The initialization script is located at `database/init.sql` and includes:

- Quotes table with proper indexes
- Sample data for testing
- Table documentation and comments

## Project Structure

```
crypto-bl/
├── compose.yml
├── database/
│   └── init.sql
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── types/
│       │   └── index.ts
│       └── database/
│           └── connection.ts
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       │   └── UI/
│       └── styles/
│           └── GlobalStyles.js
└── README.md
```

## Environment Variables

### Backend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:3001)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## License

This project is licensed under the ISC License.
