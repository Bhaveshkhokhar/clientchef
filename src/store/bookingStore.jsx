import { createContext, useContext, useEffect, useState } from "react";
import getTheChefBookings from "../services/bookingService";
import { authContext } from "./authStore";
import { bookingHistoryContext } from "./bookingHistoryStore";

export const bookingContext = createContext({
  bookings: [],
  updateBooking: () => {},
});

const BookingContextProvider = ({ children }) => {
  const { handleuserProfile } = useContext(authContext);
  const { handlechange } = useContext(bookingHistoryContext);

  const [bookings, setBooking] = useState([]);

  const addBooking = (data) => {
    const bookingdata = [...data];
    setBooking(bookingdata);
  };

  const updateBooking = (id, action, date, time,bookedAt) => {
    fetch("https://serverofchefbooking.onrender.com/chefbookingupdate", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        id,
        action,
        date,
        time,
        bookedAt
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          alert(data.message);
          if (res.status === 401) {
            handleuserProfile(false);
            return;
          }
          if (res.status === 404) {
            const book = bookings.filter((booking) => {
              return booking.id !== id;
            });
            setBooking(book);
            return;
          }
          if (res.status === 400) {
            const historydata = bookings.find((booking) => booking.id === id);
            const book = bookings.filter((booking) => {
              return booking.id !== id;
            });
            setBooking(book);
            handlechange({
              name: historydata.user.name,
              date: historydata.date,
              time: historydata.time,
              fees: historydata.price,
              modeOfPayment: historydata.modeOfPayment,
              status: data.status,
            });
            return;
          }
          if (res.status === 500) {
            return;
          }
          throw new Error("Failed to update status");
        }
        return data;
      })
      .then((data) => {
        if (!data) return;
        if (data.status === "success") {
          const historydata = bookings.find((booking) => booking.id === id);
          const book = bookings.filter((booking) => {
            return booking.id !== id;
          });
          handlechange({
            name: historydata.user.name,
            date: historydata.date,
            time: historydata.time,
            fees: historydata.price,
            modeOfPayment: historydata.modeOfPayment,
            status: action,
          });
          setBooking(book);
        }
      })
      .catch((err) => {
        console.error("Error during updating status of Booking:", err);
        alert("An error occurred during updating status. Please try again.");
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getTheChefBookings(signal, handleuserProfile)
      .then((bookings) => {
        addBooking(bookings);
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
    <bookingContext.Provider value={{ bookings, updateBooking }}>
      {children}
    </bookingContext.Provider>
  );
};
export default BookingContextProvider;
