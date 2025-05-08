// src/App.tsx
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateEvent from "./pages/admin/CreateEvent";
import Events from "./components/events/Events";
import EditEvent from "./pages/admin/EditEvent";

import Layout from "./Layout";

import AdminOnlyRoute from "./components/protectedRoutes/AdminOnlyRoute";
import NonAdminRoute from "./components/protectedRoutes/NonAdminRoute";
import { ThemeProvider } from "./context/ThemeProvider";
import BookedSuccessfully from "./pages/BookedSuccessfully";
import MyBookings from "./pages/user/MyBookings";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route element={<NonAdminRoute />}>
              <Route index element={<Home />} />
            </Route>

            <Route element={<NonAdminRoute />}>
              <Route path="my-bookings" element={<MyBookings />} />
            </Route>

            <Route element={<AdminOnlyRoute />}>
              <Route path="admin" element={<AdminDashboard />}>
                <Route index element={<Events />} />
                <Route path="events" element={<Events />} />
                <Route path="create-event" element={<CreateEvent />} />
                <Route path="edit-event/:id" element={<EditEvent />} />
              </Route>
            </Route>
          </Route>
          <Route path="/booked-successfully" element={<BookedSuccessfully />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
