const knex = require("../db/connection");

async function list(req) {
      return knex("tables")
        .select("*")
        .orderBy("table_name", "asc")
    }

async function create(table) {
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((createdTable) => createdTable[0])
}

async function read( tableId ) {
    return knex("tables")
      .select("*")
      .where({ table_id: tableId })
      .first()
}

async function update( reservationId, tableId  ) {
    return knex("tables")
      .select("*")
      .where({ table_id: tableId })
      .update({reservation_id: reservationId})
      .returning("*");
}

async function deleteRecord( tableId  ) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update({reservation_id: null})
    .returning("*");
}

module.exports = {
    create,
    read,
    list,
    update,
    deleteRecord,
}