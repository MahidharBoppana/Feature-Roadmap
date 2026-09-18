// Auth Routes
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";

// Feature Routes
import FeatureFeed from "@/pages/Features/FeatureFeed";
import FeatureDetails from "@/pages/Features/FeatureDetails";
import Roadmap from "@/pages/Roadmap";

const publicRoutes = [
  {
    path: "/",
    element: <FeatureFeed />,
  },
  // Auth Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  // Feature Routes
  {
    path: "/features",
    element: <FeatureFeed />,
  },
  {
    path: "/features/:featureId",
    element: <FeatureDetails />,
  },
  {
    path: "/roadmap",
    element: <Roadmap />,
  },
];

export default publicRoutes;
