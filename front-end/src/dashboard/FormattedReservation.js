import React from "react";

function FormattedReservation({ reservation }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
  } = reservation;
  return (
      <ul>
          <h3>{first_name} {last_name}</h3>
          <h6>{mobile_number}</h6>
          <h4>{reservation_time}</h4>
          <h4>{people} people</h4>
      </ul>
  )
}

export default FormattedReservation;
