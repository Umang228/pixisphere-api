const Joi = require('joi');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Middleware for request validation
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, params, query)
 */
const validator = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (!error) {
      return next();
    }

    const errors = error.details.reduce((acc, curr) => {
      acc[curr.context.key] = curr.message.replace(/["']/g, '');
      return acc;
    }, {});

    return errorResponse(res, 400, 'Validation Error', errors);
  };
};

module.exports = validator;