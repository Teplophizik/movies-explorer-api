const ApiError = require('../error/ApiError');
const { ERROR_500 } = require('../helpers/constants');

module.exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).send({ message: err.message });
  }

  res
    .status(500)
    .send({ message: ERROR_500 });

  return next();
};
