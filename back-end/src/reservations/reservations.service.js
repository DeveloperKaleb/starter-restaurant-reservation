const knex = require("../db/connection");

async function list(req) {
    if (req.query.date) {
      return knex("reservations")
        .select("*")
        .where({"reservation_date": req.query.date})
        .whereNot({"status": "finished"})
        .orderBy("reservation_time", "asc")
    } 
    if (req.query.mobile_number) {
      return knex("reservations")
        .select("*")
        .where("mobile_number", "like", `%${req.query.mobile_number}%`)
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

async function updateStatus( reservationId, status  ) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update({status: status})
    .returning("*");
}

async function updateReservation( reservation ) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation.reservation_id})
    .update(reservation, "*")
    .returning("*")
}

module.exports = {
    create,
    read,
    list,
    updateStatus,
    updateReservation,
}