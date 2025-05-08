import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const authError = queryParams.get("error");

    if (authError) {
      setError(`Authentication failed: ${authError}`);
      setProcessing(false);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    if (token) {
      login(token)
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Error processing auth token:", err);
          setError(
            "Failed to process authentication. Please try logging in again."
          );
          setProcessing(false);
          setTimeout(() => navigate("/login", { replace: true }), 3000);
        });
    } else {
      setError("No authentication token found. Redirecting to login.");
      setProcessing(false);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    }
  }, [location.search, navigate, login]);

  if (processing) {
    return <div>Processing authentication...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <p>You will be redirected to the login page shortly.</p>
      </div>
    );
  }

  return null;
};

export default AuthCallbackPage;
