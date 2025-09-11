// ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authContext } from "../store/authStore";
import ChefProvider from "../store/ChefdataStore";
import BookingHistoryContextProvider from "../store/bookingHistoryStore";
import Header from "./Header";
import BookingContextProvider from "../store/bookingStore";
const ProtectedRoute = () => {
  const location=useLocation();
  const { loginstate } = useContext(authContext);
  return loginstate ? (
    <>
      <ChefProvider>
        <BookingHistoryContextProvider>
          <BookingContextProvider>
            <Header />
            <Outlet />
          </BookingContextProvider>
        </BookingHistoryContextProvider>
      </ChefProvider>
    </>
  ) : (
    <Navigate to="/unauthorized" replace state={{ from: location }}/>
  );
};

export default ProtectedRoute;
