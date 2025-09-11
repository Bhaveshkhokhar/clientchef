const getBookingHistory = async (signal,handleuserProfile) => {
  try {
    const response = await fetch("https://serverofchefbooking.onrender.com/getchefBookingHistory", {
      signal,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        handleuserProfile(false);
        return;
      }
      if (response.status === 404) {
        handleuserProfile(false);
        return ;
      }
      if (response.status === 500) {
        alert(data.message);
        return;
      }
      throw new Error("Failed to fetch authentication status");
    }

    return mapServerBookingHistToLocaBookingHist(data.bookings);
  } catch (err) {
    throw err;
  }
};
const mapServerBookingHistToLocaBookingHist = (bookings) => {
  return bookings.map((booking) => {
    return {
     name:booking.name,
     date:booking.date,
     time:booking.time,
     fees:booking.price,
     modeOfPayment:booking.modeOfPayment,
     status:booking.status,
    };
  });
};
export default getBookingHistory;
