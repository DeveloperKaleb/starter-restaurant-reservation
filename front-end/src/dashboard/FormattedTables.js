import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { finishTable, changeStatus } from "../utils/api";

function FormattedTables({ table }) {
  const { table_id, table_name, capacity, reservation_id } = table;
  const [ finishError, setFinishError ] = useState(null);
  const [ statusError, setStatusError ] = useState(null);

  function confirmFinish() {
    if (
      !window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    )
      return null;
    finishTable(table_id)
      .then(document.location.reload())
      .catch(setFinishError);
  }

  return (
    <li>
      {finishError ? <ErrorAlert error={finishError} /> : null}
      <h3>{table_name}</h3>
      <h4>{capacity}</h4>
      <h5 data-table-id-status={`${table.table_id}`}>
        {!reservation_id ? "Free" : "Occupied"}
      </h5>
      {reservation_id ? (
        <button data-table-id-finish={table.table_id} onClick={confirmFinish}>
          Finish
        </button>
      ) : null}
    </li>
  );
}

export default FormattedTables;
