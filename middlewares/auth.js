const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError');
const { ERROR_401, ERROR_403 } = require('../helpers/constants');

module.exports = (req, res, next) => {
  let payload;
  if (!req.cookies.jwt) {
    return next(ApiError.forbidden(ERROR_403));
  }
  try {
    payload = jwt.verify(req.cookies.jwt, (process.env.NODE_ENV === 'production') ? process.env.JWT_SECRET : 's-s-k');
  } catch (err) {
    next(ApiError.unauthorized(ERROR_401));
  }
  req.user = payload;
  next();
};
