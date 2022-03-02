import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function NewTable() {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const history = useHistory();

  const changeHandler = (event) => {
    let { name, value } = event.target;
    if (name === "capacity") {
      value = Number(value)
    }
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const makeTable = (event) => {
    event.preventDefault()
    setError(null)
    createTable(formData)
      .then(setFormData(initialFormData))
      .then(() => history.push("/dashboard"))
      .catch(setError)
}

  return (
    <>
    <ErrorAlert error={error} />
    <form onSubmit={makeTable}>
      <label htmlFor="table_name">Table Name:</label>
      <input
        name="table_name"
        onChange={changeHandler}
        value={formData.table_name}
      />
      <label htmlFor="capacity">Capacity:</label>
      <input
        name="capacity"
        onChange={changeHandler}
        value={formData.capacity}
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={() => history.goBack()}>Cancel</button>
    </form>
    </>
  );
}

export default NewTable;
