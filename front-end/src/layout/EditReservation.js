import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { updateReservation, listReservations } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "./ErrorAlert";

function EditReservation({ reservations, setDay, setReservations, reservationsError, setReservationsError }) {
  const { reservation_id } = useParams();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(loadReservations, [])

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(null, abortController.signal)
      .then((response) => {
        const reservation = response.find(
          (reservation) => reservation.reservation_id === Number(reservation_id)
        )
        setFormData({
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          mobile_number: reservation.mobile_number,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          reservation_id: reservation.reservation_id,
          people: reservation.people,
        })
        setReservations(response)
      })
      .catch(setReservationsError)
    return () => abortController.abort();
  }


  const editReservation = (event) => {
    event.preventDefault();
    setError(null);
    updateReservation(formData, reservation_id)
      .then((response) => {
        setDay(new Date(response.reservation_date));
        setFormData({
        first_name: response.first_name,
        last_name: response.last_name,
        mobile_number: response.mobile_number,
        reservation_date: response.reservation_date,
        reservation_time: response.reservation_time,
        reservation_id: response.reservation_id,
        people: response.people,
      })
    })
      .then(() => history.push("/dashboard"))
      .catch(setError);
  };
  console.log(formData)

  return (
    <>
      <div>
        <ErrorAlert error={reservationsError} />
        <form onSubmit={editReservation}>
          <h2>Edit Reservation</h2>
          {formData ? <ReservationForm error={error} setFormData={setFormData} formData={formData} /> : null}
        </form>
      </div>
    </>
  );
}

export default EditReservation;
