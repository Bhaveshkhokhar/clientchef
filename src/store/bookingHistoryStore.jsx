import { createContext, useContext, useEffect, useState } from "react";
import getBookingHistory from "../services/bookingHistoryService";
import { authContext } from "./authStore";
export const bookingHistoryContext = createContext({
  bookinghistory: [],
  handlechange:()=>{},
});
const BookingHistoryContextProvider = ({ children }) => {
  const { handleuserProfile } = useContext(authContext);

  const [bookinghistory, setbookinghistory] = useState([]);

  const addbookinghistory = (data) => {
    const request = [...data];
    setbookinghistory(data);
  };

  const handlechange = (data) => {
   const newdata=[...bookinghistory,data];
   setbookinghistory(newdata);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getBookingHistory(signal,handleuserProfile)
      .then((data) => {
        addbookinghistory(data);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("something went wrong at server side:", err.message);
          alert("something went wrong at server side");
        }
      });
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <bookingHistoryContext.Provider value={{ bookinghistory,handlechange }}>
      {children}
    </bookingHistoryContext.Provider>
  );
};
export default BookingHistoryContextProvider;
