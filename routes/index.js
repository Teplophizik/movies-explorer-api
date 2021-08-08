const router = require('express').Router();

const ApiError = require('../error/ApiError');
const auth = require('../middlewares/auth');
const { ERROR_404 } = require('../helpers/constants');

router.use('/', require('./auth'));

router.use(auth);

router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

router.use((req, res, next) => {
  next(ApiError.notFound(ERROR_404));
});

module.exports = router;
