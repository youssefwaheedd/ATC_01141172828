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
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { LockIcon } from "lucide-react";
import axios from "axios";
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
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleGoogleSignIn = async () => {
    window.location.replace("http://localhost:3000/auth/google");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      setLoading(true); // Set loading state to true
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response, e.g., saving the token
      const token = await response.data.token;
      localStorage.setItem("authToken", token); // Store the token in localStorage
      // Navigate to the dashboard or home page
      window.location.replace("/"); // Redirect to the home page
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          "Registration failed. Please try again.";
        setError(message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full p-3", className)} {...props}>
      <Card>
        <CardHeader>
          <CardDescription className=" text-center flex items-center">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
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
                <div className="flex items-center">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                </div>
                <div className="relative">
                  <Input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    id="confirm-password"
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
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
              <div className="flex justify-between items-center gap-3">
                <Button type="submit" className="w-full">
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            {confirmPasswordError && (
              <div className="mt-4 text-center text-sm text-red-500">
                {confirmPasswordError}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full cursor-pointer mt-2"
          >
            <FcGoogle />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
