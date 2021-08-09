const Movie = require('../models/movie');

const ApiError = require('../error/ApiError');
const { ERROR_403, ERROR_404_MOVIE, SUCCESS_DELETE } = require('../helpers/constants');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    movieId, nameRU, nameEN, thumbnail, trailer, image, description, year,
    duration, director, country,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    trailer,
    image,
    description,
    year,
    duration,
    director,
    country,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(() => ApiError.notFound(ERROR_404_MOVIE))
    .then((movie) => {
      if (String(movie.owner) === req.user._id) {
        return Movie.deleteOne({ _id: id }).then(() => res.send({ message: SUCCESS_DELETE }));
      }
      return Promise.reject(ApiError.forbidden(ERROR_403));
    })
    .catch(next);
};
