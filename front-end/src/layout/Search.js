import React, { useState } from "react";

import { listReservations } from "../utils/api";
import FormattedReservation from "../dashboard/FormattedReservation";
import ErrorAlert from "./ErrorAlert";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const initialFormData = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const updateForm = (event) => {
    const { value, name } = event.target;
    setFormData({
      [name]: value,
    });
  };

  const searchReservations = (event) => {
    const abortController = new AbortController();
    event.preventDefault();

    const { mobile_number } = formData;
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  const formattedReservations = reservations.map((reservation) => {
    return <FormattedReservation key={reservation.reservation_id} reservation={reservation} />;
  });

  return (
    <>
      <form onSubmit={searchReservations}>
        <label htmlFor="mobile_number">Search by Mobile Number: </label>
        <input
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          onChange={updateForm}
          value={formData.mobile_number}
        />
        <button type="submit">Find</button>
      </form>
      <div>
        <ErrorAlert error={reservationsError} />
        {JSON.stringify(reservations) === "[]" ? (
          "No reservations found"
        ) : (
          <ul>{formattedReservations}</ul>
        )}
      </div>
    </>
  );
}

export default Search;
