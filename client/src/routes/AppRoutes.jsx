import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

import publicRoutes from "./public.routes";
import protectedRoutes from "./protected.routes";
import adminRoutes from "./admin.routes";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [...publicRoutes, ...protectedRoutes, ...adminRoutes],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
