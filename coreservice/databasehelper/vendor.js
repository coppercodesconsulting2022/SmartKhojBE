const databaseModule = require("../database/database");
const constant = require("../common/constant");
const errorModel = require("../models/serviceModel/error");

//AddVendor
module.exports.addVendorDb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;
  logger.logInfo("AddVendorDB() Invoked !");

  let image = null;

  if (imageUrl) {
    image = imageUrl;
  } else if (resolvedResult?.Image) {
    image = resolvedResult?.Image?.replaceAll('"', "");
  } else {
    image = null;
  }

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_vendors(:VendorRef,:Firstname,:Lastname,:Phone,:Email,:DOB,:Gender,:State,:Password,:Image,:IsActive,:CreatedOn)`,
      {
        VendorRef: resolvedResult.VendorRef,
        Firstname: resolvedResult.Firstname,
        Lastname: resolvedResult.Lastname,
        Phone: resolvedResult.Phone,
        Email: resolvedResult.Email,
        DOB: resolvedResult.DOB,
        Gender: resolvedResult.Gender,
        State: resolvedResult.State,
        Password: resolvedResult.Password,
        Image: image,
        IsActive: resolvedResult.IsActive,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addVendorDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddVendorDb) {
    logger.logInfo(
      `addVendorDb() :: Error :: ${JSON.stringify(erraddVendorDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddVendorDb.sqlState &&
      erraddVendorDb.sqlState == constant.ErrorCode.PhoneNo_Already_Exists
    ) {
      errorCode = constant.ErrorCode.PhoneNo_Already_Exists;
      errorMessage = constant.ErrorMessage.PhoneNo_Already_Exists;
    } else if (
      erraddVendorDb.sqlState &&
      erraddVendorDb.sqlState == constant.ErrorCode.Email_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Email_Already_Exists;
      errorMessage = constant.ErrorMessage.Email_Already_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};
//Edit Vendor
module.exports.editVendorDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;
  logger.logInfo("editVendorDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_edit_vendors(:VendorRef,:Firstname,:Lastname,:Phone,:Email,:DOB,:Gender,:Password,:CreatedOn)`,
      {
        VendorRef: resolvedResult.VendorRef,
        Firstname: resolvedResult.Firstname,
        Lastname: resolvedResult.Lastname,
        Phone: resolvedResult.Phone,
        Email: resolvedResult.Email,
        DOB: resolvedResult.DOB,
        Gender: resolvedResult.Gender,
        Password: resolvedResult.Password,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `editVendorDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erreditVendorDb) {
    logger.logInfo(
      `editVendorDb() :: Error :: ${JSON.stringify(erreditVendorDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Vendor
module.exports.fetchVendorDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;
  logger.logInfo("fetchVendorDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_vendor(:VendorRef)`,
      {
        VendorRef: resolvedResult.VendorRef,
      }
    );

    logger.logInfo(
      `fetchVendorDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    // console.log("rows", rows[0]);
    // const details = [rows[0][0][0], rows[0][1][0], rows[0][2][0]];
    return (
      // !resolvedResult.VendorRef ? rows[0][0] : rows[0][0][0],
      !resolvedResult.VendorRef
        ? rows[0][0]
        : [rows[0][0][0], rows[0][1][0], rows[0][2][0]]
    );

    // return rows[0][0][0], rows[0][1][0], rows[0][2][0];
  } catch (errfetchVendorDb) {
    logger.logInfo(
      `fetchVendorDb() :: Error :: ${JSON.stringify(errfetchVendorDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddReviewReplyDb.sqlState &&
      erraddReviewReplyDb.sqlState == constant.ErrorCode.Vendor_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Vendor_Dont_Exists;
      errorMessage = constant.ErrorMessage.Vendor_Dont_Exists;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//addReview Reply
module.exports.addReviewReplyDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addReviewReplyDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_review_reply(:ReviewRef,:ReviewReply,:CurrentTs )`,
      {
        ReviewRef: resolvedResult.ReviewRef,
        // BusinessId: resolvedResult.BusinessId,
        ReviewReply: resolvedResult.ReviewReply,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addReviewReplyDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddReviewReplyDb) {
    logger.logInfo(
      `addReviewReplyDb() :: Error :: ${JSON.stringify(erraddReviewReplyDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddReviewReplyDb.sqlState &&
      erraddReviewReplyDb.sqlState ==
        constant.ErrorCode.Review_Reply_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Review_Reply_Already_Exists;
      errorMessage = constant.ErrorMessage.Review_Reply_Already_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};
//Add Leads

module.exports.addLeadsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addLeadsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_leads(:BusinessId,:Calls,:Visits,:Leads,:CreatedOn)`,
      {
        BusinessId: resolvedResult.BusinessId,
        Calls: resolvedResult.Calls,
        Visits: resolvedResult.Visits,
        Leads: resolvedResult.Leads,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addLeadsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddLeadsDb) {
    logger.logInfo(
      `erraddLeadsDb() :: Error :: ${JSON.stringify(erraddLeadsDb)}`
    );

    throw functionContext.error;
  }
};

//Fetch Leads

module.exports.fetchLeadsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchLeadsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_leads(:BusinessId)`,
      {
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `fetchLeadsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    // return rows[0][0][0] ? rows[0][0][0] : null;
    var LeadsDetails = {};
    LeadsDetails = {
      AllLeads: rows[0][0] ? rows[0][0] : null,
      Daily: rows[0][1] ? rows[0][1] : null,
      Weakly: rows[0][2] ? rows[0][2] : null,
      Monthly: rows[0][3] ? rows[0][3] : null,
    };
    return LeadsDetails;
  } catch (errfetchLeadsDb) {
    logger.logInfo(
      `fetchLeadsDb() :: Error :: ${JSON.stringify(errfetchLeadsDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errfetchLeadsDb.sqlState &&
      errfetchLeadsDb.sqlState == constant.ErrorCode.No_Leads_Found
    ) {
      errorCode = constant.ErrorCode.No_Leads_Found;
      errorMessage = constant.ErrorMessage.No_Leads_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);

    throw functionContext.error;
  }
};

//package updation
module.exports.packageUpdationDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("packageUpdationDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_package_updation(:PackageName,:Amount,:IsCatalogue,:BalanceAds,:IsActive,:IsVerified,:IsCertified,:IsTrusted,:IsChat,:CurrentTs )`,
      {
        PackageName: resolvedResult.PackageName,
        Amount: resolvedResult.Amount,
        IsCatalogue: resolvedResult.IsCatalogue,
        BalanceAds: resolvedResult.BalanceAds,
        IsActive: resolvedResult.IsActive,
        IsVerified: resolvedResult.IsVerified,
        IsCertified: resolvedResult.IsCertified,
        IsTrusted: resolvedResult.IsTrusted,
        IsChat: resolvedResult.IsChat,
        CurrentTs: functionContext.CurrentTs,
      }
    );

    logger.logInfo(
      `packageUpdationDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errpackageUpdationDb) {
    logger.logInfo(
      `packageUpdationDb() :: Error :: ${JSON.stringify(errpackageUpdationDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Package details

module.exports.showpackageDetailsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("showpackageDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_show_package_details(:BusinessId)`,
      {
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `showpackageDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errshowpackageDetailsDb) {
    logger.logInfo(
      `errshowpackageDetailsDb() :: Error :: ${JSON.stringify(
        errshowpackageDetailsDb
      )}`
    );

    throw functionContext.error;
  }
};

//Show Balance Ads
module.exports.showBalanceAdsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("showBalanceAdsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_show_balance_ads(:BusinessId)`,
      {
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `showBalanceAdsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errshowBalanceAdsDb) {
    logger.logInfo(
      `showBalanceAdsDb() :: Error :: ${JSON.stringify(errshowBalanceAdsDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errshowBalanceAdsDb.sqlState &&
      errshowBalanceAdsDb.sqlState == constant.ErrorCode.Package_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Package_Dont_Exists;
      errorMessage = constant.ErrorMessage.Package_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//add catalogue
module.exports.addCatalogueDb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;
  logger.logInfo("addCatalogueDb() Invoked !");

  let image = [];

  console.log("resolvedResult?.Image;", resolvedResult?.Image);
  console.log("resolvedResult?.imageUrl;", imageUrl);

  if (imageUrl === "[]") {
    resolvedResult?.Image?.split(",")?.forEach((element) => {
      image.push(element);
    });

    console.log("image", image);
  } else {
    image = imageUrl;
  }

  console.log("IMAGES", image);

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_catalogue(:ProductRef,:BusinessId,:ProductTitle,:Amount,:ProductDescription,:Image,:Quantity,:Phone,:CreatedOn)`,
      {
        ProductRef: resolvedResult.ProductRef,
        BusinessId: resolvedResult.BusinessId,
        ProductTitle: resolvedResult.ProductTitle,
        Amount: resolvedResult.Amount,
        ProductDescription: resolvedResult.ProductDescription,
        Image: image,
        Quantity: resolvedResult.Quantity,
        Phone: resolvedResult.Phone,
        CreatedOn: functionContext.currentTs,
      }
    );
    logger.logInfo(
      `addCatalogueDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddCatalogueDbDb) {
    logger.logInfo(
      `erraddCatalogueDbDb() :: Error :: ${JSON.stringify(erraddCatalogueDbDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Vendor Radius

module.exports.getVendorsRadiusDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("getVendorsRadiusDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_vendors_in_radius(:SubCategoryId,:Latitude,:Longitude)`,
      {
        SubCategoryId: resolvedResult.SubCategoryId,
        Latitude: resolvedResult.Latitude,
        Longitude: resolvedResult.Longitude,
        // Radius: resolvedResult.Radius,
      }
    );

    logger.logInfo(
      `getVendorsRadiusDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    const result = {
      BusinessDetails: rows[0][0] ? rows[0][0] : null,
      Services: rows[0][1] ? rows[0][1] : null,
      Reviews: rows[0][2] ? rows[0][2] : null,
    };
    return result;
  } catch (errGetVendorsRadiusDb) {
    logger.logInfo(
      `errGetVendorsRadiusDb() :: Error :: ${JSON.stringify(
        errGetVendorsRadiusDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errGetVendorsRadiusDb.sqlState &&
      errGetVendorsRadiusDb.sqlState == constant.ErrorCode.No_Vendors_Found
    ) {
      errorCode = constant.ErrorCode.No_Vendors_Found;
      errorMessage = constant.ErrorMessage.No_Vendors_Found;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.updateVendorServices = async (
  functionContext,
  resolvedResult,
  businessDetails
) => {
  let logger = functionContext.logger;

  logger.logInfo("updateVendorServices() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_update_vendorservices(:VendorId,:BusinessId,:Services, :OtherServices, :CurrentTs)`,
      {
        VendorId: resolvedResult.VendorId,
        BusinessId: businessDetails.Id,
        Services: businessDetails.Services,
        OtherServices: businessDetails.OtherServices,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `updateVendorServices() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errupdateVendorServices) {
    logger.logInfo(
      `updateVendorServices() :: Error :: ${JSON.stringify(
        errupdateVendorServices
      )}`
    );
    let errorCode = constant.ErrorCode.ApplicationError;
    let errorMessage = constant.ErrorMessage.ApplicationError;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Add business details

module.exports.addBusinessDetailsDb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;

  let image = [];

  // console.log("imageUrl", typeof imageUrl);

  if (imageUrl === "[]") {
    const images = resolvedResult?.Images?.split(",");
    // console.log("images", resolvedResult?.Images);

    images?.forEach((element) => {
      image.push(element);
    });

    image = JSON.stringify(image);
    // console.log("image");
  } else {
    image = imageUrl;
  }

  // console.log("Images", image);

  logger.logInfo("addBusinessDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_businessdetails(:BusinessRef,
        :VendorId,
        :BusinessName,
        :OwnerName,
        :BusinessCategoryId,
        :DateOfBusiness,
        :ContactNumber,
        :Email,
        :GST,
        :Address,
        :Pincode,
        :City,
        :State,
        :Landmark,
        :Latitude,
        :Longitude,
        :Images,
        :Description,
        :ServingCities,
        :Services,
        :OtherServices,
        :Sunday,
        :Monday,
        :Tuesday,
        :Wednesday,
        :Thursday,
        :Friday,
        :Saturday,
        :StartTime,
        :EndTime,
        :SalesPersonId,
        :CurrentTs )`,
      {
        BusinessRef: resolvedResult?.BusinessRef,
        VendorId: resolvedResult.VendorId,
        BusinessName: resolvedResult.BusinessName,
        OwnerName: resolvedResult.OwnerName,
        BusinessCategoryId: resolvedResult.BusinessCategoryId,
        DateOfBusiness: resolvedResult.DateOfBusiness,
        ContactNumber: resolvedResult.ContactNumber,
        Email: resolvedResult.Email,
        GST: resolvedResult.GST,
        Address: resolvedResult.Address,
        Pincode: resolvedResult.Pincode,
        City: resolvedResult.City,
        State: resolvedResult.State,
        Landmark: resolvedResult.Landmark,
        Latitude: resolvedResult.Latitude,
        Longitude: resolvedResult.Longitude,
        //Location: resolvedResult.Location,
        Images: image,
        Description: resolvedResult.Description,
        ServingCities: resolvedResult.ServingCities,
        Services: resolvedResult.Services,
        OtherServices: resolvedResult.OtherServices,
        Sunday: resolvedResult.Sunday,
        Monday: resolvedResult.Monday,
        Tuesday: resolvedResult.Tuesday,
        Wednesday: resolvedResult.Wednesday,
        Thursday: resolvedResult.Thursday,
        Friday: resolvedResult.Friday,
        Saturday: resolvedResult.Saturday,
        StartTime: resolvedResult.StartTime,
        EndTime: resolvedResult.EndTime,
        SalesPersonId: resolvedResult.SalesPersonId,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addBusinessDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    console.log("rows[0][0][0]", rows[0][0][0]);

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddBusinessDetailsDb) {
    logger.logInfo(
      `addBusinessDetailsDb() :: Error :: ${JSON.stringify(
        erraddBusinessDetailsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddBusinessDetailsDb.sqlState &&
      erraddBusinessDetailsDb.sqlState ==
        constant.ErrorCode.Review_Reply_Already_Exists
    ) {
      errorCode = constant.ErrorCode.PhoneNo_Already_Exists;
      errorMessage = constant.ErrorMessage.PhoneNo_Already_Exists;
    } else if (
      erraddBusinessDetailsDb.sqlState &&
      erraddBusinessDetailsDb.sqlState ==
        constant.ErrorCode.Email_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Email_Already_Exists;
      errorMessage = constant.ErrorMessage.Email_Already_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//add business verification image
module.exports.addBusinessVerificationImagedb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;

  logger.logInfo("addBusinessVerificationImagedb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_upload_businessverificationImage(:BusinessRef,:BusineessImage )`,
      {
        BusinessRef: resolvedResult.BusinessRef,
        BusineessImage: imageUrl,
      }
    );

    logger.logInfo(
      `addBusinessVerificationImagedb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddBusinessVerificationImagedb) {
    logger.logInfo(
      `addBusinessVerificationImagedb() :: Error :: ${JSON.stringify(
        erraddBusinessVerificationImagedb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Business Details

module.exports.fetchBusinessDetailsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchBusinessDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_businessdetails_wrt_businessId(:BusinessId)`,
      {
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `fetchBusinessDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    var Details = rows[0][0];
    // if (resolvedResult.SubCategoryId) {
    //   Details = {
    //     BusinessDetails: rows[0][0] ? rows[0][0] : null,
    //     Services: rows[0][1] ? rows[0][1] : null,
    //     Reviews: rows[0][2] ? rows[0][2] : null,
    //   };
    // }

    if (resolvedResult.BusinessId) {
      Details = {
        BusinessDetails: rows[0][0] ? rows[0][0] : null,
        Catalogue: rows[0][1] ? rows[0][1] : null,
        Reviews: rows[0][2] ? rows[0][2] : null,
        ReviewPercentage: rows[0][3] ? rows[0][3] : null,
        ReviewAverage: rows[0][4] ? rows[0][4] : null,
        NearbyBusiness: rows[0][5] ? rows[0][5] : null,
        SavedServices: rows[0][6] ? rows[0][6] : null,
      };
    }

    return Details;
    // return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchBusinessDetailsDb) {
    logger.logInfo(
      `fetchBusinessDetailsDb() :: Error :: ${JSON.stringify(
        errfetchBusinessDetailsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errfetchBusinessDetailsDb.sqlState &&
      errfetchBusinessDetailsDb.sqlState ==
        constant.ErrorCode.Business_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Business_Dont_Exists;
      errorMessage = constant.ErrorMessage.Business_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);

    throw functionContext.error;
  }
};

module.exports.fetchAllBusinessDetailsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchAllBusinessDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(`CALL usp_fetch_all_business()`);

    logger.logInfo(
      `fetchAllBusinessDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    let BusinessDetails = {};
    BusinessDetails = {
      IsApproved: rows[0][0] ? rows[0][0] : null,
      IsNotApproved: rows[0][1] ? rows[0][1] : null,
      Services: rows[0][2] ? rows[0][2] : null,
    };
    return BusinessDetails;

    // return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchAllBusinessDetailsDb) {
    logger.logInfo(
      `fetchAllBusinessDetailsDb() :: Error :: ${JSON.stringify(
        errfetchAllBusinessDetailsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errfetchAllBusinessDetailsDb.sqlState &&
      errfetchAllBusinessDetailsDb.sqlState ==
        constant.ErrorCode.Business_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Business_Dont_Exists;
      errorMessage = constant.ErrorMessage.Business_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);

    throw functionContext.error;
  }
};

//Fetch Business Details Wrt Vendor

module.exports.fetchBusinessDetailsWrtVendorDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchBusinessDetailsWrtVendorDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_businessdetails_wrt_VendorId(:VendorId)`,
      {
        VendorId: resolvedResult.VendorId,
      }
    );

    logger.logInfo(
      `fetchBusinessDetailsWrtVendorDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return {
      BusinessDetails: rows[0][0] ? rows[0][0] : null,
      Catalogue: rows[0][1] ? rows[0][1] : null,
      Reviews: rows[0][2] ? rows[0][2] : null,
      ReviewPercentage: rows[0][3] ? rows[0][3] : null,
      ReviewAverage: rows[0][4] ? rows[0][4] : null,
      PacakgeInfo: rows[0][5] ? rows[0][5] : null,
      PaymentDetails: rows[0][6] ? rows[0][6] : null,
      ChatDetails: rows[0][7] ? rows[0][7] : null,
    };
    //return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchfetchBusinessDetailsWrtVendorDb) {
    logger.logInfo(
      `errfetchfetchBusinessDetailsWrtVendorDb() :: Error :: ${JSON.stringify(
        errfetchfetchBusinessDetailsWrtVendorDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errfetchfetchBusinessDetailsWrtVendorDb.sqlState &&
      errfetchfetchBusinessDetailsWrtVendorDb.sqlState ==
        constant.ErrorCode.Business_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Business_Dont_Exists;
      errorMessage = constant.ErrorMessage.Business_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);

    throw functionContext.error;
  }
};

//Get details Notification By Vendor
module.exports.getDetailsNotificationVendorDB = async (
  functionContext,
  requestContext
) => {
  let logger = functionContext.logger;

  logger.logInfo("getDetailsNotificationVendorDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_get_details_notificationuse_vendor( :UserId, :VendorId)`,
      {
        UserId: requestContext.UserId,
        VendorId: requestContext.VendorId,
      }
    );

    logger.logInfo(
      `getDetailsNotificationVendorDB() :: Returned Result :: ${JSON.stringify(
        rows[0]
      )}`
    );
    console.log("rows", rows[0]);
    return rows[0];
  } catch (errSaveNotificationByVendorDB) {
    logger.logInfo(
      `getDetailsNotificationVendorDB() :: Error :: ${JSON.stringify(
        errSaveNotificationByVendorDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Save Notification By Vendor
module.exports.saveNotificationVendorDB = async (
  pushNotificationDataContextVendor
) => {
  let logger = pushNotificationDataContextVendor.logger;

  logger.logInfo("saveNotificationVendorDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_save_notification_by_vendor( :UserId, :VendorId, :Payload, :CurrentTs)`,
      {
        UserId: pushNotificationDataContextVendor.UserId,
        VendorId: pushNotificationDataContextVendor.VendorId,
        Payload: JSON.stringify(pushNotificationDataContextVendor.Payload),
        CurrentTs: pushNotificationDataContextVendor.currentTs,
      }
    );

    logger.logInfo(
      `saveNotificationVendorDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0];
  } catch (errSaveNotificationByVendorDB) {
    logger.logInfo(
      `saveNotificationVendorDB() :: Error :: ${JSON.stringify(
        errSaveNotificationByVendorDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    pushNotificationDataContextVendor.error = new errorModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw pushNotificationDataContextVendor.error;
  }
};

//Save Job Notification By Vendor
module.exports.saveJobNotificationVendorDB = async (
  pushNotificationDataContextVendor
) => {
  let logger = pushNotificationDataContextVendor.logger;

  logger.logInfo("saveNotificationVendorDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL save_job_notifications( :UserId, :VendorId, :JobId, :Payload, :CurrentTs)`,
      {
        UserId: pushNotificationDataContextVendor.UserId,
        VendorId: pushNotificationDataContextVendor.VendorId,
        JobId: pushNotificationDataContextVendor.JobId,
        Payload: JSON.stringify(pushNotificationDataContextVendor.Payload),
        CurrentTs: pushNotificationDataContextVendor.currentTs,
      }
    );

    logger.logInfo(
      `saveNotificationVendorDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0];
  } catch (errSaveNotificationByVendorDB) {
    logger.logInfo(
      `saveNotificationVendorDB() :: Error :: ${JSON.stringify(
        errSaveNotificationByVendorDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    pushNotificationDataContextVendor.error = new errorModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw pushNotificationDataContextVendor.error;
  }
};

//Fetch Notifications
module.exports.fetchNotificationDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchNotificationDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_get_notification_vendor(:VendorId)`,
      {
        VendorId: resolvedResult.VendorId,
      }
    );

    logger.logInfo(
      `fetchNotificationDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errFetchNotification) {
    logger.logInfo(
      `errFetchNotification() :: Error :: ${JSON.stringify(
        errFetchNotification
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errFetchNotification.sqlState &&
      errFetchNotification.sqlState == constant.ErrorCode.No_Notification_Found
    ) {
      errorCode = constant.ErrorCode.No_Notification_Found;
      errorMessage = constant.ErrorMessage.No_Notification_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Subscribe Package
module.exports.subscribePackageDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("subscribePackageDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_subscribe_package(:VendorId, :BusinessId,:PackageId,:PlanId,:PlanName,:SubscriptionId,:SubscriptionURL,
        :SubscriptionStatus,:PaymentId,:PaymentMode,:Amount,:InvoiceId,:paymentStatus,:CreatedOn)`,
      {
        VendorId: resolvedResult.VendorId,
        BusinessId: resolvedResult.BusinessId,
        PackageId: resolvedResult.PackageId,
        PlanId: resolvedResult.PlanId,
        PlanName: resolvedResult.PlanName,
        SubscriptionId: resolvedResult.SubscriptionId,
        SubscriptionURL: resolvedResult.SubscriptionURL,
        SubscriptionStatus: resolvedResult.SubscriptionStatus,
        PaymentId: resolvedResult.PaymentId,
        PaymentMode: resolvedResult.PaymentMode,
        Amount: resolvedResult.Amount,
        InvoiceId: resolvedResult.InvoiceId,
        paymentStatus: resolvedResult.paymentStatus,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `subscribePackageDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errSubscribePackageDb) {
    logger.logInfo(
      `errSubscribePackageDb() :: Error :: ${JSON.stringify(
        errSubscribePackageDb
      )}`
    );

    throw functionContext.error;
  }
};

//chat initiated
module.exports.chatInitiatedDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("chatInitiatedDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_chat_availability(:UserId,:VendorId ,:CreatedOn)`,
      {
        UserId: resolvedResult.UserId,
        VendorId: resolvedResult.VendorId,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `chatInitiatedDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0] ? rows[0][0] : null;
  } catch (errchatInitiatedDb) {
    logger.logInfo(
      `errchatInitiatedDb() :: Error :: ${JSON.stringify(errchatInitiatedDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchChats = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchChats() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL fetch_chats(:UserType,:UserId)`,
      {
        UserType: resolvedResult.UserType,
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchChats() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0] ? rows[0][0] : null;
  } catch (errchatInitiatedDb) {
    logger.logInfo(
      `errchatInitiatedDb() :: Error :: ${JSON.stringify(errchatInitiatedDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch chat inititated
module.exports.fetchchatInitiatedDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;
  logger.logInfo("fetchchatInitiatedDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_chat_availiabilty(:UserType,:UserId)`,
      {
        UserType: resolvedResult.UserType,
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchchatInitiatedDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchchatInitiatedDb) {
    logger.logInfo(
      `fetchchatInitiatedDb() :: Error :: ${JSON.stringify(
        errfetchchatInitiatedDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//save Buisiness Link
module.exports.saveBusinessLinkdDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("saveBusinessLinkdDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_save_businesslink(:BusinessId,:BusinessLink )`,
      {
        BusinessId: resolvedResult.UserType,
        BusinessLink: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `saveBusinessLinkdDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0] ? rows[0][0] : null;
  } catch (errsaveBusinessLinkdDb) {
    logger.logInfo(
      `errsaveBusinessLinkdDb() :: Error :: ${JSON.stringify(
        errsaveBusinessLinkdDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//add businessId into vendor

module.exports.saveVendorIdDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("saveVendorIdDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_update_vendor_wrt_busineesId(:VendorId,:BusinessId)`,
      {
        VendorId: resolvedResult.VendorId,
        BusinessId: resolvedResult.Id,
      }
    );

    logger.logInfo(
      `saveVendorIdDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errsaveVendorIdDb) {
    logger.logInfo(
      `errsaveVendorIdDb() :: Error :: ${JSON.stringify(errsaveVendorIdDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

// fetch business details subcat

module.exports.fetchBusinessDetailsWrtSubCat = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchBusinessDetailsWrtSubCat() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_business_details_subcat(:SubCategoryId)`,
      {
        SubCategoryId: resolvedResult.SubCategoryId,
      }
    );

    logger.logInfo(
      `fetchBusinessDetailsWrtSubCat() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var Details = {
      BusinessDetails: rows[0][0] ? rows[0][0] : null,
      Services: rows[0][1] ? rows[0][1] : null,
      Reviews: rows[0][2] ? rows[0][2] : null,
    };

    return Details;
  } catch (errfetchBusinessDetailsWrtSubCat) {
    logger.logInfo(
      `errfetchBusinessDetailsWrtSubCat() :: Error :: ${JSON.stringify(
        errfetchBusinessDetailsWrtSubCat
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//save vendor company details for jobs
module.exports.addCompanyDetailsDBDB = async (
  functionContext,
  resolvedResult,
  images
) => {
  let logger = functionContext.logger;

  let image = [];

  if (images === "[]") {
    // resolvedResult?.Logo?.split(",")?.forEach((element) => {
    //   image.push(element);
    // });
    image = resolvedResult?.Logo;
  } else {
    image = images;
  }

  console.log("Images", image);

  logger.logInfo("addCompanyDetailsDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL add_vendor_company_details(
        :JobRef,
        :VendorId,
        :Logo,
        :Companyname,
        :CompanyEmail,
        :State,
        :City,
        :Location,
        :CompanyDescription
        )`,
      {
        JobRef: resolvedResult.JobRef,
        VendorId: resolvedResult.VendorId,
        Logo: image,
        Companyname: resolvedResult.Companyname,
        CompanyEmail: resolvedResult.CompanyEmail,
        State: resolvedResult.State,
        City: resolvedResult.City,
        Location: resolvedResult.Location,
        CompanyDescription: resolvedResult.CompanyDescription,
      }
    );

    logger.logInfo(
      `addCompanyDetailsDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddCompanyDetailsDB) {
    logger.logInfo(
      `erraddCompanyDetailsDB() :: Error :: ${JSON.stringify(
        erraddCompanyDetailsDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      erraddCompanyDetailsDB.sqlState &&
      erraddCompanyDetailsDB.sqlState == constant.ErrorCode.Job_Does_Not_Exist
    ) {
      errorCode = constant.ErrorCode.Job_Does_Not_Exist;
      errorMessage = constant.ErrorMessage.Job_Does_Not_Exist;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//save vendor job details for jobs
module.exports.addJobsDetailsDB = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addJobsDetailsDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL add_vendor_job_details(
        :JobId,
        :VendorId,
        :CategoryId,
        :JobPosition,
        :Salary,
        :Shift,
        :JobType,
        :EmployementType,
        :WorkStatus,
        :WorkExperience,
        :JobDescription,
        :JobResponsibilities,
        :JobRequirement
        )`,
      {
        JobId: resolvedResult.JobId,
        VendorId: resolvedResult.VendorId,
        CategoryId: resolvedResult.CategoryId,
        JobPosition: resolvedResult.JobPosition,
        Salary: resolvedResult.Salary,
        Shift: resolvedResult.Shift,
        JobType: resolvedResult.JobType,
        EmployementType: resolvedResult.EmployementType,
        WorkStatus: resolvedResult.WorkStatus,
        WorkExperience: resolvedResult.WorkExperience,
        JobDescription: resolvedResult.JobDescription,
        JobResponsibilities: resolvedResult.JobResponsibilities,
        JobRequirement: resolvedResult.JobRequirement,
      }
    );

    logger.logInfo(
      `addJobsDetailsDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddJobsDetailsDB) {
    logger.logInfo(
      `erraddJobsDetailsDB() :: Error :: ${JSON.stringify(erraddJobsDetailsDB)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      erraddJobsDetailsDB.sqlState &&
      erraddJobsDetailsDB.sqlState == constant.ErrorCode.Job_Does_Not_Exist
    ) {
      errorCode = constant.ErrorCode.Job_Does_Not_Exist;
      errorMessage = constant.ErrorMessage.Job_Does_Not_Exist;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//save vendor job summary for jobs
module.exports.addJobsSummaryDB = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addJobsSummaryDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL add_vendor_job_summary(
        :JobId,
        :VendorId,
        :Education,
        :Vacancy,
        :CurrentTs
        )`,
      {
        JobId: resolvedResult.JobId,
        VendorId: resolvedResult.VendorId,
        Education: resolvedResult.Education,
        Vacancy: resolvedResult.Vacancy,
        // Skills: resolvedResult.Skills,
        // Duration: resolvedResult.Duration,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addJobsSummaryDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddJobsSummaryDB) {
    logger.logInfo(
      `erraddJobsSummaryDB() :: Error :: ${JSON.stringify(erraddJobsSummaryDB)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      erraddJobsSummaryDB.sqlState &&
      erraddJobsSummaryDB.sqlState == constant.ErrorCode.Job_Does_Not_Exist
    ) {
      errorCode = constant.ErrorCode.Job_Does_Not_Exist;
      errorMessage = constant.ErrorMessage.Job_Does_Not_Exist;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

// fetch earliear posted jobs by vendor
module.exports.fetchJobsPostedByVendorDB = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchJobsPostedByVendorDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL fetch_earlier_posted_jobs_by_vendor(:VendorId)`,
      {
        VendorId: resolvedResult.VendorId,
      }
    );

    logger.logInfo(
      `fetchJobsPostedByVendorDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var Details = rows[0][0];
    return Details;
  } catch (errfetchJobsPostedByVendorDB) {
    logger.logInfo(
      `errfetchJobsPostedByVendorDB() :: Error :: ${JSON.stringify(
        errfetchBusinessDetailsWrtSubCat
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

// delete earlier posted jobs by vendor
module.exports.deleteJobsPostedByVendorDB = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteJobsPostedByVendorDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL delete_job(:DeleteAll, :JobId, :VendorId)`,
      {
        DeleteAll: resolvedResult.DeleteAll,
        JobId: resolvedResult.JobId,
        VendorId: resolvedResult.VendorId,
      }
    );

    logger.logInfo(
      `deleteJobsPostedByVendorDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var Details = rows[0][0];
    return Details;
  } catch (errdeleteJobsPostedByVendorDB) {
    logger.logInfo(
      `errdeleteJobsPostedByVendorDB() :: Error :: ${JSON.stringify(
        errdeleteBusinessDetailsWrtSubCat
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchUsersBasedOnCategoryDB = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchUsersBasedOnCategoryDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL fetch_users_based_on_category(
        :CategoryId
        )`,
      {
        CategoryId: resolvedResult.CategoryId,
      }
    );

    logger.logInfo(
      `fetchUsersBasedOnCategoryDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchJobRoles) {
    logger.logInfo(
      `errfetchJobRoles() :: Error :: ${JSON.stringify(errfetchJobRoles)}`
    );
    let errorCode = constant.ErrorCode.ApplicationError;
    let errorMessage = constant.ErrorMessage.ApplicationError;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchJobDetailsDB = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchJobDetailsDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(`CALL fetch_job_details(:JobId)`, {
      JobId: resolvedResult?.JobId,
    });

    logger.logInfo(
      `fetchJobDetailsDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0][0]
      )}`
    );
    var Details = rows[0][0][0];
    return Details;
  } catch (fetchJobDetailsDB) {
    logger.logInfo(
      `fetchJobDetailsDB() :: Error :: ${JSON.stringify(fetchJobDetailsDB)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchAllJobsDB = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchAllJobsDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(`CALL fetch_all_jobs()`);

    logger.logInfo(
      `fetchAllJobsDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var Details = rows[0][0];
    return Details;
  } catch (errFetchAllJobsDB) {
    logger.logInfo(
      `errFetchAllJobsDB() :: Error :: ${JSON.stringify(errFetchAllJobsDB)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.deleteUserDB = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteUserDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL delete_user_account(:UserId, :Type)`,
      {
        UserId: resolvedResult.UserId,
        Type: resolvedResult.Type,
      }
    );

    logger.logInfo(
      `deleteUserDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0];
  } catch (errdeleteUserDB) {
    logger.logInfo(
      `errdeleteUserDB() :: Error :: ${JSON.stringify(errdeleteUserDB)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errdeleteUserDB.sqlState &&
      errdeleteUserDB.sqlState == constant.ErrorCode.Invalid_User
    ) {
      errorCode = constant.ErrorCode.Invalid_User;
      errorMessage = constant.ErrorMessage.Invalid_User;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.updateUserVendorMessageStatusInDB = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("updateUserVendorMessageStatusInDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL update_message_status(:UserType, :VendorId, :UserId, :VendorStatus, :UserStatus)`,
      {
        UserType: resolvedResult.UserType,
        VendorId: resolvedResult.VendorId,
        UserId: resolvedResult.UserId,
        VendorStatus: resolvedResult.VendorStatus,
        UserStatus: resolvedResult.UserStatus,
      }
    );

    logger.logInfo(
      `updateUserVendorMessageStatusInDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    let Details = rows[0][0][0];
    return Details;
  } catch (errUpdateUserVendorMessageStatusInDB) {
    logger.logInfo(
      `errUpdateUserVendorMessageStatusInDB() :: Error :: ${JSON.stringify(
        errUpdateUserVendorMessageStatusInDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errUpdateUserVendorMessageStatusInDB.sqlState &&
      errUpdateUserVendorMessageStatusInDB.sqlState ==
        constant.ErrorCode.Invalid_Chat
    ) {
      errorCode = constant.ErrorCode.Invalid_Chat;
      errorMessage = constant.ErrorMessage.Invalid_Chat;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};
