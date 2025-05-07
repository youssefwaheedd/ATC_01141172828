import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <LoginForm className="max-w-120" />
    </div>
  );
};

export default Login;
