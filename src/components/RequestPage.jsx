import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "./RequestPage.module.css";
import { BACKEND_URL, S3_BASE_URL } from "../config";

export default function RequestPage() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewImg, setPreviewImg] = useState(
    `${S3_BASE_URL}/public/defaultpic.jpg`,
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [bio, setBio] = useState("");
  const [certifications, setCertifications] = useState("");
  const [experience, setExperience] = useState("");

  const fileInputRef = useRef(null);

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

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^[0-9]{10}$/.test(number.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await fetch(`${BACKEND_URL}/chefOtpRequest`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Number: number.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send OTP.");
      }

      setOtpSent(true);
      setMessage("OTP sent. Please enter the code to verify your number.");
    } catch (err) {
      setError(err.message || "Could not send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your mobile number.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await fetch(`${BACKEND_URL}/chefOtpVerify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Number: number.trim(), Otp: otp.trim() }),
      });
      const data = await response.json();

      if (!response.ok || (data.status && data.status !== "success")) {
        throw new Error(data.message || "OTP verification failed.");
      }

      setOtpVerified(true);
      window.alert("Phone number is verified");
    } catch (err) {
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your mobile number before submitting the form.");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("Number", number.trim());
      formData.append("Password", password);
      formData.append("Name", name);
      formData.append("Price", price);
      formData.append("Type", type);
      formData.append("Speciality", speciality);
      formData.append("Bio", bio);
      formData.append("Certifications", certifications);
      formData.append("Experience", experience);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await fetch(`${BACKEND_URL}/addChefAccountRequest`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send request.");
      }

      setMessage("Request submitted successfully.");
      navigate("/");
    } catch (err) {
      setError(
        err.message || "An error occurred while submitting your request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.header}>
          <h1 className={style.title}>Chef Request</h1>
          {otpVerified && (
            <p className={style.subtitle}>Phone Number Verified</p>
          )}
          {!otpVerified && (
            <p className={style.subtitle}>
              Verify your mobile number first, then complete your chef request
              details.
            </p>
          )}
        </div>

        <form
          className={style.form}
          onSubmit={otpVerified ? handleSubmit : sendOtp}
        >
          <div className={style.formGroup}>
            <label htmlFor="number">Mobile Number</label>
            <div className={style.numberRow}>
              <input
                id="number"
                type="text"
                className={style.input}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                disabled={otpSent || isSendingOtp}
                placeholder="Enter 10-digit mobile number"
                required
              />
              {!otpVerified && (
                <button
                  type="button"
                  className={`btn btn-lg rounded-3 ${style.otpButton}`}
                  onClick={sendOtp}
                  disabled={otpSent || isSendingOtp || !number.trim()}
                >
                  {isSendingOtp ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>
          </div>

          {otpSent && !otpVerified && (
            <div className={style.formGroup}>
              <label htmlFor="otp">OTP Code</label>
              <div className={style.otpRow}>
                <input
                  id="otp"
                  type="text"
                  className={style.input}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isVerifyingOtp}
                  placeholder="Enter OTP"
                  required
                />
                <button
                  type="button"
                  className={`btn btn-lg rounded-3 ${style.verifyButton}`}
                  onClick={verifyOtp}
                  disabled={isVerifyingOtp || !otp.trim()}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {otpVerified && (
            <>
              <div className={style.profileRow}>
                <div className={style.profilePreview}>
                  <img
                    src={previewImg}
                    alt="Chef preview"
                    className={style.profileImage}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className={style.fileInput}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className={style.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="Price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={style.select}
                  required
                >
                  <option value="">-- Select Type --</option>
                  <option value="One-Time Service">One-Time Service</option>
                  <option value="Chef's Table">Chef's Table</option>
                  <option value="Chef for Party">Chef for Party</option>
                  <option value="Chef Subscription">Chef Subscription</option>
                </select>
              </div>

              <div className={style.formGroup}>
                <label htmlFor="speciality">Speciality</label>
                <input
                  id="speciality"
                  name="Speciality"
                  type="text"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={style.textarea}
                  rows={4}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="certifications">Certifications</label>
                <input
                  id="certifications"
                  name="Certifications"
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="experience">Experience</label>
                <input
                  id="experience"
                  name="Experience"
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className={style.input}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-lg rounded-3 ${style.submitBtn}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </>
          )}
        </form>

        <div className={style.statusRow}>
          {message && (
            <p className={`${style.message} ${style.success}`}>{message}</p>
          )}
          {error && (
            <p className={`${style.message} ${style.error}`}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
