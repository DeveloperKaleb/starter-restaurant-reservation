const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function dataExists(req, res, next) {
    const { data } = req.body;
  
    if (data) {
      next();
    } else {
      next({
        message: "To create or assign a table it must include data",
        status: 400,
      });
    }
  }

  function validateAttributes(req, res, next) {
    const { table_name, capacity } = req.body.data;

    const tableHasGoodLength = table_name?.length >= 2
    const capacityIsValid = capacity >= 1
    const isNumber = typeof capacity === "number"

    if (table_name && capacity && tableHasGoodLength && capacityIsValid && isNumber) {
      next()
    } else {
      let invalidAttribute = ""
      if (!table_name) invalidAttribute = invalidAttribute.concat(" table_name")
      if (!capacity) invalidAttribute = invalidAttribute.concat(" capacity")
      if (!tableHasGoodLength) invalidAttribute = invalidAttribute.concat(" table_name with more than 1 character")
      if (!capacityIsValid) invalidAttribute = invalidAttribute.concat(" capacity greater than 0")
      if (!isNumber) invalidAttribute = invalidAttribute.concat(" capacity that is a number")
      next({
        message: `Table must include a ${invalidAttribute.trim()}`,
        status: 400,
      })
    }
  }

  async function updateIsValid(req, res, next) {
    const { table_id } = req.params;
    const { reservation_id } = req.body.data;
    
    const existingTable = table_id ? await service.read( table_id ) : false;
    const reservation = reservation_id ? await reservationsService.read( reservation_id ) : false;

    const enoughSpace = Number(existingTable?.capacity) >= Number(reservation?.people)
    const tableIsNotOccupied = existingTable?.reservation_id === null
    const reservationIsNotSeated = reservation?.status !== "seated"
    
    if (reservation_id && reservation && existingTable && enoughSpace && tableIsNotOccupied && reservationIsNotSeated) {
      res.locals.tableId = table_id
      next()
    } else if (reservation_id && !reservation) {
      next({
        message: `The reservation_id ${reservation_id} does not exist`,
        status: 404,
      })
    } else {
      let problem = ""
      !reservationIsNotSeated ? problem = problem.concat(" unseated reservation") : null
      !reservation_id ? problem = problem.concat(" reservation_id") : null
      !existingTable ? problem = problem.concat(" valid table_id") : null
      !enoughSpace ? problem = problem.concat(" table with enough capacity for the reservation") : null
      !tableIsNotOccupied ? problem = problem.concat(" unoccupied table") : null
      next({
        message: `Request did not contain a ${problem.trim()}`,
        status: 400,
      })
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

  async function update(req, res) {
    const { reservation_id } = req.body.data;
    const { tableId } = res.locals;

    
    const returned = await service.update(reservation_id, tableId)
    await reservationsService.updateStatus( reservation_id, "seated")
    const data = returned[0]

    if (data) {
      res.status(200).json({
        data,
      });
    }
  }

  async function recordIsValid(req, res, next) {
    const { table_id } = req.params
    const table = await service.read( table_id )

    if (table?.reservation_id) {
      res.locals.reservationId = table.reservation_id
      res.locals.tableId = table_id
      next()
    } else if (table_id && table?.reservation_id === null) {
      next({
        message: `Table ${ table_id } is not occupied.`,
        status: 400,
      })
    } else {
      next({
        message: `Table id ${ table_id } does not exist`,
        status: 404,
      })
    }
  }

  async function deleteRecord(req, res) {
    const { tableId, reservationId } = res.locals

    const returned = await service.deleteRecord( tableId )
    await reservationsService.updateStatus( reservationId, "finished")
    const data = returned[0]
    res.status(200).json({
      data,
    })
  }

  module.exports = {
      create: [dataExists, validateAttributes, asyncErrorBoundary(create)],
      list: [asyncErrorBoundary(list)],
      update: [dataExists, asyncErrorBoundary(updateIsValid), asyncErrorBoundary(update)],
      deleteRecord: [asyncErrorBoundary(recordIsValid), asyncErrorBoundary(deleteRecord)],
  }