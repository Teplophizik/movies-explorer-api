const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ApiError = require('../error/ApiError');
const {
  ERROR_404_USER, ERROR_409, AUTH_ERROR, SUCCESS,
} = require('../helpers/constants');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => ApiError.notFound(ERROR_404_USER))
    .then((user) => {
      const {
        name, email,
      } = user;
      res.send({
        name, email,
      });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .orFail(() => ApiError.notFound(ERROR_404_USER))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => ApiError.unauthorized(AUTH_ERROR))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(ApiError.unauthorized(AUTH_ERROR));
        }
        const token = jwt.sign({ _id: user._id }, (process.env.NODE_ENV === 'production') ? process.env.JWT_SECRET : 's-s-k', { expiresIn: '7d' });
        return res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).send({ name: user.name, email: user.email });
      }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.send({ data: SUCCESS }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(ApiError.conflict(ERROR_409));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', 'none', {
    maxAge: 1,
    httpOnly: true,
  }).send({ message: SUCCESS });
};
