"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="text-center space-y-2 p-6 pb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-xs">
            Sign in to access your resumes, ATS analyses, and version history.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-9 text-sm font-semibold" variant="gradient">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="p-6 pt-0 text-center border-t bg-muted/10 justify-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
