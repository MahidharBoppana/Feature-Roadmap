import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/api/auth.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Email verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token);

        setStatus("success");
        setMessage(
          response.message || "Your email has been verified successfully.",
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. The link may be invalid or expired.",
        );
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {status === "verifying" && "Verifying your email..."}
            {status === "success" && "Email verified"}
            {status === "error" && "Verification failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">
            {status === "verifying"
              ? "Please wait while we verify your email address."
              : message}
          </p>

          {status === "success" && (
            <Button asChild className="w-full">
              <Link to="/login">Continue to Login</Link>
            </Button>
          )}

          {status === "error" && (
            <Button asChild className="w-full">
              <Link to="/login">Back to Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
