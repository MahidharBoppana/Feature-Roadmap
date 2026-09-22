import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, UserCircle, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Unable to logout");
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight"
            onClick={closeMobileMenu}
          >
            FeatureHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-3 sm:flex">
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

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
                >
                  <UserCircle className="h-5 w-5 text-muted-foreground" />

                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>

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

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t py-4 sm:hidden">
            <nav className="flex flex-col gap-2">
              <Link
                to="/features"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Features
              </Link>

              <Link
                to="/roadmap"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Roadmap
              </Link>

              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <UserCircle className="h-5 w-5" />
                  Profile
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Admin Dashboard
                </Link>
              )}

              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="mt-2 w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  asChild
                  className="mt-2 w-full"
                  onClick={closeMobileMenu}
                >
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
