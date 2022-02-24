import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createTable } from "../utils/api";

function NewTable() {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);

  const changeHandler = (event) => {
    const { name, value } = event.target;
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
      .catch(setError)
}

  return (
    <form onSubmit={makeTable}>
      <label htmlFor="table_name">Table Name:</label>
      <input
        name="table_name"
        onChange={changeHandler}
        value={formData.table_name}
        required
      />
      <label htmlFor="capacity">Capacity:</label>
      <input
        name="capacity"
        onChange={changeHandler}
        value={formData.capacity}
        required
      />
      <button type="submit">Submit</button>
      <Link to="/">
        <button type="button">Cancel</button>
      </Link>
    </form>
  );
}

export default NewTable;
