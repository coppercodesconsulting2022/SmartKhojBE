const databaseHelper = require("../databasehelper/admin");
const coreRequestModel = require("../models/serviceModel/admin");
const errorModel = require("../models/serviceModel/error");
const constant = require("../common/constant");
const appLib = require("applib");
const momentTimezone = require("moment-timezone");
const requestType = constant.RequestType;
const joiValidationModel = require("../models/validationModel/admin");
const fileConfiguration = require("../common/settings").FileConfiguration;
const fs = require("fs");
const AWS = require("aws-sdk");

//Add Categories Request
module.exports.addCategories = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`AddCategories invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDCATEGORIES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addCategoriesDetailsRequest = new coreRequestModel.addCategoriesRequest(
    req
  );

  logger.logInfo(
    `AddCategories() :: Request Object :: ${addCategoriesDetailsRequest}`
  );

  let requestContext = {
    ...addCategoriesDetailsRequest,
    ImageURL: null,
  };

  // console.log("requestContext", requestContext);

  let validateRequest = joiValidationModel.addCategories(
    addCategoriesDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addCategoriesDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    // addCategoriesResponse(functionContext, null);
    // return;
  }

  try {
    if (req.hasOwnProperty("files")) {
      let toBeUploaded = [];
      for (let count = 0; count < req.files.length; count++) {
        let file = req.files[count];
        if (file.hasOwnProperty("filename")) {
          if (file.filename) {
            toBeUploaded[count] = fs.readFileSync(file.path);

            requestContext.ImageURL = file.filename.split(" ").join("%20");
          }
        }
      }
      const ImageUrl = await CategoriesFileUploadFunction(
        functionContext,
        requestContext,
        toBeUploaded
      );

      let addCategoriesDBResult = await databaseHelper.addCategoriesDb(
        functionContext,
        requestContext,
        ImageUrl
      );

      addCategoriesResponse(functionContext, addCategoriesDBResult);
    }
  } catch (errAddCategories) {
    if (!errAddCategories.ErrorMessage && !errAddCategories.ErrorCode) {
      logger.logInfo(`addCategoriesDBResult() :: Error :: ${errAddCategories}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addCategoriesDBResult() :: Error :: ${JSON.stringify(errAddCategories)}`
    );
    addCategoriesResponse(functionContext, null);
  }
};

//Add Categories Response
const addCategoriesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addCategoriesResponse() invoked!`);

  let addCategoriesResponse = new coreRequestModel.addCategoriesResponse();

  addCategoriesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addCategoriesResponse.Error = functionContext.error;
    addCategoriesResponse.Details = null;
  } else {
    addCategoriesResponse.Error = null;
    addCategoriesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addCategoriesResponse);

  logger.logInfo(
    `addCategoriesResponse  response:: ${JSON.stringify(addCategoriesResponse)}`
  );

  logger.logInfo(`addCategoriesResponse() completed`);
};

async function CategoriesFileUploadFunction(
  functionContext,
  resolvedResult,
  files
) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  const params = [];
  files.map((f) => {
    params.push({
      Bucket: process.env.DO_SPACES_NAME,
      Key: `Categories-Icons/${resolvedResult.ImageURL}`,
      Body: f,
      ACL: "public-read",
    });
  });
  try {
    const responses = await Promise.all(
      params.map((param) => s3.upload(param).promise())
    );
    const storedlocation = responses[0]?.Location;
    return storedlocation;
  } catch (err) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);

    functionContext.error = new errorModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,

      constant.ErrorCode.ApplicationError
    );

    throw functionContext.error;
  }
}

//Add Sub Categories
module.exports.addSubCategories = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`Add Sub Catergories invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDSUBCATEGORIES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addSubCategoriesDetailsRequest =
    new coreRequestModel.addSubCategoriesRequest(req);

  logger.logInfo(
    `AddSubCategories() :: Request Object :: ${addSubCategoriesDetailsRequest}`
  );

  let requestContext = {
    ...addSubCategoriesDetailsRequest,
  };

  let validateRequest = joiValidationModel.addSubCategories(
    addSubCategoriesDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addSubCategoriesDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addSubCategoriesResponse(functionContext, null);
    return;
  }

  try {
    let addSubCategoriesDBResult = await databaseHelper.addSubCategoriesDb(
      functionContext,
      requestContext
    );

    addSubCategoriesResponse(functionContext, addSubCategoriesDBResult);
  } catch (errAddSubCategories) {
    if (!errAddSubCategories.ErrorMessage && !errAddSubCategories.ErrorCode) {
      logger.logInfo(
        `addSubCategoriesDBResult() :: Error :: ${errAddSubCategories}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addSubCategoriesDBResult() :: Error :: ${JSON.stringify(
        errAddSubCategories
      )}`
    );
    addSubCategoriesResponse(functionContext, null);
  }
};

//Add Sub Categories Response
const addSubCategoriesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addSubCategoriesResponse() invoked!`);

  let addSubCategoriesResponse =
    new coreRequestModel.addSubCategoriesResponse();

  addSubCategoriesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addSubCategoriesResponse.Error = functionContext.error;
    addSubCategoriesResponse.Details = null;
  } else {
    addSubCategoriesResponse.Error = null;
    addSubCategoriesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addSubCategoriesResponse);

  logger.logInfo(
    `addSubCategoriesResponse response :: ${JSON.stringify(
      addSubCategoriesResponse
    )}`
  );

  logger.logInfo(`addSubCategoriesResponse() completed`);
};

//Add Popular Service
module.exports.addPopularServices = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addPopularServices invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDPOPULARESERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addPopularServicesDetailsRequest =
    new coreRequestModel.addPopularServicesRequest(req);

  logger.logInfo(
    `AddCategories() :: Request Object :: ${addPopularServicesDetailsRequest}`
  );

  let requestContext = {
    ...addPopularServicesDetailsRequest,
    ImageURL: null,
  };

  let validateRequest = joiValidationModel.addPopularServices(
    addPopularServicesDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addPopularServicesDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addPopularServicesResponse(functionContext, null);
    return;
  }

  try {
    if (req.files.length > 0) {
      if (req.hasOwnProperty("files")) {
        var toBeUploaded = [];
        for (let count = 0; count < req.files.length; count++) {
          var file = req.files[count];
          if (file.hasOwnProperty("filename")) {
            if (file.filename) {
              toBeUploaded[count] = fs.readFileSync(file.path);

              requestContext.ImageURL = file.filename.split(" ").join("%20");
              //process.env.DO_SPACES_FOR_SPACES +file.filename.split(" ").join("%20");
            }
          }
        }
        const ImageUrl = await AddPopularCategoriesFileUploadFunction(
          functionContext,
          requestContext,
          toBeUploaded
        );

        let addPopularServicesDBResult =
          await databaseHelper.addPopularServicesDb(
            functionContext,
            requestContext,
            ImageUrl
          );

        addPopularServicesResponse(functionContext, addPopularServicesDBResult);
      }
    } else {
      let addVendorDBResult = await databaseHelper.addPopularServicesDb(
        functionContext,
        requestContext,
        requestContext.ImageURL
        //ImageURL
      );

      addPopularServicesResponse(functionContext, addVendorDBResult);
    }
  } catch (errAddPopularServices) {
    if (
      !errAddPopularServices.ErrorMessage &&
      !errAddPopularServices.ErrorCode
    ) {
      logger.logInfo(
        `addPopularServicesDBResult() :: Error :: ${errAddPopularServices}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addPopularServicesDBResult() :: Error :: ${JSON.stringify(
        errAddPopularServices
      )}`
    );
    addPopularServicesResponse(functionContext, null);
  }
};

// //Add Populare Services
// module.exports.addPopularServices = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`addPopularServices invoked()!!`);

//   let functionContext = {
//     requestType: requestType.ADDPOPULARESERVICES,
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   let addPopularServicesDetailsRequest =
//     new coreRequestModel.addPopularServicesRequest(req);

//   logger.logInfo(
//     `AddPopularServices() :: Request Object :: ${addPopularServicesDetailsRequest}`
//   );

//   let requestContext = {
//     ...addPopularServicesDetailsRequest,

//   };

//   let validateRequest = joiValidationModel.addPopularServices(
//     addPopularServicesDetailsRequest
//   );

//   if (validateRequest.error) {
//     functionContext.error = new errorModel.ErrorModel(
//       validateRequest.error.details[0]["message"],
//       constant.ErrorCode.Invalid_Request
//     );
//     logger.logInfo(
//       `addPopularServicesDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
//         validateRequest
//       )}`
//     );
//     addPopularServicesResponse(functionContext, null);
//     return;
//   }

//   try {
//     let addPopularServicesDBResult = await databaseHelper.addPopularServicesDb(
//       functionContext,
//       requestContext
//     );

//     addPopularServicesResponse(functionContext, addPopularServicesDBResult);
//   } catch (errAddPopularServices) {
//     if (
//       !errAddPopularServices.ErrorMessage &&
//       !errAddPopularServices.ErrorCode
//     ) {
//       logger.logInfo(
//         `addPopularServicesDBResult() :: Error :: ${errAddPopularServices}`
//       );
//       functionContext.error = new errorModel.ErrorModel(
//         constant.ErrorMessage.ApplicationError,
//         constant.ErrorCode.ApplicationError
//       );
//     }
//     logger.logInfo(
//       `addPopularServicesDBResult() :: Error :: ${JSON.stringify(
//         errAddPopularServices
//       )}`
//     );
//     addPopularServicesResponse(functionContext, null);
//   }
// };

//Add Popular services  Response
const addPopularServicesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addPopularServicesResponse() invoked!`);

  let addPopularServicesResponse =
    new coreRequestModel.addPopularServicesResponse();

  addPopularServicesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addPopularServicesResponse.Error = functionContext.error;
    addPopularServicesResponse.Details = null;
  } else {
    addPopularServicesResponse.Error = null;
    addPopularServicesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addPopularServicesResponse);

  logger.logInfo(
    `addPopularServicesResponse response :: ${JSON.stringify(
      addPopularServicesResponse
    )}`
  );

  logger.logInfo(`addPopularServicesResponse() completed`);
};
//file upload for add popular
async function AddPopularCategoriesFileUploadFunction(
  functionContext,
  resolvedResult,
  files
) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  const params = [];
  files.map((f) => {
    params.push({
      Bucket: process.env.DO_SPACES_NAME,
      Key: `Categories-Icons/${resolvedResult.ImageURL}`,
      Body: f,
      ACL: "public-read",
    });
  });
  try {
    const responses = await Promise.all(
      params.map((param) => s3.upload(param).promise())
    );
    const storedlocation = responses[0].Location;
    return storedlocation;
  } catch (err) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);

    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,

      constant.ErrorCode.ApplicationError
    );

    throw functionContext.error;
  }
}

//end file upload for add popular

//Add Trending Services
module.exports.addTrendingServices = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addTrendingServices invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDTRENDINGSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addTrendindServicesDetailsRequest =
    new coreRequestModel.addTrendingServicesRequest(req);

  logger.logInfo(
    `AddCategories() :: Request Object :: ${addTrendindServicesDetailsRequest}`
  );

  let requestContext = {
    ...addTrendindServicesDetailsRequest,
    ImageURL: null,
  };

  let validateRequest = joiValidationModel.addTrendingServices(
    addTrendindServicesDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addTrendindServicesDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addTrendingServicesResponse(functionContext, null);
    return;
  }

  try {
    if (req.files.length > 0) {
      if (req.hasOwnProperty("files")) {
        var toBeUploaded = [];
        for (let count = 0; count < req.files.length; count++) {
          var file = req.files[count];
          if (file.hasOwnProperty("filename")) {
            if (file.filename) {
              toBeUploaded[count] = fs.readFileSync(file.path);

              requestContext.ImageURL = file.filename.split(" ").join("%20");
              //process.env.DO_SPACES_FOR_SPACES +file.filename.split(" ").join("%20");
            }
          }
        }
        const ImageUrl = await AddTrendingCategoriesFileUploadFunction(
          functionContext,
          requestContext,
          toBeUploaded
        );

        let addTrendingServicesDBResult =
          await databaseHelper.addTrendingServicesDb(
            functionContext,
            requestContext,
            ImageUrl
          );

        addTrendingServicesResponse(
          functionContext,
          addTrendingServicesDBResult
        );
      }
    } else {
      let addVendorDBResult = await databaseHelper.addTrendingServicesDb(
        functionContext,
        requestContext,
        requestContext.ImageURL
        //ImageURL
      );

      addTrendingServicesResponse(functionContext, addVendorDBResult);
    }
  } catch (errAddTrendingServices) {
    if (
      !errAddTrendingServices.ErrorMessage &&
      !errAddTrendingServices.ErrorCode
    ) {
      logger.logInfo(
        `addTrendingServicesDBResult() :: Error :: ${errAddTrendingServices}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addTrendingServicesDBResult() :: Error :: ${JSON.stringify(
        errAddTrendingServices
      )}`
    );
    addTrendingServicesResponse(functionContext, null);
  }
};
// module.exports.addTrendingServices = async (req, res) => {
//   let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

//   logger.logInfo(`addTrendingServices invoked()!!`);

//   let functionContext = {
//     requestType: requestType.ADDTRENDINGSERVICES,
//     requestId: res.apiContext.requestId,
//     error: null,
//     res: res,
//     logger: logger,
//     currentTs: momentTimezone
//       .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss "),
//   };

//   let addTrendindServicesDetailsRequest =
//     new coreRequestModel.addTrendingServicesRequest(req);

//   logger.logInfo(
//     `AddTrendingServices() :: Request Object :: ${addTrendindServicesDetailsRequest}`
//   );

//   let requestContext = {
//     ...addTrendindServicesDetailsRequest,
//   };

//   let validateRequest = joiValidationModel.addTrendingServices(
//     addTrendindServicesDetailsRequest
//   );

//   if (validateRequest.error) {
//     functionContext.error = new errorModel.ErrorModel(
//       validateRequest.error.details[0]["message"],
//       constant.ErrorCode.Invalid_Request
//     );
//     logger.logInfo(
//       `addTrendindServicesDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
//         validateRequest
//       )}`
//     );
//     addTrendingServicesResponse(functionContext, null);
//     return;
//   }

//   try {
//     let addTrendingServicesDBResult =
//       await databaseHelper.addTrendingServicesDb(
//         functionContext,
//         requestContext
//       );

//     addTrendingServicesResponse(functionContext, addTrendingServicesDBResult);
//   } catch (errAddTrendingServices) {
//     if (
//       !errAddTrendingServices.ErrorMessage &&
//       !errAddTrendingServices.ErrorCode
//     ) {
//       logger.logInfo(
//         `addTrendingServicesDBResult() :: Error :: ${errAddTrendingServices}`
//       );
//       functionContext.error = new errorModel.ErrorModel(
//         constant.ErrorMessage.ApplicationError,
//         constant.ErrorCode.ApplicationError
//       );
//     }
//     logger.logInfo(
//       `addTrendingServicesDBResult() :: Error :: ${JSON.stringify(
//         errAddTrendingServices
//       )}`
//     );
//     addTrendingServicesResponse(functionContext, null);
//   }
// };

//Add Trending services  Response
const addTrendingServicesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addTrendingServicesResponse() invoked!`);

  let addTrendingServicesResponse =
    new coreRequestModel.addTrendingServicesResponse();

  addTrendingServicesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addTrendingServicesResponse.Error = functionContext.error;
    addTrendingServicesResponse.Details = null;
  } else {
    addTrendingServicesResponse.Error = null;
    addTrendingServicesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addTrendingServicesResponse);

  logger.logInfo(
    `addTrendingServicesResponse response :: ${JSON.stringify(
      addTrendingServicesResponse
    )}`
  );

  logger.logInfo(`addTrendingServicesResponse() completed`);
};
//file upload for add popular
async function AddTrendingCategoriesFileUploadFunction(
  functionContext,
  resolvedResult,
  files
) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  const params = [];
  files.map((f) => {
    params.push({
      Bucket: process.env.DO_SPACES_NAME,
      Key: `Categories-Icons/${resolvedResult.ImageURL}`,
      Body: f,
      ACL: "public-read",
    });
  });
  try {
    const responses = await Promise.all(
      params.map((param) => s3.upload(param).promise())
    );
    const storedlocation = responses[0].Location;
    return storedlocation;
  } catch (err) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);

    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,

      constant.ErrorCode.ApplicationError
    );

    throw functionContext.error;
  }
}

//end file upload for add popular
//block-unblock account
module.exports.blockUnblockAccount = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`blockUnblockAccount invoked()!!`);

  let functionContext = {
    requestType: requestType.BLOCKUNBLOCKACCOUNT,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let blockUnblockAccountDetailsRequest =
    new coreRequestModel.blockUnblockAccountRequest(req);

  logger.logInfo(
    `blockUnblockAccount() :: Request Object :: ${blockUnblockAccountDetailsRequest}`
  );

  let requestContext = {
    ...blockUnblockAccountDetailsRequest,
  };

  let validateRequest = joiValidationModel.blockUnblockAccount(
    blockUnblockAccountDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `blockUnblockAccountDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    blockUnblockAccountResponse(functionContext, null);
    return;
  }

  try {
    let blockUnblockAccountDBResult =
      await databaseHelper.blockUnblockAccountDb(
        functionContext,
        requestContext
      );

    blockUnblockAccountResponse(functionContext, blockUnblockAccountDBResult);
  } catch (errblockUnblockAccount) {
    if (
      !errblockUnblockAccount.ErrorMessage &&
      !errblockUnblockAccount.ErrorCode
    ) {
      logger.logInfo(
        `blockUnblockAccountDBResult() :: Error :: ${errblockUnblockAccount}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `blockUnblockAccountDBResult() :: Error :: ${JSON.stringify(
        errblockUnblockAccount
      )}`
    );
    blockUnblockAccountResponse(functionContext, null);
  }
};

//Block Unblock   Response
const blockUnblockAccountResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`blockUnblockAccountResponse() invoked!`);

  let blockUnblockAccountResponse =
    new coreRequestModel.blockUnblockAccountResponse();

  blockUnblockAccountResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    blockUnblockAccountResponse.Error = functionContext.error;
    blockUnblockAccountResponse.Details = null;
  } else {
    blockUnblockAccountResponse.Error = null;
    blockUnblockAccountResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, blockUnblockAccountResponse);

  logger.logInfo(
    `blockUnblockAccountResponse response :: ${JSON.stringify(
      blockUnblockAccountResponse
    )}`
  );

  logger.logInfo(`blockUnblockAccountResponse() completed`);
};

//delete Review

module.exports.deleteReview = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deleteReview invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEREVIEW,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deleteReviewDetailsRequest = new coreRequestModel.deleteReviewRequest(
    req
  );

  logger.logInfo(
    `deleteReview() :: Request Object :: ${deleteReviewDetailsRequest}`
  );

  let requestContext = {
    ...deleteReviewDetailsRequest,
  };

  let validateRequest = joiValidationModel.deleteReview(
    deleteReviewDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deleteReviewDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    deleteReviewResponse(functionContext, null);
    return;
  }

  try {
    let deleteReviewDBResult = await databaseHelper.deleteReviewDb(
      functionContext,
      requestContext
    );

    deleteReviewResponse(functionContext, deleteReviewDBResult);
  } catch (errdeleteReview) {
    if (!errdeleteReview.ErrorMessage && !errdeleteReview.ErrorCode) {
      logger.logInfo(`deleteReviewDBResult() :: Error :: ${errdeleteReview}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deleteReviewDBResult() :: Error :: ${JSON.stringify(errdeleteReview)}`
    );
    deleteReviewResponse(functionContext, null);
  }
};

//delete Review   Response
const deleteReviewResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deleteReviewResponse() invoked!`);

  let deleteReviewResponse = new coreRequestModel.deleteReviewResponse();

  deleteReviewResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deleteReviewResponse.Error = functionContext.error;
    deleteReviewResponse.Details = null;
  } else {
    deleteReviewResponse.Error = null;
    deleteReviewResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deleteReviewResponse);

  logger.logInfo(
    `deleteReviewResponse response :: ${JSON.stringify(deleteReviewResponse)}`
  );

  logger.logInfo(`deleteReviewResponse() completed`);
};

//approve reject vendors

module.exports.approveRejectVendors = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`approveRejectVendors invoked()!!`);

  let functionContext = {
    requestType: requestType.APPROVEREJECTVENDORS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let approveRejectVendorsDetailsRequest =
    new coreRequestModel.approveRejectVendorsRequest(req);

  logger.logInfo(
    `approveRejectVendors() :: Request Object :: ${approveRejectVendorsDetailsRequest}`
  );

  let requestContext = {
    ...approveRejectVendorsDetailsRequest,
  };

  let validateRequest = joiValidationModel.approveRejectVendors(
    approveRejectVendorsDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `approveRejectVendorsDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    approveRejectVendorsResponse(functionContext, null);
    return;
  }

  try {
    let approveRejectVendorsDBResult =
      await databaseHelper.approveRejectVendorsDb(
        functionContext,
        requestContext
      );

    approveRejectVendorsResponse(functionContext, approveRejectVendorsDBResult);
  } catch (errapproveRejectVendors) {
    if (
      !errapproveRejectVendors.ErrorMessage &&
      !errapproveRejectVendors.ErrorCode
    ) {
      logger.logInfo(
        `approveRejectVendorsDBResult() :: Error :: ${errapproveRejectVendors}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `approveRejectVendorsDBResult() :: Error :: ${JSON.stringify(
        errapproveRejectVendors
      )}`
    );
    approveRejectVendorsResponse(functionContext, null);
  }
};

//Approve Reject   Response
const approveRejectVendorsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`approveRejectVendorsResponse() invoked!`);

  let approveRejectVendorsResponse =
    new coreRequestModel.approveRejectVendorsResponse();

  approveRejectVendorsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    approveRejectVendorsResponse.Error = functionContext.error;
    approveRejectVendorsResponse.Details = null;
  } else {
    approveRejectVendorsResponse.Error = null;
    approveRejectVendorsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, approveRejectVendorsResponse);

  logger.logInfo(
    `approveRejectVendorsResponse response :: ${JSON.stringify(
      approveRejectVendorsResponse
    )}`
  );

  logger.logInfo(`approveRejectVendorsResponse() completed`);
};

//fetch approved Reject vendors

module.exports.fetchapproveRejectVendors = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`approveRejectVendors invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHAPPROVEDREJECTVENDORS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchApprovedRejectVendorsDetailsRequest =
    new coreRequestModel.fetchApprovedRejectVendorsRequest(req);

  logger.logInfo(
    `fetchApprovedRejectVendors() :: Request Object :: ${fetchApprovedRejectVendorsDetailsRequest}`
  );

  let requestContext = {
    ...fetchApprovedRejectVendorsDetailsRequest,
  };

  let validateRequest = joiValidationModel.fetchApprovedRejectVendors(
    fetchApprovedRejectVendorsDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchApprovedRejectVendorsDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchApprovedRejectVendorsResponse(functionContext, null);
    return;
  }

  try {
    let fetchApprovedRejectVendorsDBResult =
      await databaseHelper.fetchApproveRejectVendorsDb(
        functionContext,
        requestContext
      );

    fetchApprovedRejectVendorsResponse(
      functionContext,
      fetchApprovedRejectVendorsDBResult
    );
  } catch (errfetchApprovedRejectVendors) {
    if (
      !errfetchApprovedRejectVendors.ErrorMessage &&
      !errfetchApprovedRejectVendors.ErrorCode
    ) {
      logger.logInfo(
        `fetchApprovedRejectVendorsDBResult() :: Error :: ${errfetchApprovedRejectVendors}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchApprovedRejectVendorsDBResult() :: Error :: ${JSON.stringify(
        errfetchApprovedRejectVendors
      )}`
    );
    fetchApprovedRejectVendorsResponse(functionContext, null);
  }
};

// fetch Approved Reject   Response
const fetchApprovedRejectVendorsResponse = (
  functionContext,
  resolvedResult
) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchApprovedRejectVendorsResponse() invoked!`);

  let fetchApprovedRejectVendorsResponse =
    new coreRequestModel.fetchApprovedRejectVendorsResponse();

  fetchApprovedRejectVendorsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchApprovedRejectVendorsResponse.Error = functionContext.error;
    fetchApprovedRejectVendorsResponse.Details = null;
  } else {
    fetchApprovedRejectVendorsResponse.Error = null;
    fetchApprovedRejectVendorsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchApprovedRejectVendorsResponse);

  logger.logInfo(
    `fetchApprovedRejectVendorsResponse response :: ${JSON.stringify(
      fetchApprovedRejectVendorsResponse
    )}`
  );

  logger.logInfo(`approveRejectVendorsResponse() completed`);
};

//Payment Approval Request
module.exports.paymentApproval = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`paymentApproval invoked()!!`);

  let functionContext = {
    requestType: requestType.PAYMENTAPPROVAL,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let paymentApprovalRequest = new coreRequestModel.paymentApprovalRequest(req);

  logger.logInfo(
    `paymentApproval() :: Request Object :: ${paymentApprovalRequest}`
  );

  let requestContext = {
    ...paymentApprovalRequest,
  };

  let validateRequest = joiValidationModel.paymentApproval(
    paymentApprovalRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `paymentApprovalRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    paymentApprovalResponse(functionContext, null);
    return;
  }

  try {
    let paymentApprovalResponseDbResult =
      await databaseHelper.paymentApprovalDb(functionContext, requestContext);

    paymentApprovalResponse(functionContext, paymentApprovalResponseDbResult);
  } catch (errpaymentApprovalResponseDbResult) {
    if (
      !errpaymentApprovalResponseDbResult.ErrorMessage &&
      !errpaymentApprovalResponseDbResult.ErrorCode
    ) {
      logger.logInfo(
        `paymentApprovalResponseDbResult() :: Error :: ${errpaymentApprovalResponseDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `paymentApprovalResponseDbResult() :: Error :: ${JSON.stringify(
        errpaymentApprovalResponseDbResult
      )}`
    );
    paymentApprovalResponse(functionContext, null);
  }
};

//Payment Approval  Response
const paymentApprovalResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`paymentApprovalResponse() invoked!`);

  let paymentApprovalResponse = new coreRequestModel.paymentApprovalResponse();

  paymentApprovalResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    paymentApprovalResponse.Error = functionContext.error;
    paymentApprovalResponse.Details = null;
  } else {
    paymentApprovalResponse.Error = null;
    paymentApprovalResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, paymentApprovalResponse);

  logger.logInfo(
    `paymentApprovalResponse invoked:: ${JSON.stringify(
      paymentApprovalResponse
    )}`
  );

  logger.logInfo(`paymentApprovalResponse() completed`);
};

//fetch payment details

module.exports.fetchPaymentDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchPaymentDetails invoked()!!`);

  let functionContext = {
    requestType: requestType.PAYMENTDETAILS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchPaymentDetailsRequest =
    new coreRequestModel.fetchPaymentDetailsRequest(req);

  logger.logInfo(
    `fetchPaymentDetails() :: Request Object :: ${fetchPaymentDetailsRequest}`
  );

  let requestContext = {
    ...fetchPaymentDetailsRequest,
  };

  let validateRequest = joiValidationModel.fetchPaymentDetails(
    fetchPaymentDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchPaymentDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchPaymentDetailsResponse(functionContext, null);
    return;
  }

  try {
    let fetchPaymentDetailsDbResult =
      await databaseHelper.fetchPaymentDetailsDb(
        functionContext,
        requestContext
      );

    fetchPaymentDetailsResponse(functionContext, fetchPaymentDetailsDbResult);
  } catch (errfetchPaymentDetailsDbResult) {
    if (
      !errfetchPaymentDetailsDbResult.ErrorMessage &&
      !errfetchPaymentDetailsDbResult.ErrorCode
    ) {
      logger.logInfo(
        `fetchPaymentDetailsDbResult() :: Error :: ${errfetchPaymentDetailsDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchPaymentDetailsDbResult() :: Error :: ${JSON.stringify(
        errfetchPaymentDetailsDbResult
      )}`
    );
    fetchPaymentDetailsResponse(functionContext, null);
  }
};

//fetch payment details Response
const fetchPaymentDetailsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchPaymentDetailsResponse() invoked!`);

  let fetchPaymentDetailsResponse =
    new coreRequestModel.fetchPaymentDetailsResponse();

  fetchPaymentDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchPaymentDetailsResponse.Error = functionContext.error;
    fetchPaymentDetailsResponse.Details = null;
  } else {
    fetchPaymentDetailsResponse.Error = null;
    fetchPaymentDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchPaymentDetailsResponse);

  logger.logInfo(
    `fetchPaymentDetailsResponse invoked:: ${JSON.stringify(
      fetchPaymentDetailsResponse
    )}`
  );

  logger.logInfo(`fetchPaymentDetailsResponse() completed`);
};

//add master

module.exports.addMaster = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`Add Master invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDMASTER,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addMasterDetailsRequest = new coreRequestModel.addMasterRequest(req);

  logger.logInfo(`addMaster() :: Request Object :: ${addMasterDetailsRequest}`);

  let requestContext = {
    ...addMasterDetailsRequest,
  };

  let validateRequest = joiValidationModel.addMaster(addMasterDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addMasterDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addMasterResponse(functionContext, null);
    return;
  }

  try {
    let addMasterDBResult = await databaseHelper.addMasterDb(
      functionContext,
      requestContext
    );

    addMasterResponse(functionContext, addMasterDBResult);
  } catch (errAddMaster) {
    if (!errAddMaster.ErrorMessage && !errAddMaster.ErrorCode) {
      logger.logInfo(`addMasterDBResult() :: Error :: ${errAddMaster}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addMasterDBResult() :: Error :: ${JSON.stringify(errAddMaster)}`
    );
    addMasterResponse(functionContext, null);
  }
};

//Add Master Response
const addMasterResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addMasterResponse() invoked!`);

  let addMasterResponse = new coreRequestModel.addMasterResponse();

  addMasterResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addMasterResponse.Error = functionContext.error;
    addMasterResponse.Details = null;
  } else {
    addMasterResponse.Error = null;
    addMasterResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addMasterResponse);

  logger.logInfo(
    `addMasterResponse response :: ${JSON.stringify(addMasterResponse)}`
  );

  logger.logInfo(`addMasterResponse() completed`);
};

//fetch Revenue  generated by sales Person
module.exports.fetchRevenueGenerated = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchRevenueGenerated invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHREVENUEGENERAYED,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchRevenueGeneratedRequest =
    new coreRequestModel.fetchRevenueGeneratedRequest(req);

  logger.logInfo(
    `fetchRevenueGenerated() :: Request Object :: ${fetchRevenueGeneratedRequest}`
  );

  let requestContext = {
    ...fetchRevenueGeneratedRequest,
  };

  let validateRequest = joiValidationModel.fetchRevenueGenerated(
    fetchRevenueGeneratedRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchRevenueGeneratedRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchRevenueGeneratedResponse(functionContext, null);
    return;
  }

  try {
    let fetchRevenueGeneratedDbResult =
      await databaseHelper.fetchRevenueGeneratedDb(
        functionContext,
        requestContext
      );

    fetchRevenueGeneratedResponse(
      functionContext,
      fetchRevenueGeneratedDbResult
    );
  } catch (errfetchRevenueGeneratedDbResult) {
    if (
      !errfetchRevenueGeneratedDbResult.ErrorMessage &&
      !errfetchRevenueGeneratedDbResult.ErrorCode
    ) {
      logger.logInfo(
        `fetchRevenueGeneratedDbResult() :: Error :: ${errfetchRevenueGeneratedDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchRevenueGeneratedDbResult() :: Error :: ${JSON.stringify(
        errfetchRevenueGeneratedDbResult
      )}`
    );
    fetchRevenueGeneratedResponse(functionContext, null);
  }
};

//fetch Revenue Generated Response
const fetchRevenueGeneratedResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchRevenueGeneratedResponse() invoked!`);

  let fetchRevenueGeneratedResponse =
    new coreRequestModel.fetchRevenueGeneratedResponse();

  fetchRevenueGeneratedResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchRevenueGeneratedResponse.Error = functionContext.error;
    fetchRevenueGeneratedResponse.Details = null;
  } else {
    fetchRevenueGeneratedResponse.Error = null;
    fetchRevenueGeneratedResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchRevenueGeneratedResponse);

  logger.logInfo(
    `fetchRevenueGeneratedResponse invoked:: ${JSON.stringify(
      fetchRevenueGeneratedResponse
    )}`
  );

  logger.logInfo(`fetchRevenueGeneratedResponse() completed`);
};

//delete Advertisement
module.exports.deletedAvertisement = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deletedAvertisement invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEADVERTISEMENT,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deletedAvertisementRequest =
    new coreRequestModel.deletedAvertisementRequest(req);

  logger.logInfo(
    `deletedAvertisement() :: Request Object :: ${deletedAvertisementRequest}`
  );

  let requestContext = {
    ...deletedAvertisementRequest,
  };

  let validateRequest = joiValidationModel.deleteAdvertisement(
    deletedAvertisementRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deletedAvertisementRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    deletedAvertisementResponse(functionContext, null);
    return;
  }

  try {
    let deletedAvertisementDbResult =
      await databaseHelper.deleteAdvertisementDb(
        functionContext,
        requestContext
      );

    deletedAvertisementResponse(functionContext, deletedAvertisementDbResult);
  } catch (errdeletedAvertisementDbResult) {
    if (
      !errdeletedAvertisementDbResult.ErrorMessage &&
      !errdeletedAvertisementDbResult.ErrorCode
    ) {
      logger.logInfo(
        `deletedAvertisementDbResult() :: Error :: ${errdeletedAvertisementDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deletedAvertisementDbResult() :: Error :: ${JSON.stringify(
        errdeletedAvertisementDbResult
      )}`
    );
    deletedAvertisementResponse(functionContext, null);
  }
};

//delete Advertisement Response
const deletedAvertisementResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deletedAvertisementResponse() invoked!`);

  let deletedAvertisementResponse =
    new coreRequestModel.deletedAvertisementResponse();

  deletedAvertisementResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deletedAvertisementResponse.Error = functionContext.error;
    deletedAvertisementResponse.Details = null;
  } else {
    deletedAvertisementResponse.Error = null;
    deletedAvertisementResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deletedAvertisementResponse);

  logger.logInfo(
    `deletedAvertisementResponse invoked:: ${JSON.stringify(
      deletedAvertisementResponse
    )}`
  );

  logger.logInfo(`deletedAvertisementResponse() completed`);
};

//fetch all data of Usertypes
module.exports.fetchData = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchData invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHDATA,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchDataRequest = new coreRequestModel.fetchDataRequest(req);

  logger.logInfo(`fetchData() :: Request Object :: ${fetchDataRequest}`);

  let requestContext = {
    ...fetchDataRequest,
  };

  try {
    let fetchDataDbResult = await databaseHelper.fetchDataDb(
      functionContext,
      requestContext
    );

    fetchDataResponse(functionContext, fetchDataDbResult);
  } catch (errfetchDataDbResult) {
    if (!errfetchDataDbResult.ErrorMessage && !errfetchDataDbResult.ErrorCode) {
      logger.logInfo(`fetchDataDbResult() :: Error :: ${errfetchDataDbResult}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchDataDbResult() :: Error :: ${JSON.stringify(errfetchDataDbResult)}`
    );
    fetchDataResponse(functionContext, null);
  }
};

//fetch Data Response
const fetchDataResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchDataResponse() invoked!`);

  let fetchDataResponse = new coreRequestModel.fetchDataResponse();

  fetchDataResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchDataResponse.Error = functionContext.error;
    fetchDataResponse.Details = null;
  } else {
    fetchDataResponse.Error = null;
    fetchDataResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchDataResponse);

  logger.logInfo(
    `fetchDataResponse invoked:: ${JSON.stringify(fetchDataResponse)}`
  );

  logger.logInfo(`fetchDataResponse() completed`);
};

//fetch Master Details
module.exports.fetchMasterDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchMaster Details invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHMASTERDETAILS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchMasterDetailsRequest =
    new coreRequestModel.fetchMasterDetailsRequest(req);

  logger.logInfo(
    `fetchMasterDetailsRequest() :: Request Object :: ${fetchMasterDetailsRequest}`
  );

  let requestContext = {
    ...fetchMasterDetailsRequest,
  };
  let validateRequest = joiValidationModel.FetchMasterDetails(
    fetchMasterDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchMasterDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchMasterDetailsResponse(functionContext, null);
    return;
  }

  try {
    let fetchMasterDetailsDbResult = await databaseHelper.fetchMasterDetailsDb(
      functionContext,
      requestContext
    );

    fetchMasterDetailsResponse(functionContext, fetchMasterDetailsDbResult);
  } catch (errfetchMasterDetailsDbResult) {
    if (
      !errfetchMasterDetailsDbResult.ErrorMessage &&
      !errfetchMasterDetailsDbResult.ErrorCode
    ) {
      logger.logInfo(
        `fetchMasterDetailsDbResult() :: Error :: ${errfetchMasterDetailsDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchMasterDetailsDbResult() :: Error :: ${JSON.stringify(
        errfetchMasterDetailsDbResult
      )}`
    );
    fetchMasterDetailsResponse(functionContext, null);
  }
};

//fetch Master Response
const fetchMasterDetailsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchMasterDetailsResponse() invoked!`);

  let fetchMasterDetailsResponse =
    new coreRequestModel.fetchMasterDetailsResponse();

  fetchMasterDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchMasterDetailsResponse.Error = functionContext.error;
    fetchMasterDetailsResponse.Details = null;
  } else {
    fetchMasterDetailsResponse.Error = null;
    fetchMasterDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchMasterDetailsResponse);

  logger.logInfo(
    `fetchMasterDetailsResponse invoked:: ${JSON.stringify(
      fetchMasterDetailsResponse
    )}`
  );

  logger.logInfo(`fetchMasterDetailsResponse() completed`);
};

//delete trending services

module.exports.deleteTrendingServices = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deleteTrendingServices invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETETRENDINGSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deletedTrendingServicesRequest =
    new coreRequestModel.deletedTrendingServicesRequest(req);

  logger.logInfo(
    `deletedTrendingServicesRequest() :: Request Object :: ${deletedTrendingServicesRequest}`
  );

  let requestContext = {
    ...deletedTrendingServicesRequest,
  };

  let validateRequest = joiValidationModel.deleteTrendingServices(
    deletedTrendingServicesRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deletedTrendingServicesRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    deletedTrendingServicesResponse(functionContext, null);
    return;
  }

  try {
    let deletedTrendingServicesDbResult =
      await databaseHelper.deleteTrendingServicesDb(
        functionContext,
        requestContext
      );

    deletedTrendingServicesResponse(
      functionContext,
      deletedTrendingServicesDbResult
    );
  } catch (errdeletedTrendingServicesDbResult) {
    if (
      !errdeletedTrendingServicesDbResult.ErrorMessage &&
      !errdeletedTrendingServicesDbResult.ErrorCode
    ) {
      logger.logInfo(
        `deletedTrendingServicesDbResult() :: Error :: ${errdeletedTrendingServicesDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deletedTrendingServicesDbResult() :: Error :: ${JSON.stringify(
        errdeletedTrendingServicesDbResult
      )}`
    );
    deletedTrendingServicesResponse(functionContext, null);
  }
};

//delete Trending Services Response
const deletedTrendingServicesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deletedTrendingServicesResponse() invoked!`);

  let deletedTrendingServicesResponse =
    new coreRequestModel.deletedTrendingServicesResponse();

  deletedTrendingServicesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deletedTrendingServicesResponse.Error = functionContext.error;
    deletedTrendingServicesResponse.Details = null;
  } else {
    deletedTrendingServicesResponse.Error = null;
    deletedTrendingServicesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deletedTrendingServicesResponse);

  logger.logInfo(
    `deletedTrendingServicesResponse invoked:: ${JSON.stringify(
      deletedTrendingServicesResponse
    )}`
  );

  logger.logInfo(`deletedTrendingServicesResponse() completed`);
};

//deleting category request

module.exports.deleteCategory = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`delete Category invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETECATEGORY,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deletedCategoryRequest = new coreRequestModel.deletedCategoryRequest(req);

  logger.logInfo(
    `deletedCategoryRequest() :: Request Object :: ${deletedCategoryRequest}`
  );

  let requestContext = {
    ...deletedCategoryRequest,
  };

  let validateRequest = joiValidationModel.deleteCategory(
    deletedCategoryRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deletedCategoryRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    deletedCategoryResponse(functionContext, null);
    return;
  }

  try {
    let deletedCategoryDbResult = await databaseHelper.deleteCategoryDb(
      functionContext,
      requestContext
    );

    deletedCategoryResponse(functionContext, deletedCategoryDbResult);
  } catch (errdeletedCategoryDbResult) {
    if (
      !errdeletedCategoryDbResult.ErrorMessage &&
      !errdeletedCategoryDbResult.ErrorCode
    ) {
      logger.logInfo(
        `deletedCategoryDbResult() :: Error :: ${errdeletedCategoryDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deletedCategoryDbResult() :: Error :: ${JSON.stringify(
        errdeletedCategoryDbResult
      )}`
    );
    deletedCategoryResponse(functionContext, null);
  }
};

//delete category Response
const deletedCategoryResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deletedCategoryResponse() invoked!`);

  let deletedCategoryResponse = new coreRequestModel.deletedCategoryResponse();

  deletedCategoryResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deletedCategoryResponse.Error = functionContext.error;
    deletedCategoryResponse.Details = null;
  } else {
    deletedCategoryResponse.Error = null;
    deletedCategoryResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deletedCategoryResponse);

  logger.logInfo(
    `deletedCategoryResponse invoked:: ${JSON.stringify(
      deletedCategoryResponse
    )}`
  );

  logger.logInfo(`deletedCategoryResponse() completed`);
};

//fetch Advertisements
module.exports.fetchAdvertisements = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetch Advertisements invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHADVERTISEMENTS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchAdvertisementDetailsRequest =
    new coreRequestModel.fetchAdvertisementDetailsRequest(req);

  logger.logInfo(
    `fetchAdvertisementDetailsRequest() :: Request Object :: ${fetchAdvertisementDetailsRequest}`
  );

  let requestContext = {
    ...fetchAdvertisementDetailsRequest,
  };
  let validateRequest = joiValidationModel.FetchAddvertisementDetails(
    fetchAdvertisementDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchAdvertisementDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchAdvertisementDetailsResponse(functionContext, null);
    return;
  }

  try {
    let fetchAdvertisementDetailsDbResult =
      await databaseHelper.fetchadvertisementDb(
        functionContext,
        requestContext
      );

    fetchAdvertisementDetailsResponse(
      functionContext,
      fetchAdvertisementDetailsDbResult
    );
  } catch (errfetchAdvertisementDetailsDbResult) {
    if (
      !errfetchAdvertisementDetailsDbResult.ErrorMessage &&
      !errfetchAdvertisementDetailsDbResult.ErrorCode
    ) {
      logger.logInfo(
        `fetchAdvertisementDetailsDbResult() :: Error :: ${errfetchAdvertisementDetailsDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchAdvertisementDetailsDbResult() :: Error :: ${JSON.stringify(
        errfetchAdvertisementDetailsDbResult
      )}`
    );
    fetchAdvertisementDetailsResponse(functionContext, null);
  }
};
//Fetch Advertisement Response
const fetchAdvertisementDetailsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchAdvertisementDetailsResponse() invoked!`);

  let fetchAdvertisementDetailsResponse =
    new coreRequestModel.fetchAdvertisementDetailsResponse();

  fetchAdvertisementDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchAdvertisementDetailsResponse.Error = functionContext.error;
    fetchAdvertisementDetailsResponse.Details = null;
  } else {
    fetchAdvertisementDetailsResponse.Error = null;
    fetchAdvertisementDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchAdvertisementDetailsResponse);

  logger.logInfo(
    `fetchAdvertisementDetailsResponse invoked:: ${JSON.stringify(
      fetchAdvertisementDetailsResponse
    )}`
  );

  logger.logInfo(`fetchAdvertisementDetailsResponse() completed`);
};

//admin add  advertisement
module.exports.addAdminAdvertisement = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addAdminAdvertisement invoked()!!`);

  let functionContext = {
    requestType: requestType.addAdminAdvertisement,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addAdminAdvertisementDetailsRequest =
    new coreRequestModel.addAdminAdvertisementRequest(req);

  logger.logInfo(
    `addAdminAdvertisement() :: Request Object :: ${addAdminAdvertisementDetailsRequest}`
  );

  let requestContext = {
    ...addAdminAdvertisementDetailsRequest,
    ImageURL: null,
  };

  let validateRequest = joiValidationModel.addadminadvertisemt(
    addAdminAdvertisementDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addAdminAdvertisementDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addVendorResponse(functionContext, null);
    return;
  }

  //image upload
  try {
    if (req.files.length > 0) {
      if (req.hasOwnProperty("files")) {
        console.log("req", req.hasOwnProperty("files"));
        var toBeUploaded = [];
        for (let count = 0; count < req.files.length; count++) {
          var file = req.files[count];
          if (file.hasOwnProperty("filename")) {
            if (file.filename) {
              toBeUploaded[count] = fs.readFileSync(file.path);

              requestContext.ImageURL = file.filename.split(" ").join("%20");
            }
          }
        }
        const ImageUrl = await adminadvertisementImageFileUploadFunction(
          functionContext,
          requestContext,
          toBeUploaded
        );

        let addadminadvertisemenDBResult =
          await databaseHelper.addadminadvertismentDb(
            functionContext,
            requestContext,
            ImageUrl
          );

        addAdminAdvertisementResponse(
          functionContext,
          addadminadvertisemenDBResult
        );
      }
    } else {
      let addadminadvertisemenDBResult =
        await databaseHelper.addadminadvertismentDb(
          functionContext,
          requestContext,
          requestContext.ImageURL
        );

      addAdminAdvertisementResponse(
        functionContext,
        addadminadvertisemenDBResult
      );
    }
  } catch (erraddAdminAdvertisement) {
    if (
      !erraddAdminAdvertisement.ErrorMessage &&
      !erraddAdminAdvertisement.ErrorCode
    ) {
      logger.logInfo(
        `erraddAdminAdvertisement() :: Error :: ${erraddAdminAdvertisement}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addadminadvertisemenDBResult() :: Error :: ${JSON.stringify(
        erraddAdminAdvertisement
      )}`
    );
    addAdminAdvertisementResponse(functionContext, null);
  }
};

//Add admin advertisemnet Response
const addAdminAdvertisementResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addAdminAdvertisementResponse() invoked!`);

  let addAdminAdvertisementResponse =
    new coreRequestModel.addAdminAdvertisementResponse();

  addAdminAdvertisementResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addAdminAdvertisementResponse.Error = functionContext.error;
    addAdminAdvertisementResponse.Details = null;
  } else {
    addAdminAdvertisementResponse.Error = null;
    addAdminAdvertisementResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addAdminAdvertisementResponse);

  logger.logInfo(
    `addAdminAdvertisementResponse response :: ${JSON.stringify(
      addAdminAdvertisementResponse
    )}`
  );

  logger.logInfo(`addAdminAdvertisementResponse() completed`);
};

//admin image upload function
async function adminadvertisementImageFileUploadFunction(
  functionContext,
  resolvedResult,
  files
) {
  var logger = functionContext.logger;

  logger.logInfo(`fileUpload() Invoked()`);

  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);

  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  const params = [];
  files.map((f) => {
    params.push({
      Bucket: process.env.DO_SPACES_NAME,
      Key: `Business/${resolvedResult.ImageURL}`,
      Body: f,
      ACL: "public-read",
    });
  });
  try {
    const responses = await Promise.all(
      params.map((param) => s3.upload(param).promise())
    );
    const storedlocation = responses[0].Location;
    console.log("location", storedlocation);
    return storedlocation;
  } catch (err) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);

    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,

      constant.ErrorCode.ApplicationError
    );

    throw functionContext.error;
  }
}

//approval of business request
module.exports.approvalOfBusiness = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`approvalOfBusiness invoked()!!`);

  let functionContext = {
    requestType: requestType.APPROVALOFBUSINESS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let approvalOfBusinessRequest =
    new coreRequestModel.approvalOfBusinessRequest(req);

  logger.logInfo(
    `approvalOfBusiness() :: Request Object :: ${approvalOfBusinessRequest}`
  );

  let requestContext = {
    ...approvalOfBusinessRequest,
  };

  let validateRequest = joiValidationModel.approvalOfBusiness(
    approvalOfBusinessRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `approvalOfBusinessRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    approvalOfBusinessResponse(functionContext, null);
    return;
  }

  try {
    let approvalOfBusinessDbResult = await databaseHelper.approvalOfBusinessDb(
      functionContext,
      requestContext
    );

    approvalOfBusinessResponse(functionContext, approvalOfBusinessDbResult);
  } catch (errapprovalOfBusinessDbResult) {
    if (
      !errapprovalOfBusinessDbResult.ErrorMessage &&
      !errapprovalOfBusinessDbResult.ErrorCode
    ) {
      logger.logInfo(
        `approvalOfBusinessDbResult() :: Error :: ${errapprovalOfBusinessDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `approvalOfBusinessDbResult() :: Error :: ${JSON.stringify(
        errapprovalOfBusinessDbResult
      )}`
    );
    approvalOfBusinessResponse(functionContext, null);
  }
};

//approval of business  Response
const approvalOfBusinessResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`approvalOfBusinessResponse() invoked!`);

  let approvalOfBusinessResponse =
    new coreRequestModel.approvalOfBusinessResponse();

  approvalOfBusinessResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    approvalOfBusinessResponse.Error = functionContext.error;
    approvalOfBusinessResponse.Details = null;
  } else {
    approvalOfBusinessResponse.Error = null;
    approvalOfBusinessResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, approvalOfBusinessResponse);

  logger.logInfo(
    `approvalOfBusinessResponse invoked:: ${JSON.stringify(
      approvalOfBusinessResponse
    )}`
  );

  logger.logInfo(`approvalOfBusinessResponse() completed`);
};

//delete popular service request
module.exports.deletePopularServices = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deletePopularServices invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEPOPULARSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deletedPopularServicesRequest =
    new coreRequestModel.deletedPopularServicesRequest(req);

  logger.logInfo(
    `deletedPopularServicesRequest() :: Request Object :: ${deletedPopularServicesRequest}`
  );

  let requestContext = {
    ...deletedPopularServicesRequest,
  };

  let validateRequest = joiValidationModel.deletePopularServices(
    deletedPopularServicesRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deletedPopularServicesRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    deletedPopularServicesResponse(functionContext, null);
    return;
  }

  try {
    let deletedPopularServicesDbResult =
      await databaseHelper.deletePopularServicesDb(
        functionContext,
        requestContext
      );

    deletedPopularServicesResponse(
      functionContext,
      deletedPopularServicesDbResult
    );
  } catch (errdeletedPopularServicesDbResult) {
    if (
      !errdeletedPopularServicesDbResult.ErrorMessage &&
      !errdeletedPopularServicesDbResult.ErrorCode
    ) {
      logger.logInfo(
        `deletedPopularServicesDbResult() :: Error :: ${errdeletedPopularServicesDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deletedPopularServicesDbResult() :: Error :: ${JSON.stringify(
        errdeletedPopularServicesDbResult
      )}`
    );
    deletedPopularServicesResponse(functionContext, null);
  }
};

//delete popular services responce
const deletedPopularServicesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deletedPopularServicesResponse() invoked!`);

  let deletedPopularServicesResponse =
    new coreRequestModel.deletedPopularServicesResponse();

  deletedPopularServicesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deletedPopularServicesResponse.Error = functionContext.error;
    deletedPopularServicesResponse.Details = null;
  } else {
    deletedPopularServicesResponse.Error = null;
    deletedPopularServicesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deletedPopularServicesResponse);

  logger.logInfo(
    `deletedPopularServicesResponse invoked:: ${JSON.stringify(
      deletedPopularServicesResponse
    )}`
  );

  logger.logInfo(`deletedPopularServicesResponse() completed`);
};

//delete job seeker request
module.exports.deleteJobSeeker = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deleteJobSeeker invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEPOPULARSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let deletedJobSeekerRequest = new coreRequestModel.deletedJobSeekerRequest(
    req
  );

  logger.logInfo(
    `deleteJobSeeker() :: Request Object :: ${deletedJobSeekerRequest}`
  );

  let requestContext = {
    ...deletedJobSeekerRequest,
  };

  let validateRequest = joiValidationModel.deleteJobSeeker(
    deletedJobSeekerRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deletedJobSeekerRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    deleteJobSeekerResponse(functionContext, null);
    return;
  }

  try {
    let deleteJobSeekerDbResult = await databaseHelper.deleteJobSeekerDb(
      functionContext,
      requestContext
    );

    deleteJobSeekerResponse(functionContext, deleteJobSeekerDbResult);
  } catch (errdeleteJobSeekerDbResult) {
    if (
      !errdeleteJobSeekerDbResult.ErrorMessage &&
      !errdeleteJobSeekerDbResult.ErrorCode
    ) {
      logger.logInfo(
        `deleteJobSeekerDbResult() :: Error :: ${errdeleteJobSeekerDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deleteJobSeekerDbResult() :: Error :: ${JSON.stringify(
        errdeleteJobSeekerDbResult
      )}`
    );
    deleteJobSeekerResponse(functionContext, null);
  }
};

//delete job seeker responce
const deleteJobSeekerResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deleteJobSeekerResponse() invoked!`);

  let deleteJobSeekerResponse = new coreRequestModel.deletedJobSeekerResponse();

  deleteJobSeekerResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deleteJobSeekerResponse.Error = functionContext.error;
    deleteJobSeekerResponse.Details = null;
  } else {
    deleteJobSeekerResponse.Error = null;
    deleteJobSeekerResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deleteJobSeekerResponse);

  logger.logInfo(
    `deleteJobSeekerResponse invoked:: ${JSON.stringify(
      deleteJobSeekerResponse
    )}`
  );

  logger.logInfo(`deleteJobSeekerResponse() completed`);
};

//block job seeker
module.exports.blockJobSeeker = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`blockJobSeeker invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEPOPULARSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let blockJobSeekerRequest = new coreRequestModel.blockJobSeekerRequest(req);

  logger.logInfo(
    `blockJobSeeker() :: Request Object :: ${blockJobSeekerRequest}`
  );

  let requestContext = {
    ...blockJobSeekerRequest,
  };

  let validateRequest = joiValidationModel.blockJobSeeker(
    blockJobSeekerRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `blockJobSeekerRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    blockJobSeekerResponse(functionContext, null);
    return;
  }

  try {
    let blockJobSeekerDbResult = await databaseHelper.blockJobSeekerDb(
      functionContext,
      requestContext
    );

    blockJobSeekerResponse(functionContext, blockJobSeekerDbResult);
  } catch (errblockJobSeekerDbResult) {
    if (
      !errblockJobSeekerDbResult.ErrorMessage &&
      !errblockJobSeekerDbResult.ErrorCode
    ) {
      logger.logInfo(
        `blockJobSeekerDbResult() :: Error :: ${errblockJobSeekerDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `blockJobSeekerDbResult() :: Error :: ${JSON.stringify(
        errblockJobSeekerDbResult
      )}`
    );
    blockJobSeekerResponse(functionContext, null);
  }
};

//block job seeker responce
const blockJobSeekerResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`blockJobSeekerResponse() invoked!`);

  let blockJobSeekerResponse = new coreRequestModel.blockJobSeekerResponse();

  blockJobSeekerResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    blockJobSeekerResponse.Error = functionContext.error;
    blockJobSeekerResponse.Details = null;
  } else {
    blockJobSeekerResponse.Error = null;
    blockJobSeekerResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, blockJobSeekerResponse);

  logger.logInfo(
    `blockJobSeekerResponse invoked:: ${JSON.stringify(blockJobSeekerResponse)}`
  );

  logger.logInfo(`blockJobSeekerResponse() completed`);
};

//initiate admin chat
module.exports.adminChatInitiation = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`adminChatInitiation invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEPOPULARSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let adminChatInitiationRequest =
    new coreRequestModel.adminChatInitiationRequest(req);

  logger.logInfo(
    `adminChatInitiation() :: Request Object :: ${adminChatInitiationRequest}`
  );

  let requestContext = {
    ...adminChatInitiationRequest,
  };

  let validateRequest = joiValidationModel.adminChatInitiation(
    adminChatInitiationRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `adminChatInitiationRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    adminChatInitiationResponse(functionContext, null);
    return;
  }

  try {
    let adminChatInitiationDbResult = await databaseHelper.adminChatDb(
      functionContext,
      requestContext
    );

    adminChatInitiationResponse(functionContext, adminChatInitiationDbResult);
  } catch (erradminChatInitiationDbResult) {
    if (
      !erradminChatInitiationDbResult.ErrorMessage &&
      !erradminChatInitiationDbResult.ErrorCode
    ) {
      logger.logInfo(
        `adminChatInitiationDbResult() :: Error :: ${erradminChatInitiationDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `adminChatInitiationDbResult() :: Error :: ${JSON.stringify(
        erradminChatInitiationDbResult
      )}`
    );
    adminChatInitiationResponse(functionContext, null);
  }
};

//initiate admin chat responce
const adminChatInitiationResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`adminChatInitiationResponse() invoked!`);

  let adminChatInitiationResponse =
    new coreRequestModel.adminChatInitiationResponse();

  adminChatInitiationResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    adminChatInitiationResponse.Error = functionContext.error;
    adminChatInitiationResponse.Details = null;
  } else {
    adminChatInitiationResponse.Error = null;
    adminChatInitiationResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, adminChatInitiationResponse);

  logger.logInfo(
    `adminChatInitiationResponse invoked:: ${JSON.stringify(
      adminChatInitiationResponse
    )}`
  );

  logger.logInfo(`adminChatInitiationResponse() completed`);
};

//fetch admin chat
module.exports.fetchaAdminChat = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchaAdminChat invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEPOPULARSERVICES,
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
    let fetchaAdminChatDbResult = await databaseHelper.fetchAdminChatDb(
      functionContext
    );

    fetchaAdminChatResponse(functionContext, fetchaAdminChatDbResult);
  } catch (errfetchaAdminChatDbResult) {
    if (
      !errfetchaAdminChatDbResult.ErrorMessage &&
      !errfetchaAdminChatDbResult.ErrorCode
    ) {
      logger.logInfo(
        `fetchaAdminChatDbResult() :: Error :: ${errfetchaAdminChatDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchaAdminChatDbResult() :: Error :: ${JSON.stringify(
        errfetchaAdminChatDbResult
      )}`
    );
    fetchaAdminChatResponse(functionContext, null);
  }
};

//fetch admin chat responce
const fetchaAdminChatResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchaAdminChatResponse() invoked!`);

  let fetchaAdminChatResponse = new coreRequestModel.fetchAdminChatResponse();

  fetchaAdminChatResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchaAdminChatResponse.Error = functionContext.error;
    fetchaAdminChatResponse.Details = null;
  } else {
    fetchaAdminChatResponse.Error = null;
    fetchaAdminChatResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchaAdminChatResponse);

  logger.logInfo(
    `fetchaAdminChatResponse invoked:: ${JSON.stringify(
      fetchaAdminChatResponse
    )}`
  );

  logger.logInfo(`fetchaAdminChatResponse() completed`);
};

//verify
module.exports.verify = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`verify invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEPOPULARSERVICES,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let verifyRequest = new coreRequestModel.verifyRequest(req);

  logger.logInfo(`verify() :: Request Object :: ${verifyRequest}`);

  let requestContext = {
    ...verifyRequest,
  };

  let validateRequest = joiValidationModel.verify(verifyRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `verifyRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    verifyResponse(functionContext, null);
    return;
  }

  try {
    let finalResult;

    let verifyBusinessDb = await databaseHelper.verifyBusinessDb(
      functionContext,
      requestContext
    );

    let verifyJobSeekerDb = await databaseHelper.verifyJobSeekerDb(
      functionContext,
      requestContext
    );

    finalResult = {
      verifiedBusiness: verifyBusinessDb,
      verifiedJobSeeker: verifyJobSeekerDb,
    };

    verifyResponse(functionContext, finalResult);
  } catch (errverifyDbResult) {
    if (!errverifyDbResult.ErrorMessage && !errverifyDbResult.ErrorCode) {
      logger.logInfo(`verifyDbResult() :: Error :: ${errverifyDbResult}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `verifyDbResult() :: Error :: ${JSON.stringify(errverifyDbResult)}`
    );
    verifyResponse(functionContext, null);
  }
};

//verify responce
const verifyResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`verifyResponse() invoked!`);

  let verifyResponse = new coreRequestModel.verifyResponse();

  verifyResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    verifyResponse.Error = functionContext.error;
    verifyResponse.Details = null;
  } else {
    verifyResponse.Error = null;
    verifyResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, verifyResponse);

  logger.logInfo(`verifyResponse invoked:: ${JSON.stringify(verifyResponse)}`);

  logger.logInfo(`verifyResponse() completed`);
};

module.exports.fetchAdSpaces = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchaAdSpaces invoked()!!`);

  let functionContext = {
    requestType: requestType.DELETEPOPULARSERVICES,
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
    let fetchaAdSpacesDbResult = await databaseHelper.fetchAdSpacesDb(
      functionContext
    );

    fetchaAdSpacesResponse(functionContext, fetchaAdSpacesDbResult);
  } catch (errfetchaAdSpacesDbResult) {
    if (
      !errfetchaAdSpacesDbResult.ErrorMessage &&
      !errfetchaAdSpacesDbResult.ErrorCode
    ) {
      logger.logInfo(
        `fetchaAdSpacesDbResult() :: Error :: ${errfetchaAdSpacesDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchaAdSpacesDbResult() :: Error :: ${JSON.stringify(
        errfetchaAdSpacesDbResult
      )}`
    );
    fetchaAdSpacesResponse(functionContext, null);
  }
};

const fetchaAdSpacesResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchaAdSpacesResponse() invoked!`);

  let fetchaAdSpacesResponse = new coreRequestModel.fetchAdSpacesResponse();

  fetchaAdSpacesResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchaAdSpacesResponse.Error = functionContext.error;
    fetchaAdSpacesResponse.Details = null;
  } else {
    fetchaAdSpacesResponse.Error = null;
    fetchaAdSpacesResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchaAdSpacesResponse);

  logger.logInfo(
    `fetchaAdSpacesResponse invoked:: ${JSON.stringify(fetchaAdSpacesResponse)}`
  );

  logger.logInfo(`fetchaAdSpacesResponse() completed`);
};
