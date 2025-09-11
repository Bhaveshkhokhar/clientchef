import { createContext, useEffect, useState } from "react";
import { checkAuthStatus } from "../services/authService";

// Create a context for authentication state
export const authContext = createContext({
  loginstate: Boolean,
  handleuserProfile: () => {},
});

// Context provider component
const LogininfoContextProvider = ({ children }) => {
  const [loginstate, setloginstate] = useState(false);

 // Function to handle user profile state
  const handleuserProfile = (flag) => {
    setloginstate(flag);
  };

 // Effect to check authentication status on component mount
  useEffect(()=>{
    const controller=new AbortController();
    const signal=controller.signal;
    checkAuthStatus(signal)
    .then((data)=>{handleuserProfile(data.isLoggedIn);
    })
    .catch((err) =>{
      if(err.name==="AbortError"){
      console.log("Fetch aborted");
    }else{
      console.error("Auth check failed:", err.message);
      handleuserProfile(false);
    }
    })

    return ()=>{
      controller.abort();
    }
  },[]);

  // Provide the authentication state and handler to children components
  return (
    <authContext.Provider value={{ loginstate, handleuserProfile }}>
      {children}
    </authContext.Provider>
  );
};


export default LogininfoContextProvider;
