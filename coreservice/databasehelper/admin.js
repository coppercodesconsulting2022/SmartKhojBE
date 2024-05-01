const databaseModule = require("../database/database");
const constant = require("../common/constant");
const errorModel = require("../models/serviceModel/error");

//Add Categories
module.exports.addCategoriesDb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;
  logger.logInfo("AddCategoriesDB() Invoked !");

  let image;

  if (imageUrl === "[]" || imageUrl === undefined) {
    image = resolvedResult?.CategoriesIcon;
  } else {
    image = imageUrl;
  }

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_categories(:CategoryRef,:Name,:CategoriesIcon,:CreatedOn)`,
      {
        CategoryRef: resolvedResult.CategoryRef,
        Name: resolvedResult.Name,
        CategoriesIcon: image,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addCategoriesDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddCategoriesDb) {
    logger.logInfo(
      `addCategoriesDb() :: Error :: ${JSON.stringify(erraddCategoriesDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddCategoriesDb.sqlState &&
      erraddCategoriesDb.sqlState == constant.ErrorCode.Category_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Category_Already_Exists;
      errorMessage = constant.ErrorMessage.Category_Already_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Add Sub Categories
module.exports.addSubCategoriesDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;
  logger.logInfo("addSubCategoriesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_subcatergories(:SubCategoryRef,:CategoryRef,:Name,:CreatedOn)`,
      {
        SubCategoryRef: resolvedResult.SubCategoryRef,
        CategoryRef: resolvedResult.CategoryRef,
        Name: resolvedResult.Name,
        //Status: resolvedResult.Status,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addSubCategoriesDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddSubCategoriesDb) {
    logger.logInfo(
      `addaddSubCategoriesDb() :: Error :: ${JSON.stringify(
        erraddSubCategoriesDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddSubCategoriesDb.sqlState &&
      erraddSubCategoriesDb.sqlState ==
        constant.ErrorCode.Category_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Category_Already_Exists;
      errorMessage = constant.ErrorMessage.Category_Already_Exists;
    } else if (
      erraddSubCategoriesDb.sqlState &&
      erraddSubCategoriesDb.sqlState ==
        constant.ErrorCode.Sub_Catergory_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Sub_Catergory_Already_Exists;
      errorMessage = constant.ErrorMessage.Sub_Catergory_Already_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//add popular services

module.exports.addPopularServicesDb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;
  logger.logInfo("addPopularServicesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_popular_services(:CategoryId,:UserType,:Image,:CreatedOn)`,
      {
        CategoryId: resolvedResult.CategoryId,
        UserType: resolvedResult.UserType,
        Image: imageUrl,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addPopularServicesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return { ...rows[0][0][0], ...rows[0][1][0] };
  } catch (erraddPopularServicesDb) {
    logger.logInfo(
      `addPopularServicesDb() :: Error :: ${JSON.stringify(
        erraddPopularServicesDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddPopularServicesDb.sqlState &&
      erraddPopularServicesDb.sqlState ==
        constant.ErrorCode.Category_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Category_Dont_Exists;
      errorMessage = constant.ErrorMessage.Category_Dont_Exists;
    } else if (
      erraddPopularServicesDb.sqlState &&
      erraddPopularServicesDb.sqlState ==
        constant.ErrorCode.Request_not_permitted
    ) {
      errorCode = constant.ErrorCode.Request_not_permitted;
      errorMessage = constant.ErrorMessage.Request_not_permitted;
    } else if (
      erraddPopularServicesDb.sqlState &&
      erraddPopularServicesDb.sqlState ==
        constant.ErrorCode.Popular_service_already_exists
    ) {
      errorCode = constant.ErrorCode.Popular_service_already_exists;
      errorMessage = constant.ErrorMessage.Popular_service_already_exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//add Trendind services

module.exports.addTrendingServicesDb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;
  logger.logInfo("addTrendingServicesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_trending_services(:CategoryId,:UserType,:Image,:CreatedOn)`,
      {
        CategoryId: resolvedResult.CategoryId,
        UserType: resolvedResult.UserType,
        Image: imageUrl,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addTrendingServicesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return { ...rows[0][0][0], ...rows[0][1][0] };
  } catch (erraddTrendingServicesDb) {
    logger.logInfo(
      `addTrendingServicesDb() :: Error :: ${JSON.stringify(
        erraddTrendingServicesDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddTrendingServicesDb.sqlState &&
      erraddTrendingServicesDb.sqlState ==
        constant.ErrorCode.Category_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Category_Dont_Exists;
      errorMessage = constant.ErrorMessage.Category_Dont_Exists;
    } else if (
      erraddTrendingServicesDb.sqlState &&
      erraddTrendingServicesDb.sqlState ==
        constant.ErrorCode.Request_not_permitted
    ) {
      errorCode = constant.ErrorCode.Request_not_permitted;
      errorMessage = constant.ErrorMessage.Request_not_permitted;
    } else if (
      erraddTrendingServicesDb.sqlState &&
      erraddTrendingServicesDb.sqlState ==
        constant.ErrorCode.Trending_service_already_exists
    ) {
      errorCode = constant.ErrorCode.Trending_service_already_exists;
      errorMessage = constant.ErrorMessage.Trending_service_already_exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//block unblock account
module.exports.blockUnblockAccountDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;
  logger.logInfo("blockUnblockAccountDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_block_unblock_account(:UserRef,:UserType,:Status)`,
      {
        UserRef: resolvedResult.UserRef,
        UserType: resolvedResult.UserType,
        Status: resolvedResult.Status,
      }
    );

    logger.logInfo(
      `blockUnblockAccountDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errblockUnblockAccountDb) {
    logger.logInfo(
      `errblockUnblockAccountDb() :: Error :: ${JSON.stringify(
        errblockUnblockAccountDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//delete Review

module.exports.deleteReviewDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;
  logger.logInfo("deleteReviewDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_delete_review(:UserId,:BusinessId)`,
      {
        UserId: resolvedResult.UserId,
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `deleteReviewDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errdeleteReviewDb) {
    logger.logInfo(
      `errdeleteReviewDb() :: Error :: ${JSON.stringify(errdeleteReviewDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//approve reject vendors
module.exports.approveRejectVendorsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;
  logger.logInfo("approveRejectVendorsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_approve_reject_vendors(:VendorRef,:Status)`,
      {
        VendorRef: resolvedResult.VendorRef,
        Status: resolvedResult.Status,
      }
    );
    logger.logInfo(
      `approveRejectVendorsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errapproveRejectVendorsDb) {
    logger.logInfo(
      `errapproveRejectVendorsDb() :: Error :: ${JSON.stringify(
        errapproveRejectVendorsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//fetch approved reject vendors

module.exports.fetchApproveRejectVendorsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;
  logger.logInfo("fetchApproveRejectVendorsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_approved_rejected_vendors(:Status)`,
      {
        Status: resolvedResult.Status,
      }
    );
    logger.logInfo(
      `fetchApproveRejectVendorsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchApproveRejectVendorsDb) {
    logger.logInfo(
      `errfetchApproveRejectVendorsDb() :: Error :: ${JSON.stringify(
        errfetchApproveRejectVendorsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//payment approval
module.exports.paymentApprovalDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("paymentApprovalDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_approval_of_Payment(:VendorId,:IsApproved)`,
      {
        VendorId: resolvedResult.VendorId,
        IsApproved: resolvedResult.IsApproved,
      }
    );

    logger.logInfo(
      `paymentApprovalDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errpaymentApproval) {
    logger.logInfo(
      `errpaymentApproval() :: Error :: ${JSON.stringify(errpaymentApproval)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//fetch payment details

module.exports.fetchPaymentDetailsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchPaymentDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_payment_details(:UserId, :UserType)`,
      {
        UserId: resolvedResult.UserId,
        UserType: resolvedResult.UserType,
      }
    );

    logger.logInfo(
      `fetchPaymentDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchPaymentDetails) {
    logger.logInfo(
      `errfetchPaymentDetails() :: Error :: ${JSON.stringify(
        errfetchPaymentDetails
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchPaymentDetails.sqlState &&
      errfetchPaymentDetails.sqlState ==
        constant.ErrorCode.Payment_Details_Does_Not_Exists
    ) {
      errorCode = constant.ErrorCode.Payment_Details_Does_Not_Exists;
      errorMessage = constant.ErrorMessage.Payment_Details_Does_Not_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Add master

module.exports.addMasterDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;
  logger.logInfo("addMasterDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_master(:MasterRef,:Firstname,:Lastname,:Username,:Email,:Phone,:Passsword,:UserType,:CreatedOn)`,
      {
        MasterRef: resolvedResult.MasterRef,
        Firstname: resolvedResult.Firstname,
        Lastname: resolvedResult.Lastname,
        Username: resolvedResult.Username,
        Email: resolvedResult.Email,
        Phone: resolvedResult.Phone,
        Passsword: resolvedResult.Passsword,
        UserType: resolvedResult.UserType,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addMasterDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddMasterDb) {
    logger.logInfo(
      `erraddMasterDb() :: Error :: ${JSON.stringify(erraddMasterDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddMasterDb.sqlState &&
      erraddMasterDb.sqlState == constant.ErrorCode.PhoneNo_Already_Exists
    ) {
      errorCode = constant.ErrorCode.PhoneNo_Already_Exists;
      errorMessage = constant.ErrorMessage.PhoneNo_Already_Exists;
    } else if (
      erraddMasterDb.sqlState &&
      erraddMasterDb.sqlState == constant.ErrorCode.Email_Already_Exists
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

//Fetch Revenue Generated
module.exports.fetchRevenueGeneratedDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchRevenueGeneratedDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_revenue_generated_by_salesperosn(:SalesId)`,
      {
        SalesId: resolvedResult.SalesId,
      }
    );

    logger.logInfo(
      `fetchRevenueGeneratedDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return [rows[0][0] ? rows[0][0] : null, rows[0][1] ? rows[0][1] : null];
  } catch (errfetchRevenueGenerated) {
    logger.logInfo(
      `fetchRevenueGenerated() :: Error :: ${JSON.stringify(
        errfetchRevenueGenerated
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Delete Advertisement
module.exports.deleteAdvertisementDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteAdvertisementDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_delete_advertisement(:AdvertisementRef)`,
      {
        AdvertisementRef: resolvedResult.AdvertisementRef,
      }
    );

    logger.logInfo(
      `deleteAdvertisementDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return [rows[0][0] ? rows[0][0] : null, rows[0][1] ? rows[0][1] : null];
  } catch (errdeleteAdvertisementDb) {
    logger.logInfo(
      `deleteAdvertisementDb() :: Error :: ${JSON.stringify(
        errdeleteAdvertisementDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Data
module.exports.fetchDataDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchDataDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(` CALL usp_fetch_data()`, {
      // SalesId: resolvedResult.SalesId,
    });

    logger.logInfo(
      `fetchDataDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    const JobSeekerRevenue = rows[0][4][0];
    const VendorRevenue = rows[0][5][0];

    const revenue =
      JobSeekerRevenue.JobSeekerRevenue + VendorRevenue.VendorRevenue;
    const totalRevenue = revenue / 100;

    return [
      rows[0][0][0] ? rows[0][0][0] : null,
      rows[0][1][0] ? rows[0][1][0] : null,
      rows[0][2][0] ? rows[0][2][0] : null,
      rows[0][3][0] ? rows[0][3][0] : null,
      { JobSeekerRevenue: JobSeekerRevenue.JobSeekerRevenue / 100 },
      { VendorRevenue: VendorRevenue.VendorRevenue / 100 },
      { TotalRevenue: totalRevenue },
    ];
  } catch (errfetchDataDb) {
    logger.logInfo(
      `fetchDataDb() :: Error :: ${JSON.stringify(errfetchDataDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Master Details DB
module.exports.fetchMasterDetailsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchMasterDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_masterdetails(:UserType)`,
      {
        UserType: resolvedResult.UserType,
      }
    );

    logger.logInfo(
      `fetchMasterDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return [rows[0][0] ? rows[0][0] : null];
  } catch (errfetchMasterDetailsDb) {
    logger.logInfo(
      `fetchMasterDetailsDb() :: Error :: ${JSON.stringify(
        errfetchMasterDetailsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Delete trending
module.exports.deleteTrendingServicesDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteTrendingServicesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_delete_trendingservices(:CategoryId)`,
      {
        CategoryId: resolvedResult.CategoryId,
      }
    );

    logger.logInfo(
      `deleteTrendingServicesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var trendingCategories = {};
    Categories = {
      deletedCategories: rows[0][0] ? rows[0][0] : null,
      trendingCategories: rows[0][1] ? rows[0][1] : null,
    };
    return Categories;
    // return [rows[0][0] ? rows[0][0] : null, rows[0][1] ? rows[0][1] : null];
  } catch (errdeleteTrendingServicesDb) {
    logger.logInfo(
      `deleteTrendingServicesDb() :: Error :: ${JSON.stringify(
        errdeleteTrendingServicesDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//delete category

module.exports.deleteCategoryDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteCategoryDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_delete_categories(:CategoryId,:SubCategoryId)`,
      {
        CategoryId: resolvedResult.CategoryId,
        SubCategoryId: resolvedResult.SubCategoryId,
      }
    );

    logger.logInfo(
      `deleteCategoryDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    var Details = {};
    if (resolvedResult.CategoryId) {
      Details = {
        deletedCategories: rows[0][0] ? rows[0][0] : null,
        deleteSubCategories: rows[0][1] ? rows[0][1] : null,
        Categories: rows[0][2] ? rows[0][2] : null,
      };
    }

    if (resolvedResult.SubCategoryId) {
      Details = {
        deleteSubCategories: rows[0][0] ? rows[0][0] : null,
        SubCategories: rows[0][1] ? rows[0][1] : null,
      };
    }

    return Details;
    // Categories = {
    //   deletedCategories: rows[0][0] ? rows[0][0] : null,
    //   deleteSubCategories: rows[0][1] ? rows[0][1] : null,
    //   Categories: rows[0][2] ? rows[0][2]: null,
    // };
    // return Categories;
    // return [rows[0][0] ? rows[0][0] : null, rows[0][1] ? rows[0][1] : null];
  } catch (errdeleteCategoryDb) {
    logger.logInfo(
      `deleteCategoryDb() :: Error :: ${JSON.stringify(errdeleteCategoryDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Advertisement  DB
module.exports.fetchadvertisementDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchadvertisementDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_adminadvertisemnet(:Status, :AppType)`,
      {
        Status: resolvedResult.Status,
        AppType: resolvedResult.AppType,
      }
    );

    logger.logInfo(
      `fetchAdvertisementDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return [
      rows[0][0] ? rows[0][0] : null,
      { AppRelatedAds: rows[0][1] ? rows[0][1] : null },
    ];
  } catch (errfetchAdvertisementDb) {
    logger.logInfo(
      `fetchAdvertisementDb() :: Error :: ${JSON.stringify(
        errfetchAdvertisementDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

// add admin Advertisement

module.exports.addadminadvertismentDb = async (
  functionContext,
  resolvedResult,
  imageUrl
) => {
  let logger = functionContext.logger;
  logger.logInfo("addadminadvertismentDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_adminadvertisement(:AdvertisementtId,:Image,:Status,:AppType, :AdLink, :ImageOperation, :AdSpaceId, :CreatedOn)`,
      {
        AdvertisementtId: resolvedResult.AdvertisementtId,
        Image: imageUrl,
        Status: resolvedResult.Status,
        AppType: resolvedResult.AppType,
        AdLink: resolvedResult.AdLink,
        ImageOperation: resolvedResult.ImageOperation,
        AdSpaceId: resolvedResult.AdSpaceId,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addadminadvertismentDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return [rows[0][0] ? rows[0][0] : null, rows[0][1] ? rows[0][1] : null];
  } catch (erraddadminadvertismentDb) {
    logger.logInfo(
      `addadminadvertismentDb() :: Error :: ${JSON.stringify(
        erraddadminadvertismentDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    // if (
    //   erraddTrendingServicesDb.sqlState &&
    //   erraddTrendingServicesDb.sqlState ==
    //     constant.ErrorCode.Category_Dont_Exists
    // ) {
    //   errorCode = constant.ErrorCode.Category_Dont_Exists;
    //   errorMessage = constant.ErrorMessage.Category_Dont_Exists;
    // } else if (
    //   erraddTrendingServicesDb.sqlState &&
    //   erraddTrendingServicesDb.sqlState ==
    //     constant.ErrorCode.Request_not_permitted
    // ) {
    //   errorCode = constant.ErrorCode.Request_not_permitted;
    //   errorMessage = constant.ErrorMessage.Request_not_permitted;
    // } else if (
    //   erraddTrendingServicesDb.sqlState &&
    //   erraddTrendingServicesDb.sqlState ==
    //     constant.ErrorCode.Trending_service_already_exists
    // ) {
    //   errorCode = constant.ErrorCode.Trending_service_already_exists;
    //   errorMessage = constant.ErrorMessage.Trending_service_already_exists;
    // } else {
    //   errorCode = constant.ErrorCode.ApplicationError;
    //   errorMessage = constant.ErrorMessage.ApplicationError;
    // }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//approvalofbusiness
module.exports.approvalOfBusinessDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("approvalOfBusinessDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_approval_of_business(:BusinessId)`,
      {
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `approvalOfBusinessDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errapprovalOfBusinessDb) {
    logger.logInfo(
      `approvalOfBusinessDb() :: Error :: ${JSON.stringify(
        errapprovalOfBusinessDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Delete popular
module.exports.deletePopularServicesDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("deletePopularServicesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_delete_popular_services(:CategoryId)`,
      {
        CategoryId: resolvedResult.CategoryId,
      }
    );

    logger.logInfo(
      `deletePopularServicesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var trendingCategories = {};
    Categories = {
      deletedCategories: rows[0][0] ? rows[0][0] : null,
      PoularCategories: rows[0][1] ? rows[0][1] : null,
    };
    return Categories;
    // return [rows[0][0] ? rows[0][0] : null, rows[0][1] ? rows[0][1] : null];
  } catch (errdeletePopularServicesDb) {
    logger.logInfo(
      `deletePopularServicesDb() :: Error :: ${JSON.stringify(
        errdeletePopularServicesDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Delete job seeker
module.exports.deleteJobSeekerDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteJobSeekerDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL delete_job_seeker(:JobSeekerId, :CareerId, :ResumeId, :UserId)`,
      {
        JobSeekerId: resolvedResult.JobSeekerId,
        CareerId: resolvedResult.CareerId,
        ResumeId: resolvedResult.ResumeId,
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `deleteJobSeekerDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0];
  } catch (errdeletePopularServicesDb) {
    logger.logInfo(
      `deletePopularServicesDb() :: Error :: ${JSON.stringify(
        errdeletePopularServicesDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Block job seeker
module.exports.blockJobSeekerDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("blockJobSeekerDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL block_job_seeker(:JobSeekerId, :UserId, :Block)`,
      {
        JobSeekerId: resolvedResult.JobSeekerId,
        UserId: resolvedResult.UserId,
        Block: resolvedResult.Block,
      }
    );

    logger.logInfo(
      `blockJobSeekerDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0];
  } catch (errblockJobSeekerDb) {
    logger.logInfo(
      `blockJobSeekerDb() :: Error :: ${JSON.stringify(errblockJobSeekerDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errblockJobSeekerDb.sqlState &&
      errblockJobSeekerDb.sqlState == constant.ErrorCode.Job_Seeker_Deleted
    ) {
      errorCode = constant.ErrorCode.Job_Seeker_Deleted;
      errorMessage = constant.ErrorMessage.Job_Seeker_Deleted;
    } else {
      errorCode = constant.ErrorCode.Error_Blocking_Job_Seeker;
      errorMessage = constant.ErrorMessage.Error_Blocking_Job_Seeker;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.adminChatDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("adminChatDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL admin_chat_initiation(:UserId, :UserType, :CurrentTs)`,
      {
        UserId: resolvedResult.UserId,
        UserType: resolvedResult.UserType,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `adminChatDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0];
  } catch (erradminChatDb) {
    logger.logInfo(
      `adminChatDb() :: Error :: ${JSON.stringify(erradminChatDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    errorCode = constant.ErrorCode.Error_Initiating_Admin_Chat;
    errorMessage = constant.ErrorMessage.Error_Initiating_Admin_Chat;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchAdminChatDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchAdminChatDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(` CALL admin_chat_availability()`);

    logger.logInfo(
      `fetchAdminChatDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return { Users: rows[0][0], Vendors: rows[0][1] };
  } catch (errfetchAdminChatDb) {
    logger.logInfo(
      `fetchAdminChatDb() :: Error :: ${JSON.stringify(errfetchAdminChatDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    errorCode = constant.ErrorCode.Error_Fetching_Admin_Chat;
    errorMessage = constant.ErrorMessage.Error_Fetching_Admin_Chat;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.verifyBusinessDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("verifyBusinessDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL verify_business(:VendorId, :BusinessId)`,
      {
        VendorId: resolvedResult.VendorId,
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `verifyBusinessDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0];
  } catch (errverifyBusinessDb) {
    logger.logInfo(
      `verifyBusinessDb() :: Error :: ${JSON.stringify(errverifyBusinessDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    errorCode = constant.ErrorCode.Error_Verify_Business_Details;
    errorMessage = constant.ErrorMessage.Error_Verify_Business_Details;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.verifyJobSeekerDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("verifyJobSeekerDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL verify_job_seeker(:UserId, :JobSeekerId, :CareerId)`,
      {
        UserId: resolvedResult.UserId,
        JobSeekerId: resolvedResult.JobSeekerId,
        CareerId: resolvedResult.CareerId,
      }
    );

    logger.logInfo(
      `verifyJobSeekerDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0];
  } catch (errverifyJobSeekerDb) {
    logger.logInfo(
      `verifyJobSeekerDb() :: Error :: ${JSON.stringify(errverifyBusinessDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    errorCode = constant.ErrorCode.Error_Verify_Job_Seeker_Details;
    errorMessage = constant.ErrorMessage.Error_Verify_Job_Seeker_Details;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchAdSpacesDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchAdSpacesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(` CALL fetch_adspaces()`);

    logger.logInfo(
      `fetchAdSpacesDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0] ? rows[0][0] : [];
  } catch (errfetchAdSpacesDb) {
    logger.logInfo(
      `fetchAdSpacesDb() :: Error :: ${JSON.stringify(errfetchAdSpacesDb)}`
    );
    let errorCode = null;
    let errorMessage = null;

    errorCode = constant.ErrorCode.ApplicationError;
    errorMessage = constant.ErrorMessage.ApplicationError;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};
