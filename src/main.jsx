import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./routes/App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./components/Login.jsx";
import LoginRequiredMessage from "./components/LoginRequiredMessage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Booking from "./components/Booking.jsx";
import EditChef from "./components/EditChef.jsx";
import ChefProfile from "./components/ChefProfile.jsx";
import BookingHistory from "./components/BookingHistory.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute></ProtectedRoute>,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/bookings", element: <Booking /> },
          { path: "/chefProfile", element: <ChefProfile /> },
          { path: "/editProfile", element: <EditChef /> },
          { path: "/pastBookings", element: <BookingHistory /> },
        ],
      },
      { path: "/login", element: <Login /> },
      { path: "/unauthorized", element: <LoginRequiredMessage /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
