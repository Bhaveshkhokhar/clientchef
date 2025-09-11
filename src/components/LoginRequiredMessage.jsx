import React, { useContext,useEffect } from "react";
import styles from "./LoginRequiredMessage.module.css";
import { useNavigate,Navigate, useLocation } from "react-router-dom";
import { authContext } from "../store/authStore";
const LoginRequiredMessage = () => {
  const {loginstate}=useContext(authContext);
  const navigate = useNavigate();
  const location=useLocation();
  useEffect(() => {
    if (loginstate) {
      // Get the intended path, fallback to home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [loginstate, navigate, location]);
  return (
    <div className={` ${styles["container"]}`}>
      <div className={` ${styles["messageBox"]}`}>
        <p className={` ${styles["text"]}`}>
          To access the chef profile, login first.
        </p>
        <div>
          <center>
            <button
              type="button"
              className={`btn ${styles["button"]}`}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredMessage;
