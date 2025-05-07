// src/components/NonAdminRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoaderCircleIcon } from "lucide-react"; // Or your preferred loader

const NonAdminRoute: React.FC = () => {
  const { user, isLoading } = useAuth(); // We only need user and isLoading here

  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-2xl justify-center items-center flex gap-2">
        <LoaderCircleIcon className="animate-spin h-8 w-8" /> Loading page...
      </div>
    );
  }

  if (user && user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default NonAdminRoute;
