const validator = require('validator');

module.exports.urlValidator = (value, helpers) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  return helpers.error('any.invalid');
};
