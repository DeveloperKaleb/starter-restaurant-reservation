import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, occupyTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function SeatReservation() {
  const params = useParams();
  const history = useHistory();
  const data = params;
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [occupyError, setOccupyError] = useState(null);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const tableOptions = tables.map((table) => {
    return (
      <option value={table.table_id} key={`${table.table_id}`}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  const submitHandler = (event) => {
    event.preventDefault();

    const { value } = event.target[0];
    occupyTable(data, value)
      .then(() => history.push("/"))
      .catch(setOccupyError);
  };

  return (
    <div>
      <ErrorAlert error={tablesError} />
      <form onSubmit={submitHandler}>
        <select name="table_id" required>
          {tableOptions}
        </select>
        <ErrorAlert error={occupyError} />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SeatReservation;
