import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import FormattedReservation from "./FormattedReservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, addDay, resetDay, subtractDay }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const formattedReservations = reservations.map((reservation) => {
    return <FormattedReservation reservation={reservation}/>
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <button type="button" onClick={subtractDay}>Previous</button>
      <button type="button" onClick={resetDay}>Today</button>
      <button type="button" onClick={addDay}>Next</button>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations) === "[]" ? "No reservations for this date" : <li>{formattedReservations}</li>}
    </main>
  );
}

export default Dashboard;
