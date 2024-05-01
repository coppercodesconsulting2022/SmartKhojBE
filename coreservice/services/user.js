const databaseHelper = require("../databasehelper/user");
const coreRequestModel = require("../models/serviceModel/user");
const errorModel = require("../models/serviceModel/error");
const constant = require("../common/constant");
const appLib = require("applib");
const momentTimezone = require("moment-timezone");
const requestType = constant.RequestType;
const joiValidationModel = require("../models/validationModel/user");
const appLibModule = require("../../applib/app");
const fileConfiguration = require("../common/settings").FileConfiguration;
const fs = require("fs");
const AWS = require("aws-sdk");
const { param } = require("../routes/vendor");
const uuid = require("uuid");
const { notifyUsers } = require("../databasehelper/general");
const { addLeadsDb, getVendorsRadiusDb } = require("../databasehelper/vendor");

async function FileUploadFunction(
  functionContext,
  resolvedResult,
  image,
  folderName
) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  const params = {
    Bucket: process.env.DO_SPACES_NAME,
    Key: `${folderName}/${uuid.v4()}_${resolvedResult.ImageUrl}`,
    Body: image,
    ACL: "public-read",
  };

  console.log("farams", params);
  try {
    const response = await s3.upload(params).promise();
    console.log("location", response.Location);
    return response.Location;
  } catch (err) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,
      constant.ErrorCode.ApplicationError
    );
    throw functionContext.error;
  }
}

module.exports.userLogin = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`UserLogin invoked()!!`);

  let functionContext = {
    requestType: requestType.USERLOGIN,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let userLoginDetailsRequest = new coreRequestModel.UserLoginRequest(req);

  logger.logInfo(`UserLogin() :: Request Object :: ${userLoginDetailsRequest}`);

  let requestContext = {
    ...userLoginDetailsRequest,
  };

  let validateRequest = joiValidationModel.userLogin(userLoginDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `userLoginDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    userLoginResponse(functionContext, null);
    return;
  }

  try {
    let userLoginDBResult = await databaseHelper.userLoginDb(
      functionContext,
      requestContext
    );

    userLoginResponse(functionContext, userLoginDBResult);
  } catch (errUserLogin) {
    if (!errUserLogin.ErrorMessage && !errUserLogin.ErrorCode) {
      logger.logInfo(`userLoginDBResult() :: Error :: ${errUserLogin}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `userLoginDBResult() :: Error :: ${JSON.stringify(errUserLogin)}`
    );
    userLoginResponse(functionContext, null);
  }
};

const userLoginResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`userLoginResponse() invoked!`);

  let userLoginResponse = new coreRequestModel.UserLoginResponse();

  userLoginResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    userLoginResponse.Error = functionContext.error;
    userLoginResponse.Details = null;
  } else {
    userLoginResponse.Error = null;
    userLoginResponse.Details.AuthToken = resolvedResult.AuthToken;
    userLoginResponse.Details.UserRef = resolvedResult.UserReference;
    userLoginResponse.Details.UserType = resolvedResult.UserTypeId;
    userLoginResponse.Details.UserId = resolvedResult.UserId;
  }
  appLib.SendHttpResponse(functionContext, userLoginResponse);

  logger.logInfo(
    `userLoginResponse response :: ${JSON.stringify(userLoginResponse)}`
  );

  logger.logInfo(`userLoginResponse completed`);
};

//User Logout
module.exports.userLogout = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`userLogout invoked()!!`);

  let functionContext = {
    requestType: requestType.USERLOGOUT,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let userLogoutDetailsRequest = new coreRequestModel.userLogoutRequest(req);

  logger.logInfo(
    `userLogoutRequest() :: Request Object :: ${userLogoutDetailsRequest}`
  );

  let requestContext = {
    ...userLogoutDetailsRequest,
  };

  let validateRequest = joiValidationModel.userLogout(userLogoutDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `userLogoutDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    userLogoutResponse(functionContext, null);
    return;
  }

  try {
    let userLogoutDBResult = await databaseHelper.userLogoutDb(
      functionContext,
      requestContext
    );

    userLogoutResponse(functionContext, userLogoutDBResult);
  } catch (errUserLogout) {
    if (!errUserLogout.ErrorMessage && !errUserLogout.ErrorCode) {
      logger.logInfo(`userLogoutDBResult() :: Error :: ${errUserLogout}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `userLogoutDBResult() :: Error :: ${JSON.stringify(errUserLogout)}`
    );
    userLogoutResponse(functionContext, null);
  }
};

const userLogoutResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`userLogoutResponse() invoked!`);

  let userLogoutResponse = new coreRequestModel.userLogoutResponse();

  userLogoutResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    userLogoutResponse.Error = functionContext.error;
    userLogoutResponse.Details = null;
  } else {
    userLogoutResponse.Error = null;
    userLogoutResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, userLogoutResponse);

  logger.logInfo(
    `userLogoutResponse response :: ${JSON.stringify(userLogoutResponse)}`
  );

  logger.logInfo(`userLogoutResponse completed`);
};

//AddUser  Request

module.exports.addUser = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`AddUser invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDUSER,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addUserDetailsRequest = new coreRequestModel.addUserRequest(req);

  logger.logInfo(`AddUser() :: Request Object :: ${addUserDetailsRequest}`);

  let requestContext = {
    ...addUserDetailsRequest,
  };

  let validateRequest = joiValidationModel.addUser(addUserDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addUserDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addUserResponse(functionContext, null);
    return;
  }

  try {
    let addUserDBResult = await databaseHelper.addUserDb(
      functionContext,
      requestContext
    );

    addUserResponse(functionContext, addUserDBResult);
  } catch (errAddUser) {
    if (!errAddUser.ErrorMessage && !errAddUser.ErrorCode) {
      logger.logInfo(`addUserDBResult() :: Error :: ${errAddUser}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addUserDBResult() :: Error :: ${JSON.stringify(errAddUser)}`
    );
    addUserResponse(functionContext, null);
  }
};

//Add User Response

const addUserResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addUserResponse() invoked!`);

  let addUserResponse = new coreRequestModel.addUserResponse();

  addUserResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addUserResponse.Error = functionContext.error;
    addUserResponse.Details = null;
  } else {
    addUserResponse.Error = null;
    addUserResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addUserResponse);

  logger.logInfo(
    `addUserResponse response :: ${JSON.stringify(addUserResponse)}`
  );

  logger.logInfo(`addUserResponse() completed`);
};

//Fetch User
// module.exports.fetchUser = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`FetchUser invoked()!!`);

//   let functionContext = {
//     requestType: requestType.FETCHUSER,
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   let fetchserDetailsRequest = new coreRequestModel.fetchUserRequest(req);

//   logger.logInfo(`fetchUser() :: Request Object :: ${fetchserDetailsRequest}`);

//   let requestContext = {
//     ...fetchserDetailsRequest,
//   };

//   try {
//     let fetchUserDBResult = await databaseHelper.fetchUserDb(
//       functionContext,
//       requestContext
//     );

//     fetchUserResponse(functionContext, fetchUserDBResult);
//   } catch (errFetchUser) {
//     if (!errFetchUser.ErrorMessage && !errFetchUser.ErrorCode) {
//       logger.logInfo(`fetchUserDBResult() :: Error :: ${errFetchUser}`);
//       functionContext.error = new errorModel.ErrorModel(
//         constant.ErrorMessage.ApplicationError,
//         constant.ErrorCode.ApplicationError
//       );
//     }
//     logger.logInfo(
//       `fetchUserDBResult() :: Error :: ${JSON.stringify(errFetchUser)}`
//     );
//     fetchUserResponse(functionContext, null);
//   }
// };

//edit user request

module.exports.editUser = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`editUser invoked()!!`);

  let functionContext = {
    requestType: requestType.EDITUSER,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let editUserDetailsRequest = new coreRequestModel.editUserRequest(req);

  logger.logInfo(`editUser() :: Request Object :: ${editUserDetailsRequest}`);

  let requestContext = {
    ...editUserDetailsRequest,
  };

  let validateRequest = joiValidationModel.editUser(editUserDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `editUserDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    editUserResponse(functionContext, null);
    return;
  }

  try {
    let editUserDBResult = await databaseHelper.editUserDb(
      functionContext,
      requestContext
    );

    editUserResponse(functionContext, editUserDBResult);
  } catch (erreditUser) {
    if (!erreditUser.ErrorMessage && !erreditUser.ErrorCode) {
      logger.logInfo(`editUserDBResult() :: Error :: ${erreditUser}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `editUserDBResult() :: Error :: ${JSON.stringify(erreditUser)}`
    );
    editUserResponse(functionContext, null);
  }
};

//Edit User Response

const editUserResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`editUserResponse() invoked!`);

  let editUserResponse = new coreRequestModel.editUserResponse();

  editUserResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    editUserResponse.Error = functionContext.error;
    editUserResponse.Details = null;
  } else {
    editUserResponse.Error = null;
    editUserResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, editUserResponse);

  logger.logInfo(
    `editUserResponse response :: ${JSON.stringify(editUserResponse)}`
  );

  logger.logInfo(`editUserResponse() completed`);
};

//Fetch User
module.exports.fetchUser = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`FetchUser invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHUSER,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchUserDetailsRequest = new coreRequestModel.fetchUserRequest(req);

  logger.logInfo(`fetchUser() :: Request Object :: ${fetchUserDetailsRequest}`);

  let requestContext = {
    ...fetchUserDetailsRequest,
  };
  let validateRequest = joiValidationModel.fetchUser(fetchUserDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchUserDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchUserResponse(functionContext, null);

    return;
  }

  try {
    let fetchUserDBResult = await databaseHelper.fetchUserDb(
      functionContext,
      requestContext
    );

    let fetchJobSeekerIdDBResult = await databaseHelper.fetchJobSeekerIdDb(
      functionContext,
      requestContext
    );

    fetchUserResponse(
      functionContext,
      fetchUserDBResult,
      fetchJobSeekerIdDBResult
    );
  } catch (errFetchUser) {
    if (!errFetchUser.ErrorMessage && !errFetchUser.ErrorCode) {
      logger.logInfo(`fetchUserDBResult() :: Error :: ${errFetchUser}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchUserDBResult() :: Error :: ${JSON.stringify(errFetchUser)}`
    );
    fetchUserResponse(functionContext, null);
  }
};

//Fetch User Response
const fetchUserResponse = (
  functionContext,
  resolvedResult,
  resolvedResult1
) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchUserResponse() invoked!`);

  let fetchUserResponse = new coreRequestModel.fetchUserResponse();

  fetchUserResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchUserResponse.Error = functionContext.error;
    fetchUserResponse.Details = null;
  } else {
    fetchUserResponse.Error = null;
    fetchUserResponse.Details = resolvedResult;
    fetchUserResponse.JobSeekerDetails = resolvedResult1;
  }
  appLib.SendHttpResponse(functionContext, fetchUserResponse);

  logger.logInfo(
    `fetchUserResponse response :: ${JSON.stringify(fetchUserResponse)}`
  );

  logger.logInfo(`fetchUserResponse() completed`);
};

//Add addvertisement Request

module.exports.addAdvertisement = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`AddAdvertisement invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDADVERTISEMENT,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,

    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addAdvertisementDetailsRequest =
    new coreRequestModel.addAdvertisementRequest(req);

  logger.logInfo(
    `addAdvertisementDetailsRequest() :: Request Object :: ${addAdvertisementDetailsRequest}`
  );

  let requestContext = {
    ...addAdvertisementDetailsRequest,
    // ImageURL: null,
  };

  let validateRequest = joiValidationModel.addAdvertisement(
    addAdvertisementDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );

    logger.logInfo(
      `addAdvertisementRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );

    addAdvertisementResponse(functionContext, null);
    return;
  }

  //Image upload start
  try {
    //console.log('req.hasOwnProperty("files").length>>>>', req.files.length);
    // if (req.files.length > 0) {
    //   if (req.hasOwnProperty("files")) {
    //     console.log("req", req.hasOwnProperty("files"));
    //     var toBeUploaded = [];
    //     for (let count = 0; count < req.files.length; count++) {
    //       var file = req.files[count];
    //       if (file.hasOwnProperty("filename")) {
    //         if (file.filename) {
    //           toBeUploaded[count] = fs.readFileSync(file.path);

    //           requestContext.ImageURL = file.filename.split(" ").join("%20");
    //           //process.env.DO_SPACES_FOR_SPACES +file.filename.split(" ").join("%20");
    //         }
    //       }
    //     }
    //     const ImageUrl = await advertisementImageFileUploadFunction(
    //       functionContext,
    //       requestContext,
    //       toBeUploaded
    //     );

    let addAdvertisementDBResult = await databaseHelper.addAdvertisementDb(
      functionContext,
      requestContext
      // ImageUrl
    );

    addAdvertisementResponse(functionContext, addAdvertisementDBResult);
  } catch (addAdvertisement) {
    // } else {
    //   let addAdvertisementDBResult = await databaseHelper.addAdvertisementDb(
    //     functionContext,
    //     requestContext,
    //     requestContext.ImageURL
    //     //ImageURL
    //   );

    //   addAdvertisementResponse(functionContext, addAdvertisementDBResult);
    // }
    if (!addAdvertisement.ErrorMessage && !addAdvertisement.ErrorCode) {
      logger.logInfo(
        `addAdvertisementDBResult() :: Error :: ${addAdvertisement}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addAdvertisementDBResult() :: Error :: ${JSON.stringify(
        addAdvertisement
      )}`
    );
    addAdvertisementResponse(functionContext, null);
  }
};

//Add addvertisement Response

const addAdvertisementResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addAdvertisementResponse() invoked!`);

  let addAdvertisementResponse =
    new coreRequestModel.addAdvertisementResponse();

  addAdvertisementResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addAdvertisementResponse.Error = functionContext.error;
    addAdvertisementResponse.Details = null;
  } else {
    addAdvertisementResponse.Error = null;
    addAdvertisementResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addAdvertisementResponse);

  logger.logInfo(
    `addAdvertisementResponse response :: ${JSON.stringify(
      addAdvertisementResponse
    )}`
  );

  logger.logInfo(`addAdvertisementResponse() completed`);
};

//advertisement image upload function
// async function advertisementImageFileUploadFunction(
//   functionContext,
//   resolvedResult,
//   files
// ) {
//   var logger = functionContext.logger;

//   logger.logInfo(`fileUpload() Invoked()`);

//   const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

//   const s3 = new AWS.S3({
//     endpoint: spacesEndpoint,
//     accessKeyId: process.env.DO_SPACES_KEY,
//     secretAccessKey: process.env.DO_SPACES_SECRET,
//   });

//   const params = [];
//   files.map((f) => {
//     params.push({
//       Bucket: process.env.DO_SPACES_NAME,
//       Key: `Business/${resolvedResult.ImageURL}`,
//       Body: f,
//       ACL: "public-read",
//     });
//   });
//   try {
//     const responses = await Promise.all(
//       params.map((param) => s3.upload(param).promise())
//     );
//     const storedlocation = responses[0].Location;
//     console.log("location", storedlocation);
//     return storedlocation;
//   } catch (err) {
//     logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);

//     functionContext.error = new coreRequestModel.ErrorModel(
//       constant.ErrorMessage.ApplicationError,

//       constant.ErrorCode.ApplicationError
//     );

//     throw functionContext.error;
//   }
// }

//end of advertisement image upload function

//Fetch Reviews
module.exports.fetchReviews = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchReviews invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHREVIEWS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchreviewDetailsRequest = new coreRequestModel.fetchReviewRequest(req);

  logger.logInfo(
    `fetchReviews() :: Request Object :: ${fetchreviewDetailsRequest}`
  );

  let requestContext = {
    ...fetchreviewDetailsRequest,
  };

  try {
    let fetchReviewDBResult = await databaseHelper.fetchReviewDb(
      functionContext,
      requestContext
    );

    fetchReviewResponse(functionContext, fetchReviewDBResult);
  } catch (errFetchReview) {
    if (!errFetchReview.ErrorMessage && !errFetchReview.ErrorCode) {
      logger.logInfo(`fetchReviewDBResult() :: Error :: ${errFetchReview}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchReviewDBResult() :: Error :: ${JSON.stringify(errFetchReview)}`
    );
    fetchReviewResponse(functionContext, null);
  }
};

//Fetch Review Response

const fetchReviewResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchReviewResponse() invoked!`);

  let fetchReviewResponse = new coreRequestModel.fetchReviewResponse();

  fetchReviewResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchReviewResponse.Error = functionContext.error;
    fetchReviewResponse.Details = null;
  } else {
    fetchReviewResponse.Error = null;
    fetchReviewResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchReviewResponse);

  logger.logInfo(
    `fetchReviewResponse response :: ${JSON.stringify(fetchReviewResponse)}`
  );

  logger.logInfo(`fetchReviewResponse() completed`);
};

//AddReview  Request

module.exports.addReview = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`AddReview invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDREVIEW,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addReviewDetailsRequest = new coreRequestModel.addReviewRequest(req); //

  logger.logInfo(
    `addReviewDetailsRequest() :: Request Object :: ${addReviewDetailsRequest}`
  );

  let requestContext = {
    ...addReviewDetailsRequest,
  };

  let validateRequest = joiValidationModel.addReview(addReviewDetailsRequest); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addReviewDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addReviewResponse(functionContext, null);
    return;
  }

  try {
    let addReviewDBResult = await databaseHelper.addReviewDb(
      functionContext,
      requestContext
    );

    addReviewResponse(functionContext, addReviewDBResult);
  } catch (errAddReview) {
    if (!errAddReview.ErrorMessage && !errAddReview.ErrorCode) {
      logger.logInfo(`addReviewDBResult() :: Error :: ${errAddReview}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addReviewDBResult() :: Error :: ${JSON.stringify(errAddReview)}`
    );
    addReviewResponse(functionContext, null);
  }
};

//Add Review Response

const addReviewResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addReviewResponse() invoked!`);

  let addReviewResponse = new coreRequestModel.addReviewResponse();

  addReviewResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addReviewResponse.Error = functionContext.error;
    addReviewResponse.Details = null;
  } else {
    addReviewResponse.Error = null;
    addReviewResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addReviewResponse);

  logger.logInfo(
    `addReviewResponse response :: ${JSON.stringify(addReviewResponse)}`
  );

  logger.logInfo(`addReviewResponse() completed`);
};

//AddSavedService  Request

module.exports.addSavedService = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`AddSavedService invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDSAVEDSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addSavedServiceDetailsRequest =
    new coreRequestModel.addSavedServiceRequest(req); //

  logger.logInfo(
    `AddSavedService() :: Request Object :: ${addSavedServiceDetailsRequest}`
  );

  let requestContext = {
    ...addSavedServiceDetailsRequest,
  };

  let validateRequest = joiValidationModel.addSavedService(
    addSavedServiceDetailsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `AddSavedServiceDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addSavedServiceResponse(functionContext, null);
    return;
  }

  try {
    let addSavedServiceDBResult = await databaseHelper.addSavedServiceDb(
      functionContext,
      requestContext
    );

    addSavedServiceResponse(functionContext, addSavedServiceDBResult);
  } catch (errAddSavedService) {
    if (!errAddSavedService.ErrorMessage && !errAddSavedService.ErrorCode) {
      logger.logInfo(
        `addSavedServiceDBResult() :: Error :: ${errAddSavedService}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addSavedServiceDBResult() :: Error :: ${JSON.stringify(
        errAddSavedService
      )}`
    );
    addSavedServiceResponse(functionContext, null);
  }
};

//AddSavedService Response
const addSavedServiceResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addSavedServiceResponse() invoked!`);

  let addSavedServiceResponse = new coreRequestModel.addSavedServiceResponse();

  addSavedServiceResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addSavedServiceResponse.Error = functionContext.error;
    addSavedServiceResponse.Details = null;
  } else {
    addSavedServiceResponse.Error = null;
    addSavedServiceResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addSavedServiceResponse);

  logger.logInfo(
    `addSavedServiceResponse response :: ${JSON.stringify(
      addSavedServiceResponse
    )}`
  );

  logger.logInfo(`addSavedServiceResponse() completed`);
};

//Fetch Savedservices
module.exports.fetchSavedServices = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchSavedServices invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHSAVEDSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchSavedServicesDetailsRequest =
    new coreRequestModel.fetchSavedServicesRequest(req);

  logger.logInfo(
    `fetchSavedServices() :: Request Object :: ${fetchSavedServicesDetailsRequest}`
  );

  let requestContext = {
    ...fetchSavedServicesDetailsRequest,
  };
  let validateRequest = joiValidationModel.fetchSavedservices(
    fetchSavedServicesDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchSavedServicesDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchSavedServicesResponse(functionContext, null);
    return;
  }
  try {
    let fetchSavedServicesDBResult = await databaseHelper.fetchSavedServicesDb(
      functionContext,
      requestContext
    );

    fetchSavedServicesResponse(functionContext, fetchSavedServicesDBResult);
  } catch (errfetchSavedServices) {
    if (
      !errfetchSavedServices.ErrorMessage &&
      !errfetchSavedServices.ErrorCode
    ) {
      logger.logInfo(
        `fetchSavedServicesDBResult() :: Error :: ${errfetchSavedServices}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchSavedServicesDBResult() :: Error :: ${JSON.stringify(
        errfetchSavedServices
      )}`
    );
    fetchSavedServicesResponse(functionContext, null);
  }
};

//Fetch Savedservices Response

const fetchSavedServicesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchSavedServicesResponse() invoked!`);

  let fetchSavedServicesResponse =
    new coreRequestModel.fetchSavedServicesResponse();

  fetchSavedServicesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchSavedServicesResponse.Error = functionContext.error;
    fetchSavedServicesResponse.Details = null;
  } else {
    fetchSavedServicesResponse.Error = null;
    fetchSavedServicesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchSavedServicesResponse);

  logger.logInfo(
    `fetchSavedServicesResponse response :: ${JSON.stringify(
      fetchSavedServicesResponse
    )}`
  );

  logger.logInfo(`fetchSavedServicesResponse() completed`);
};

//Fetch Catalogue
module.exports.fetchCatalogue = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchCatalogue invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHCATALOGUE,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchCatalogueDetailsRequest = new coreRequestModel.fetchCatalogueRequest(
    req
  );

  logger.logInfo(
    `fetchCatalogue() :: Request Object :: ${fetchCatalogueDetailsRequest}`
  );

  let requestContext = {
    ...fetchCatalogueDetailsRequest,
  };
  let validateRequest = joiValidationModel.fetchCatalogue(
    fetchCatalogueDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addUserDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchCatalogueResponse(functionContext, null);
    return;
  }

  try {
    let fetchCatalogueDBResult = await databaseHelper.fetchCatalogueDb(
      functionContext,
      requestContext
    );

    fetchCatalogueResponse(functionContext, fetchCatalogueDBResult);
  } catch (errfetchCatalogue) {
    if (!errfetchCatalogue.ErrorMessage && !errfetchCatalogue.ErrorCode) {
      logger.logInfo(
        `fetchCatalogueDBResult() :: Error :: ${errfetchCatalogue}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchCatalogueDBResult() :: Error :: ${JSON.stringify(
        errfetchCatalogue
      )}`
    );
    fetchCatalogueResponse(functionContext, null);
  }
};

//Fetch Catalogue Response

const fetchCatalogueResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchCatalogueResponse() invoked!`);

  let fetchCatalogueResponse = new coreRequestModel.fetchCatalogueResponse();

  fetchCatalogueResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchCatalogueResponse.Error = functionContext.error;
    fetchCatalogueResponse.Details = null;
  } else {
    fetchCatalogueResponse.Error = null;
    fetchCatalogueResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchCatalogueResponse);

  logger.logInfo(
    `fetchCatalogueResponse response :: ${JSON.stringify(
      fetchCatalogueResponse
    )}`
  );

  logger.logInfo(`fetchCatalogueResponse() completed`);
};

//Fetch Vendor Category
module.exports.fetchVendorCategories = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchVendorCategories() invoked()!!`);

  let functionContext = {
    requestType: requestType.VENDORSCATEGORIES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchVendorCategories = new coreRequestModel.fetchVendorCategoriesRequest(
    req
  );

  logger.logInfo(
    `fetchVendorCategories() :: Request Object :: ${fetchVendorCategories}`
  );

  let requestContext = {
    ...fetchVendorCategories,
  };

  let validateRequest = joiValidationModel.fetchVendorCategory(
    fetchVendorCategories
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchVendorCategories() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchVendorCategoriesResponse(functionContext, null);
    return;
  }

  try {
    let fetchVendorCategoryDBResult = await databaseHelper.fetchVendorCategory(
      functionContext,
      requestContext
    );
    fetchVendorCategoriesResponse(functionContext, fetchVendorCategoryDBResult);
  } catch (errFetchVendorCategory) {
    if (
      !errFetchVendorCategory.ErrorMessage &&
      !errFetchVendorCategory.ErrorCode
    ) {
      logger.logInfo(
        `fetchVendorCategoryDBResult() :: Error :: ${errFetchVendorCategory}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchVendorCategoryDBResult() :: Error :: ${JSON.stringify(
        errFetchVendorCategory
      )}`
    );
    fetchVendorCategoriesResponse(functionContext, null);
  }
};

//Fetch Vendor Category Response

const fetchVendorCategoriesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchVendorCategoriesResponse() invoked!`);

  let fetchVendorCategoriesResponse =
    new coreRequestModel.fetchVendorCategoriesResponse();

  fetchVendorCategoriesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchVendorCategoriesResponse.Error = functionContext.error;
    fetchVendorCategoriesResponse.Details = null;
  } else {
    fetchVendorCategoriesResponse.Error = null;
    fetchVendorCategoriesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchVendorCategoriesResponse);

  logger.logInfo(
    `fetchVendorCategoriesResponse response :: ${JSON.stringify(
      fetchVendorCategoriesResponse
    )}`
  );

  logger.logInfo(`fetchVendorCategoriesResponse() completed`);
};

//Fetch Catagories
module.exports.fetchCategories = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchCatalogue invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHCATEGORIES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchCategoriesDetailsRequest =
    new coreRequestModel.fetchCategoriesRequest(req);

  logger.logInfo(
    `fetchCategories() :: Request Object :: ${fetchCategoriesDetailsRequest}`
  );

  let requestContext = {
    ...fetchCategoriesDetailsRequest,
  };

  try {
    let fetchCategoriesDBResult = await databaseHelper.fetchCategoriesDb(
      functionContext,
      requestContext
    );

    fetchCategoriesResponse(functionContext, fetchCategoriesDBResult);
  } catch (errfetchCategories) {
    if (!errfetchCategories.ErrorMessage && !errfetchCategories.ErrorCode) {
      logger.logInfo(
        `fetchCategoriesDBResult() :: Error :: ${errfetchCategories}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchCategoriesDBResult() :: Error :: ${JSON.stringify(
        errfetchCategories
      )}`
    );
    fetchCategoriesResponse(functionContext, null);
  }
};

//Fetch Categories Response

const fetchCategoriesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchCategoriesResponse() invoked!`);

  let fetchCategoriesResponse = new coreRequestModel.fetchCategoriesResponse();

  fetchCategoriesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchCategoriesResponse.Error = functionContext.error;
    fetchCategoriesResponse.Details = null;
  } else {
    fetchCategoriesResponse.Error = null;
    fetchCategoriesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchCategoriesResponse);

  logger.logInfo(
    `fetchCategoriesResponse response :: ${JSON.stringify(
      fetchCategoriesResponse
    )}`
  );

  logger.logInfo(`fetchCategoriesResponse() completed`);
};

//Forgot Password
module.exports.forgotPassword = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotpassword invoked()!!`);

  let functionContext = {
    requestType: requestType.FORGOTPASSWORD,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let forgotPasswordDetailsRequest = new coreRequestModel.forgotPasswordRequest(
    req
  );

  logger.logInfo(
    `forgotPasswordRequest() :: Request Object :: ${forgotPasswordDetailsRequest}`
  );

  let requestContext = {
    ...forgotPasswordDetailsRequest,
  };
  let validateRequest = joiValidationModel.forgotPassword(
    forgotPasswordDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `forgotPasswordDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    forgotPasswordResponse(functionContext, null);
    return;
  }
  try {
    let forgotPasswordDBResult = await databaseHelper.forgotPasswordDb(
      functionContext,
      requestContext
    );

    forgotPasswordResponse(functionContext, forgotPasswordDBResult);
  } catch (errforgotPassword) {
    if (!errforgotPassword.ErrorMessage && !errforgotPassword.ErrorCode) {
      logger.logInfo(
        `forgotPasswordDBResult() :: Error :: ${errforgotPassword}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `forgotPasswordDBResult() :: Error :: ${JSON.stringify(
        errforgotPassword
      )}`
    );
    forgotPasswordResponse(functionContext, null);
  }
};

//Forgot Password Response

const forgotPasswordResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`forgotPasswordResponse() invoked!`);

  let forgotPasswordResponse = new coreRequestModel.fetchCategoriesResponse();

  forgotPasswordResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    forgotPasswordResponse.Error = functionContext.error;
    forgotPasswordResponse.Details = null;
  } else {
    forgotPasswordResponse.Error = null;
    forgotPasswordResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, forgotPasswordResponse);

  logger.logInfo(
    `forgotPasswordResponse response :: ${JSON.stringify(
      forgotPasswordResponse
    )}`
  );

  logger.logInfo(`forgotPasswordResponse() completed`);
};

//Fetch Sub Categories

module.exports.fetchSubCategories = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchSubCategories invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHSUBCATEGORIES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchSubCategoriesDetailsRequest =
    new coreRequestModel.fetchSubCategoriesRequest(req);

  logger.logInfo(
    `fetchSubCategories() :: Request Object :: ${fetchSubCategoriesDetailsRequest}`
  );

  let requestContext = {
    ...fetchSubCategoriesDetailsRequest,
  };

  try {
    let fetchSubCategoriesDBResult = await databaseHelper.fetchSubCategoriesDb(
      functionContext,
      requestContext
    );

    fetchSubCategoriesResponse(functionContext, fetchSubCategoriesDBResult);
  } catch (errfetchSubCategories) {
    if (
      !errfetchSubCategories.ErrorMessage &&
      !errfetchSubCategories.ErrorCode
    ) {
      logger.logInfo(
        `fetchSubCategoriesDBResult() :: Error :: ${errfetchSubCategories}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchSubCategoriesDBResult() :: Error :: ${JSON.stringify(
        errfetchSubCategories
      )}`
    );
    fetchCategoriesResponse(functionContext, null);
  }
};

//Fetch Categories Response

const fetchSubCategoriesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchSubCategoriesResponse() invoked!`);

  let fetchSubCategoriesResponse =
    new coreRequestModel.fetchSubCategoriesResponse();

  fetchSubCategoriesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchSubCategoriesResponse.Error = functionContext.error;
    fetchSubCategoriesResponse.Details = null;
  } else {
    fetchSubCategoriesResponse.Error = null;
    fetchSubCategoriesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchSubCategoriesResponse);

  logger.logInfo(
    `fetchSubCategoriesResponse response :: ${JSON.stringify(
      fetchSubCategoriesResponse
    )}`
  );

  logger.logInfo(`fetchSubCategoriesResponse() completed`);
};

// Filtering
module.exports.filter = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`Filter invoked()!!`);

  let functionContext = {
    requestType: requestType.FILTER,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let filterRequest = new coreRequestModel.filterRequest(req); //

  logger.logInfo(`FilterRequest() :: Request Object :: ${filterRequest}`);

  let requestContext = {
    ...filterRequest,
  };

  let validateRequest = joiValidationModel.filters(filterRequest); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `filterRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    filterResponse(functionContext, null);
    return;
  }

  try {
    let filterDBResult;
    // if (requestContext.Radius > 0) {
    //   filterDBResult = await getVendorsRadiusDb(
    //     functionContext,
    //     requestContext
    //   );
    // }
    filterDBResult = await databaseHelper.filterDb(
      functionContext,
      requestContext
    );

    filterResponse(functionContext, filterDBResult);
  } catch (errFilterDb) {
    if (!errFilterDb.ErrorMessage && !errFilterDb.ErrorCode) {
      logger.logInfo(`filterDBResult() :: Error :: ${errFilterDb}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `filterDBResult() :: Error :: ${JSON.stringify(errFilterDb)}`
    );
    filterResponse(functionContext, null);
  }
};

//Filters Response
const filterResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`filterResponse() invoked!`);

  let filterResponse = new coreRequestModel.filterResponse();

  filterResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    filterResponse.Error = functionContext.error;
    filterResponse.Details = null;
  } else {
    filterResponse.Error = null;
    filterResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, filterResponse);

  logger.logInfo(
    `filterResponse response :: ${JSON.stringify(filterResponse)}`
  );

  logger.logInfo(`filterResponse() completed`);
};

// Recently Added Services LIMIT 5
module.exports.recentlyAddedLimit = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`recentlyAddedLimit invoked()!!`);

  let functionContext = {
    requestType: requestType.RECENTLYADDED5,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  try {
    let recentlyAdded5DBResult = await databaseHelper.recentlyAdded5Db(
      functionContext
    );

    recentlyAddedResponse(functionContext, recentlyAdded5DBResult);
  } catch (errRecentlyAdded5Db) {
    if (!errRecentlyAdded5Db.ErrorMessage && !errRecentlyAdded5Db.ErrorCode) {
      logger.logInfo(
        `recentlyAdded5DBResult() :: Error :: ${errRecentlyAdded5Db}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `recentlyAdded5DBResult() :: Error :: ${JSON.stringify(
        errRecentlyAdded5Db
      )}`
    );
    recentlyAddedResponse(functionContext, null);
  }
};

//Recently added 5 Response
const recentlyAddedResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`recentlyAddedResponse() invoked!`);

  let recentlyAdded5Response = new coreRequestModel.recentlyAdded5Response();

  recentlyAdded5Response.RequestId = functionContext.requestId;

  if (functionContext.error) {
    recentlyAdded5Response.Error = functionContext.error;
    recentlyAdded5Response.Details = null;
  } else {
    recentlyAdded5Response.Error = null;
    recentlyAdded5Response.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, recentlyAdded5Response);

  logger.logInfo(
    `recentlyAdded5Response response :: ${JSON.stringify(
      recentlyAdded5Response
    )}`
  );

  logger.logInfo(`recentlyAdded5Response() completed`);
};

// Recently Added Services All
module.exports.recentlyAddedAll = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`recentlyAddedAll invoked()!!`);

  let functionContext = {
    requestType: requestType.RECENTLYADDEDALL,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  try {
    let recentlyAddedAllDBResult = await databaseHelper.recentlyAddedAllDb(
      functionContext
    );

    recentlyAddedAllResponse(functionContext, recentlyAddedAllDBResult);
  } catch (errRecentlyAddedAllDb) {
    if (
      !errRecentlyAddedAllDb.ErrorMessage &&
      !errRecentlyAddedAllDb.ErrorCode
    ) {
      logger.logInfo(
        `recentlyAddedAllDBResult() :: Error :: ${errRecentlyAddedAllDb}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `recentlyAddedAllDBResult() :: Error :: ${JSON.stringify(
        errRecentlyAddedAllDb
      )}`
    );
    recentlyAddedAllResponse(functionContext, null);
  }
};

//Recently added All Response
const recentlyAddedAllResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`recentlyAddedAllResponse() invoked!`);

  let recentlyAddedAllResponse =
    new coreRequestModel.recentlyAddedAllResponse();

  recentlyAddedAllResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    recentlyAddedAllResponse.Error = functionContext.error;
    recentlyAddedAllResponse.Details = null;
  } else {
    recentlyAddedAllResponse.Error = null;
    recentlyAddedAllResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, recentlyAddedAllResponse);

  logger.logInfo(
    `recentlyAddedAllResponse response :: ${JSON.stringify(
      recentlyAddedAllResponse
    )}`
  );

  logger.logInfo(`recentlyAddedAllResponse() completed`);
};

// Fetch Notifications
module.exports.fetchNotification = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchNotification invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHNOTIFICATIONS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchNotificationRequest = new coreRequestModel.fetchNotificationRequest(
    req
  ); //

  logger.logInfo(
    `FetchNotificationRequest() :: Request Object :: ${fetchNotificationRequest}`
  );

  let requestContext = {
    ...fetchNotificationRequest,
  };

  let validateRequest = joiValidationModel.fetchNotification(
    fetchNotificationRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `FetchNotificationRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchNotificationResponse(functionContext, null);
    return;
  }

  try {
    let fetchNotificationDBResult = await databaseHelper.fetchNotificationDb(
      functionContext,
      requestContext
    );

    fetchNotificationResponse(functionContext, fetchNotificationDBResult);
  } catch (errFetchNotification) {
    if (!errFetchNotification.ErrorMessage && !errFetchNotification.ErrorCode) {
      logger.logInfo(
        `fetchNotificationResult() :: Error :: ${errFetchNotification}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchNotificationResult() :: Error :: ${JSON.stringify(
        errFetchNotification
      )}`
    );
    fetchNotificationResponse(functionContext, null);
  }
};

//Fetch Notification Response
const fetchNotificationResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchNotificationResponse() invoked!`);

  let fetchNotificationResponse =
    new coreRequestModel.fetchNotificationResponse();

  fetchNotificationResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchNotificationResponse.Error = functionContext.error;
    fetchNotificationResponse.Details = null;
  } else {
    fetchNotificationResponse.Error = null;
    fetchNotificationResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchNotificationResponse);

  logger.logInfo(
    `fetchNotificationResponse response :: ${JSON.stringify(
      fetchNotificationResponse
    )}`
  );

  logger.logInfo(`fetchNotificationResponse() completed`);
};

// Delete Notifications
module.exports.deleteNotification = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deleteNotification invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETENOTIFICATIONS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deleteNotificationRequest =
    new coreRequestModel.deleteNotificationRequest(req); //

  logger.logInfo(
    `DeleteNotificationRequest() :: Request Object :: ${deleteNotificationRequest}`
  );

  let requestContext = {
    ...deleteNotificationRequest,
  };

  let validateRequest = joiValidationModel.deleteNotification(
    deleteNotificationRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `DeleteNotificationRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    deleteNotificationResponse(functionContext, null);
    return;
  }

  try {
    let deleteNotificationDBResult = await databaseHelper.deleteNotificationDb(
      functionContext,
      requestContext
    );

    deleteNotificationResponse(functionContext, deleteNotificationDBResult);
  } catch (errDeleteNotification) {
    if (
      !errDeleteNotification.ErrorMessage &&
      !errDeleteNotification.ErrorCode
    ) {
      logger.logInfo(
        `deleteNotificationResult() :: Error :: ${errDeleteNotification}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deleteNotificationResult() :: Error :: ${JSON.stringify(
        errDeleteNotification
      )}`
    );
    deleteNotificationResponse(functionContext, null);
  }
};

//Delete Notification Response
const deleteNotificationResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deleteNotificationResponse() invoked!`);

  let deleteNotificationResponse =
    new coreRequestModel.deleteNotificationResponse();

  deleteNotificationResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deleteNotificationResponse.Error = functionContext.error;
    deleteNotificationResponse.Details = null;
  } else {
    deleteNotificationResponse.Error = null;
    deleteNotificationResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deleteNotificationResponse);

  logger.logInfo(
    `deleteNotificationResponse response :: ${JSON.stringify(
      deleteNotificationResponse
    )}`
  );

  logger.logInfo(`deleteNotificationResponse() completed`);
};

// Register Device Token
module.exports.registerToken = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`registerToken invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDSAVEDSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let registerTokenDetailsRequest = new coreRequestModel.registerTokenRequest(
    req
  );

  logger.logInfo(
    `registerToken() :: Request Object :: ${registerTokenDetailsRequest}`
  );

  let requestContext = {
    ...registerTokenDetailsRequest,
  };

  let validateRequest = joiValidationModel.registerToken(
    registerTokenDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `RegisterTokenDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    registerTokenResponse(functionContext, null);
    return;
  }

  try {
    let registerTokenDBResult = await databaseHelper.registerTokenDb(
      functionContext,
      requestContext
    );

    registerTokenResponse(functionContext, registerTokenDBResult);
  } catch (errRegisterToken) {
    if (!errRegisterToken.ErrorMessage && !errRegisterToken.ErrorCode) {
      logger.logInfo(`registerTokenDBResult() :: Error :: ${errRegisterToken}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `registerTokenDBResult() :: Error :: ${JSON.stringify(errRegisterToken)}`
    );
    registerTokenResponse(functionContext, null);
  }
};

//Register Token Response
const registerTokenResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`registerTokenResponse() invoked!`);

  let registerTokenResponse = new coreRequestModel.registerTokenResponse();

  registerTokenResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    registerTokenResponse.Error = functionContext.error;
    registerTokenResponse.Details = null;
  } else {
    registerTokenResponse.Error = null;
    registerTokenResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, registerTokenResponse);

  logger.logInfo(
    `registerTokenResponse response :: ${JSON.stringify(registerTokenResponse)}`
  );

  logger.logInfo(`registerTokenResponse() completed`);
};

//Notification by user
module.exports.pushNotificationByUser = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`PushNotificationByUser()`);

  let functionContext = {
    requestType: requestType.PUSHNOTIFICATIONBYUSER,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  logger.logInfo(
    `PushNotificationByUser() Request :: ${JSON.stringify(req.body)}`
  );

  var pushNotificationByUserRequest =
    new coreRequestModel.pushNotificationByUserRequest(req);
  var validateRequest = joiValidationModel.pushNotificationByUserRequest(
    pushNotificationByUserRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `pushNotificationByUserRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    return null;
  }

  var requestContext = {
    ...pushNotificationByUserRequest,
  };

  try {
    let findNearbyLocationsResult = await databaseHelper.findNearbyLocations(
      functionContext,
      requestContext
    );

    console.log("findNearbyLocationsResult", findNearbyLocationsResult);

    let BusinessDetails = findNearbyLocationsResult[0];

    console.log("BusinessDetails", BusinessDetails);
    let UserDetails = findNearbyLocationsResult[1];
    console.log("UserDetails", UserDetails);

    try {
      BusinessDetails?.map(async (element) => {
        console.log("element", typeof element.PackageId);
        let pushNotificationDataContext = {
          requestId: res.apiContext.requestId,
          error: null,
          res: res,
          logger: logger,
          BusinessId: element.Id,
          VendorId: element.VendorId,
          // Token:"eQ1znKi2R6WsrRTrFRt4KW:APA91bFqI16VtnVrpkfwZUHsDjWHDapbIscTXI0LoDhCcBa9hB5K7vyoftxSrAI8TsA7XxlLRhWEzCR1ZdKIbwMFUlCEMZrG21rPEi5tHslc9kJB-ekCgGsLYLMhZUyGcMTxcyvZzsUX",

          Token: element.Token,
          Payload: {
            Title: `Great News, ${UserDetails.Firstname} ${UserDetails.Lastname}  is actively searching for the service you offer on smartkhoj.`,
            Message: "Open in Chat",
          },
          UserId: UserDetails.Id,
          FirstName: UserDetails.Firstname,
          LastName: UserDetails.Lastname,
          currentTs: momentTimezone
            .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss.SSS"),
        };

        console.log("element", element);

        const postData = {
          BusinessId: element.Id,
          Calls: 0,
          Visits: 0,
          Leads: 1,
        };

        const leads = await addLeadsDb(functionContext, postData);
        console.log({ leads });

        if (element.PackageId === "1" || element.PackageId === "2") {
          console.log("inside 1st If", element.PackageId);
          return new Promise(async (resolve) => {
            setTimeout(async () => {
              const notifDetails = await saveNotification(
                pushNotificationDataContext
              );
              const pushNotif = await sendPushNotification(
                pushNotificationDataContext,
                notifDetails[0][0],
                notifDetails[1][0]
              );
              resolve(pushNotif);
            }, 30000);
          });
        } else if (element.PackageId === "3" || element.PackageId === "4") {
          console.log("inside 2nd If", element.PackageId);

          const notifDetails = await saveNotification(
            pushNotificationDataContext
          );
          const pushNotif = await sendPushNotification(
            pushNotificationDataContext,
            notifDetails[0][0],
            notifDetails[1][0]
          );
          return pushNotif;
        } else {
          findNearbyLocationsResult = "Free Package User";
          // return ;
        }
      });
    } catch (err) {
      console.log("Err", err);
      res.send({ err: err });
    }
    const text = "Notification sent successfully";
    //  Promise.all(promises).then((pushNotif) => {
    pushNotificationByUserResponse(functionContext, findNearbyLocationsResult);
    // });
  } catch (errPushNotificationByUser) {
    if (
      !errPushNotificationByUser.ErrorMessage &&
      !errPushNotificationByUser.ErrorCode
    ) {
      logger.logInfo(
        `pushNotificationByUserRequest() :: Error :: ${errPushNotificationByUser}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `pushNotificationByUserRequest() :: Error :: ${JSON.stringify(
        errPushNotificationByUser
      )}`
    );
    pushNotificationByUserResponse(functionContext, null);
  }
};

var pushNotificationByUserResponse = async (
  functionContext,
  resolvedResult
) => {
  const logger = functionContext.logger;

  logger.logInfo(`pushNotificationByUserResponse() invoked!`);

  let pushNotificationByUserResponse =
    new coreRequestModel.pushNotificationByUserResponse();

  pushNotificationByUserResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    pushNotificationByUserResponse.Error = functionContext.error;
    pushNotificationByUserResponse.Details = null;
  } else {
    pushNotificationByUserResponse.Error = null;
    pushNotificationByUserResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, pushNotificationByUserResponse);

  logger.logInfo(
    `pushNotificationByUserResponse response :: ${JSON.stringify(
      pushNotificationByUserResponse
    )}`
  );

  logger.logInfo(`pushNotificationByUserResponse() completed`);
};

var saveNotification = async (pushNotificationDataContext) => {
  try {
    let saveNotificationResult = await databaseHelper.saveNotificationDB(
      pushNotificationDataContext
    );
    return saveNotificationResult;
  } catch (errorSendNotif) {
    if (!errorSendNotif.ErrorMessage && !errorSendNotif.ErrorCode) {
      logger.logInfo(
        `pushNotificationByUserResponse() :: Error :: ${errorSendNotif}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `pushNotificationByUserResponse() :: Error :: ${JSON.stringify(
        errorSendNotif
      )}`
    );
    pushNotificationByUserResponse(functionContext, null);
    return null;
  }
};

var sendPushNotification = async (
  pushNotificationDataContext,
  notifDetails,
  image
) => {
  let deviceToken = pushNotificationDataContext.Token;
  var { logger } = pushNotificationDataContext;
  logger.logInfo(`sendPushNotification Invoked()`);

  var pushNotificationData = {
    NotificationRef: notifDetails.NotificationRef,
    UserId: pushNotificationDataContext.UserId,
    title: `Great News, ${pushNotificationDataContext.FirstName}${pushNotificationDataContext.LastName} is actively searching for the 
    service you offer on smartkhoj.`,
    body: "Open in Chat",
    UserId: pushNotificationDataContext.UserId,
    VendorId: pushNotificationDataContext.VendorId,
    image: image,
  };
  let cred =
    "AAAA4bDVu-0:APA91bHNBs5u92GLGwkWTWF0pux-GMYhiYJjRFzChzbgxq-IHI6FZ84MH6WVLc-LNwbXdseduk9wxoAvRdayJwhrKdLAR7UmpTd7R5LeRClW1LJA-T5rCaInL0pBkJO_ulcUoPIOcblM";
  // "AAAAJ_JUUPE:APA91bEqnTc0JjvPq1FNgPdLy7bHhcIIpMVhZoTRiEcYMnyykZMpFTrcwHpp8Pkq_5NVw4mbWgib6m53bUj5qTOAE9N2TPgyRuIT0Piv6cAlUHEQrkH_ntztjMTrphfgW0ODkVw4axo0";

  const notifResult = await appLibModule.SendPushNotification(
    logger,
    pushNotificationData,
    deviceToken,
    cred
  );

  logger.logInfo(
    `sendPushNotification()  :: Pushnotification sent to Vendor successfully`
  );
  return notifResult;
};

//Fetch Popular Services

module.exports.fetchPopularServices = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchPopularservices invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHPOPULARSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchPopularServicesDetailsRequest =
    new coreRequestModel.fetchPopularServicesRequest(req);

  logger.logInfo(
    `fetchPopularservices() :: Request Object :: ${fetchPopularServicesDetailsRequest}`
  );

  let requestContext = {
    ...fetchPopularServicesDetailsRequest,
  };

  try {
    let fetchPopularServicesDBResult =
      await databaseHelper.fetchPopularServicesDb(
        functionContext,
        requestContext
      );

    fetchPopularServicesResponse(functionContext, fetchPopularServicesDBResult);
  } catch (errfetchPopularServices) {
    if (
      !errfetchPopularServices.ErrorMessage &&
      !errfetchPopularServices.ErrorCode
    ) {
      logger.logInfo(
        `fetchPopularServicesDBResult() :: Error :: ${errfetchPopularServices}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchPopularServicesDBResult() :: Error :: ${JSON.stringify(
        errfetchPopularServices
      )}`
    );
    fetchPopularServicesResponse(functionContext, null);
  }
};

//Fetch popular services Response

const fetchPopularServicesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchPopularServicesResponse() invoked!`);

  let fetchPopularServicesResponse =
    new coreRequestModel.fetchPopularServicesResponse();

  fetchPopularServicesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchPopularServicesResponse.Error = functionContext.error;
    fetchPopularServicesResponse.Details = null;
  } else {
    fetchPopularServicesResponse.Error = null;
    fetchPopularServicesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchPopularServicesResponse);

  logger.logInfo(
    `fetchPopularServicesResponse response :: ${JSON.stringify(
      fetchPopularServicesResponse
    )}`
  );

  logger.logInfo(`fetchPopularServicesResponse() completed`);
};

//Fetch Trending Services

module.exports.fetchTrendingServices = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchTrendingServices invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHTRENDINGSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchTrendingServicesDetailsRequest =
    new coreRequestModel.fetchTrendingServicesRequest(req);

  logger.logInfo(
    `fetchTrendingservices() :: Request Object :: ${fetchTrendingServicesDetailsRequest}`
  );

  let requestContext = {
    ...fetchTrendingServicesDetailsRequest,
  };

  try {
    let fetchTrendingServicesDBResult =
      await databaseHelper.fetchTrendingServicesDb(
        functionContext,
        requestContext
      );

    fetchTrendingServicesResponse(
      functionContext,
      fetchTrendingServicesDBResult
    );
  } catch (errfetchTrendingServices) {
    if (
      !errfetchTrendingServices.ErrorMessage &&
      !errfetchTrendingServices.ErrorCode
    ) {
      logger.logInfo(
        `fetchTrendingServicesDBResult() :: Error :: ${errfetchTrendingServices}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchTrendingServicesDBResult() :: Error :: ${JSON.stringify(
        errfetchTrendingServices
      )}`
    );
    fetchTrendingServicesResponse(functionContext, null);
  }
};

//FetchTrending services Response

const fetchTrendingServicesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchTrendingServicesResponse() invoked!`);

  let fetchTrendingServicesResponse =
    new coreRequestModel.fetchTrendingServicesResponse();

  fetchTrendingServicesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchTrendingServicesResponse.Error = functionContext.error;
    fetchTrendingServicesResponse.Details = null;
  } else {
    fetchTrendingServicesResponse.Error = null;
    fetchTrendingServicesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchTrendingServicesResponse);

  logger.logInfo(
    `fetchTrendingServicesResponse response :: ${JSON.stringify(
      fetchTrendingServicesResponse
    )}`
  );

  logger.logInfo(`fetchTrendingServicesResponse() completed`);
};

//update password

module.exports.updatePassword = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`updatePassword invoked()!!`);

  let functionContext = {
    requestType: requestType.UPDATEPASSWORD,
    requestId: res.apiContext.requestId,
    UserRef: res.apiContext.userRef,
    UserType: res.apiContext.userType,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let updatePasswordRequestDetailsRequest =
    new coreRequestModel.updatePasswordRequest(req);

  logger.logInfo(
    `updatePasswordRequest() :: Request Object :: ${updatePasswordRequestDetailsRequest}`
  );

  let requestContext = {
    ...updatePasswordRequestDetailsRequest,
  };
  let validateRequest = joiValidationModel.updatePassword(
    updatePasswordRequestDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `updatePasswordRequestDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    updatePasswordResponse(functionContext, null);
    return;
  }
  try {
    let updatePasswordDBResult = await databaseHelper.updatePasswordDb(
      functionContext,
      requestContext
    );

    updatePasswordResponse(functionContext, updatePasswordDBResult);
  } catch (errupdatePassword) {
    if (!errupdatePassword.ErrorMessage && !errupdatePassword.ErrorCode) {
      logger.logInfo(
        `updatePasswordDBResult() :: Error :: ${errupdatePassword}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `updatePasswordDBResult() :: Error :: ${JSON.stringify(
        errupdatePassword
      )}`
    );
    updatePasswordResponse(functionContext, null);
  }
};

//Update Password Response

const updatePasswordResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`updatePasswordResponse() invoked!`);

  let updatePasswordResponse = new coreRequestModel.forgotPasswordResponse();

  updatePasswordResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    updatePasswordResponse.Error = functionContext.error;
    updatePasswordResponse.Details = null;
  } else {
    updatePasswordResponse.Error = null;
    updatePasswordResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, updatePasswordResponse);

  logger.logInfo(
    `updatePasswordResponse response :: ${JSON.stringify(
      updatePasswordResponse
    )}`
  );

  logger.logInfo(`updatePasswordResponse() completed`);
};

module.exports.checkIfRegistered = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let forgotUserPasswordRequest = new coreRequestModel.CheckIfRegisterdRequest(
    req
  );

  logger.logInfo(
    `checkIfRegistered() :: Request Object :: ${forgotUserPasswordRequest}`
  );

  let requestContext = {
    ...forgotUserPasswordRequest,
  };

  let validateRequest = joiValidationModel.checkIfRegisteredRequest(
    forgotUserPasswordRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `forgotUserPassword() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    checkIfRegisteredResponse(functionContext, null);
    return;
  }

  try {
    let forgotUserPasswordDBResult = await databaseHelper.checkIfRegisteredDB(
      functionContext,
      requestContext
    );

    checkIfRegisteredResponse(functionContext, forgotUserPasswordDBResult);
  } catch (errForgotUserPassword) {
    if (
      !errForgotUserPassword.ErrorMessage &&
      !errForgotUserPassword.ErrorCode
    ) {
      logger.logInfo(
        `checkIfRegisteredDB() :: Error :: ${JSON.stringify(
          errForgotUserPassword
        )}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `checkIfRegisteredDB() :: Error :: ${JSON.stringify(
        errForgotUserPassword
      )}`
    );
    checkIfRegisteredResponse(functionContext, null);
  }
};

const checkIfRegisteredResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`checkIfRegisteredResponse() invoked!`);

  let forgotUserPasswordRes = new coreRequestModel.CheckIfRegisterdResponse();

  forgotUserPasswordRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    forgotUserPasswordRes.Error = functionContext.error;
    forgotUserPasswordRes.Details = null;
  } else {
    forgotUserPasswordRes.Error = null;
    forgotUserPasswordRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, forgotUserPasswordRes);

  logger.logInfo(
    `checkIfRegisteredResponse response :: ${JSON.stringify(
      forgotUserPasswordRes
    )}`
  );

  logger.logInfo(`checkIfRegisteredResponse completed!`);
};

module.exports.addCareerPreferences = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let addCareerPreferencesRequest =
    new coreRequestModel.addCareerPreferencesRequest(req);

  logger.logInfo(
    `addCareerPreferences() :: Request Object :: ${addCareerPreferencesRequest}`
  );

  let requestContext = {
    ...addCareerPreferencesRequest,
  };

  let validateRequest = joiValidationModel.addCareerPreferences(
    addCareerPreferencesRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addCareerPreferences() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addCareerPreferencesResponse(functionContext, null);
    return;
  }

  try {
    let addCareerPreferencesDBResult =
      await databaseHelper.addCareerPreferencesDb(
        functionContext,
        requestContext
      );

    addCareerPreferencesResponse(functionContext, addCareerPreferencesDBResult);
  } catch (erraddCareerPreferences) {
    if (
      !erraddCareerPreferences.ErrorMessage &&
      !erraddCareerPreferences.ErrorCode
    ) {
      logger.logInfo(
        `addCareerPreferencesDB() :: Error :: ${JSON.stringify(
          erraddCareerPreferences
        )}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addCareerPreferencesDB() :: Error :: ${JSON.stringify(
        erraddCareerPreferences
      )}`
    );
    addCareerPreferencesResponse(functionContext, null);
  }
};

const addCareerPreferencesResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`addCareerPreferencesResponse() invoked!`);

  let addCareerPreferencesRes =
    new coreRequestModel.addCareerPreferencesResponse();

  addCareerPreferencesRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addCareerPreferencesRes.Error = functionContext.error;
    addCareerPreferencesRes.Details = null;
  } else {
    addCareerPreferencesRes.Error = null;
    addCareerPreferencesRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, addCareerPreferencesRes);

  logger.logInfo(
    `addCareerPreferencesResponse response :: ${JSON.stringify(
      addCareerPreferencesRes
    )}`
  );

  logger.logInfo(`addCareerPreferencesResponse completed!`);
};

module.exports.addKeySkills = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let addKeySkillsRequest = new coreRequestModel.addKeySkillsRequest(req);

  logger.logInfo(`addKeySkills() :: Request Object :: ${addKeySkillsRequest}`);

  let requestContext = {
    ...addKeySkillsRequest,
  };

  let validateRequest = joiValidationModel.addKeySkills(addKeySkillsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addKeySkills() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addKeySkillsResponse(functionContext, null);
    return;
  }

  try {
    let addKeySkillsDBResult = await databaseHelper.addKeySkillsDb(
      functionContext,
      requestContext
    );

    addKeySkillsResponse(functionContext, addKeySkillsDBResult);
  } catch (erraddKeySkills) {
    if (!erraddKeySkills.ErrorMessage && !erraddKeySkills.ErrorCode) {
      logger.logInfo(
        `addKeySkillsDB() :: Error :: ${JSON.stringify(erraddKeySkills)}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addKeySkillsDB() :: Error :: ${JSON.stringify(erraddKeySkills)}`
    );
    addKeySkillsResponse(functionContext, null);
  }
};

const addKeySkillsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`addKeySkillsResponse() invoked!`);

  let addKeySkillsRes = new coreRequestModel.addKeySkillsResponse();

  addKeySkillsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addKeySkillsRes.Error = functionContext.error;
    addKeySkillsRes.Details = null;
  } else {
    addKeySkillsRes.Error = null;
    addKeySkillsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, addKeySkillsRes);

  logger.logInfo(
    `addKeySkillsResponse response :: ${JSON.stringify(addKeySkillsRes)}`
  );

  logger.logInfo(`addKeySkillsResponse completed!`);
};

module.exports.addJobSeekerDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let addJobSeekerDetailsRequest =
    new coreRequestModel.addJobSeekerDetailsRequest(req);

  logger.logInfo(
    `addJobSeekerDetails() :: Request Object :: ${addJobSeekerDetailsRequest}`
  );

  let requestContext = {
    ...addJobSeekerDetailsRequest,
  };

  let validateRequest = joiValidationModel.addJobSeekerDetails(
    addJobSeekerDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addJobSeekerDetails() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addJobSeekerDetailsResponse(functionContext, null);
    return;
  }

  try {
    let addJobSeekerDetailsDBResult =
      await databaseHelper.addJobSeekerDetailsDb(
        functionContext,
        requestContext
      );

    addJobSeekerDetailsResponse(functionContext, addJobSeekerDetailsDBResult);
  } catch (erraddJobSeekerDetails) {
    if (
      !erraddJobSeekerDetails.ErrorMessage &&
      !erraddJobSeekerDetails.ErrorCode
    ) {
      logger.logInfo(
        `addJobSeekerDetailsDB() :: Error :: ${JSON.stringify(
          erraddJobSeekerDetails
        )}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addJobSeekerDetailsDB() :: Error :: ${JSON.stringify(
        erraddJobSeekerDetails
      )}`
    );
    addJobSeekerDetailsResponse(functionContext, null);
  }
};

const addJobSeekerDetailsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`addJobSeekerDetailsResponse() invoked!`);

  let addJobSeekerDetailsRes =
    new coreRequestModel.addJobSeekerDetailsResponse();

  addJobSeekerDetailsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addJobSeekerDetailsRes.Error = functionContext.error;
    addJobSeekerDetailsRes.Details = null;
  } else {
    addJobSeekerDetailsRes.Error = null;
    addJobSeekerDetailsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, addJobSeekerDetailsRes);

  logger.logInfo(
    `addJobSeekerDetailsResponse response :: ${JSON.stringify(
      addJobSeekerDetailsRes
    )}`
  );

  logger.logInfo(`addJobSeekerDetailsResponse completed!`);
};

module.exports.fetchJobSeekerDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let fetchJobSeekerDetailsRequest =
    new coreRequestModel.fetchJobSeekerDetailsRequest(req);

  logger.logInfo(
    `fetchJobSeekerDetails() :: Request Object :: ${fetchJobSeekerDetailsRequest}`
  );

  let requestContext = {
    ...fetchJobSeekerDetailsRequest,
  };

  let validateRequest = joiValidationModel.fetchJobSeekerDetails(
    fetchJobSeekerDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchJobSeekerDetails() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchJobSeekerDetailsResponse(functionContext, null);
    return;
  }

  try {
    let fetchJobSeekerDetailsDBResult =
      await databaseHelper.fetchJobSeekerDetailsDb(
        functionContext,
        requestContext
      );

    fetchJobSeekerDetailsResponse(
      functionContext,
      fetchJobSeekerDetailsDBResult
    );
  } catch (errfetchJobSeekerDetails) {
    if (
      !errfetchJobSeekerDetails.ErrorMessage &&
      !errfetchJobSeekerDetails.ErrorCode
    ) {
      logger.logInfo(
        `fetchJobSeekerDetailsDB() :: Error :: ${JSON.stringify(
          errfetchJobSeekerDetails
        )}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchJobSeekerDetailsDB() :: Error :: ${JSON.stringify(
        errfetchJobSeekerDetails
      )}`
    );
    fetchJobSeekerDetailsResponse(functionContext, null);
  }
};

const fetchJobSeekerDetailsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`fetchJobSeekerDetailsResponse() invoked!`);

  let fetchJobSeekerDetailsRes =
    new coreRequestModel.fetchJobSeekerDetailsResponse();

  fetchJobSeekerDetailsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchJobSeekerDetailsRes.Error = functionContext.error;
    fetchJobSeekerDetailsRes.Details = null;
  } else {
    fetchJobSeekerDetailsRes.Error = null;
    fetchJobSeekerDetailsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, fetchJobSeekerDetailsRes);

  logger.logInfo(
    ` fetchJobSeekerDetailsResponse response :: ${JSON.stringify(
      fetchJobSeekerDetailsRes
    )}`
  );

  logger.logInfo(` fetchJobSeekerDetailsResponse completed!`);
};

module.exports.addUserResume = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss"),
  };

  let addUserResumeRequest = new coreRequestModel.addUserResumeRequest(req);

  logger.logInfo(
    `addUserResume() :: Request Object :: ${addUserResumeRequest}`
  );

  let requestContext = {
    ...addUserResumeRequest,
    ImageUrl: null,
  };

  let validateRequest = joiValidationModel.addUserResume(addUserResumeRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addUserResume() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addUserResumeResponse(functionContext, null);
    return;
  }

  try {
    if (req.hasOwnProperty("files")) {
      var toBeUploaded = [];
      var imagetobeUploaded = [];

      console.log("REq.files", req.files);

      for (let count = 0; count < req.files.length; count++) {
        console.log("length", req.files.length);
        var file = req.files[count];
        if (file.hasOwnProperty("filename")) {
          if (file.filename) {
            const image = fs.readFileSync(file.path);
            requestContext.ImageUrl = file.filename.split(" ").join("%20");
            const imageUrl = await FileUploadFunction(
              functionContext,
              requestContext,
              image,
              "UserResume"
            );
            imagetobeUploaded.push(imageUrl);
          }
        }
      }

      const newimage = JSON.stringify(imagetobeUploaded);

      let addUserResumeDBResult = await databaseHelper.addUserResumeDb(
        functionContext,
        requestContext,
        newimage
      );

      addUserResumeResponse(functionContext, addUserResumeDBResult);
    }
  } catch (erraddUserResume) {
    if (!erraddUserResume.ErrorMessage && !erraddUserResume.ErrorCode) {
      logger.logInfo(
        `addUserResumeDB() :: Error :: ${JSON.stringify(erraddUserResume)}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addUserResumeDB() :: Error :: ${JSON.stringify(erraddUserResume)}`
    );
    addUserResumeResponse(functionContext, null);
  }
};

const addUserResumeResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`addUserResumeResponse() invoked!`);

  let addUserResumeRes = new coreRequestModel.addUserResumeResponse();

  addUserResumeRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addUserResumeRes.Error = functionContext.error;
    addUserResumeRes.Details = null;
  } else {
    addUserResumeRes.Error = null;
    addUserResumeRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, addUserResumeRes);

  logger.logInfo(
    ` addUserResumeResponse response :: ${JSON.stringify(addUserResumeRes)}`
  );

  logger.logInfo(` addUserResumeResponse completed!`);
};

module.exports.saveUnsaveJobs = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let saveUnsaveJobsRequest = new coreRequestModel.saveUnsaveJobsRequest(req);

  logger.logInfo(
    `saveUnsaveJobs() :: Request Object :: ${saveUnsaveJobsRequest}`
  );

  let requestContext = {
    ...saveUnsaveJobsRequest,
  };

  let validateRequest = joiValidationModel.saveUnsaveJobs(
    saveUnsaveJobsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `saveUnsaveJobs() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    saveUnsaveJobsResponse(functionContext, null);
    return;
  }

  try {
    let saveUnsaveJobsDBResult = await databaseHelper.saveUnsaveJobsDb(
      functionContext,
      requestContext
    );

    saveUnsaveJobsResponse(functionContext, saveUnsaveJobsDBResult);
  } catch (errsaveUnsaveJobs) {
    if (!errsaveUnsaveJobs.ErrorMessage && !errsaveUnsaveJobs.ErrorCode) {
      logger.logInfo(
        `saveUnsaveJobsDB() :: Error :: ${JSON.stringify(errsaveUnsaveJobs)}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `saveUnsaveJobsDB() :: Error :: ${JSON.stringify(errsaveUnsaveJobs)}`
    );
    saveUnsaveJobsResponse(functionContext, null);
  }
};

const saveUnsaveJobsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`saveUnsaveJobsResponse() invoked!`);

  let saveUnsaveJobsRes = new coreRequestModel.saveUnsaveJobsResponse();

  saveUnsaveJobsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    saveUnsaveJobsRes.Error = functionContext.error;
    saveUnsaveJobsRes.Details = null;
  } else {
    saveUnsaveJobsRes.Error = null;
    saveUnsaveJobsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, saveUnsaveJobsRes);

  logger.logInfo(
    ` saveUnsaveJobsResponse response :: ${JSON.stringify(saveUnsaveJobsRes)}`
  );

  logger.logInfo(` saveUnsaveJobsResponse completed!`);
};

module.exports.fetchSavedJobs = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`forgotUserPassword() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let fetchSavedJobsRequest = new coreRequestModel.fetchSavedJobsRequest(req);

  logger.logInfo(
    `fetchSavedJobs() :: Request Object :: ${fetchSavedJobsRequest}`
  );

  let requestContext = {
    ...fetchSavedJobsRequest,
  };

  let validateRequest = joiValidationModel.fetchSavedJobs(
    fetchSavedJobsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchSavedJobs() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchSavedJobsResponse(functionContext, null);
    return;
  }

  try {
    let fetchSavedJobsDBResult = await databaseHelper.fetchSavedJobsDb(
      functionContext,
      requestContext
    );

    fetchSavedJobsResponse(functionContext, fetchSavedJobsDBResult);
  } catch (errfetchSavedJobs) {
    if (!errfetchSavedJobs.ErrorMessage && !errfetchSavedJobs.ErrorCode) {
      logger.logInfo(
        `fetchSavedJobsDB() :: Error :: ${JSON.stringify(errfetchSavedJobs)}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchSavedJobsDB() :: Error :: ${JSON.stringify(errfetchSavedJobs)}`
    );
    fetchSavedJobsResponse(functionContext, null);
  }
};

const fetchSavedJobsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`fetchSavedJobsResponse() invoked!`);

  let fetchSavedJobsRes = new coreRequestModel.fetchSavedJobsResponse();

  fetchSavedJobsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchSavedJobsRes.Error = functionContext.error;
    fetchSavedJobsRes.Details = null;
  } else {
    fetchSavedJobsRes.Error = null;
    fetchSavedJobsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, fetchSavedJobsRes);

  logger.logInfo(
    ` fetchSavedJobsResponse response :: ${JSON.stringify(fetchSavedJobsRes)}`
  );

  logger.logInfo(` fetchSavedJobsResponse completed!`);
};

module.exports.appliedJobs = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`appliedJobs() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let appliedJobsRequest = new coreRequestModel.appliedJobsRequest(req);

  logger.logInfo(`appliedJobs() :: Request Object :: ${appliedJobsRequest}`);

  let requestContext = {
    ...appliedJobsRequest,
  };

  let validateRequest = joiValidationModel.appliedJobs(appliedJobsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `appliedJobs() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    appliedJobsResponse(functionContext, null);
    return;
  }

  try {
    let appliedJobsDBResult = await databaseHelper.applyJobsDb(
      functionContext,
      requestContext
    );

    let fetchResumeDB = await databaseHelper.fetchUserResumeDb(
      functionContext,
      requestContext
    );

    console.log("fetchResumeDB", fetchResumeDB);

    let fetchVendorBasedOnJobIdDb =
      await databaseHelper.fetchVendorBasedOnJobIdDb(
        functionContext,
        requestContext
      );

    let notifyVendors = await notifyUsers(
      functionContext,
      fetchResumeDB,
      fetchVendorBasedOnJobIdDb
    );

    console.log(notifyVendors);

    appliedJobsResponse(functionContext, appliedJobsDBResult);
  } catch (errappliedJobs) {
    if (!errappliedJobs.ErrorMessage && !errappliedJobs.ErrorCode) {
      logger.logInfo(
        `appliedJobsDB() :: Error :: ${JSON.stringify(errappliedJobs)}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `appliedJobsDB() :: Error :: ${JSON.stringify(errappliedJobs)}`
    );
    appliedJobsResponse(functionContext, null);
  }
};

const appliedJobsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`appliedJobsResponse() invoked!`);

  let appliedJobsRes = new coreRequestModel.appliedJobsResponse();

  appliedJobsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    appliedJobsRes.Error = functionContext.error;
    appliedJobsRes.Details = null;
  } else {
    appliedJobsRes.Error = null;
    appliedJobsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, appliedJobsRes);

  logger.logInfo(
    ` appliedJobsResponse response :: ${JSON.stringify(appliedJobsRes)}`
  );

  logger.logInfo(` appliedJobsResponse completed!`);
};

module.exports.fetchAppliedJobs = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchAppliedJobs() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let fetchAppliedJobsRequest = new coreRequestModel.fetchAppliedJobsRequest(
    req
  );

  logger.logInfo(
    `fetchAppliedJobs() :: Request Object :: ${fetchAppliedJobsRequest}`
  );

  let requestContext = {
    ...fetchAppliedJobsRequest,
  };

  let validateRequest = joiValidationModel.fetchAppliedJobs(
    fetchAppliedJobsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchAppliedJobs() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchAppliedJobsResponse(functionContext, null);
    return;
  }

  try {
    let fetchAppliedJobsDBResult = await databaseHelper.fetchAppliedJobsDb(
      functionContext,
      requestContext
    );

    fetchAppliedJobsResponse(functionContext, fetchAppliedJobsDBResult);
  } catch (errfetchAppliedJobs) {
    if (!errfetchAppliedJobs.ErrorMessage && !errfetchAppliedJobs.ErrorCode) {
      logger.logInfo(
        `fetchAppliedJobsDB() :: Error :: ${JSON.stringify(
          errfetchAppliedJobs
        )}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchAppliedJobsDB() :: Error :: ${JSON.stringify(errfetchAppliedJobs)}`
    );
    fetchAppliedJobsResponse(functionContext, null);
  }
};

const fetchAppliedJobsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`fetchAppliedJobsResponse() invoked!`);

  let fetchAppliedJobsRes = new coreRequestModel.fetchAppliedJobsResponse();

  fetchAppliedJobsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchAppliedJobsRes.Error = functionContext.error;
    fetchAppliedJobsRes.Details = null;
  } else {
    fetchAppliedJobsRes.Error = null;
    fetchAppliedJobsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, fetchAppliedJobsRes);

  logger.logInfo(
    ` fetchAppliedJobsResponse response :: ${JSON.stringify(
      fetchAppliedJobsRes
    )}`
  );

  logger.logInfo(` fetchAppliedJobsResponse completed!`);
};

module.exports.fetchEducationList = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchEducationList invoked()!!`);

  let functionContext = {
    requestType: requestType.fetchEducationList,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  try {
    let fetchEducationListDBResult = await databaseHelper.fetchEducationListDb(
      functionContext
    );

    fetchEducationListResponse(functionContext, fetchEducationListDBResult);
  } catch (errfetchEducationListDb) {
    if (
      !errfetchEducationListDb.ErrorMessage &&
      !errfetchEducationListDb.ErrorCode
    ) {
      logger.logInfo(
        `fetchEducationListDBResult() :: Error :: ${errfetchEducationListDb}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchEducationListDBResult() :: Error :: ${JSON.stringify(
        errfetchEducationListDb
      )}`
    );
    fetchEducationListResponse(functionContext, null);
  }
};

//Recently added All Response
const fetchEducationListResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchEducationListResponse() invoked!`);

  let fetchEducationListResponse =
    new coreRequestModel.fetchEducationListResponse();

  fetchEducationListResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchEducationListResponse.Error = functionContext.error;
    fetchEducationListResponse.Details = null;
  } else {
    fetchEducationListResponse.Error = null;
    fetchEducationListResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchEducationListResponse);

  logger.logInfo(
    `fetchEducationListResponse response :: ${JSON.stringify(
      fetchEducationListResponse
    )}`
  );

  logger.logInfo(`fetchEducationListResponse() completed`);
};

module.exports.fetchJobRoles = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchJobRoles invoked()!!`);

  let functionContext = {
    requestType: requestType.fetchJobRoles,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  try {
    let fetchJobRolesDBResult = await databaseHelper.fetchJobRolesDb(
      functionContext
    );

    fetchJobRolesResponse(functionContext, fetchJobRolesDBResult);
  } catch (errfetchJobRolesDb) {
    if (!errfetchJobRolesDb.ErrorMessage && !errfetchJobRolesDb.ErrorCode) {
      logger.logInfo(
        `fetchJobRolesDBResult() :: Error :: ${errfetchJobRolesDb}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchJobRolesDBResult() :: Error :: ${JSON.stringify(
        errfetchJobRolesDb
      )}`
    );
    fetchJobRolesResponse(functionContext, null);
  }
};

//Recently added All Response
const fetchJobRolesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchJobRolesResponse() invoked!`);

  let fetchJobRolesResponse = new coreRequestModel.fetchJobRolesResponse();

  fetchJobRolesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchJobRolesResponse.Error = functionContext.error;
    fetchJobRolesResponse.Details = null;
  } else {
    fetchJobRolesResponse.Error = null;
    fetchJobRolesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchJobRolesResponse);

  logger.logInfo(
    `fetchJobRolesResponse response :: ${JSON.stringify(fetchJobRolesResponse)}`
  );

  logger.logInfo(`fetchJobRolesResponse() completed`);
};

module.exports.fetchJobNotifications = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchJobNotifications() invoked!!`);

  let functionContext = {
    res: res,
    // requestType: requestType.FORGOTUSERPASSWORD,
    requestId: res.apiContext.requestId,
    userType: res.apiContext.userType,
    error: null,
    userRef: null,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss.SSS"),
  };

  let fetchJobNotifications = new coreRequestModel.fetchJobNotificationsRequest(
    req
  );

  logger.logInfo(
    `fetchJobNotifications() :: Request Object :: ${fetchJobNotifications}`
  );

  let requestContext = {
    ...fetchJobNotifications,
  };

  let validateRequest = joiValidationModel.fetchJobNotifications(
    fetchJobNotifications
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchJobNotifications() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchJobNotificationsResponse(functionContext, null);
    return;
  }

  try {
    let fetchJobNotificationsDBResult =
      await databaseHelper.fetchJobNotificationsDb(
        functionContext,
        requestContext
      );

    fetchSavedJobsResponse(functionContext, fetchJobNotificationsDBResult);
  } catch (errFetchJobNotifications) {
    if (
      !errFetchJobNotifications.ErrorMessage &&
      !errFetchJobNotifications.ErrorCode
    ) {
      logger.logInfo(
        `fetchJobNotificationsDBResult() :: Error :: ${JSON.stringify(
          errFetchJobNotifications
        )}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchJobNotificationsDBResult() :: Error :: ${JSON.stringify(
        errfetchSavedJobs
      )}`
    );
    fetchJobNotificationsResponse(functionContext, null);
  }
};

const fetchJobNotificationsResponse = (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo(`fetchJobNotificationsResponse() invoked!`);

  let fetchJobNotificationsRes =
    new coreRequestModel.fetchJobNotificationsResponse();

  fetchJobNotificationsRes.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchJobNotificationsRes.Error = functionContext.error;
    fetchJobNotificationsRes.Details = null;
  } else {
    fetchJobNotificationsRes.Error = null;
    fetchJobNotificationsRes.Details = resolvedResult;
  }

  appLib.SendHttpResponse(functionContext, fetchJobNotificationsRes);

  logger.logInfo(
    ` fetchJobNotificationsResponse :: ${JSON.stringify(
      fetchJobNotificationsRes
    )}`
  );

  logger.logInfo(` fetchJobNotificationsResponse completed!`);
};

module.exports.deleteJobNotifications = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deleteJobs() invoked()!!`);

  let functionContext = {
    requestType: requestType.ADCOMPANYDETAILS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deleteJobNotificationsRequest =
    new coreRequestModel.deleteJobNotificationsRequest(req);

  logger.logInfo(
    `deleteJobNotificationsRequest() :: Request Object :: ${deleteJobNotificationsRequest}`
  );

  let requestContext = {
    ...deleteJobNotificationsRequest,
  };

  let validateRequest = joiValidationModel.deleteJobNotifications(
    deleteJobNotificationsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deleteJobNotificationsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
    if (requestContext?.NotificationRef?.length > 0) {
      requestContext?.NotificationRef?.forEach(async (element) => {
        let deleteJobNotificationsRequestDBResult =
          await databaseHelper.deleteJobNotificationsDB(
            functionContext,
            requestContext,
            element
          );
      });

      deleteJobNotificationResponse(functionContext, "Notification Deleted");
    } else if (requestContext?.NotificationRef === null) {
      let deleteJobNotificationsRequestDBResult =
        await databaseHelper.deleteJobNotificationsDB(
          functionContext,
          requestContext
        );

      deleteJobNotificationResponse(
        functionContext,
        "All Notifications Deleted"
      );
    }
  } catch (errdeleteJobs) {
    if (!errdeleteJobs.ErrorMessage && !errdeleteJobs.ErrorCode) {
      logger.logInfo(
        `deleteJobNotificationsRequestDBResult() :: Error :: ${errdeleteJobs}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deleteJobsDBResult() :: Error :: ${JSON.stringify(errdeleteJobs)}`
    );
    deleteJobNotificationResponse(functionContext, null);
  }
};

//delete jobs  Response

const deleteJobNotificationResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deleteJobsResponse() invoked!`);

  let deleteJobNotificationResponse =
    new coreRequestModel.deleteJobNotificationsResponse();

  deleteJobNotificationResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deleteJobNotificationResponse.Error = functionContext.error;
    deleteJobNotificationResponse.Details = null;
  } else {
    deleteJobNotificationResponse.Error = null;
    deleteJobNotificationResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deleteJobNotificationResponse);

  logger.logInfo(
    `deleteJobNotificationResponse response :: ${JSON.stringify(
      deleteJobNotificationResponse
    )}`
  );

  logger.logInfo(`deleteJobNotificationResponse() completed`);
};

//Fetch User
module.exports.recommendedList = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`FetchUser invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHUSER,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let recommendedListRequest = new coreRequestModel.recommendedListRequest(req);

  logger.logInfo(
    `recommendedListRequest() :: Request Object :: ${recommendedListRequest}`
  );

  let requestContext = {
    ...recommendedListRequest,
  };
  let validateRequest = joiValidationModel.recommendedList(
    recommendedListRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `recommendedListRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    recommendedListResponse(functionContext, null);

    return;
  }

  try {
    let recommendedListDBResult = await databaseHelper.recommendedListDb(
      functionContext,
      requestContext
    );

    let savedDBResult = await databaseHelper.fetchSavedJobsDb(
      functionContext,
      requestContext
    );

    let recommendedListArr = [];

    recommendedListDBResult.forEach((el1) => {
      recommendedListArr.push({ ...el1, SavedJob: 0, SavedJobRef: null });
    });

    recommendedListArr.forEach((element) => {
      savedDBResult?.forEach((el2) => {
        if (element.Id === el2.JobId) {
          element.SavedJob = 1;
          element.SavedJobRef = el2.SavedJobRef;
        }
      });
    });

    recommendedListResponse(functionContext, recommendedListArr);
  } catch (errFetchUser) {
    if (!errFetchUser.ErrorMessage && !errFetchUser.ErrorCode) {
      logger.logInfo(`recommendedListDBResult() :: Error :: ${errFetchUser}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `recommendedListDBResult() :: Error :: ${JSON.stringify(errFetchUser)}`
    );
    recommendedListResponse(functionContext, null);
  }
};

//Fetch User Response
const recommendedListResponse = (
  functionContext,
  resolvedResult,
  resolvedResult1
) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchUserResponse() invoked!`);

  let fetchUserResponse = new coreRequestModel.fetchUserResponse();

  fetchUserResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchUserResponse.Error = functionContext.error;
    fetchUserResponse.Details = null;
  } else {
    fetchUserResponse.Error = null;
    fetchUserResponse.Details = resolvedResult;
    fetchUserResponse.JobSeekerDetails = resolvedResult1;
  }
  appLib.SendHttpResponse(functionContext, fetchUserResponse);

  logger.logInfo(
    `fetchUserResponse response :: ${JSON.stringify(fetchUserResponse)}`
  );

  logger.logInfo(`fetchUserResponse() completed`);
};
