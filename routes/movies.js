const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlValidator } = require('../helpers/urlValidator');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(urlValidator),
    trailer: Joi.string().required().custom(urlValidator),
    image: Joi.string().required().custom(urlValidator),
    description: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
