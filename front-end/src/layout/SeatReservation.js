import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { listTables, occupyTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function SeatReservation() {
    const params = useParams();
    const history = useHistory();
    const data = JSON.parse(JSON.stringify(params));
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [occupyError, setOccupyError] = useState(null);

    useEffect(loadTables, [])

    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError)
        return () => abortController.abort();
    }

    const tableOptions = tables.map((table) => {
        return (
            <option value={table.table_id}>{table.table_name} - {table.capacity}</option>
        )
    })

    const submitHandler = (event) => {
        event.preventDefault();

        
        const { value } = event.target[0]
        console.log(event.target[0].value)
        occupyTable(data, value)
          .then(() => history.push("/dashboard"))
          .catch(setOccupyError)
    }

    return (
        <div>
            <ErrorAlert error={occupyError}/>
            <form onSubmit={submitHandler}>
                <select name="table_id" required>
                    {tableOptions}
                </select>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => history.goBack()}>Cancel</button>
            </form>
        </div>
    )

}

export default SeatReservation;