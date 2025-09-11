import { createContext, useEffect, useState } from "react";
import { getTheChefProfile } from "../services/chefService";
import { useContext } from "react";
import { authContext } from "./authStore";
export const ChefStore = createContext({
  chef:{},
  updateChef: () => {},
  updateProfilePic:()=>{},
});
const ChefProvider = ({ children }) => {

  const {handleuserProfile}=useContext(authContext);

  const [chef, setchef] = useState({});

  const handelesetchef = (chef) => {
    setchef(chef);
  };

  const updateProfilePic=(chef)=>{
    setchef(chef);
  }

  const updateChef = (data) => {
    setchef(data);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getTheChefProfile(signal,handleuserProfile).then((chef) => {
      handelesetchef(chef);
    }).catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Auth check failed:", err.message);
          alert("something went wrong");
        }
      });
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <ChefStore.Provider value={{ chef, updateChef,updateProfilePic}}>
      {children}
    </ChefStore.Provider>
  );
};
export default ChefProvider;
