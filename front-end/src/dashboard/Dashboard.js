import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import FormattedReservation from "./FormattedReservation";
import FormattedTables from "./FormattedTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  reservations,
  setReservations,
  reservationsError,
  setReservationsError,
  date,
  addDay,
  setDay,
  subtractDay,
}) {
  const [tables, setTables] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date, setReservations, setReservationsError]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then((response) => {
        setReservations(response);
      })
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  let formattedReservations = [];
  let formattedTables = [];

  if (tables && reservations) {
    const filteredReservations = reservations.filter(
      (reservation) =>
        reservation?.status !== "finished" &&
        reservation?.status !== "cancelled"
    );

    formattedReservations = filteredReservations.map((reservation) => {
      return (
        <FormattedReservation
          key={reservation.reservation_id}
          setReservations={setReservations}
          setReservationsError={setReservationsError}
          setTables={setTables}
          setTablesError={setTablesError}
          date={date}
          reservation={reservation}
        />
      );
    });

    formattedTables = tables.map((table) => {
      return (
        <FormattedTables
          key={table.table_id}
          setReservations={setReservations}
          setReservationsError={setReservationsError}
          setTables={setTables}
          setTablesError={setTablesError}
          date={date}
          table={table}
        />
      );
    });
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="container-fluid d-flex align-items-start">
        <div>
          <div className="d-flex justify-content-around">
            <button
              type="button"
              className="m-1 btn btn-secondary"
              onClick={subtractDay}
            >
              Previous
            </button>
            <button
              type="button"
              className="m-1 btn btn-secondary"
              onClick={() => setDay()}
            >
              Today
            </button>
            <button
              type="button"
              className="m-1 btn btn-secondary"
              onClick={addDay}
            >
              Next
            </button>
          </div>
          <h5 className="mb-0 d-flex justify-content-center">
            Reservations for {date}
          </h5>
          <ErrorAlert error={reservationsError} />
          {JSON.stringify(reservations) === "[]" ? (
            "No reservations for this date"
          ) : (
            <ul className="m-3 d-flex list-group">
              {reservations ? formattedReservations : null}
            </ul>
          )}
        </div>
        <div>
          <div className="d-md-flex mb-4"></div>
          <h5 className="d-flex justify-content-around">Tables:</h5>
          <ErrorAlert error={tablesError} />
          {JSON.stringify(tables) === "[]" ? (
            "No tables created"
          ) : (
            <ul className="m-3 d-flex list-group">
              {tables ? formattedTables : null}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
