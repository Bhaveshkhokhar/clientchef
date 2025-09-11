const getTheChefBookings = async (signal,handleuserProfile) => {
  try {
    const response = await fetch("https://serverofchefbooking.onrender.com/get-Chefbookings", {
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
    console.log(data);
    return mapServerbookingToLocalbooking(data.BookingData);
  } catch (err) {
    throw err;
  }
};
const mapServerbookingToLocalbooking = (bookings) => {
  return bookings.map((booking) => {
    return {
      bookedAt:booking.bookedAt,
      id:booking.id,
      time:booking.time,
      date:booking.date,
      fees:booking.price,
      address:booking.address,
      modeOfPayment:booking.modeOfPayment,
      user:booking.user,
    };
  });
};
export default getTheChefBookings;
