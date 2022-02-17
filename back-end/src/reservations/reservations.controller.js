const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const data = await service.list(req)
  res.json({
    data,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data)
  res.json({
    data
  })
}

module.exports = {
  create,
  list,
};
