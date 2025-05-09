# 🎟️ Event Booking System

This is a full-stack event booking system built as part of a technical task. The system allows users to browse, book, and manage event reservations, while admins can manage all events through an integrated admin panel.

> ✅ Minor change made: Instead of labeling an event as "Booked," users now have the ability to cancel the booking if already booked.

---

## 📁 Project Structure

```
.
├── backend/
│   ├── .env.example
│   └── (Node.js REST API with Auth, Events, and Booking logic)
├── frontend/
│   ├── .env.example
│   └── (React + Tailwind frontend with user/admin interface)
```

---

## 🚀 Getting Started

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/youssefwaheedd/booking-system.git
cd booking-system
```

---

### 2. Backend Setup

```bash
cd backend
cp .env.example .env       # Create env file
npm install                # Install dependencies
npm start                  # Start backend server
```

> The backend runs on [http://localhost:3000](http://localhost:3000) by default.

---

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env       # Create env file
npm install                # Install dependencies
npm run dev                # Start frontend development server
```

> The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

---

## 🛠 Features

### ✅ User Functionality

- User registration and login
- Browse event listings
- Book and **cancel** tickets
- View event details

### ✅ Admin Functionality

- Create, update, delete events
- Admin panel UI (protected by role-based access)

---

## 🎨 UI Highlights

- Clean, responsive web layout
- Tailwind CSS for styling
- Integrated admin dashboard
- Image upload support (via Supabase)

---

## 🌐 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
- **Auth**: JWT + httpOnly cookies
- **Storage**: Supabase (for images)

---

## 📦 Deployment

The app is built with production readiness and can be deployed to services like:

- **Frontend**: Vercel [https://areeb-task-frontend.vercel.app](https://areeb-task-frontend.vercel.app)
- **Backend**: Vercel

---

## 📄 License

This project is provided for technical evaluation purposes only.
