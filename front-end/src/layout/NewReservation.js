import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function NewReservation({ setDay }) {
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const history = useHistory();

  const makeReservation = (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    setError(null);
    createReservation(formData, abortController.signal)
      .then((response) => {
        setDay(new Date(response.reservation_date));
      })
      .then(setFormData(initialFormData))
      .then(() => history.push("/dashboard"))
      .catch(setError);
    return () => abortController.abort();
  };

  return (
    <>
      <div>
        <form onSubmit={makeReservation}>
          <h2>Create Reservation</h2>
          <ReservationForm
            error={error}
            setFormData={setFormData}
            formData={formData}
          />
        </form>
      </div>
    </>
  );
}

export default NewReservation;
