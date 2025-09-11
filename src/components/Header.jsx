import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useContext, useState } from "react";
import { authContext } from "../store/authStore";
const Header = () => {
  const{handleuserProfile}=useContext(authContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handlesignout = (e) => {
    // e.preventDefault();

    fetch("https://serverofchefbooking.onrender.com/cheflogout", {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 400) {
            alert("You are not logged in");
            return;
          } else if (res.status === 500) {
            alert("Internal server error. Please try again later.");
            return;
          }
          throw new Error("Logout failed");
        }
        return data;
      })
      .then((data) => {
        if (!data) return;
        if (data.status === "success") {
          handleuserProfile(false);
          navigate("/unauthorized");
          alert("You have been logged out successfully");
        }
      })
      .catch((err) => {
        console.error("Logout error:", err);
        alert("An error occurred while logging out. Please try again.");
      });
  };
  return (
    <header className={`${styles["grad"]} p-3 border-bottom`}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              width="50px"
              height="50px"
              src="https://serverofchefbooking.onrender.com/Chefwalelogo.png"
              alt="ChefWale"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}>
            <center>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link px-3">
                <b>   Dashboard</b>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/chefProfile" className="nav-link px-3">
                 <b>  Profile</b>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/bookings" className="nav-link px-3">
                  <b> Booking</b>
                </Link>
              </li>
               <li className="nav-item">
                <Link to="/pastBookings" className="nav-link px-3">
                  <b>Past Booking </b>
                </Link>
              </li>
            </ul>
            </center>
            {/* Hamburger menu (mobile): show below links */}
            {/* Hamburger menu (mobile): show below links, left-aligned */}
            <div className="w-100 d-lg-none d-block mt-3 ps-3">
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className={`btn ${styles["button"]} w-75`}
                  onClick={(e) => {
                   handlesignout(e);
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
            {/* Desktop: keep in top bar */}
            <div className="d-none d-lg-flex align-items-center ms-auto">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn ${styles["button"]}`}
                  onClick={(e) => {
                   handlesignout(e);
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Header;
