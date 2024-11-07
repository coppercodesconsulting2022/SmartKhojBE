const databaseHelper = require("../databasehelper/vendor");
const coreRequestModel = require("../models/serviceModel/vendor");
const errorModel = require("../models/serviceModel/error");
const constant = require("../common/constant");
const appLib = require("applib");
const momentTimezone = require("moment-timezone");
const requestType = constant.RequestType;
const joiValidationModel = require("../models/validationModel/vendor");
const fileConfiguration = require("../common/settings").FileConfiguration;
const fs = require("fs");
const AWS = require("aws-sdk");
const appLibModule = require("../../applib/app");
const { param } = require("../routes/vendor");
const uuid = require("uuid");
const { fetchSavedJobsDb } = require("../databasehelper/user");

//AddVendor Request
module.exports.addVendor = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`AddVendor invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDVENDOR,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addVendorDetailsRequest = new coreRequestModel.addVendorRequest(req);

  logger.logInfo(`AddVendor() :: Request Object :: ${addVendorDetailsRequest}`);

  let requestContext = {
    ...addVendorDetailsRequest,
    ImageURL: null,
  };

  let validateRequest = joiValidationModel.addVendor(addVendorDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addVendorDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    // addVendorResponse(functionContext, null);
    // return;
  }

  //image upload
  try {
    console.log('req.hasOwnProperty("files").length>>>>', req.files);
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
              //process.env.DO_SPACES_FOR_SPACES +file.filename.split(" ").join("%20");
            }
          }
        }
        const ImageUrl = await VendorImageFileUploadFunction(
          functionContext,
          requestContext,
          toBeUploaded
        );

        let addVendorDBResult = await databaseHelper.addVendorDb(
          functionContext,
          requestContext,
          ImageUrl
        );

        addVendorResponse(functionContext, addVendorDBResult);
      }
    } else {
      let addVendorDBResult = await databaseHelper.addVendorDb(
        functionContext,
        requestContext,
        requestContext.ImageURL
        //ImageURL
      );

      addVendorResponse(functionContext, addVendorDBResult);
    }
    //end
    // try {
    //   let addVendorDBResult = await databaseHelper.addVendorDb(
    //     functionContext,
    //     requestContext
    //   );

    // addVendorResponse(functionContext, addVendorDBResult);
  } catch (errAddVendor) {
    if (!errAddVendor.ErrorMessage && !errAddVendor.ErrorCode) {
      logger.logInfo(`addVendorDBResult() :: Error :: ${errAddVendor}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addVendorDBResult() :: Error :: ${JSON.stringify(errAddVendor)}`
    );
    addVendorResponse(functionContext, null);
  }
};

//Add Vendor Response
const addVendorResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addVendorResponse() invoked!`);

  let addVendorResponse = new coreRequestModel.addVendorResponse();

  addVendorResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addVendorResponse.Error = functionContext.error;
    addVendorResponse.Details = null;
  } else {
    addVendorResponse.Error = null;
    addVendorResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addVendorResponse);

  logger.logInfo(
    `addVendorResponse response :: ${JSON.stringify(addVendorResponse)}`
  );

  logger.logInfo(`addVendorResponse() completed`);
};

//vendor image upload function
async function VendorImageFileUploadFunction(
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

//end of vendor image upload function
//Fetch Vendor Request

module.exports.fetchVendor = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchVendor invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHVENDOR,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchVendorDetailsRequest = new coreRequestModel.fetchVendorRequest(req);

  logger.logInfo(
    `fetchVendor() :: Request Object :: ${fetchVendorDetailsRequest}`
  );

  let requestContext = {
    ...fetchVendorDetailsRequest,
  };

  let validateRequest = joiValidationModel.fetchVendor(
    fetchVendorDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchVendorDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    fetchVendorResponse(functionContext, null);
    return;
  }

  try {
    let fetchVendorDBResult = await databaseHelper.fetchVendorDb(
      functionContext,
      requestContext
    );

    fetchVendorResponse(functionContext, fetchVendorDBResult);
  } catch (errfetchVendor) {
    if (!errfetchVendor.ErrorMessage && !errfetchVendor.ErrorCode) {
      logger.logInfo(`fetchVendorDBResult() :: Error :: ${errfetchVendor}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchVendorDBResult() :: Error :: ${JSON.stringify(errfetchVendor)}`
    );
    fetchVendorResponse(functionContext, null);
  }
};

//Fetch Vendor Response
const fetchVendorResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchVendorResponse() invoked!`);

  let fetchVendorResponse = new coreRequestModel.fetchVendorResponse();

  fetchVendorResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchVendorResponse.Error = functionContext.error;
    fetchVendorResponse.Details = null;
  } else {
    fetchVendorResponse.Error = null;
    fetchVendorResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchVendorResponse);

  logger.logInfo(
    `fetchVendorResponse response :: ${JSON.stringify(fetchVendorResponse)}`
  );

  logger.logInfo(`fetchVendorResponse() completed`);
};

//Fetch Leads Request

module.exports.fetchLeads = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchLeads invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHLEADS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchLeadsDetailsRequest = new coreRequestModel.fetchLeadsRequest(req);

  logger.logInfo(
    `fetchLeads() :: Request Object :: ${fetchLeadsDetailsRequest}`
  );

  let requestContext = {
    ...fetchLeadsDetailsRequest,
  };
  let validateRequest = joiValidationModel.fetchLeads(fetchLeadsDetailsRequest); //

  try {
    let fetchLeadsDBResult = await databaseHelper.fetchLeadsDb(
      functionContext,
      requestContext
    );

    fetchLeadsResponse(functionContext, fetchLeadsDBResult);
  } catch (errfetchLeads) {
    if (!errfetchLeads.ErrorMessage && !errfetchLeads.ErrorCode) {
      logger.logInfo(`fetchLeadsDBResult() :: Error :: ${errfetchLeads}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchLeadsDBResult() :: Error :: ${JSON.stringify(errfetchLeads)}`
    );
    fetchLeadsResponse(functionContext, null);
  }
};

//Fetch Leads Response

const fetchLeadsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchLeadsResponse() invoked!`);

  let fetchLeadsResponse = new coreRequestModel.fetchLeadsResponse();

  fetchLeadsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchLeadsResponse.Error = functionContext.error;
    fetchLeadsResponse.Details = null;
  } else {
    fetchLeadsResponse.Error = null;
    fetchLeadsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchLeadsResponse);

  logger.logInfo(
    `fetchLeadsResponse response :: ${JSON.stringify(fetchLeadsResponse)}`
  );

  logger.logInfo(`fetchLeadsResponse() completed`);
};

//AddReviewReply Request

module.exports.addReviewReply = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`AddReviewReply() invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDREVIEWREPLY,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addReviewReplyDetailsRequest = new coreRequestModel.addReviewReplyRequest(
    req
  ); //

  logger.logInfo(
    `AddReviewReply() :: Request Object :: ${addReviewReplyDetailsRequest}`
  );

  let requestContext = {
    ...addReviewReplyDetailsRequest,
  };

  let validateRequest = joiValidationModel.addReviewReply(
    addReviewReplyDetailsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addReviewReplyDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addReviewReplyResponse(functionContext, null);
    return;
  }

  try {
    let addReviewReplyDBResult = await databaseHelper.addReviewReplyDb(
      functionContext,
      requestContext
    );

    addReviewReplyResponse(functionContext, addReviewReplyDBResult);
  } catch (errAddReviewReply) {
    if (!errAddReviewReply.ErrorMessage && !errAddReviewReply.ErrorCode) {
      logger.logInfo(
        `addReviewReplyDBResult() :: Error :: ${errAddReviewReply}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addReviewReplyDBResult() :: Error :: ${JSON.stringify(
        errAddReviewReply
      )}`
    );
    addReviewReplyResponse(functionContext, null);
  }
};

//Add Review Reply Response

const addReviewReplyResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addReviewReplyResponse() invoked!`);

  let addReviewReplyResponse = new coreRequestModel.addReviewReplyResponse();

  addReviewReplyResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addReviewReplyResponse.Error = functionContext.error;
    addReviewReplyResponse.Details = null;
  } else {
    addReviewReplyResponse.Error = null;
    addReviewReplyResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addReviewReplyResponse);

  logger.logInfo(
    `addReviewReplyResponse response :: ${JSON.stringify(
      addReviewReplyResponse
    )}`
  );

  logger.logInfo(`addReviewReplyResponse() completed`);
};

//Addleads Request
module.exports.addLeads = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addLeads invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDLEADS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addLeadsDetailsRequest = new coreRequestModel.addLeadsRequest(req);

  logger.logInfo(`addleads() :: Request Object :: ${addLeadsDetailsRequest}`);

  let requestContext = {
    ...addLeadsDetailsRequest,
  };

  let validateRequest = joiValidationModel.addLeads(addLeadsDetailsRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addLeadsDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    addLeadsResponse(functionContext, null);
    return;
  }

  try {
    let addLeadsDBResult = await databaseHelper.addLeadsDb(
      functionContext,
      requestContext
    );

    addLeadsResponse(functionContext, addLeadsDBResult);
  } catch (erraddLeads) {
    if (!erraddLeads.ErrorMessage && !erraddLeads.ErrorCode) {
      logger.logInfo(`addLeadsDBResult() :: Error :: ${erraddLeads}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addLeadsDBResult() :: Error :: ${JSON.stringify(erraddLeads)}`
    );
    addLeadsResponse(functionContext, null);
  }
};

//Add leads Response
const addLeadsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addLeadsResponse() invoked!`);

  let addLeadsResponse = new coreRequestModel.addLeadsResponse();

  addLeadsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addLeadsResponse.Error = functionContext.error;
    addLeadsResponse.Details = null;
  } else {
    addLeadsResponse.Error = null;
    addLeadsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addLeadsResponse);

  logger.logInfo(
    `addLeadsResponse response :: ${JSON.stringify(addLeadsResponse)}`
  );

  logger.logInfo(`addLeadsResponse() completed`);
};

//Fetch package details
module.exports.showpackageDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`showpackagedetails invoked()!!`);

  let functionContext = {
    requestType: requestType.SHOWPACKAGEDETAILS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let showpackageDetailsRequest =
    new coreRequestModel.showpackageDetailsRequest(req);

  logger.logInfo(
    `showpackageDetailsRequest() :: Request Object :: ${showpackageDetailsRequest}`
  );

  let requestContext = {
    ...showpackageDetailsRequest,
  };

  let validateRequest = joiValidationModel.showpackageDetails(
    showpackageDetailsRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `showpackageDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    showpackageDetailsResponse(functionContext, null);
    return;
  }

  try {
    let showpackageDetailsDBResult = await databaseHelper.showpackageDetailsDb(
      functionContext,
      requestContext
    );

    showpackageDetailsResponse(functionContext, showpackageDetailsDBResult);
  } catch (errshowpackageDetails) {
    if (
      !errshowpackageDetails.ErrorMessage &&
      !errshowpackageDetails.ErrorCode
    ) {
      logger.logInfo(
        `showpackageDetailsDBResult() :: Error :: ${errshowpackageDetails}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `showpackageDetailsDBResult() :: Error :: ${JSON.stringify(
        errshowpackageDetails
      )}`
    );
    showpackageDetailsResponse(functionContext, null);
  }
};

//Add Vendor Response
const showpackageDetailsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`showpackageDetailsResponse() invoked!`);

  let showpackageDetailsResponse =
    new coreRequestModel.showpackageDetailsResponse();

  showpackageDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    showpackageDetailsResponse.Error = functionContext.error;
    showpackageDetailsResponse.Details = null;
  } else {
    showpackageDetailsResponse.Error = null;
    showpackageDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, showpackageDetailsResponse);

  logger.logInfo(
    `showpackageDetailsResponse invoked:: ${JSON.stringify(addVendorResponse)}`
  );

  logger.logInfo(`showpackageDetailsResponse() completed`);
};

//Package Updation Request

module.exports.packageUpdation = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`packageUpdation() invoked()!!`);

  let functionContext = {
    requestType: requestType.PACKAGEUPDATION,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    CurrentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let packageUpdationDetailsRequest =
    new coreRequestModel.packageUpdationRequest(req); //

  logger.logInfo(
    `packageUpdationDetailsRequest() :: Request Object :: ${packageUpdationDetailsRequest}`
  );

  let requestContext = {
    ...packageUpdationDetailsRequest,
  };

  let validateRequest = joiValidationModel.packageUpdation(
    packageUpdationDetailsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `packageUpdationDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    packageUpdationResponse(functionContext, null);
    return;
  }

  try {
    let packageUpdationDBResult = await databaseHelper.packageUpdationDb(
      functionContext,
      requestContext
    );

    packageUpdationResponse(functionContext, packageUpdationDBResult);
  } catch (errPackageUpdation) {
    if (!errPackageUpdation.ErrorMessage && !errPackageUpdation.ErrorCode) {
      logger.logInfo(
        `packageUpdationDBResult() :: Error :: ${errPackageUpdation}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `packageUpdationDBResult() :: Error :: ${JSON.stringify(
        errPackageUpdation
      )}`
    );
    packageUpdationResponse(functionContext, null);
  }
};

// Package Updation Response

const packageUpdationResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`packageUpdationResponse() invoked!`);

  let packageUpdationResponse = new coreRequestModel.packageUpdationResponse();

  packageUpdationResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    packageUpdationResponse.Error = functionContext.error;
    packageUpdationResponse.Details = null;
  } else {
    packageUpdationResponse.Error = null;
    packageUpdationResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, packageUpdationResponse);

  logger.logInfo(
    `packageUpdationResponse response :: ${JSON.stringify(
      packageUpdationResponse
    )}`
  );

  logger.logInfo(`packageUpdationResponse() completed`);
};

//Show Balance Ads Request

module.exports.showBalanceAds = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`showBlanaceAds() invoked()!!`);

  let functionContext = {
    requestType: requestType.SHOWBALANCEADS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    CurrentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let showBlanaceAdsDetailsRequest = new coreRequestModel.showBalanceAdsRequest(
    req
  ); //

  logger.logInfo(
    `showBlanaceAdsDetailsRequest() :: Request Object :: ${showBlanaceAdsDetailsRequest}`
  );

  let requestContext = {
    ...showBlanaceAdsDetailsRequest,
  };

  let validateRequest = joiValidationModel.showBalanceAdsDetails(
    showBlanaceAdsDetailsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `showBlanaceAdsDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    showBalanceAdsResponse(functionContext, null);
    return;
  }
  try {
    let showBalanceAdsDBResult = await databaseHelper.showBalanceAdsDb(
      functionContext,
      requestContext
    );

    showBalanceAdsResponse(functionContext, showBalanceAdsDBResult);
  } catch (errshowBalanceAds) {
    if (!errshowBalanceAds.ErrorMessage && !errshowBalanceAds.ErrorCode) {
      logger.logInfo(
        `showBalanceAdsDBResult() :: Error :: ${errshowBalanceAds}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `showBalanceAdsDBResult() :: Error :: ${JSON.stringify(
        errshowBalanceAds
      )}`
    );
    showBalanceAdsResponse(functionContext, null);
  }
};

// Show Balance Ads Response

const showBalanceAdsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`showBalanceAdsResponse() invoked!`);

  let showBalanceAdsResponse = new coreRequestModel.showBalanceAdsResponse();

  showBalanceAdsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    showBalanceAdsResponse.Error = functionContext.error;
    showBalanceAdsResponse.Details = null;
  } else {
    showBalanceAdsResponse.Error = null;
    showBalanceAdsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, showBalanceAdsResponse);

  logger.logInfo(
    `showBalanceAdsResponse response :: ${JSON.stringify(
      showBalanceAdsResponse
    )}`
  );

  logger.logInfo(`showBalanceAdsResponse() completed`);
};

//add Catalogue

module.exports.addCatalogue = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addCatalogue() invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDCATALOGUE,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addCatalogueDetailsRequest = new coreRequestModel.addCatalogueRequest(
    req
  ); //

  logger.logInfo(
    `addCatalogueDetailsRequest() :: Request Object :: ${addCatalogueDetailsRequest}`
  );

  let requestContext = {
    ...addCatalogueDetailsRequest,
    ImageURL: null,
  };

  let validateRequest = joiValidationModel.addCatalogueDetails(
    addCatalogueDetailsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addCatalogueDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
    if (req.hasOwnProperty("files")) {
      var toBeUploaded = [];
      var imagetobeUploaded = [];

      console.log("REq.files", req);

      for (let count = 0; count < req.files.length; count++) {
        console.log("length", req.files.length);
        var file = req.files[count];
        if (file.hasOwnProperty("filename")) {
          if (file.filename) {
            const image = fs.readFileSync(file.path);
            requestContext.ImageURL = file.filename.split(" ").join("%20");
            const imageUrl = await FileUploadFunction(
              functionContext,
              requestContext,
              image
            );
            imagetobeUploaded.push(imageUrl);
          }
        }
      }

      const newimage = JSON.stringify(imagetobeUploaded);

      let addCatalogueDBResult = await databaseHelper.addCatalogueDb(
        functionContext,
        requestContext,
        newimage
        // requestContext.ImageURL
      );

      addCatalogueResponse(functionContext, addCatalogueDBResult);
    }
  } catch (erraddCatalogue) {
    if (!erraddCatalogue.ErrorMessage && !erraddCatalogue.ErrorCode) {
      logger.logInfo(`addCatalogueDBResult() :: Error :: ${erraddCatalogue}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addCatalogueDBResult() :: Error :: ${JSON.stringify(erraddCatalogue)}`
    );
    addCatalogueResponse(functionContext, null);
  }
};

// add Catalogue Response

const addCatalogueResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addCatalogueResponse() invoked!`);

  let addCatalogueResponse = new coreRequestModel.addCatalogueResponse();

  addCatalogueResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addCatalogueResponse.Error = functionContext.error;
    addCatalogueResponse.Details = null;
  } else {
    addCatalogueResponse.Error = null;
    addCatalogueResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addCatalogueResponse);

  logger.logInfo(
    `addCatalogueResponse response :: ${JSON.stringify(addCatalogueResponse)}`
  );

  logger.logInfo(`addCatalogueResponse() completed`);
};

async function FileUploadFunction(functionContext, resolvedResult, image) {
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
    Key: `CompanyLogo/${uuid.v4()}_${resolvedResult.ImageUrl}`,
    Body: image,
    ACL: "public-read",
  };

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
// {
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
//       Key: `catalogue/${resolvedResult.ImageURL}`,
//       Body: f,
//       ACL: "public-read",
//     });
//   });
//   try {
//     const responses = await Promise.all(
//       params.map((param) => s3.upload(param).promise())
//     );

//     console.log("responses", responses);
//     const storedlocation = responses[0].Location;
//     return storedlocation;
//     /// return responses;
//   } catch (err) {
//     logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);

//     functionContext.error = new errorModel.ErrorModel(
//       constant.ErrorMessage.ApplicationError,

//       constant.ErrorCode.ApplicationError
//     );

//     throw functionContext.error;
//   }
// }

//Get vendor radius
module.exports.getVendorsRadius = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`getVendorsRadius invoked()!!`);

  let functionContext = {
    requestType: requestType.GETVENDORSRADIUS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let getVendorsRadiusRequest = new coreRequestModel.getVendorsRadiusRequest(
    req
  );

  logger.logInfo(
    `getVendorsRadiusRequest() :: Request Object :: ${getVendorsRadiusRequest}`
  );

  let requestContext = {
    ...getVendorsRadiusRequest,
  };

  let validateRequest = joiValidationModel.getVendorsRadius(
    getVendorsRadiusRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `getVendorsRadiusRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    getVendorsRadiusResponse(functionContext, null);
    return;
  }

  try {
    let getVendorsRadiusDBResult = await databaseHelper.getVendorsRadiusDb(
      functionContext,
      requestContext
    );
    console.log('radius res',getVendorsRadiusDBResult);
    
    getVendorsRadiusResponse(functionContext, getVendorsRadiusDBResult);
  } catch (errGetVendorsRadiusDBResult) {
    if (
      !errGetVendorsRadiusDBResult.ErrorMessage &&
      !errGetVendorsRadiusDBResult.ErrorCode
    ) {
      logger.logInfo(
        `getVendorsRadiusDBResultDBResult() :: Error :: ${errGetVendorsRadiusDBResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `getVendorsRadiusDBResultDBResult() :: Error :: ${JSON.stringify(
        errGetVendorsRadiusDBResult
      )}`
    );
    getVendorsRadiusResponse(functionContext, null);
  }
};

//getVendorsRadius Response
const getVendorsRadiusResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`getVendorsRadiusResponse() invoked!`);

  let getVendorsRadiusResponse =
    new coreRequestModel.getVendorsRadiusResponse();

  getVendorsRadiusResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    getVendorsRadiusResponse.Error = functionContext.error;
    getVendorsRadiusResponse.Details = null;
  } else {
    getVendorsRadiusResponse.Error = null;
    getVendorsRadiusResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, getVendorsRadiusResponse);

  logger.logInfo(
    `getVendorsRadiusResponse invoked:: ${JSON.stringify(
      getVendorsRadiusResponse
    )}`
  );

  logger.logInfo(`getVendorsRadiusResponse() completed`);
};

//Add Business Details Request

module.exports.addBusinessDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addBusinessDetails() invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDBUSINESSDETAILS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addBusinessDetailsRequest =
    new coreRequestModel.addBusinessDetailsRequest(req); //

  logger.logInfo(
    `addBusinessDetailsRequest() :: Request Object :: ${addBusinessDetailsRequest}`
  );

  let requestContext = {
    ...addBusinessDetailsRequest,
    ImageURL: null,
    // VarificationImage:null,
  };

  let validateRequest = joiValidationModel.addBusinessDetail(
    addBusinessDetailsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addBusinessDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
    if (req.hasOwnProperty("files")) {
      var toBeUploaded = [];
      var imagetobeUploaded = [];

      // console.log("REq.files", req);

      for (let count = 0; count < req.files.length; count++) {
        console.log("length", req.files.length);
        var file = req.files[count];
        if (file.hasOwnProperty("filename")) {
          if (file.filename) {
            const image = fs.readFileSync(file.path);
            requestContext.ImageURL = file.filename.split(" ").join("%20");
            const imageUrl = await BusinessDetailsFileUploadFunction(
              functionContext,
              requestContext,
              image
            );
            imagetobeUploaded.push(imageUrl);
          }
        }
        // if (file.hasOwnProperty("filename")) {
        //   if (file.filename) {

        //     toBeUploaded[count] = fs.readFileSync(file.path);
        //     requestContext.ImageURL = file.filename.split(" ").join("%20");

        //   }
        // }

        //   const ImageUrl = await BusinessDetailsFileUploadFunction(
        //     functionContext,
        //     requestContext,
        //     // requestContext.ImageURL,
        //      toBeUploaded
        //   );
        //     // console.log(" imageurl to be checked", requestContext.ImageURL);
        //   imagetobeUploaded.push(ImageUrl);
      }

      const newimage = JSON.stringify(imagetobeUploaded);

      // console.log("IMages to be checked", newimage);

      let addBusinessDetailsDBResult =
        await databaseHelper.addBusinessDetailsDb(
          functionContext,
          requestContext,
          newimage
        );
      console.log("addBusinessDetailsDBResult", addBusinessDetailsDBResult);

      let addVendorDBResult = await databaseHelper.saveVendorIdDb(
        functionContext,
        addBusinessDetailsDBResult
      );

      if (requestContext?.BusinessRef !== null) {
        let addVendorServicesDBResult =
          await databaseHelper.updateVendorServices(
            functionContext,
            requestContext,
            addBusinessDetailsDBResult
          );

        console.log(
          "********addVendorServicesDBResult*********",
          addVendorServicesDBResult
        );
      }

      const finalResult = {
        ...addBusinessDetailsDBResult,
        ...addVendorDBResult,
      };
      // console.log("final results", finalResult);
      // console.log("vendorid", addBusinessDetailsDBResult.VendorId);
      // console.log("addVendorDBResult", addVendorDBResult);
      addBusinessDetailsResponse(functionContext, finalResult);
    }
  } catch (erraddBusinessDetail) {
    if (!erraddBusinessDetail.ErrorMessage && !erraddBusinessDetail.ErrorCode) {
      logger.logInfo(
        `addBusinessDetailsDBResult() :: Error :: ${erraddBusinessDetail}`
      );
      functionContext.error = new errorModel.ErrorModel(
        erraddBusinessDetail.ErrorMessage,
        erraddBusinessDetail.ErrorCode
      );
    }
    logger.logInfo(
      `addBusinessDetailsDBResult() :: Error :: ${JSON.stringify(
        erraddBusinessDetail
      )}`
    );
    addBusinessDetailsResponse(functionContext, null);
  }
};

// add Business Details Response

const addBusinessDetailsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addBusinessDetailsResponse() invoked!`);

  let addBusinessDetailsResponse =
    new coreRequestModel.addBusinessDetailsResponse();

  addBusinessDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addBusinessDetailsResponse.Error = functionContext.error;
    addBusinessDetailsResponse.Details = null;
  } else {
    addBusinessDetailsResponse.Error = null;
    addBusinessDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addBusinessDetailsResponse);

  logger.logInfo(
    `addBusinessDetailsResponse response :: ${JSON.stringify(
      addBusinessDetailsResponse
    )}`
  );

  logger.logInfo(`addBusinessDetailsResponse() completed`);
};

// async function BusinessDetailsFileUploadFunction(
//   functionContext,
//   resolvedResult,
//    files
// )

// {

//   var logger = functionContext.logger;
// const uuid = require("uuid");
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
//       Key: `Business/${uuid.v4()}_${file.filename}`,

//       //  Key: `Business/${resolvedResult.ImageURL}`,
//       Body: f,
//       ACL: "public-read",
//     });
//   });

//   try {
//     const responses = await Promise.all(
//       params.map((param) => s3.upload(param).promise())
//     );
//      console.log("location", responses[0].Location);
//     return responses[0].Location;

//   } catch (err) {
//     logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);

//     functionContext.error = new coreRequestModel.ErrorModel(
//       constant.ErrorMessage.ApplicationError,

//       constant.ErrorCode.ApplicationError
//     );

//     throw functionContext.error;
//   }
// }

async function BusinessDetailsFileUploadFunction(
  functionContext,
  resolvedResult,
  image
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
    Key: `Business/${uuid.v4()}_${resolvedResult.ImageURL}`,
    Body: image,
    ACL: "public-read",
  };

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

module.exports.addBusinessVerificationImage = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addBusinessVerificationImage() invoked()!!`);

  let functionContext = {
    requestType: requestType.ADDBUSINESSVERIFICATIONIMAGE,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let addBusinessVerificationImageRequest =
    new coreRequestModel.addBusinessVerificationImageRequest(req); //

  logger.logInfo(
    `addBusinessVerificationImageRequest() :: Request Object :: ${addBusinessVerificationImageRequest}`
  );

  let requestContext = {
    ...addBusinessVerificationImageRequest,
    ImageURL: null,
    // VarificationImage:null,
  };

  let validateRequest = joiValidationModel.addBusinessVerificationImage(
    addBusinessVerificationImageRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addBusinessVerificationImageRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
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
      const ImageUrl = await BusinessVerificationFileUploadFunction(
        functionContext,
        requestContext,
        toBeUploaded
      );

      let addCategoriesDBResult =
        await databaseHelper.addBusinessVerificationImagedb(
          functionContext,
          requestContext,
          ImageUrl
        );

      addBusinessVerificationImageResponse(
        functionContext,
        addCategoriesDBResult
      );
    }
    // try {
    //   if (req.hasOwnProperty("files")) {
    //     var toBeUploaded = [];
    //    // var imagetobeUploaded = [];

    //     for (let count = 0; count < req.files.length; count++) {
    //       var file = req.files[count];
    //       if (file.hasOwnProperty("filename")) {
    //         if (file.filename) {
    //           toBeUploaded[count] = fs.readFileSync(file.path);
    //           requestContext.ImageURL = file.filename.split(" ").join("%20");
    //         }
    //       }
    //     }
    //       const ImageUrl = await BusinessVerificationFileUploadFunction(
    //         functionContext,
    //         requestContext,
    //         toBeUploaded
    //       );
    //      // imagetobeUploaded.push(requestContext.ImageURL);

    //    // const newimage = JSON.stringify(imagetobeUploaded);

    //     let addBusinessVerificationImageDBResult =
    //       await databaseHelper.addBusinessVerificationImagedb(
    //         functionContext,
    //         requestContext,
    //         ImageUrl
    //       );

    //     addBusinessVerificationImageResponse(
    //       functionContext,
    //       addBusinessVerificationImageDBResult
    //     );
    //     }
  } catch (erraddBusinessVerificationImage) {
    if (
      !erraddBusinessVerificationImage.ErrorMessage &&
      !erraddBusinessVerificationImage.ErrorCode
    ) {
      logger.logInfo(
        `addBusinessVerificationImageDBResult() :: Error :: ${erraddBusinessVerificationImage}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addBusinessVerificationImageDBResult() :: Error :: ${JSON.stringify(
        erraddBusinessVerificationImage
      )}`
    );
    addBusinessVerificationImageResponse(functionContext, null);
  }
};

// add Business verification Image Response

const addBusinessVerificationImageResponse = (
  functionContext,
  resolvedResult
) => {
  const logger = functionContext.logger;

  logger.logInfo(`addBusinessVerificationImageResponse() invoked!`);

  let addBusinessVerificationImageResponse =
    new coreRequestModel.addBusinessVerificationImageResponse();

  addBusinessVerificationImageResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addBusinessVerificationImageResponse.Error = functionContext.error;
    addBusinessVerificationImageResponse.Details = null;
  } else {
    addBusinessVerificationImageResponse.Error = null;
    addBusinessVerificationImageResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(
    functionContext,
    addBusinessVerificationImageResponse
  );

  logger.logInfo(
    `addBusinessVerificationImageResponse response :: ${JSON.stringify(
      addBusinessVerificationImageResponse
    )}`
  );

  logger.logInfo(`addBusinessVerificationImageResponse() completed`);
};

async function BusinessVerificationFileUploadFunction(
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

//fetch business details request

module.exports.fetchBusinessDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchBusinessDetails invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHBUSINESSDETAILS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchBusinessDetailsRequest =
    new coreRequestModel.fetchBusinessDetailsRequest(req);

  logger.logInfo(
    `fetchBusinessDetails() :: Request Object :: ${fetchBusinessDetailsRequest}`
  );

  let requestContext = {
    ...fetchBusinessDetailsRequest,
  };

  let validateRequest = joiValidationModel.fetchBusinessDetails(
    fetchBusinessDetailsRequest
  ); //

  let fetchBusinessDetailsDBResult = null;
  let fetchBusinessDetailsSubCatDBResult = null;

  try {
    if (fetchBusinessDetailsRequest.BusinessId) {
      fetchBusinessDetailsDBResult =
        await databaseHelper.fetchBusinessDetailsDb(
          functionContext,
          requestContext
        );
    }

    if (fetchBusinessDetailsRequest.SubCategoryId) {
      fetchBusinessDetailsSubCatDBResult =
        await databaseHelper.fetchBusinessDetailsWrtSubCat(
          functionContext,
          requestContext
        );
    }

    let fetchAllBusinessDetailsDBResult =
      await databaseHelper.fetchAllBusinessDetailsDb(
        functionContext,
        requestContext
      );

    fetchBusinessDetailsResponse(
      functionContext,
      fetchBusinessDetailsDBResult,
      fetchAllBusinessDetailsDBResult,
      fetchBusinessDetailsSubCatDBResult
    );
  } catch (errfetchBusinessDetails) {
    if (
      !errfetchBusinessDetails.ErrorMessage &&
      !errfetchBusinessDetails.ErrorCode
    ) {
      logger.logInfo(
        `fetchBusinessDetailsDBResult() :: Error :: ${errfetchBusinessDetails}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchBusinessDetailsDBResult() :: Error :: ${JSON.stringify(
        errfetchBusinessDetails
      )}`
    );
    fetchBusinessDetailsResponse(functionContext, null);
  }
};

//Fetch business detailsResponse

const fetchBusinessDetailsResponse = (
  functionContext,
  resolvedResult1,
  resolvedResult2,
  resolvedResult3
) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchBusinessDetailsResponse() invoked!`);

  let fetchBusinessDetailsResponse =
    new coreRequestModel.fetchBusinessDetailsResponse();

  fetchBusinessDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchBusinessDetailsResponse.Error = functionContext.error;
    fetchBusinessDetailsResponse.Details = null;
  } else {
    fetchBusinessDetailsResponse.Error = null;
    fetchBusinessDetailsResponse.Details = resolvedResult1;
    fetchBusinessDetailsResponse.AllBusinessDetails = resolvedResult2;
    fetchBusinessDetailsResponse.Details = {
      ...fetchBusinessDetailsResponse.Details,
      ...resolvedResult3,
    };
  }
  appLib.SendHttpResponse(functionContext, fetchBusinessDetailsResponse);

  logger.logInfo(
    `fetchBusinessDetailsResponse response :: ${JSON.stringify(
      fetchBusinessDetailsResponse
    )}`
  );

  logger.logInfo(`fetchBusinessDetailsResponse() completed`);
};

// fetch business details wrt Vendor

module.exports.fetchBusinessDetailsWrtVendor = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchBusinessDetails invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHBUSINESSDETAILSWRTVENDOR,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchBusinessDetailsWrtVendorRequest =
    new coreRequestModel.fetchBusinessDetailsWrtVendorRequest(req);

  logger.logInfo(
    `fetchBusinessDetailsWrtVendor() :: Request Object :: ${fetchBusinessDetailsWrtVendorRequest}`
  );

  let requestContext = {
    ...fetchBusinessDetailsWrtVendorRequest,
  };
  let validateRequest = joiValidationModel.fetchBusinessDetailsWrtVendor(
    fetchBusinessDetailsWrtVendorRequest
  ); //

  try {
    let fetchBusinessDetailsWrtVendorDBResult =
      await databaseHelper.fetchBusinessDetailsWrtVendorDb(
        functionContext,
        requestContext
      );

    fetchBusinessDetailsWrtVendorResponse(
      functionContext,
      fetchBusinessDetailsWrtVendorDBResult
    );
  } catch (errfetchBusinessDetailsWrtVendor) {
    if (
      !errfetchBusinessDetailsWrtVendor.ErrorMessage &&
      !errfetchBusinessDetailsWrtVendor.ErrorCode
    ) {
      logger.logInfo(
        `fetchBusinessDetailsWrtVendorDBResult() :: Error :: ${errfetchBusinessDetailsWrtVendor}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchBusinessDetailsWrtVendorDBResult() :: Error :: ${JSON.stringify(
        errfetchBusinessDetailsWrtVendor
      )}`
    );
    fetchBusinessDetailsWrtVendorResponse(functionContext, null);
  }
};

//Fetch business details Wrt Vendor Response

const fetchBusinessDetailsWrtVendorResponse = (
  functionContext,
  resolvedResult
) => {
  const logger = functionContext.logger;

  logger.logInfo(`fetchBusinessDetailsWrtVendorResponse() invoked!`);

  let fetchBusinessDetailsWrtVendorResponse =
    new coreRequestModel.fetchBusinessDetailsWrtVendorResponse();

  fetchBusinessDetailsWrtVendorResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchBusinessDetailsWrtVendorResponse.Error = functionContext.error;
    fetchBusinessDetailsWrtVendorResponse.Details = null;
  } else {
    fetchBusinessDetailsWrtVendorResponse.Error = null;
    fetchBusinessDetailsWrtVendorResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(
    functionContext,
    fetchBusinessDetailsWrtVendorResponse
  );

  logger.logInfo(
    `fetchBusinessDetailsWrtVendorResponse  :: ${JSON.stringify(
      fetchBusinessDetailsWrtVendorResponse
    )}`
  );

  logger.logInfo(`fetchBusinessDetailsWrtVendorResponse() completed`);
};

module.exports.pushNotificationByVendor = async (req, res) => {
  var logger = new appLib.Logger(req.originalUrl, res.apiContext.requestID);

  logger.logInfo(`PushNotificationByVendor()`);

  let functionContext = {
    requestType: requestType.PUSHNOTIFICATIONBYVENDOR,
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
    `pushNotificationByVendor() Request :: ${JSON.stringify(req.body)}`
  );

  var pushNotificationByVendorRequest =
    new coreRequestModel.pushNotificationByVendorRequest(req);

  var validateRequest = joiValidationModel.pushNotificationByVendorRequest(
    pushNotificationByVendorRequest
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
    ...pushNotificationByVendorRequest,
  };

  try {
    let pushNotificationByVendorResult =
      await databaseHelper.getDetailsNotificationVendorDB(
        functionContext,
        requestContext
      );

    let UserDetails = pushNotificationByVendorResult[0][0];
    let VendorDetails = pushNotificationByVendorResult[1][0];
    let VendorToken = pushNotificationByVendorResult[2][0];

    let pushNotificationDataContextVendor = {
      requestId: res.apiContext.requestId,
      error: null,
      res: res,
      logger: logger,
      VendorId: VendorDetails.Id,
      Token: VendorToken.Token,
      Payload: {
        Title: `Great News, ${VendorDetails.Firstname}${VendorDetails.Lastname}  has confirmed and is ready to provide the service you are looking on Smartkhoj.Get in touch and finalise the details.`,
        Message: "Checkout his profile",
      },
      UserId: UserDetails.Id,
      FirstName: VendorDetails.Firstname,
      LastName: VendorDetails.Lastname,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss.SSS"),
    };

    const notifDetails = await saveNotificationByVendor(
      pushNotificationDataContextVendor
    );

    const pushNotif = await sendPushNotificationByVendor(
      pushNotificationDataContextVendor,
      notifDetails[0][0],
      notifDetails[1][0]
    );

    pushNotificationByVendorResponse(functionContext, pushNotif);
  } catch (errPushNotificationByVendor) {
    if (
      !errPushNotificationByVendor.ErrorMessage &&
      !errPushNotificationByVendor.ErrorCode
    ) {
      logger.logInfo(
        `errPushNotificationByVendor() :: Error :: ${errPushNotificationByVendor}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `errPushNotificationByVendor() :: Error :: ${JSON.stringify(
        errPushNotificationByVendor
      )}`
    );
    return null;
  }
};

var pushNotificationByVendorResponse = async (
  functionContext,
  resolvedResult
) => {
  const logger = functionContext.logger;

  logger.logInfo(`pushNotificationByVendorResponse() invoked!`);

  let pushNotificationByVendorResponse =
    new coreRequestModel.pushNotificationByVendorResponse();

  pushNotificationByVendorResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    pushNotificationByVendorResponse.Error = functionContext.error;
    pushNotificationByVendorResponse.Details = null;
  } else {
    pushNotificationByVendorResponse.Error = null;
    pushNotificationByVendorResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, pushNotificationByVendorResponse);

  logger.logInfo(
    `pushNotificationByVendorResponse response :: ${JSON.stringify(
      pushNotificationByVendorResponse
    )}`
  );

  logger.logInfo(`pushNotificationByVendorResponse() completed`);
};

var saveNotificationByVendor = async (
  pushNotificationDataContextVendor,
  functionContext
) => {
  try {
    let saveNotificationResult = await databaseHelper.saveNotificationVendorDB(
      pushNotificationDataContextVendor
    );

    return saveNotificationResult;
  } catch (errorSaveNotif) {
    if (!errorSaveNotif.ErrorMessage && !errorSaveNotif.ErrorCode) {
      functionContext.logger.logInfo(
        `errorSaveNotif() :: Error :: ${errorSaveNotif}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    functionContext.logger.logInfo(
      `errorSaveNotif() :: Error :: ${JSON.stringify(errorSaveNotif)}`
    );
    return null;
  }
};

var sendPushNotificationByVendor = async (
  pushNotificationDataContextVendor,
  notifDetails,
  image,
  type
) => {
  let deviceToken = pushNotificationDataContextVendor.Token;

  var { logger } = pushNotificationDataContextVendor;
  logger.logInfo(`sendPushNotificationByVendor Invoked()`);

  // console.log(
  //   "**** inside sendPushNotificationByVendor ***** deviceToken",
  //   deviceToken
  // );

  // console.log(
  //   "**** inside sendPushNotificationByVendor ***** pushNotificationDataContextVendor",
  //   pushNotificationDataContextVendor
  // );

  // console.log(
  //   "**** inside sendPushNotificationByVendor ***** notifDetails",
  //   notifDetails
  // );

  // console.log("**** inside sendPushNotificationByVendor ***** image", image);

  var pushNotificationDataVendor = {
    NotificationRef: notifDetails.NotificationRef,
    UserId: pushNotificationDataContextVendor.UserId,
    title:
      type === "job"
        ? `${pushNotificationDataContextVendor.FirstName} ${pushNotificationDataContextVendor.LastName} has posted a job in your category!`
        : `Great News, ${pushNotificationDataContextVendor.FirstName} ${pushNotificationDataContextVendor.LastName} has confirmed and is ready to provide the service you are looking on Smartkhoj. Get in touch and finalise the details.`,
    body: type === "job" ? "Checkout the job" : "Checkout the profile",
    VendorId: notifDetails.VendorId,
    image: image,
  };

  let cred =
    "AAAA4bDVu-0:APA91bGzpYTYbZ5zK8t8PPeQ1Aj58aDQApiQ9T4n7OYwFAQJxntHGWEuzXY82hBg-K1B1svRZoREJsysBPmOv8Noqr66oRBJY8WOncvS5jzpXZqJQFGowivxzkPJBwxRXQ-ouNihNwSc";
  const notifResult = await appLibModule.SendPushNotification(
    logger,
    pushNotificationDataVendor,
    deviceToken,
    cred
  );

  logger.logInfo(
    `sendPushNotification()  :: Pushnotification sent to User successfully`
  );
  // console.log("notifResult", notifResult);
  return notifResult;
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

//Subscribe to package
module.exports.subscribePackage = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`subscribePackage invoked()!!`);

  let functionContext = {
    requestType: requestType.SUSCRIBEPACKAGE,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let subscribePackageRequest = new coreRequestModel.subscribePackageRequest(
    req
  );

  logger.logInfo(
    `subscribePackage() :: Request Object :: ${subscribePackageRequest}`
  );

  let requestContext = {
    ...subscribePackageRequest,
  };

  let validateRequest = joiValidationModel.subscribePackage(
    subscribePackageRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `subscribePackageRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    subscribePackageResponse(functionContext, null);
    return;
  }

  try {
    let subscribePackageDbResult = await databaseHelper.subscribePackageDb(
      functionContext,
      requestContext
    );

    subscribePackageResponse(functionContext, subscribePackageDbResult);
  } catch (errSubscribePackageDbResult) {
    if (
      !errSubscribePackageDbResult.ErrorMessage &&
      !errSubscribePackageDbResult.ErrorCode
    ) {
      logger.logInfo(
        `subscribePackageDbResult() :: Error :: ${errSubscribePackageDbResult}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `subscribePackageDbResult() :: Error :: ${JSON.stringify(
        errSubscribePackageDbResult
      )}`
    );
    subscribePackageResponse(functionContext, null);
  }
};

//subscribePackage Response
const subscribePackageResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`subscribePackageResponse() invoked!`);

  let subscribePackageResponse =
    new coreRequestModel.subscribePackageResponse();

  subscribePackageResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    subscribePackageResponse.Error = functionContext.error;
    subscribePackageResponse.Details = null;
  } else {
    subscribePackageResponse.Error = null;
    subscribePackageResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, subscribePackageResponse);

  logger.logInfo(
    `subscribePackageResponse invoked:: ${JSON.stringify(
      subscribePackageResponse
    )}`
  );

  logger.logInfo(`subscribePackageResponse() completed`);
};

//chat initiated request
module.exports.chatInitiated = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`chatInitiated invoked()!!`);

  let functionContext = {
    requestType: requestType.CHATINITAITED,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let chatInitiatedRequest = new coreRequestModel.chatInitiatedRequest(req);

  logger.logInfo(
    `chatInitiated() :: Request Object :: ${chatInitiatedRequest}`
  );

  let requestContext = {
    ...chatInitiatedRequest,
  };

  let validateRequest = joiValidationModel.chatInitiated(chatInitiatedRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `chatInitiatedRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    chatInitiatedResponse(functionContext, null);
    return;
  }

  try {
    let chatInitiatedDbResult = await databaseHelper.chatInitiatedDb(
      functionContext,
      requestContext
    );

    chatInitiatedResponse(functionContext, chatInitiatedDbResult);
  } catch (errchatInitiated) {
    if (!errchatInitiated.ErrorMessage && !errchatInitiated.ErrorCode) {
      logger.logInfo(`chatInitiatedDbResult() :: Error :: ${errchatInitiated}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `chatInitiatedDbResult() :: Error :: ${JSON.stringify(errchatInitiated)}`
    );
    chatInitiatedResponse(functionContext, null);
  }
};

//chat initiated  Response
const chatInitiatedResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`chatInitiatedResponse() invoked!`);

  let chatInitiatedResponse = new coreRequestModel.chatInitiatedResponse();

  chatInitiatedResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    chatInitiatedResponse.Error = functionContext.error;
    chatInitiatedResponse.Details = null;
  } else {
    chatInitiatedResponse.Error = null;
    chatInitiatedResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, chatInitiatedResponse);

  logger.logInfo(
    `chatInitiatedResponse invoked:: ${JSON.stringify(chatInitiatedResponse)}`
  );

  logger.logInfo(`chatInitiatedResponse() completed`);
};

//fetch chat initiated request
module.exports.fetchchatInitiated = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchchatInitiated invoked()!!`);

  let functionContext = {
    requestType: requestType.FETCHCHATINITIATED,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let fetchchatInitiatedRequest =
    new coreRequestModel.fetchchatInitiatedRequest(req);

  logger.logInfo(
    `fetchchatInitiated() :: Request Object :: ${fetchchatInitiatedRequest}`
  );

  let requestContext = {
    ...fetchchatInitiatedRequest,
  };
  let validateRequest = joiValidationModel.fetchchatInitiated(
    fetchchatInitiatedRequest
  );

  try {
    let fetchchatInitiatedDBResult = await databaseHelper.fetchchatInitiatedDb(
      functionContext,
      requestContext
    );

    fetchchatInitiatedResponse(functionContext, fetchchatInitiatedDBResult);
  } catch (errfetchchatInitiated) {
    if (
      !errfetchchatInitiated.ErrorMessage &&
      !errfetchchatInitiated.ErrorCode
    ) {
      logger.logInfo(
        `fetchchatInitiated() :: Error :: ${errfetchchatInitiated}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchchatInitiatedDBResult() :: Error :: ${JSON.stringify(
        errfetchchatInitiated
      )}`
    );
    fetchchatInitiatedResponse(functionContext, null);
  }
};

//Fetch business detailsResponse

const fetchchatInitiatedResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`v() invoked!`);

  let fetchchatInitiatedResponse =
    new coreRequestModel.fetchchatInitiatedResponse();

  fetchchatInitiatedResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    fetchchatInitiatedResponse.Error = functionContext.error;
    fetchchatInitiatedResponse.Details = null;
  } else {
    fetchchatInitiatedResponse.Error = null;
    fetchchatInitiatedResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchchatInitiatedResponse);

  logger.logInfo(
    `fetchchatInitiatedResponse response :: ${JSON.stringify(
      fetchchatInitiatedResponse
    )}`
  );

  logger.logInfo(`fetchchatInitiatedResponse() completed`);
};

//save business link request
module.exports.businessLink = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`businessLink invoked()!!`);

  let functionContext = {
    requestType: requestType.BUSINESSLINK,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let BusinessLinkRequest = new coreRequestModel.saveBusinessLinkRequest(req);

  logger.logInfo(
    `BusinessLinkRequest() :: Request Object :: ${BusinessLinkRequest}`
  );

  let requestContext = {
    ...BusinessLinkRequest,
  };

  let validateRequest =
    joiValidationModel.saveBusinessLink(BusinessLinkRequest);

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `BusinessLinkRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
    saveBusinessLinkResponse(functionContext, null);
    return;
  }

  try {
    let BusinessLinkDbResult = await databaseHelper.saveBusinessLinkdDb(
      functionContext,
      requestContext
    );

    saveBusinessLinkResponse(functionContext, BusinessLinkDbResult);
  } catch (errBusinessLink) {
    if (!errBusinessLink.ErrorMessage && !errBusinessLink.ErrorCode) {
      logger.logInfo(`BusinessLinkDbResult() :: Error :: ${errBusinessLink}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `BusinessLinkDbResult() :: Error :: ${JSON.stringify(errBusinessLink)}`
    );
    saveBusinessLinkResponse(functionContext, null);
  }
};

//save  BusinessLink   Response
const saveBusinessLinkResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`saveBusinessLinkResponse() invoked!`);

  let saveBusinessLinkResponse =
    new coreRequestModel.saveBusinessLinkResponse();

  saveBusinessLinkResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    saveBusinessLinkResponse.Error = functionContext.error;
    saveBusinessLinkResponse.Details = null;
  } else {
    saveBusinessLinkResponse.Error = null;
    saveBusinessLinkResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, saveBusinessLinkResponse);

  logger.logInfo(
    `saveBusinessLinkResponse invoked:: ${JSON.stringify(
      saveBusinessLinkResponse
    )}`
  );

  logger.logInfo(`saveBusinessLinkResponse() completed`);
};

//add Company Details

module.exports.addCompanyDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addCompanyDetails() invoked()!!`);

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

  let addCompanyDetailsRequest = new coreRequestModel.addCompanyDetailsRequest(
    req
  );

  logger.logInfo(
    `addCompanyDetails() :: Request Object :: ${addCompanyDetailsRequest}`
  );

  let requestContext = {
    ...addCompanyDetailsRequest,
    ImageUrl: null,
  };

  let validateRequest = joiValidationModel.addCompanyDetails(
    addCompanyDetailsRequest
  ); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addCompanyDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
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
              image
            );
            imagetobeUploaded.push(imageUrl);
          }
        }
      }

      const newimage = JSON.stringify(imagetobeUploaded);

      // addCompanyDetailsRequest.Logo = newimage;

      let addCompanyDetailsDBResult =
        await databaseHelper.addCompanyDetailsDBDB(
          functionContext,
          requestContext,
          newimage
          // requestContext.ImageURL
        );

      addCompanyDetailsResponse(functionContext, addCompanyDetailsDBResult);
    }
  } catch (erraddCompanyDetails) {
    if (!erraddCompanyDetails.ErrorMessage && !erraddCompanyDetails.ErrorCode) {
      logger.logInfo(
        `addCompanyDetailsDBResult() :: Error :: ${erraddCompanyDetails}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addCompanyDetailsDBResult() :: Error :: ${JSON.stringify(
        erraddCompanyDetails
      )}`
    );
    addCompanyDetailsResponse(functionContext, null);
  }
};

// add Company Details Response

const addCompanyDetailsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addCompanyDetailsResponse() invoked!`);

  let addCompanyDetailsResponse =
    new coreRequestModel.addCompanyDetailsResponse();

  addCompanyDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addCompanyDetailsResponse.Error = functionContext.error;
    addCompanyDetailsResponse.Details = null;
  } else {
    addCompanyDetailsResponse.Error = null;
    addCompanyDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addCompanyDetailsResponse);

  logger.logInfo(
    `addCompanyDetailsResponse response :: ${JSON.stringify(
      addCompanyDetailsResponse
    )}`
  );

  logger.logInfo(`addCompanyDetailsResponse() completed`);
};

//add Job Details

module.exports.addJobDetails = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addJobDetails() invoked()!!`);

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

  let addJobDetailsRequest = new coreRequestModel.addJobDetailsRequest(req);

  logger.logInfo(
    `addJobDetails() :: Request Object :: ${addJobDetailsRequest}`
  );

  let requestContext = {
    ...addJobDetailsRequest,
  };

  let validateRequest = joiValidationModel.addJobDetails(addJobDetailsRequest); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addJobDetailsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
    let addJobDetailsDBResult = await databaseHelper.addJobsDetailsDB(
      functionContext,
      requestContext
      // newimage
      // requestContext.ImageURL
    );

    addJobDetailsResponse(functionContext, addJobDetailsDBResult);
  } catch (erraddJobDetails) {
    if (!erraddJobDetails.ErrorMessage && !erraddJobDetails.ErrorCode) {
      logger.logInfo(`addJobDetailsDBResult() :: Error :: ${erraddJobDetails}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addJobDetailsDBResult() :: Error :: ${JSON.stringify(erraddJobDetails)}`
    );
    addJobDetailsResponse(functionContext, null);
  }
};

// add Job Details Response

const addJobDetailsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addJobDetailsResponse() invoked!`);

  let addJobDetailsResponse = new coreRequestModel.addJobDetailsResponse();

  addJobDetailsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addJobDetailsResponse.Error = functionContext.error;
    addJobDetailsResponse.Details = null;
  } else {
    addJobDetailsResponse.Error = null;
    addJobDetailsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addJobDetailsResponse);

  logger.logInfo(
    `addJobDetailsResponse response :: ${JSON.stringify(addJobDetailsResponse)}`
  );

  logger.logInfo(`addJobDetailsResponse() completed`);
};

//add Job Summary

module.exports.addJobSummary = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`addJobSummary() invoked()!!`);

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

  let addJobSummaryRequest = new coreRequestModel.addJobSummaryRequest(req);

  logger.logInfo(
    `addJobSummary() :: Request Object :: ${addJobSummaryRequest}`
  );

  let requestContext = {
    ...addJobSummaryRequest,
  };

  let validateRequest = joiValidationModel.addJobSummary(addJobSummaryRequest); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `addJobSummaryRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
    let addJobSummaryDBResult = await databaseHelper.addJobsSummaryDB(
      functionContext,
      requestContext
      // newimage
      // requestContext.ImageURL
    );

    addJobSummaryResponse(functionContext, addJobSummaryDBResult);
  } catch (erraddJobSummary) {
    if (!erraddJobSummary.ErrorMessage && !erraddJobSummary.ErrorCode) {
      logger.logInfo(`addJobSummaryDBResult() :: Error :: ${erraddJobSummary}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `addJobSummaryDBResult() :: Error :: ${JSON.stringify(erraddJobSummary)}`
    );
    addJobSummaryResponse(functionContext, null);
  }
};

// add Job Summary Response

const addJobSummaryResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`addJobSummaryResponse() invoked!`);

  let addJobSummaryResponse = new coreRequestModel.addJobSummaryResponse();

  addJobSummaryResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    addJobSummaryResponse.Error = functionContext.error;
    addJobSummaryResponse.Details = null;
  } else {
    addJobSummaryResponse.Error = null;
    addJobSummaryResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, addJobSummaryResponse);

  logger.logInfo(
    `addJobSummaryResponse response :: ${JSON.stringify(addJobSummaryResponse)}`
  );

  logger.logInfo(`addJobSummaryResponse() completed`);
};

//fetch jobs

module.exports.fetchJobs = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`fetchJobs() invoked()!!`);

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

  let fetchJobsRequest = new coreRequestModel.fetchJobsRequest(req);

  logger.logInfo(`fetchJobs() :: Request Object :: ${fetchJobsRequest}`);

  let requestContext = {
    ...fetchJobsRequest,
  };

  let validateRequest = joiValidationModel.fetchJobs(fetchJobsRequest); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `fetchJobsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
    if (requestContext?.VendorId !== null) {
      let fetchJobsDBResult = await databaseHelper.fetchJobsPostedByVendorDB(
        functionContext,
        requestContext
      );
      fetchJobsResponse(functionContext, fetchJobsDBResult);
    } else if (requestContext?.JobId !== null) {
      let fetchJobsDetailsDBResult = await databaseHelper.fetchJobDetailsDB(
        functionContext,
        requestContext
      );
      fetchJobsResponse(functionContext, fetchJobsDetailsDBResult);
    } else {
      let fetchAllJobsDBResult = await databaseHelper.fetchAllJobsDB(
        functionContext,
        requestContext
      );

      let savedDBResult = await fetchSavedJobsDb(
        functionContext,
        requestContext
      );

      let allJobsArr = [];

      fetchAllJobsDBResult.forEach((el1) => {
        allJobsArr.push({ ...el1, SavedJob: 0, SavedJobRef: null });
      });

      allJobsArr.forEach((element) => {
        savedDBResult?.forEach((el2) => {
          if (element.Id === el2.JobId) {
            element.SavedJob = 1;
            element.SavedJobRef = el2.SavedJobRef;
          }
        });
      });

      fetchJobsResponse(functionContext, allJobsArr);
    }
  } catch (errfetchJobs) {
    if (!errfetchJobs.ErrorMessage && !errfetchJobs.ErrorCode) {
      logger.logInfo(`fetchJobsDBResult() :: Error :: ${errfetchJobs}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchJobsDBResult() :: Error :: ${JSON.stringify(errfetchJobs)}`
    );
    fetchJobsResponse(functionContext, null);
  }
};

// fetch jobs  Response

const fetchJobsResponse = (functionContext, resolvedResult) => {

  const logger = functionContext.logger;

  logger.logInfo(`fetchJobsResponse() invoked!`);

  let fetchJobsResponse = new coreRequestModel.fetchJobsResponse();

  fetchJobsResponse.RequestID = functionContext.requestId;

  if (functionContext.error) {
    fetchJobsResponse.Error = functionContext.error;
    fetchJobsResponse.Details = null;
  } else {
    fetchJobsResponse.Error = null;
    fetchJobsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, fetchJobsResponse);
  logger.logInfo(
    `fetchJobsResponse response :: ${JSON.stringify(fetchJobsResponse)}`
  );

  logger.logInfo(`fetchJobsResponse() completed`);
};

//delete jobs

module.exports.deleteJobs = async (req, res) => {
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

  let deleteJobsRequest = new coreRequestModel.deleteJobsRequest(req);

  logger.logInfo(`deleteJobs() :: Request Object :: ${deleteJobsRequest}`);

  let requestContext = {
    ...deleteJobsRequest,
  };

  let validateRequest = joiValidationModel.deleteJobs(deleteJobsRequest); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deleteJobsRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  //image upload
  try {
    let deleteJobsDBResult = await databaseHelper.deleteJobsPostedByVendorDB(
      functionContext,
      requestContext
      // newimage
      // requestContext.ImageURL
    );

    deleteJobsResponse(functionContext, deleteJobsDBResult);
  } catch (errdeleteJobs) {
    if (!errdeleteJobs.ErrorMessage && !errdeleteJobs.ErrorCode) {
      logger.logInfo(`deleteJobsDBResult() :: Error :: ${errdeleteJobs}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deleteJobsDBResult() :: Error :: ${JSON.stringify(errdeleteJobs)}`
    );
    deleteJobsResponse(functionContext, null);
  }
};

//delete jobs  Response

const deleteJobsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deleteJobsResponse() invoked!`);

  let deleteJobsResponse = new coreRequestModel.deleteJobsResponse();

  deleteJobsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deleteJobsResponse.Error = functionContext.error;
    deleteJobsResponse.Details = null;
  } else {
    deleteJobsResponse.Error = null;
    deleteJobsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deleteJobsResponse);

  logger.logInfo(
    `deleteJobsResponse response :: ${JSON.stringify(deleteJobsResponse)}`
  );

  logger.logInfo(`deleteJobsResponse() completed`);
};

module.exports.jobNotifications = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`jobNotifications() invoked()!!`);

  let functionContext = {
    requestType: requestType.JOBNOTIFICATIONS,
    requestId: res.apiContext.requestId,
    error: null,
    res: res,
    logger: logger,
    currentTs: momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss "),
  };

  let jobNotificationRequest = new coreRequestModel.jobNotificationsRequest(
    req
  );

  logger.logInfo(
    `jobNotificationRequest() :: Request Object :: ${jobNotificationRequest}`
  );

  let requestContext = {
    ...jobNotificationRequest,
  };

  let validateRequest = joiValidationModel.jobNotification(
    jobNotificationRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `jobNotificationRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  try {
    let fetchUsersBasedOnCategorgyResult =
      await databaseHelper.fetchUsersBasedOnCategoryDB(
        functionContext,
        requestContext
      );

    let VendorDetails = await databaseHelper.fetchVendorDb(
      functionContext,
      requestContext
    );

    const pushNotifiationArr = [];

    fetchUsersBasedOnCategorgyResult?.forEach(async (element) => {
      let pushNotificationDataContextVendor = {
        requestId: res.apiContext.requestId,
        error: null,
        res: res,
        logger: logger,
        VendorId: VendorDetails[0]?.Id,
        Token: element?.Token,
        Payload: {
          Title: `${VendorDetails[0].Firstname} ${VendorDetails[0].Lastname} has posted a job in your category!`,
          Message: "Checkout the Job",
        },
        UserId: element.UserId,
        FirstName: VendorDetails[0]?.Firstname,
        LastName: VendorDetails[0]?.Lastname,
        currentTs: momentTimezone
          .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss.SSS"),
        JobId: requestContext.JobId,
      };

      const saveNotifToDB = await databaseHelper.saveJobNotificationVendorDB(
        pushNotificationDataContextVendor,
        functionContext
      );

      // console.log("saveNotifToDB ==> ", saveNotifToDB);

      const pushNotif = await sendPushNotificationByVendor(
        pushNotificationDataContextVendor,
        saveNotifToDB[0][0],
        saveNotifToDB[1][0],
        "job"
      );

      console.log("PUSH NOTIF :: ==>", pushNotif);

      pushNotifiationArr.push(pushNotif);
    });

    console.log("PUSH NOTIF ARR", pushNotifiationArr);
    jobNotificationsResponse(functionContext, "Notification Sent");
  } catch (errdeleteJobs) {
    if (!errdeleteJobs.ErrorMessage && !errdeleteJobs.ErrorCode) {
      logger.logInfo(`deleteJobsDBResult() :: Error :: ${errdeleteJobs}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `deleteJobsDBResult() :: Error :: ${JSON.stringify(errdeleteJobs)}`
    );
    jobNotificationsResponse(functionContext, null);
  }
};

const jobNotificationsResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deleteJobsResponse() invoked!`);

  let jobNotificationsResponse =
    new coreRequestModel.jobNotificationsResponse();

  jobNotificationsResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    jobNotificationsResponse.Error = functionContext.error;
    jobNotificationsResponse.Details = null;
  } else {
    jobNotificationsResponse.Error = null;
    jobNotificationsResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, jobNotificationsResponse);

  logger.logInfo(
    `jobNotificationsResponse response :: ${JSON.stringify(
      jobNotificationsResponse
    )}`
  );

  logger.logInfo(`jobNotificationsResponse() completed`);
};

module.exports.deleteUser = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`deleteUser() invoked()!!`);

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

  let deleteUserRequest = new coreRequestModel.deleteUserRequest(req);

  logger.logInfo(`deleteJobs() :: Request Object :: ${deleteUserRequest}`);

  let requestContext = {
    ...deleteUserRequest,
  };

  let validateRequest = joiValidationModel.deleteUser(deleteUserRequest); //

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `deleteUserRequest() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  try {
    await databaseHelper.deleteUserDB(functionContext, requestContext);

    deleteUserResponse(functionContext, "User Deleted Successfully");
  } catch (errdeleteUser) {
    if (!errdeleteUser.ErrorMessage && !errdeleteUser.ErrorCode) {
      logger.logInfo(`deleteJobsDBResult() :: Error :: ${errdeleteUser}`);
      functionContext.error = new errorModel.ErrorModel(
        errdeleteUser.ErrorMessag,
        errdeleteUser.ErrorCode
      );
    }
    logger.logInfo(
      `deleteJobsDBResult() :: Error :: ${JSON.stringify(errdeleteUser)}`
    );
    deleteUserResponse(functionContext, null);
  }
};

const deleteUserResponse = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`deleteUserResponse() invoked!`);

  let deleteUserResponse = new coreRequestModel.deleteUserResponse();

  deleteUserResponse.RequestId = functionContext.requestId;

  if (functionContext.error) {
    deleteUserResponse.Error = functionContext.error;
    deleteUserResponse.Details = null;
  } else {
    deleteUserResponse.Error = null;
    deleteUserResponse.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, deleteUserResponse);

  logger.logInfo(
    `deleteUserResponse response :: ${JSON.stringify(deleteUserResponse)}`
  );

  logger.logInfo(`deleteUserResponse() completed`);
};

module.exports.updateUserVendorMessageStatus = async (req, res) => {
  let logger = new appLib.Logger(req.originalUrl, res.apiContext.requestId);

  logger.logInfo(`updateUserVendorMessageStatus() invoked()!!`);

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

  let updateUserVendorMessageStatusRequest =
    new coreRequestModel.updateUserVendorMessageStatusRequest(req);

  logger.logInfo(
    `updateUserVendorMessageStatus() :: Request Object :: ${updateUserVendorMessageStatusRequest}`
  );

  let validateRequest = joiValidationModel.updateUserVendorMessageStatus(
    updateUserVendorMessageStatusRequest
  );

  if (validateRequest.error) {
    functionContext.error = new errorModel.ErrorModel(
      validateRequest.error.details[0]["message"],
      constant.ErrorCode.Invalid_Request
    );
    logger.logInfo(
      `updateUserVendorMessageStatus() Error:: Invalid Request :: ${JSON.stringify(
        validateRequest
      )}`
    );
  }

  try {
    const dbResult = await databaseHelper.updateUserVendorMessageStatusInDB(
      functionContext,
      updateUserVendorMessageStatusRequest
    );
    updateUserVendorMessageStatus(functionContext, dbResult);
  } catch (errfetchJobs) {
    if (!errfetchJobs.ErrorMessage && !errfetchJobs.ErrorCode) {
      logger.logInfo(`fetchJobsDBResult() :: Error :: ${errfetchJobs}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.ErrorMessage.ApplicationError,
        constant.ErrorCode.ApplicationError
      );
    }
    logger.logInfo(
      `fetchJobsDBResult() :: Error :: ${JSON.stringify(errfetchJobs)}`
    );
    updateUserVendorMessageStatus(functionContext, null);
  }
};

const updateUserVendorMessageStatus = (functionContext, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`updateUserVendorMessageStatus() invoked!`);

  let updateUserVendorMessageStatus =
    new coreRequestModel.updateUserVendorMessageStatusResponse();

  updateUserVendorMessageStatus.RequestID = functionContext.requestId;

  if (functionContext.error) {
    updateUserVendorMessageStatus.Error = functionContext.error;
    updateUserVendorMessageStatus.Details = null;
  } else {
    updateUserVendorMessageStatus.Error = null;
    updateUserVendorMessageStatus.Details = resolvedResult;
  }
  appLib.SendHttpResponse(functionContext, updateUserVendorMessageStatus);

  logger.logInfo(
    `updateUserVendorMessageStatus response :: ${JSON.stringify(
      updateUserVendorMessageStatus
    )}`
  );

  logger.logInfo(`updateUserVendorMessageStatus() completed`);
};
