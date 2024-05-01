const joi = require("joi");

module.exports.validateRequest = (requestParams) => {
  const joiSchema = joi.object({
    apiUri: joi.string().required(),
    authorization: joi.string().required(),
    appVersion: joi.string().required(),
    authToken: joi.string().optional(),
  });
  return joiSchema.validate(requestParams);
};
