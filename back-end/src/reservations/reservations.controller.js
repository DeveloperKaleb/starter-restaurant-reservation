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
  const { reservation_date } = req.body.data;

  const cloneDate = new Date(reservation_date + "T00:00:00");
  const todaysDate = Date.now();
  const dayIsNotTues = cloneDate.getDay() !== 2;
  const reservationIsInTheFuture = cloneDate.valueOf() > todaysDate;

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
  } = req.body.data;

  const isNumber = parseInt(people) !== NaN;

  if (
    first_name &&
    last_name &&
    mobile_number &&
    reservation_date &&
    reservation_time &&
    people &&
    isNumber
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
};
