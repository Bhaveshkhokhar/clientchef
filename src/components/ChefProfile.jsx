import styles from "./ChefProfile.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChefStore } from "../store/ChefdataStore";
import { useNavigate ,Navigate,useLocation} from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import { authContext } from "../store/authStore";

const ChefProfile = () => {
  const {chef,updateProfilePic}=useContext(ChefStore);
    const {loginstate,handleuserProfile}=useContext(authContext);
     const location = useLocation();
    const navigate = useNavigate();
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [previewImg, setPreviewImg] = useState(
      `https://serverofchefbooking.onrender.com${chef.image}`
    );
    useEffect(() => {
      setPreviewImg(`https://serverofchefbooking.onrender.com${chef.image}`);
    }, [chef.image]);
  
    const handleUpload = () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        fetch("https://serverofchefbooking.onrender.com/updateChefProfilePic", {
          method: "POST",
          body: formData,
          credentials: "include",
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
              if (res.status == 401) {
                alert(data.message);
                handleuserProfile(data.isLoggedIn);
                navigate("/unauthorized");
                return;
              } else if (res.status == 404) {
                alert(data.message);
                handleuserProfile(data.isLoggedIn);
                navigate("/unauthorized");
                return;
              } else if (res.status == 500) {
                alert(data.message);
                return;
              }
              throw new Error("adding data failed");
            }
            return data;
          })
          .then((data) => {
            if (!data) return;
            if (data.status === "success") {
              updateProfilePic({
                ...chef,
                image:data.image,
              })
              alert("profile image updated");
              setShowUploadPopup(false);
            }
          })
          .catch((err) => {
            console.error("Error during updating image:", err);
            alert("An error occurred during uploading. Please try again.");
          });
      } else {
        alert("please add file");
        fileInputRef.current.focus();
      }
  
      // You can access the file with fileInputRef.current.files[0]
      // console.log("uploaded");
      // setShowUploadPopup(false);
      // Optionally update the main profile image here if you want
      // setUser({ ...user, image: previewImg });
    };
  
    const handleCancel = () => {
      setShowUploadPopup(false);
      setPreviewImg(`https://serverofchefbooking.onrender.com${chef.image}`); // Reset preview on cancel
    };
  
    // Handle file input change to preview image
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImg(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    if(!loginstate){
      return <Navigate to="/login" replace   state={{ from: location }}/>
    };

    return (
      <div className={`container py-5 ${styles.profileContainer}`}>
        <div className="row justify-content-center ">
          <div className="col-12 col-md-10 col-lg-8 ">
            <div
              className={`card shadow-sm p-4  rounded-5 ${styles.profileCard}`}
            >
              <div className="d-flex flex-column align-items-center">
                <img
                  src={`https://serverofchefbooking.onrender.com${chef.image}`}
                  alt={chef.name}
                  className={`rounded-circle mb-3 ${styles.profileImage}`}
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <h3 className="mb-2">{chef.name}</h3>
                <hr
                  style={{
                    width: "100%",
                    borderTop: "2px solid rgb(226, 140, 145)",
                    margin: "0 0 1rem 0",
                  }}
                />
                <div className="w-100 mt-3">
                  <div
                    style={{
                      border: "2px solid #e0e7ff",
                      borderRadius: "12px",
                      background: "white",
                      padding: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <p>
                      <strong>Phone:</strong> {chef.number}
                    </p>
                    <p>
                      <strong>Price:</strong> {chef.price}
                    </p>
                    <p>
                      <strong>Type of Service:</strong> {chef.type}
                    </p>
                    <p>
                      <strong>Availability:</strong> {chef.available?"Available":"Not Available"}
                      
                    </p>
                    <p>
                      <strong>Rating:</strong> {chef.rating}
                    </p>
                    <p>
                      <strong>Speciality:</strong> {chef.speciality}
                    </p>
                    <p>
                      <strong>Experience:</strong> {chef.experience} year
                    </p>
                    <p>
                      <strong>certifications:</strong> {chef.certifications}
                    </p>
                    <p>
                      <strong>Bio:</strong> {chef.bio}
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button
                    type="button"
                    className={`${styles["Button"]} mb-3`}
                    onClick={() => {
                      navigate("/editProfile");
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className={`${styles["Button"]} mb-3`}
                    onClick={() => setShowUploadPopup(true)}
                  >
                    Change Profile Picture
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Popup Modal for Upload */}
        {showUploadPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.35)",
              zIndex: 1050,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#e0e7ff, #c7d2fe, #a5b4fc)",
                borderRadius: "22px",
                padding: "2.5rem 2rem 2rem 2rem",
                minWidth: "340px",
                boxShadow: "0 8px 32px rgba(44,6,0,0.18)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px solid #a5b4fc",
                position: "relative",
                animation: "popup-fade-in 0.3s",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "50%",
                  width: "150px",
                  height: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 8px rgba(44,6,0,0.10)",
                  border: "2px solid black",
                }}
              >
                <img
                  src={previewImg}
                  alt="Profile Preview"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <h5
                className="mb-3"
                style={{
                  color: "Black",
                  fontWeight: 500,
                  letterSpacing: "1px",
                }}
              >
                Upload New Profile Picture
              </h5>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="form-control mb-4"
                style={{
                  maxWidth: "250px",
                  background: "#f0f4ff",
                  border: "1.5px solid black",
                  borderRadius: "8px",
                  color: "#6c4f27",
                  fontWeight: 500,
                }}
                onChange={handleFileChange}
              />
              <div className="d-flex gap-3 w-100 justify-content-center">
                <button
                 className={`${styles["Button"]} mb-3`}
                  type="button"
                  onClick={handleCancel}
                  
                >
                  Cancel
                </button>
                <button
                 className={`${styles["Button"]} mb-3`}
                  type="button"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default ChefProfile;