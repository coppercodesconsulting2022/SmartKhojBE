// const razorpay = require("../common/paymentConfig");

// const paymentDetails = async (paymentId) => {
//   // console.log("paymentId", paymentId);
//   const response = razorpay.payments.fetch(paymentId);

//   if (response) {
//     return Promise.resolve(response);
//   } else {
//     return Promise.reject(Error);
//   }
// };

// module.exports = {
//   paymentDetails,
// };

const appLib = require("applib");


module.exports.CreatePaymentIntent = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`CreatePaymentIntent invoked()!!`);

  var functionContext = new coreRequestModel.FunctionContext(
    RequestType.CREATEPAYMENTINTENT,
    null,
    res,
    logger
  );

  let createPaymentIntentRequest =
    new coreRequestModel.CreatePaymentIntentRequest(req);
  logger.logInfo(
    `CreatePaymentIntent() :: Request Object : ${createPaymentIntentRequest}`
  );

  var validateRequest = joiValidationModel.createPaymentIntentRequest(
    createPaymentIntentRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      ErrorMessage.Invalid_Request,
      ErrorCode.Invalid_Request,
      validateRequest.error.details
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
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2020-08-27" }
    );

    functionContext.createdCustomer = customer;
    functionContext.ephemeralKey = ephemeralKey;

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "AED",
      amount: createPaymentIntentRequest.amount,
      // automatic_payment_methods: { enabled: true }
      payment_method_types: ["card"],
    });

    createPaymentResponse(functionContext, paymentIntent);
  } catch (errPaymentIntent) {
    if (!errPaymentIntent.ErrorMessage && !errPaymentIntent.ErrorCode) {
      logger.logInfo(`PaymentIntent() :: Error :: ${errPaymentIntent}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        ErrorMessage.ApplicationError,
        ErrorCode.ApplicationError
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

  var functionContext = new coreRequestModel.FunctionContext(
    RequestType.ADDWALLETAMOUNT,
    null,
    res,
    logger
  );
  var addWalletAmountRequest = new coreRequestModel.AddWalletAmountRequest(req);
  logger.logInfo(
    `addWalletAmount() :: Amount to be Added : ${addWalletAmountRequest.amount}`
  );

  var validateRequest = joiValidationModel.addWalletAmountRequest(
    addWalletAmountRequest
  );

  if (validateRequest.error) {
    functionContext.error = new coreRequestModel.ErrorModel(
      ErrorMessage.Invalid_Request,
      ErrorCode.Invalid_Request,
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
    var addWalletAmountFromDBResult = await databaseHelper.addWalletAmount(
      functionContext,
      requestContext
    );

    addWalletAmountResponse(functionContext, addWalletAmountFromDBResult);
  } catch (errAddWalletAmount) {
    functionContext.error = new coreRequestModel.ErrorModel(
      errAddWalletAmount.ErrorMessage,
      errAddWalletAmount.ErrorCode
    );
    logger.logInfo(
      `AddWallet() :: Error :: ${JSON.stringify(errAddWalletAmount)}`
    );
    addWalletAmountResponse(functionContext, null);
  }
};

var createPaymentResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`createPaymentResponse Invoked()`);

  var createPaymentResponse =
    new coreRequestModel.CreatePaymentIntentResponse();

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

var addWalletAmountResponse = (functionContext, resolvedResult) => {
  var logger = functionContext.logger;

  logger.logInfo(`addWalletAmountResponse Invoked()`);

  var addWalletAmountResponse = new coreRequestModel.AddWalletAmountResponse();

  addWalletAmountResponse.RequestID = functionContext.requestID;

  if (functionContext.error) {
    addWalletAmountResponse.Error = functionContext.error;
    addWalletAmountResponse.Details = null;
  } else {
    addWalletAmountResponse.Error = null;
    addWalletAmountResponse.Details.TotalWalletAmount =
      resolvedResult.TotalAmount;
  }
  appLib.SendHttpResponse(functionContext, addWalletAmountResponse);
  logger.logInfo(
    `addWalletAmountResponse  Response :: ${JSON.stringify(
      addWalletAmountResponse
    )}`
  );
  logger.logInfo(`addWalletAmountResponse completed`);
};
