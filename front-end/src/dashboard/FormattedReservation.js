import React from "react";
import { Link } from "react-router-dom";

function FormattedReservation({ reservation }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
    status,
  } = reservation;

  return (
    <li>
      <h3>
        {first_name} {last_name}
      </h3>
      <h6>{mobile_number}</h6>
      <h4>{reservation_time}</h4>
      <h4>{people} people</h4>
      <h5 data-reservation-id-status={reservation.reservation_id}>{status}</h5>
      {status === "booked" ? (
        <Link to={`/reservations/${reservation_id}/seat`}>
          <button type="button">Seat</button>
        </Link>
      ) : null}
    </li>
  );
}

export default FormattedReservation;
