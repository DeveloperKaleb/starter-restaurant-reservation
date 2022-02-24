import React, { useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import { createReservation } from "../utils/api" 

function NewReservation() {
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null)

  const updateForm = (event) => {
    let { value, name } = event.target;
    if (name === "people") {
      value = Number(value)
    }
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const makeReservation = (event) => {
      event.preventDefault()
      setError(null)
      createReservation(formData)
        .then(setFormData(initialFormData))
        .catch(setError)
  }

  return (
    <>
      <div>
        <form onSubmit={makeReservation}>
          <h2>Create Reservation</h2>
          <ErrorAlert error={error} />
          <div>
            <label htmlFor="first_name">First Name:</label>
            <input
              name="first_name"
              onChange={updateForm}
              value={formData.first_name}
              required
            />
            <label htmlFor="last_name">Last Name:</label>
            <input
              name="last_name"
              onChange={updateForm}
              value={formData.last_name}
              required
            />
            <label htmlFor="mobile_number">Cellphone Number:</label>
            <input
              name="mobile_number"
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={updateForm}
              value={formData.mobile_number}
              required
            />
            <label htmlFor="reservation_date">Reservation Date:</label>
            <input
              name="reservation_date"
              type="date"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={updateForm}
              value={formData.reservation_date}
              required
            />
            <label htmlFor="reservation_time">Reservation Time:</label>
            <input
              name="reservation_time"
              type="time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={updateForm}
              value={formData.reservation_time}
              required
            />
            <label htmlFor="people">Number of People in Party:</label>
            <input
              name="people"
              type="number"
              onChange={updateForm}
              value={formData.people}
              required
            />
          </div>
          <button type="submit">Submit</button>
          <Link to="/">
            <button type="button">Cancel</button>
          </Link>
        </form>
      </div>
    </>
  );
}

export default NewReservation;
