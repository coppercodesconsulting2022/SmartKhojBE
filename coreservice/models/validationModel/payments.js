const joi = require("joi");

module.exports.jobSeekerPayments = (requestParams) => {
  let joiSchema = joi.object({
    JobSeekerId: joi.number().required(),
    Amount: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.customerRequest = (requestParams) => {
  let joiSchema = joi.object({
    Name: joi.string().required(),
    Contact: joi.number().required(),
    Email: joi.string().required(),
    // GSTIn: joi.string().required(),
    VendorId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.saveSubscriptionRequest = (requestParams) => {
  let joiSchema = joi.object({
    SubscriptionId: joi.string().required(),
    VendorId: joi.number().required(),
    BusinessId: joi.number().required(),
    PackageId: joi.number().required(),
    RazorpayPaymentId: joi.string().required(),
    RazorpaySignature: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.createSubscriptionRequest = (requestParams) => {
  let joiSchema = joi.object({
    PlanId: joi.string().required(),
    CustomerId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.createPaymentIntentRequest = (requestParams) => {
  var joiSchema = joi.object({
    amount: joi.number().required(),
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    address: joi.string().required(),
    city: joi.string().required(),
    pincode: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addWalletAmountRequest = (requestParams) => {
  var joiSchema = joi.object({
    paymentType: joi.number().optional().allow(null),
    vendorId: joi.number().optional().allow(null),
    businessId: joi.number().optional().allow(null),
    packageId: joi.number().optional().allow(null),
    jobSeekerId: joi.number().optional().allow(null),
    amount: joi.number().required(),
    paymentId: joi.string().required(),
    paymentStatus: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.getPaymentDetailsRequest = (requestParams) => {
  var joiSchema = joi.object({
    paymentType: joi.number().optional().allow(null),
    vendorId: joi.number().optional().allow(null),
    jobSeekerId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
