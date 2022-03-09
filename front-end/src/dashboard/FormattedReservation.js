import React, { useState } from "react";
import { Link } from "react-router-dom";
import { changeStatus, listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function FormattedReservation({
  setReservations,
  setReservationsError,
  setTables,
  setTablesError,
  reservation,
  date,
}) {
  let {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
    status,
  } = reservation;
  const [statusError, setStatusError] = useState(null);

  const cancelReservation = (event) => {
    if (!window.confirm("Do you want to cancel this reservation?")) return null;
    const data = { status: "cancelled" };
    changeStatus(data, reservation_id)
      .then(() => {
        const abortController = new AbortController();
        listReservations({ date }, abortController.signal)
          .then(setReservations)
          .catch(setReservationsError);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError);
        return () => abortController.abort();
      })
      .catch(setStatusError);
  };

  return (
    <li key={`${reservation_id}`}>
      <ErrorAlert error={statusError} />
      <h3>
        {first_name} {last_name}
      </h3>
      <h6>{mobile_number}</h6>
      <h4>{reservation_time}</h4>
      <h4>{people} people</h4>
      <h5 data-reservation-id-status={reservation.reservation_id}>{status}</h5>
      <Link to={`reservations/${reservation_id}/edit`}>
        <button type="button">Edit</button>
      </Link>
      <button
        data-reservation-id-cancel={reservation.reservation_id}
        type="button"
        onClick={cancelReservation}
      >
        Cancel
      </button>
      {status === "booked" ? (
        <Link to={`/reservations/${reservation_id}/seat`}>
          <button type="button">Seat</button>
        </Link>
      ) : null}
    </li>
  );
}

export default FormattedReservation;
