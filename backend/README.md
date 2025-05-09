# Backend - Event Booking System

This is the backend service for the event booking system. It handles user authentication, event management, and booking APIs.

---

## Setup Instructions

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create your environment variables file

```bash
cp .env.example .env
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the server

```bash
npm start
```

By default, the backend server runs on [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

- `npm start` - Starts the server using Node.js
- `npx prisma studio` - Opens the Prisma GUI to inspect the database

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Supabase (for image uploads)

---

## License

This backend service is provided for evaluation purposes only.
