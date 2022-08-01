const config = require('config');
const Joi = require('joi');
const ServiceError = require('../core/serviceError');

const JOI_OPTIONS = config.get('validation');

const cleanupJoiError = (error) => error.details.reduce((resultObj, {
  message,
  path,
  type,
}) => {
  const joinedPath = path.join('.') || 'value';
  if (!resultObj[joinedPath])
    resultObj[joinedPath] = [];

  resultObj[joinedPath].push({
    type,
    message,
  });
  
  return resultObj;
}, {});

const validationHelper = (object, ctx) => { //schema.body
  if (object) {
    let errors;

    if (!Joi.isSchema(object)) {
      object = Joi.object(object);
    }
    
    const {
      error: objectErrors,
      value: objectValue,
    } = object.validate(
      ctx,
      JOI_OPTIONS,
    );

    if (objectErrors) {
      errors = cleanupJoiError(objectErrors);
    } else {
      ctx = objectValue;
    }

    return errors;
  }
};

const validate = (schema) => {
  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }
  
  return (ctx, next) => {
    const errors = {};

    const query = validationHelper(schema.query, ctx.query, 'query');
    query && (errors.query = query);

    const body = validationHelper(schema.body, ctx.request.body, 'body');
    body && (errors.body = body);

    const params = validationHelper(schema.params, ctx.params, 'params');
    params && (errors.params = params);

    if (Object.keys(errors).length)
      throw ServiceError.validationFailed('Validation failed, check details for more information', errors);
  
    return next();
  };
};
module.exports = validate;