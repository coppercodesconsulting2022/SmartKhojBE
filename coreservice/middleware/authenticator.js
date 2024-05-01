const appLib = require("applib");
const databaseHelper = require("../databasehelper/validate");
const coreRequestModel = require("../models/serviceModel/validate");
const settings = require("../common/settings").Settings;
const constant = require("../common/constant");
const momentTimezone = require("moment-timezone");

const uuid = appLib.UUID.prototype;

exports.AuthenticateRequest = async function (req, res, next) {
  const requestId = uuid.GetTimeBasedID();
  const logger = new appLib.Logger(req.originalUrl, requestId);

  logger.logInfo(`Authenticate Request()!`);

  const functionContext = {
    logger: logger,
    res: res,
  };

  const apiContext = {
    requestId: requestId,
    userRef: null,
    currenTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  res.apiContext = apiContext;

  const validateRequest = new coreRequestModel.ValidateRequest(req);
  const validateResponse = new coreRequestModel.ValidateResponse(req);

  validateResponse.RequestID = requestId;

  if (
    !validateRequest.apiUri ||
    !validateRequest.authorization ||
    !validateRequest.appVersion
  ) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Request,
      constant.ErrorCode.Invalid_Request
    );

    logger.logInfo(`AuthenticateRequest() Error:: Invalid Request :: 
    ${JSON.stringify(validateRequest)}`);

    validateResponse.Error = functionContext.error;

    appLib.SendHttpResponse(functionContext, validateResponse);

    return;
  }

  const basicAuth = new Buffer(
    settings.APP_KEY + ":" + settings.APP_SECRET
  ).toString("base64");

  if (validateRequest.authorization != basicAuth) {
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.Invalid_Authentication,
      constant.ErrorCode.Invalid_Authentication
    );

    logger.logInfo(`AuthenticateRequest() Error:: Invalid Request :: 
    ${JSON.stringify(validateRequest)}`);

    validateResponse.Error = functionContext.error;
    appLib.SendHttpResponse(functionContext, validateResponse);
    return;
  }
  try {
    let validateRequestResult = await databaseHelper.validateRequest(
      functionContext,
      validateRequest
    );

    apiContext.userType = validateRequestResult.UserTypeId;
    apiContext.userRef = validateRequestResult.UserRef;
    apiContext.userId = validateRequestResult.UserId;

    res.apiContext = apiContext;
    next();
  } catch (errValidateRequest) {
    if (!errValidateRequest.ErrorMessage && !errValidateRequest.ErrorCode) {
      logger.logInfo(`AuthenticateRequest() :: Error :: ${errValidateRequest}`);
      functionContext.error = new coreRequestModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `AuthenticateRequest() :: Error :: ${JSON.stringify(errValidateRequest)}`
    );
    validateResponse.Error = functionContext.error;
    appLib.SendHttpResponse(functionContext, validateResponse);
  }
  
};
