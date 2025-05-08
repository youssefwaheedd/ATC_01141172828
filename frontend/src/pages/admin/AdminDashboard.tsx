import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoaderCircleIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  if (isLoading || showLoader) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-2xl text-foreground">
          <LoaderCircleIcon className="h-8 w-8 animate-spin" />
          <span>Loading Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className=" flex justify-center items-center w-full  ">
      <Outlet />
    </main>
  );
};

export default AdminDashboard;
