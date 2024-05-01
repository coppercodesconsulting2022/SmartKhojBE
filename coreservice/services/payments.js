// const Razorpay = require("razorpay");
// const crypto = require("crypto");
const databaseHelper = require("../databasehelper/payments");
const coreRequestModel = require("../models/serviceModel/payments");
const errorModel = require("../models/serviceModel/error");
const constant = require("../common/constant");
const appLib = require("applib");
const momentTimezone = require("moment-timezone");
const joiValidationModel = require("../models/validationModel/payments");
// const paymentDetails = require("../payments/payments");
// const createOrder = require("../payments/order");
// const customers = require("../payments/customers");
// const subscription = require("../payments/subscriptions");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const stripe = require("stripe")(PaymentConfiguration.SECRET_KEY, {
//   apiVersion: "2020-08-27",
//   appInfo: {
//     // For sample support and debugging, not required for production:
//     name: "stripe-samples/accept-a-payment/payment-element",
//     version: "0.0.2",
//     url: "https://github.com/stripe-samples",
//   },
// });

// module.exports.createPayment = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`createPayment invoked()!!`);

//   let functionContext = {
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   let jobSeekerPaymentsRequest = new coreRequestModel.JobSeekerPayments(req);

//   logger.logInfo(
//     `createPayment() :: Request Object :: ${jobSeekerPaymentsRequest}`
//   );

//   let validateRequest = joiValidationModel.jobSeekerPayments(
//     jobSeekerPaymentsRequest
//   );

//   if (validateRequest.error) {
//     functionContext.error = new errorModel.ErrorModel(
//       validateRequest.error.details[0]["message"],
//       constant.ErrorCode.Invalid_Request
//     );
//     logger.logInfo(
//       `jobSeekerPaymentsRequest() Error:: Invalid Request :: ${JSON.stringify(
//         validateRequest
//       )}`
//     );
//     res.send({
//       ErrorCode: 404,
//       ErrorMessage: validateRequest.error.details[0]["message"],
//     });
//   }

//   try {
//     const order = await createOrder(jobSeekerPaymentsRequest.Amount);
//     // console.log("Order", order);

//     if (!order) return res.status(500).send("Some error occured");

//     res.send({ OrderDetails: order });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     res.send({
//       ErrorCode: 500,
//       ErrorMessage: JSON.stringify(error),
//     });
//   }
// };

// // Create a route to capture the payment

// module.exports.paymentSuccess = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`paymentSuccess invoked()!!`);

//   let functionContext = {
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   try {
//     // getting the details back from our font-end
//     const {
//       orderCreationId,
//       razorpayPaymentId,
//       razorpayOrderId,
//       razorpaySignature,
//       JobSeekerId,
//       Amount,
//     } = req.body;

//     // Creating our own digest
//     // The format should be like this:
//     // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);

//     // let generatedSignature = crypto
//     //   .createHmac("SHA256", "vBtlO6AyRcyFnZXbP35SZXGU")
//     //   .update(orderCreationId + "|" + razorpayPaymentId)
//     //   .digest("hex");
//     const shasum = crypto.createHmac("sha256", "vBtlO6AyRcyFnZXbP35SZXGU");

//     shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

//     const digest = shasum.digest("hex");

//     const requestContext = {
//       JobSeekerId: JobSeekerId,
//       Amount: Amount,
//       PaymentStatus: null,
//       PaymentId: razorpayPaymentId,
//     };

//     // comaparing our digest with the actual signature
//     if (digest !== razorpaySignature) {
//       logger.logInfo(
//         `paymentSuccess Error :: digest = ${digest} != razorpaySignature = ${razorpaySignature}!!`
//       );
//       res.json({
//         ErrorMessage: "Payment not verified",
//         ErrorCode: 404,
//         paymentVerfied: false,
//       });
//     } else {
//       const payment = await paymentDetails.paymentDetails(razorpayPaymentId);

//       requestContext.PaymentStatus = payment.status;

//       try {
//         let jobseekerPayment = await databaseHelper.addJobSeekerPaymentsDb(
//           functionContext,
//           requestContext
//         );

//         res.send({
//           PaymenyDetails: jobseekerPayment,
//           StatusCode: 200,
//           paymentVerfied: true,
//           Error: null,
//         });
//       } catch (error) {
//         logger.logInfo(`paymentSuccess() :: Error :: ${error}`);
//         res.send({
//           PaymenyDetails: null,
//           statusCode: 200,
//           paymentVerfied: false,
//           Error: "Error in database function",
//         });
//       }
//     }

//     // THE PAYMENT IS LEGIT & VERIFIED
//     // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// module.exports.createCustomer = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`createCustomer invoked()!!`);

//   let functionContext = {
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   let customerRequest = new coreRequestModel.customerRequest(req);

//   logger.logInfo(`createCustomer() :: Request Object :: ${customerRequest}`);

//   let validateRequest = joiValidationModel.customerRequest(customerRequest);

//   if (validateRequest.error) {
//     functionContext.error = new errorModel.ErrorModel(
//       validateRequest.error.details[0]["message"],
//       constant.ErrorCode.Invalid_Request
//     );
//     logger.logInfo(
//       `customerRequest() Error:: Invalid Request :: ${JSON.stringify(
//         validateRequest
//       )}`
//     );
//     res.send({
//       ErrorCode: 404,
//       ErrorMessage: validateRequest.error.details[0]["message"],
//     });
//   }

//   try {
//     const customer = await customers.createCustomer(customerRequest);

//     const requestContext = { ...customerRequest, CustomerId: customer.id };

//     const dbResult = await databaseHelper.updateVendorCustomerIdDb(
//       functionContext,
//       requestContext
//     );

//     res.send({
//       customerDetails: customer,
//       vendorDetails: dbResult,
//       Error: null,
//     });
//   } catch (error) {
//     res.send({
//       customerDetails: null,
//       vendorDetails: null,
//       Error: JSON.stringify(error),
//     });
//   }
// };

// module.exports.createSubscription = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`createSubscription invoked()!!`);

//   let functionContext = {
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   let createSubscriptionRequest =
//     new coreRequestModel.createSubscriptionRequest(req);

//   logger.logInfo(
//     `createSubscription() :: Request Object :: ${createSubscriptionRequest}`
//   );

//   let validateRequest = joiValidationModel.createSubscriptionRequest(
//     createSubscriptionRequest
//   );

//   if (validateRequest.error) {
//     functionContext.error = new errorModel.ErrorModel(
//       validateRequest.error.details[0]["message"],
//       constant.ErrorCode.Invalid_Request
//     );
//     logger.logInfo(
//       `createSubscription() Error:: Invalid Request :: ${JSON.stringify(
//         validateRequest
//       )}`
//     );
//     res.send({
//       ErrorCode: 404,
//       ErrorMessage: validateRequest.error.details[0]["message"],
//     });
//   }

//   try {
//     const createSubScription = await subscription.createSubscription(
//       createSubscriptionRequest.PlanId,
//       createSubscriptionRequest.CustomerId
//     );

//     // console.log("createSubScription", createSubScription);

//     res.send({
//       subscriptionDetails: createSubScription,
//       Error: null,
//     });
//   } catch (error) {
//     res.send({
//       customerDetails: null,
//       vendorDetails: null,
//       Error: JSON.stringify(error),
//     });
//   }
// };

// module.exports.subscriptionPaymentVerfication = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`subscriptionPaymentVerfication invoked()!!`);

//   let functionContext = {
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   let paymentSuccessReq = new coreRequestModel.paymentSuccessRequest(req);

//   logger.logInfo(
//     `subscriptionPaymentVerfication() :: Request Object :: ${paymentSuccessReq}`
//   );

//   let validateRequest =
//     joiValidationModel.saveSubscriptionRequest(paymentSuccessReq);

//   if (validateRequest.error) {
//     functionContext.error = new errorModel.ErrorModel(
//       validateRequest.error.details[0]["message"],
//       constant.ErrorCode.Invalid_Request
//     );
//     logger.logInfo(
//       `subscriptionPaymentVerfication() Error:: Invalid Request :: ${JSON.stringify(
//         validateRequest
//       )}`
//     );
//     res.send({
//       ErrorCode: 404,
//       ErrorMessage: validateRequest.error.details[0]["message"],
//     });
//   }

//   try {
//     const signature = paymentSuccessReq.RazorpaySignature;

//     let generatedSignature = crypto
//       .createHmac("SHA256", "vBtlO6AyRcyFnZXbP35SZXGU")
//       .update(
//         paymentSuccessReq.RazorpayPaymentId +
//           "|" +
//           paymentSuccessReq.SubscriptionId
//       )
//       .digest("hex");

//     let isSignatureValid = generatedSignature == signature;

//     if (isSignatureValid) {
//       const payment = await paymentDetails.paymentDetails(
//         paymentSuccessReq.RazorpayPaymentId
//       );

//       const requestContext = {
//         ...paymentSuccessReq,
//         SubscriptionStatus: payment.status,
//         Amount: payment.amount,
//       };

//       const dbResult = await databaseHelper.saveSubScriptionDetailsDB(
//         functionContext,
//         requestContext
//       );

//       res.send({
//         subscriptionDetails: dbResult,
//         // payment: payment,
//         Error: null,
//       });
//     }
//   } catch (error) {
//     res.send({
//       subscriptionDetails: null,
//       // payment: null,
//       Error: JSON.stringify(error),
//     });
//   }
// };

module.exports.CreatePaymentIntent = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`CreatePaymentIntent invoked()!!`);

  let functionContext = {
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let createPaymentIntentRequest =
    new coreRequestModel.createPaymentIntentRequest(req);

  logger.logInfo(
    `CreatePaymentIntent() :: Request Object : ${createPaymentIntentRequest}`
  );

  var validateRequest = joiValidationModel.createPaymentIntentRequest(
    createPaymentIntentRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `CreatePaymentIntent() Error:: Invalid Request :: ${JSON.stringify(
        createPaymentIntentRequest
      )}`
    );
    createPaymentResponse(functionContext, null);
    return;
  }

  try {
    const customer = await stripe.customers.create({
      name: createPaymentIntentRequest.name, // Customer's name
      email: createPaymentIntentRequest.email, // Customer's email
      metadata: {
        // Additional customer information (optional)
        address: createPaymentIntentRequest.address,
        phone: createPaymentIntentRequest.phone,
        city: createPaymentIntentRequest.city,
        postal_code: createPaymentIntentRequest.pincode,
        country: "India",
      },
    });
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2020-08-27" }
    );

    functionContext.createdCustomer = customer;
    functionContext.ephemeralKey = ephemeralKey;

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: createPaymentIntentRequest.amount,
      // automatic_payment_methods: { enabled: true }
      payment_method_types: ["card"],
    });

    createPaymentResponse(functionContext, paymentIntent);
  } catch (errPaymentIntent) {
    if (!errPaymentIntent.ErrorMessage && !errPaymentIntent.ErrorCode) {
      logger.logInfo(`PaymentIntent() :: Error :: ${errPaymentIntent}`);
      functionContext.error = new errorModel.ErrorModel(
        errPaymentIntent.ErrorMessage,
        errPaymentIntent.ErrorCode
      );
    }
    logger.logInfo(
      `PaymentIntent() :: Error :: ${JSON.stringify(errPaymentIntent)}`
    );
    createPaymentResponse(functionContext, null);
  }
};

module.exports.AddWalletAmount = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`AddWalletAmount invoked()!!`);

  let functionContext = {
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };
  var addWalletAmountRequest = new coreRequestModel.addWalletAmountRequest(req);

  logger.logInfo(
    `addWalletAmount() :: Amount to be Added : ${addWalletAmountRequest}`
  );

  var validateRequest = joiValidationModel.addWalletAmountRequest(
    addWalletAmountRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `addWalletAmountResponse() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addWalletAmountResponse(functionContext, null);
    return;
  }

  var requestContext = {
    ...addWalletAmountRequest,
  };

  try {
    if (addWalletAmountRequest.paymentType == 1) {
      const addWalletAmountFromDBResult =
        await databaseHelper.addVendorWalletAmount(
          functionContext,
          requestContext
        );

      addWalletAmountResponse(functionContext, addWalletAmountFromDBResult);
    } else if (addWalletAmountRequest.paymentType == 2) {
      const addWalletAmountFromDBResult =
        await databaseHelper.addJobSeekerPaymentsDb(
          functionContext,
          requestContext
        );
      addWalletAmountResponse(functionContext, addWalletAmountFromDBResult);
    } else {
      addWalletAmountResponse(functionContext, null);
    }
  } catch (errAddWalletAmount) {
    functionContext.error = new errorModel.ErrorModel(
      errAddWalletAmount.ErrorMessage,
      errAddWalletAmount.ErrorCode
    );
    logger.logInfo(
      `AddWallet() :: Error :: ${JSON.stringify(errAddWalletAmount)}`
    );
    addWalletAmountResponse(functionContext, null);
  }
};

const createPaymentResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`createPaymentResponse Invoked()`);

  let createPaymentResponse =
    new coreRequestModel.createPaymentIntentResponse();

  createPaymentResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    createPaymentResponse.Error = functionContext.error;
    createPaymentResponse.Details = null;
  } else {
    createPaymentResponse.Error = null;
    createPaymentResponse.Details.ClientSecret = resolvedResult.client_secret;
    createPaymentResponse.Details.StripeCustomer =
      functionContext.createdCustomer;
    createPaymentResponse.Details.ephemeralKey = functionContext.ephemeralKey;
  }
  appLib.SendHttpResponse(functionContext, createPaymentResponse);
  logger.logInfo(
    `createPaymentResponse  Response :: ${JSON.stringify(
      createPaymentResponse
    )}`
  );
  logger.logInfo(`createPaymentResponse completed`);
};

const addWalletAmountResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`addWalletAmountResponse Invoked()`);

  var addWalletAmountResponse = new coreRequestModel.addWalletAmountResponse();

  addWalletAmountResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    addWalletAmountResponse.Error = functionContext.error;
    addWalletAmountResponse.Details = null;
  } else {
    addWalletAmountResponse.Error = null;
    addWalletAmountResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addWalletAmountResponse);
  logger.logInfo(
    `addWalletAmountResponse  Response :: ${JSON.stringify(
      addWalletAmountResponse
    )}`
  );
  logger.logInfo(`addWalletAmountResponse completed`);
};

module.exports.getPaymentDetails = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`getPaymentDetails invoked()!!`);

  let functionContext = {
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };
  var getPaymentDetailsRequest = new coreRequestModel.getPaymentDetailsRequest(
    req
  );

  logger.logInfo(
    `getPaymentDetails() :: Amount to be Added : ${getPaymentDetailsRequest}`
  );

  var validateRequest = joiValidationModel.getPaymentDetailsRequest(
    getPaymentDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request,
      validateRequest.error.details
    );
    logger.logInfo(
      `getPaymentDetailsResponse() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    getPaymentDetailsResponse(functionContext, null);
    return;
  }

  var requestContext = {
    ...getPaymentDetailsRequest,
  };

  try {
    if (getPaymentDetailsRequest.paymentType == 1) {
      const getVendorPaymentDetailsFromDBResult =
        await databaseHelper.getVendorPaymentDetails(
          functionContext,
          requestContext
        );

      getPaymentDetailsResponse(
        functionContext,
        getVendorPaymentDetailsFromDBResult
      );
    } else if (getPaymentDetailsRequest.paymentType == 2) {
      const getJobSeekerPaymentDetailsFromDBResult =
        await databaseHelper.getJobSeekerPaymentDetails(
          functionContext,
          requestContext
        );
      getPaymentDetailsResponse(
        functionContext,
        getJobSeekerPaymentDetailsFromDBResult
      );
    } else {
      const getVendorPaymentDetailsFromDBResult =
        await databaseHelper.getVendorPaymentDetails(
          functionContext,
          requestContext
        );

      const getJobSeekerPaymentDetailsFromDBResult =
        await databaseHelper.getJobSeekerPaymentDetails(
          functionContext,
          requestContext
        );

      getPaymentDetailsResponse(functionContext, {
        VendorPayments: getVendorPaymentDetailsFromDBResult,
        JobSeekerDetails: getJobSeekerPaymentDetailsFromDBResult,
      });
    }
  } catch (errgetPaymentDetails) {
    functionContext.error = new errorModel.ErrorModel(
      errgetPaymentDetails.ErrorMessage,
      errgetPaymentDetails.ErrorCode
    );
    logger.logInfo(
      `getPaymentDetails() :: Error :: ${JSON.stringify(errgetPaymentDetails)}`
    );
    getPaymentDetailsResponse(functionContext, null);
  }
};

const getPaymentDetailsResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`getPaymentDetailsResponse Invoked()`);

  var getPaymentDetailsResponse =
    new coreRequestModel.getPaymentDetailsResponse();

  getPaymentDetailsResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    getPaymentDetailsResponse.Error = functionContext.error;
    getPaymentDetailsResponse.PaymentDetails = null;
  } else {
    getPaymentDetailsResponse.Error = null;
    getPaymentDetailsResponse.PaymentDetails = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, getPaymentDetailsResponse);
  logger.logInfo(
    `getPaymentDetailsResponse  Response :: ${JSON.stringify(
      getPaymentDetailsResponse
    )}`
  );
  logger.logInfo(`getPaymentDetailsResponse completed`);
};
