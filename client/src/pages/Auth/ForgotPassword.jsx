import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/api/auth.api";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await forgotPassword(email);

      toast.success(
        response.message ||
          "If an account exists with this email, a reset link has been sent.",
      );

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to process your request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>

          <CardDescription>
            Enter your email address and we'll send you a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
