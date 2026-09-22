import ProtectedRoute from "./ProtectedRoute";

import Profile from "@/pages/profile/Profile";

const protectedRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];

export default protectedRoutes;
