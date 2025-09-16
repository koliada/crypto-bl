# Crypto BL

Disclaimers right away!

1. Because of the time restriction, I essentially vibe coded the project structure and did not research what's the new hot thing out there. So I created a boilerplate of a stack familiar to me and focused on the details.
2. The UI is also an AI creation.
3. I, of course, implemented the backend logic and adjusted the things on the frontend myself, and ready to explain what's going on there.
4. I'm sure there's a lot of boilerplate code left. I don't think it matters at this point. Setting the project from scratch and account for the perfect setup would take another day or two.

## Tech Stack

- **Frontend**: React + Vite + Styled Components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Containerization**: Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git
- **! IMPORTANT !** `.env` file with `CMC_API_KEY`; of course, I wouldn't commit an API key to the public repo; see email

### Installation

1. Clone the repository:
```bash
git clone git@github.com:koliada/crypto-bl.git
cd crypto-bl
```

2. Create an `.env` file with `CMC_API_KEY`:
```properties
CMC_API_KEY=xxxx-xxxx
```

3. Start the application with Docker Compose:
```bash
docker compose up --build
```

This will start:
- PostgreSQL + apply the initial "migration"
- Backend API
- Frontend

The frontend should be available at http://localhost:3000/.

### Tests

As required, there are tests on both backend and frontend.

They are also vibe coded and checked with my own eyes.

To run:

```bash
nvm use # or have Node.js installed globally
cd backend
npm i
npm test

# repeat for frontend
cd ../frontend
npm i
npm test
```

### Potential Improvements

Endless!

- Infra: Properly prepare for different environments
- Database: Add proper migration tool (e.g., knex)
- Database: Use ORM or query builder (Node.js has been historically impaired with good ORMs, but microORM looks nice; Slonik is also something interesting)
- Backend: More trading pairs should already be supported by the DB table, but we should also properly store CMC IDs of the symbols, and generally, the possibilities are limitless (looking at the CMC API)
- Backend: Historical data is already available, only an endpoint update is necessary to remove the `LIMIT` from the query; to also have more data without gaps, we of course need to fetch quotes periodically using cron or similar interval mechanism
- Frontend: Currency buttons -> filterable autocomplete dropdowns with available pairs
- Backend: Make 3rd party provider separation better, implement proper connector clients that handle edge cases and response/type mapping
- Monitoring: Add proper error handling, logging and alerting

### ~~ FIN ~~

Thanks for reading,<br>
I hope this make sense.