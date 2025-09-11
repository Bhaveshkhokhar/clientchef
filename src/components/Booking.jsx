import { useContext } from "react";
import style from "./Booking.module.css";
import { ImCancelCircle } from "react-icons/im";
import { SiTicktick } from "react-icons/si";
import { bookingContext } from "../store/bookingStore";
const Booking = () => {
  const { bookings, updateBooking } = useContext(bookingContext);
  const data = bookings.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (bookings.length === 0) {
    return (
      <>
        <center>
          <h2 style={{ color: "#3B6DCE", marginTop: "50px" }}>
            <u>NO BOOKING TILL NOW</u>
          </h2>
        </center>
      </>
    );
  }
  return (
    <>
      <div style={{ margin: "5px" }}>
        <div className={style.tableWrapper}>
          <table className={style.table}>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">User name</th>
                <th scope="col">User Mobile</th>
                <th scope="col">Address</th>
                <th scope="col">Fees</th>
                <th scope="col">Mode Of Payment</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking, index) => (
                <tr key={index} >
                  <td>{booking.date}</td>
                  <td>
                    {booking.time} {booking.time >= 12 ? "PM" : "AM"}
                  </td>
                  <td>{booking.user.name}</td>
                  <td>{booking.user.mobile}</td>
                  <td>{booking.address}</td>
                  <td>₹{booking.fees}</td>
                  <td>{booking.modeOfPayment}</td>
                  <td>
                    <div style={{ display: "flex" }}>
                      <button
                        style={{
                          border: "none",
                          background: "white",
                          color: "red",
                        }}
                        onClick={() => {
                          updateBooking(booking.id,"cancelled",booking.date,booking.time,booking.bookedAt);
                        }}
                      >
                        <ImCancelCircle />
                      </button>
                      <button
                        style={{
                          border: "none",
                          background: "white",
                          color: "green",
                        }}
                        onClick={() => {
                          updateBooking(booking.id,"Completed",booking.date,booking.time,booking.bookedAt);
                        }}
                      >
                        <SiTicktick />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default Booking;
