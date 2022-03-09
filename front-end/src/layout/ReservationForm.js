import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";

function ReservationForm({ setFormData, formData, error, }) {
    const history = useHistory();

    const updateForm = (event) => {
      let { value, name } = event.target;
      if (name === "people") {
        value = Number(value);
      }
      setFormData((prevData) => {
        return {
          ...prevData,
          [name]: value,
        };
      });
    };

    return (
        <>
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
              onChange={updateForm}
              value={formData.mobile_number}
              required
            />
            <label htmlFor="reservation_date">Reservation Date:</label>
            <input
              name="reservation_date"
              type="date"
              placeholder="YYYY-MM-DD"
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
          <button type="button" onClick={() => history.goBack()}>
            Cancel
          </button>
        </>
    )
}

export default ReservationForm;