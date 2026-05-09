import React, { useContext, useEffect } from "react";
import styles from "./LoginRequiredMessage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { authContext } from "../store/authStore";

const LoginRequiredMessage = () => {
  const { loginstate } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loginstate) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [loginstate, navigate, location]);

  return (
    <div
      className={`${styles.container} modal modal-sheet position-static d-block p-4 py-md-5`}
    >
      <div className="modal-dialog">
        <div
          className="modal-content rounded-5 shadow"
          style={{ backgroundColor: "#e0e7ff", color: "Black" }}
        >
          <div className={styles.messageBox}>
            <div className={styles.header}>
              <div className={styles.icon}>🔒</div>
              <h1 className={styles.title}>Chef Access Required</h1>
              <p className={styles.subtitle}>
                You need to login before continuing to the chef dashboard,
                bookings, and profile management.
              </p>
            </div>

            <ul className={styles.features}>
              <li>View and manage your bookings</li>
              <li>Update your chef profile and availability</li>
              <li>See new orders and customer requests</li>
            </ul>

            <div className={styles.actions}>
              <button
                type="button"
                className={`btn btn-lg rounded-3 ${styles.loginButton}`}
                onClick={() => navigate("/login")}
                style={{ backgroundColor: "white", color: "#2c0600" }}
              >
                Login
              </button>
              <button
                type="button"
                className={`btn btn-lg rounded-3 ${styles.loginButton}`}
                onClick={() => navigate("/request")}
                style={{ backgroundColor: "white", color: "#2c0600" }}
              >
                Sign up
              </button>
            </div>

            <p className={styles.helpText}>
              Don’t have a chef account yet? Use the sign up button to request
              to create a chef account or login if you already have an account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredMessage;
