import React from "react";

function FormattedTables({ table }) {
    const { table_id, table_name, capacity } = table;
    return (
        <li>
            <h3>{table_name}</h3>
            <h4>{capacity}</h4>
        </li>
    )
}

export default FormattedTables; 