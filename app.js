const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger, infoLogger } = require('./middlewares/logger');
const ApiError = require('./error/ApiError');
const { errorHandler } = require('./middlewares/errorHandler');
const limiter = require('./helpers/limiter');
const { ERROR_404 } = require('./helpers/constants');

require('dotenv').config();

const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect((process.env.NODE_ENV === 'production') ? process.env.DB_HOST : 'mongodb://127.0.0.1:27017/diplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(limiter);

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  next(ApiError.notFound(ERROR_404));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  infoLogger.info('Server is running on port %d', PORT);
});
