const databaseModule = require("../database/database");
const coreRequestModel = require("../models/serviceModel/validate");
const constant = require("../common/constant");

module.exports.validateRequest = async (functionContext, resolvedResult) => {
  const logger = functionContext.logger;
  logger.logInfo("validateRequest() Invoked!");

  try {
    let result = await databaseModule.knex.raw(`CALL usp_validate_request(
            '${resolvedResult.apiUri}',
            '${resolvedResult.authToken}')`);

    logger.logInfo("validRequest() :: Api validated Successfully");

    return result[0][0][0];
  } catch (errValidateRequest) {
    logger.logInfo(
      `validateRequest() :: Error :: ${JSON.stringify(errValidateRequest)}`
    );

    let errorCode = null;
    let errorMessage = null;

    if (
      errValidateRequest.sqlState &&
      errValidateRequest.sqlState == constant.ErrorCode.Invalid_Request_Url
    ) {
      errorCode = constant.ErrorCode.Invalid_Request_Url;
      errorMessage = constant.ErrorMessage.Invalid_Request_Url;
    } else if (
      errValidateRequest.sqlState &&
      errValidateRequest.sqlState == constant.ErrorCode.Invalid_User_Credentials
    ) {
      errorCode = constant.ErrorCode.Invalid_User_Credentials;
      errorMessage = constant.ErrorMessage.Invalid_User_Credentials;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw functionContext.error;
  }
};
