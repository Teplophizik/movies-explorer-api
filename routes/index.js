const router = require('express').Router();

const auth = require('../middlewares/auth');

router.use('/', require('./auth'));

router.use(auth);

router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

module.exports = router;
