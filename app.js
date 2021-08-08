const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger, infoLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const limiter = require('./helpers/limiter');
const { DB_HOST } = require('./helpers/constants');

require('dotenv').config();

const app = express();
const { PORT = 3000 } = process.env;

app.use(requestLogger);
app.use(limiter);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect((process.env.NODE_ENV === 'production') ? process.env.DB_HOST : DB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  infoLogger.info('Server is running on port %d', PORT);
});
