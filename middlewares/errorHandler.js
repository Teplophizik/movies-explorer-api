const ApiError = require('../error/ApiError');
const { ERROR_400, ERROR_409, ERROR_500 } = require('../helpers/constants');

module.exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).send({ message: err.message });
  }

  if (err.name === 'CastError' || (err._message && err._message.includes('failed'))) {
    return res.status(400).send({ message: ERROR_400 });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).send({ message: ERROR_409 });
  }

  res
    .status(500)
    .send({ message: ERROR_500 });

  next();
};
