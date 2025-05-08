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
import { Lock } from "lucide-react";
import axios from "axios";
import { loginUser } from "@/services/auth/authServices";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleSignIn = async () => {
    window.location.replace(`${API_BASE_URL}/auth/google`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await loginUser(email, password);

      window.location.replace(`/`);
    } catch (err: unknown) {
      if (err instanceof Error && axios.isAxiosError(err)) {
        const message =
          err.response?.data.message || "Login failed. Please try again.";
        setError(message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6  p-3 w-full", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardDescription className="text-center flex  items-center">
            <Link to={"/"} className="w-1/3  ">
              <Lock className="h-12 w-12" />{" "}
            </Link>
            <span className="w-2/3 flex flex-col items-start  text-center">
              <span className="font-bold ">Sign in to your account</span>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="relative">
                  <Input
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    readOnly={isReadOnly}
                    onFocus={() => setIsReadOnly(false)}
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
              <Button type="submit" className="w-full cursor-pointer">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
            {error && (
              <div className="mt-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full cursor-pointer"
            >
              <FcGoogle />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
