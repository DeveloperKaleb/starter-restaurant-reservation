const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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
      create,
      list,
  }