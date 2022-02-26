const knex = require("../db/connection");

async function list(req) {
    if (req.query.date) {
      return knex("reservations")
        .select("*")
        .where({"reservation_date": req.query.date})
        .orderBy("reservation_time", "asc")
    } else {
      return knex("reservations")
        .select("*")
    }
}

async function create(reservation) {
    return knex("reservations")
      .insert(reservation)
      .returning("*")
      .then((createdReservation) => createdReservation[0])
}

async function read( reservationId ) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first()
}

module.exports = {
    create,
    read,
    list,
}