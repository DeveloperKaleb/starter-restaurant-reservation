const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function dataExists(req, res, next) {
    const { data } = req.body;
  
    if (data) {
      next();
    } else {
      next({
        message: "To create a table it must include data",
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
      !table_name ? invalidAttribute = invalidAttribute.concat(" table_name") : null
      !capacity ? invalidAttribute = invalidAttribute.concat(" capacity") : null
      !tableHasGoodLength ? invalidAttribute = invalidAttribute.concat(" table_name with more than 1 character") : null
      !capacityIsValid ? invalidAttribute = invalidAttribute.concat(" capacity greater than 0") : null
      !isNumber ? invalidAttribute = invalidAttribute.concat(" capacity that is a number") : null
      next({
        message: `Table must include a ${invalidAttribute.trim()}`,
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

  module.exports = {
      create: [dataExists, validateAttributes, asyncErrorBoundary(create)],
      list: [asyncErrorBoundary(list)],
  }