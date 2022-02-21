import React, { useState } from "react";

function NewTable() {
  const initialFormdata = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const changeHandler = (event) => {
    (prevData) => {
      const { name, value } = event.target;
      setFormData({
        ...prevData,
        [name]: value,
      });
    };
  };
  return (
    <form>
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
