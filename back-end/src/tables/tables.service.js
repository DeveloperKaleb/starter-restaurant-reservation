const knex = require("../db/connection");

async function list(req) {
      return knex("tables")
        .select("*")
    }

async function create(table) {
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((createdTable) => createdTable[0])
}

module.exports = {
    create,
    list,
}