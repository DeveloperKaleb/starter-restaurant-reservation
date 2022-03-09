const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
function dataExists(req, res, next) {
  const { data } = req.body;

  if (data) {
    next();
  } else {
    next({
      message: "To create a reservation it must include data",
      status: 400,
    });
  }
}

async function reservationIsValid(req, res, next) {
  const { reservation_id } = req.params

  const reservation = await service.read(reservation_id)

  if (reservation) {
    next()
  } else {
    next({
      message: `Reservation ${reservation_id} does not exist`,
      status: 404,
    })
  }
}

function validateDateAndTimeFormat(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  const dateIsValid = reservation_date.match(dateRegex);
  const timeRegex = /\d{2}:\d{2}/;
  const timeIsValid = reservation_time.match(timeRegex);

  if (dateIsValid && timeIsValid) {
    next();
  } else {
    let notValid = "";
    !dateIsValid ? (notValid = notValid.concat(" reservation_date")) : null;
    !timeIsValid ? (notValid = notValid.concat(" reservation_time")) : null;
    next({
      message: `Reservation must include a properly formatted ${notValid.trim()}`,
      status: 400,
    });
  }
}

function dateIsDuringOpenHoursAndInTheFuture(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

  const cloneDate = new Date(reservation_date + `T${reservation_time}:00`);
  const todaysDate = Date.now();
  const dayIsNotTues = cloneDate.getDay() !== 2;
  const reservationIsInTheFuture = cloneDate.valueOf() >= todaysDate;

  if (dayIsNotTues && reservationIsInTheFuture) {
    next();
  } else {
    let problem = [];
    !dayIsNotTues
      ? problem.push(" reservation_date may not be during hours we're closed")
      : null;
    !reservationIsInTheFuture
      ? problem.push(
          " reservation_date and reservation_time must indicate a time in the future"
        )
      : null;

    next({
      message: `You encountered a problem with your reservation time, ${problem.join(
        ", "
      )}`,
      status: 400,
    });
  }
}

function timeIsDuringHoursOfAccomodation(req, res, next) {
  const { reservation_time } = req.body.data;

  const firstNums = reservation_time.slice(0, 2);
  const secondNums = reservation_time.slice(3, 5);

  const timeNum = Number(firstNums.concat(secondNums));

  if (1029 < timeNum && timeNum < 2131) {
    next();
  } else {
    next({
      message: "Reservation_time must be between 10:30am and 9:30pm",
      status: 400,
    });
  }
}

function validateAttributes(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = req.body.data;

  const isNumber = typeof people === "number";
  const statusIsBooked = status ? status === "booked" : true;

  if (
    first_name &&
    last_name &&
    mobile_number &&
    reservation_date &&
    reservation_time &&
    people &&
    isNumber &&
    statusIsBooked
  ) {
    next();
  } else {
    let attribute = "";
    !first_name ? (attribute = attribute.concat("first_name")) : null;
    !last_name ? (attribute = attribute.concat(" last_name")) : null;
    !mobile_number ? (attribute = attribute.concat(" mobile_number")) : null;
    !reservation_date
      ? (attribute = attribute.concat(" reservation_date"))
      : null;
    !reservation_time
      ? (attribute = attribute.concat(" reservation_time"))
      : null;
    !people ? (attribute = attribute.concat(" people")) : null;
    !isNumber ? (attribute = attribute.concat("people as a number")) : null;
    !statusIsBooked
      ? (attribute = attribute.concat(` a 'booked' (not ${status}) status`))
      : null;
    next({
      message: `Reservation must include ${attribute.trim()}`,
      status: 400,
    });
  }
}

async function list(req, res) {
  const data = await service.list(req);
  res.json({
    data,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({
    data,
  });
}

async function read(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);
  if (data) {
    res.json({
      data,
    });
  } else {
    next({
      message: `Reservation_id ${reservation_id} doesn't exist`,
      status: 404,
    });
  }
}

async function recordIsValid(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const reservation = await service.read(reservation_id);

  const statusesIsGood =
    reservation?.status !== "finished" && status !== "unknown";

  if (reservation && status && statusesIsGood) {
    res.locals.reservationId = reservation_id;
    next();
  } else if (reservation_id && !reservation) {
    next({
      message: `Reservation id ${reservation_id} does not exist`,
      status: 404,
    });
  } else {
    let message = "";
    status === "unknown"
      ? (message = `Reservation status ${status} is not an acceptable status`)
      : (message = `A finished reservation cannot be updated.`);
    next({
      message,
      status: 400,
    });
  }
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const { reservationId } = res.locals;

  const returned = await service.updateStatus(reservationId, status);
  const data = returned[0];

  if (data) {
    res.status(200).json({
      data,
    });
  }
}

async function updateReservation(req, res) {
  const response = await service.updateReservation(req.body.data)
  const data = response[0]

  res.json({
    data,
  })
}

module.exports = {
  create: [
    dataExists,
    validateAttributes,
    validateDateAndTimeFormat,
    dateIsDuringOpenHoursAndInTheFuture,
    timeIsDuringHoursOfAccomodation,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(read)],
  updateStatus: [
    asyncErrorBoundary(recordIsValid),
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    dataExists,
    asyncErrorBoundary(reservationIsValid),
    validateAttributes,
    validateDateAndTimeFormat,
    dateIsDuringOpenHoursAndInTheFuture,
    timeIsDuringHoursOfAccomodation,
    asyncErrorBoundary(updateReservation)
  ]
};
