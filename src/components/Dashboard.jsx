import style from "./Dashboard.module.css";
import { ImCancelCircle } from "react-icons/im";
import { SiTicktick } from "react-icons/si";
import { useContext } from "react";
import { bookingContext } from "../store/bookingStore";
import { bookingHistoryContext } from "../store/bookingHistoryStore";
const Dashboard = () => {
  const { bookings, updateBooking } = useContext(bookingContext);
  const { bookinghistory } = useContext(bookingHistoryContext);
  let completed = 0;
  let money = 0;
  bookinghistory.forEach((booking) => {
    if (booking.status === "Completed") {
      completed++;
      money += booking.fees;
    }
  });
  let data = [...bookinghistory];
  bookings.forEach((booking) => {
    data.push({
      id:booking.id,
      name: booking.user.name,
      date: booking.date,
      time: booking.time,
      fees: booking.fees,
      modeOfPayment: booking.modeOfPayment,
      status: "pending",
    });
    if (booking.modeOfPayment !== "COD") {
      money += booking.fees;
    }
  });

  const noOfPending = bookings.length;
  data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <>
      <div style={{ margin: "5px" }}>
        <div className={style.boxes}>
          <div className={style.data}>
            <img src="https://serverofchefbooking.onrender.com/money.webp" alt="Money" />
            <span>₹ {money} </span>
          </div>
          <div className={style.data}>
            <img src="https://serverofchefbooking.onrender.com/completed.png" alt="Completed" />
            <span>{completed} Booking</span>
          </div>
          <div className={style.data}>
            <img src="https://serverofchefbooking.onrender.com/pending.png" alt="Pending" />
            <span>{noOfPending} Booking</span>
          </div>
        </div>
        {data.length ? (
          <div style={{ margin: "5px" }}>
            <div className={style.tableWrapper}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">User name</th>
                    <th scope="col">Fees</th>
                    <th scope="col">Mode Of Payment</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0,10).map((booking, index) => (
                    <tr key={index}>
                      <td>{booking.date}</td>
                      <td>
                        {booking.time} {booking.time >= 12 ? "PM" : "AM"}
                      </td>
                      <td>{booking.name}</td>
                      <td>₹{booking.fees}</td>
                      <td>{booking.modeOfPayment}</td>

                      <td>
                        {booking.status==="cancelled"&&
                        <span style={{color:"red"}}>Cancelled</span>}
                        {booking.status==="Completed"&&
                        <span style={{color:"green"}}>Completed</span>}
                        {booking.status==="pending"&&
                        <div style={{ display: "flex", justifyContent:"space-evenly" }}>
                          <button
                            style={{
                              border: "none",
                              background: "white",
                              color: "red",
                            }}
                            onClick={() => {
                              updateBooking(booking.id, "cancelled",booking.date,booking.time,booking.bookedAt);
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
                              updateBooking(booking.id, "Completed",booking.date,booking.time,booking.bookedAt);
                            }}
                          >
                            <SiTicktick />
                          </button>
                        </div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <center>
            <h2 style={{ color: "#3B6DCE", marginTop: "50px" }}>
              <u>NO BOOKING TILL NOW</u>
            </h2>
          </center>
        )}
      </div>
    </>
  );
};
export default Dashboard;
