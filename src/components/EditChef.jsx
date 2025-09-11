import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./EditChef.module.css";
import { useRef } from "react";
import { ChefStore } from "../store/ChefdataStore";
import { authContext } from "../store/authStore";
const EditChef = () => {
  const navigate = useNavigate();
  const { handleuserProfile } = useContext(authContext);
  const { chef, updateChef } = useContext(ChefStore);
  const [type, setType] = useState(chef.type);
  useEffect(() => {
    setType(chef.type || "");
  }, [chef.type]);
  const Name = useRef();
  const Price = useRef();
  const Type = useRef();
  const Speciality = useRef();
  const Bio = useRef();
  const Certifications = useRef();
  const Experience = useRef();

  const handlesubmit = (e) => {
    e.preventDefault();
    fetch("https://serverofchefbooking.onrender.com/updateChefData", {
      method: "POST",
      body: JSON.stringify({ 
        Name: Name.current.value,
        Type: Type.current.value,
        Price: Price.current.value,
        Speciality: Speciality.current.value,
        Bio: Bio.current.value,
        Experience: Experience.current.value,
        Certifications: Certifications.current.value,
      }),
      headers:{
        "Content-Type":"application/json"
      },

      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 422) {
            alert(data.message);
            if (data.field === "Name") {
              Name.current.focus();
            } else if (data.field === "Price") {
              Price.current.focus();
            } else if (data.field === "Type") {
              Type.current.focus();
            } else if (data.field === "Speciality") {
              Speciality.current.focus();
            } else if (data.field === "Bio") {
              Bio.current.focus();
            } else if (data.field === "Certifications") {
              Certifications.current.focus();
            } else if (data.field === "Experience") {
              Experience.current.focus();
            }
            return;
          } else if (res.status == 401) {
            handleuserProfile(false);
            return;
          } else if (res.status == 404) {
            handleuserProfile(false);
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
          updateChef({
            ...chef,
            name: Name.current.value,
            type: Type.current.value,
            price: Price.current.value,
            speciality: Speciality.current.value,
            bio: Bio.current.value,
            experience: Experience.current.value,
            certifications: Certifications.current.value,
          });
          alert("Chef Profile Updated");
          navigate("/chefProfile");
        }
      })
      .catch((err) => {
        console.error("Error during updating data:", err);
        alert("An error occurred during updating. Please try again.");
      });
  };
  return (
    <div className={style.formWrapper}>
      <form
        className={style.form}
        onSubmit={(e) => {
          handlesubmit(e);
        }}
      >
        <div className={style.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            defaultValue={chef.name}
            name="name"
            ref={Name}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="text"
            defaultValue={chef.price}
            name="price"
            ref={Price}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            ref={Type}
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
            type="text"
            name="speciality"
            defaultValue={chef.speciality}
            ref={Speciality}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            rows="4"
            id="bio"
            defaultValue={chef.bio}
            name="bio"
            ref={Bio}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="certifications">Certifications</label>
          <input
            id="certifications"
            type="text"
            name="certifications"
            defaultValue={chef.certifications}
            ref={Certifications}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="experience">Experience</label>
          <input
            id="experience"
            type="text"
            name="experience"
            defaultValue={chef.experience}
            ref={Experience}
            required
          />
        </div>

        <button type="submit" className={style.submitBtn}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditChef;
