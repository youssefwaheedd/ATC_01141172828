import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { LockIcon } from "lucide-react";
import axios from "axios";
import { registerUser as registerUserService } from "@/services/auth/authServices";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();
  const { login: authContextLogin } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setConfirmPasswordError("");

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const responseData = await registerUserService(email, password);
      if (responseData.token && responseData.user) {
        await authContextLogin(responseData.token, responseData.user);
        navigate("/", { replace: true });
      } else {
        setError(
          responseData.message ||
            "Registration failed: Invalid response from server."
        );
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message || "Registration failed. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full p-3", className)} {...props}>
      <Card>
        <CardHeader>
          <CardDescription className="text-center flex items-center">
            <Link to="/" className="w-1/3">
              <LockIcon className="h-12 w-12 text-primary" />
            </Link>
            <span className="w-2/3 flex flex-col items-start font-bold">
              Sign up for an account
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email-register">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  id="email-register"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-register">Password</Label>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password-register"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    id="confirm-password"
                    name="confirm-password"
                    type={confirmPasswordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      confirmPasswordVisible
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>
              </div>
              {confirmPasswordError && (
                <div className="text-sm text-red-500">
                  {confirmPasswordError}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
            {error && (
              <div className="mt-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full cursor-pointer"
            disabled={loading}
            type="button"
          >
            <FcGoogle className="mr-2 h-4 w-4" /> Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
