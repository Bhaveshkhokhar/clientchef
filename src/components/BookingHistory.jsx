import { useContext } from "react";
import style from "./Booking.module.css";
import { bookingHistoryContext } from "../store/bookingHistoryStore";
const BookingHistory=()=>{
  const { bookinghistory } = useContext(bookingHistoryContext);
  const data = bookinghistory.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (!bookinghistory.length === 0) {
    return (
      <>
        <center>
          <h2 style={{ color: "#3B6DCE", marginTop: "50px" }}>
            <u>NO PAST BOOKING DATA TILL NOW</u>
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
                <th scope="col">Fees</th>
                <th scope="col">Mode Of Payment</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking, index) => (
                <tr key={index} >
                  <td>{booking.date}</td>
                  <td>
                    {booking.time} {booking.time >= 12 ? "PM" : "AM"}
                  </td>
                  <td>{booking.name}</td>
                  <td>₹{booking.fees}</td>
                  <td>{booking.modeOfPayment}</td>
                  <td style={{color:booking.status==="cancelled"?"red":"green"}}>{booking.status==="cancelled"?"Cancelled":"Completed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default BookingHistory;