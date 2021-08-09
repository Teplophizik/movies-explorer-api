const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: './logs/request.log' }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: './logs/error.log' }),
  ],
  format: winston.format.json(),
});

const infoLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console()],
});

module.exports = {
  requestLogger,
  errorLogger,
  infoLogger,
};
