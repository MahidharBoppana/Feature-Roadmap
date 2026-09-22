import AdminRoute from "./AdminRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const adminRoutes = [
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
    ],
  },
];

export default adminRoutes;
