import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
function Dashboard({ reservations, setReservations, reservationsError, setReservationsError, date, addDay, setDay, subtractDay }) {
  const [tables, setTables] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then((response) => {
        setReservations(response)
      })
      .catch(setReservationsError)
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  let formattedReservations = [];
  let formattedTables = [];

  if (tables && reservations) {
    const filteredReservations = reservations.filter(
      (reservation) => reservation?.status !== "finished" && reservation?.status !== "cancelled"
    );

    formattedReservations = filteredReservations.map((reservation) => {
      return (
        <FormattedReservation
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
      <button onClick={() => console.log(reservations)}>Test</button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <div>
        <button type="button" onClick={subtractDay}>
          Previous
        </button>
        <button type="button" onClick={() => setDay()}>
          Today
        </button>
        <button type="button" onClick={addDay}>
          Next
        </button>
        <ErrorAlert error={reservationsError} />
        {JSON.stringify(reservations) === "[]" ? (
          "No reservations for this date"
        ) : (
          <ul>{reservations ? formattedReservations : null}</ul>
        )}
      </div>
      <div>
        <ErrorAlert error={tablesError} />
        {JSON.stringify(tables) === "[]" ? (
          "No tables created"
        ) : (
          <ul>{tables ? formattedTables : null}</ul>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
