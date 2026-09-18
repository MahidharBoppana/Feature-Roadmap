import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Unable to logout");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          FeatureHub
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>

          <Link
            to="/roadmap"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Roadmap
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                <UserCircle className="h-5 w-5 text-muted-foreground" />

                <span className="text-sm font-medium">{user?.name}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
