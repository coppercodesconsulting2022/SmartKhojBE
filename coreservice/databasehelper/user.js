const databaseModule = require("../database/database");
const constant = require("../common/constant");
const errorModel = require("../models/serviceModel/error");

module.exports.userLoginDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("userLoginDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_login(:Username, :Flag, :Password, :UserType, :CurrentTs )`,
      {
        Username: resolvedResult.Username,
        Flag: resolvedResult.Flag,
        Password: resolvedResult.Password,
        UserType: resolvedResult.UserType,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `userLoginDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errUserLoginDB) {
    logger.logInfo(
      `userLoginDB() :: Error :: ${JSON.stringify(errUserLoginDB)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errUserLoginDB.sqlState &&
      errUserLoginDB.sqlState == constant.ErrorCode.Invalid_Username_Or_Password
    ) {
      errorCode = constant.ErrorCode.Invalid_Username_Or_Password;
      errorMessage = constant.ErrorMessage.Invalid_Username_Or_Password;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//User LogOut
module.exports.userLogoutDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("userLogoutDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_user_logout(:UserRef, :UserType, :CurrentTs )`,
      {
        UserRef: resolvedResult.UserRef,
        UserType: resolvedResult.UserType,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `userLogoutDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erruserLogoutDB) {
    logger.logInfo(
      `userLogoutDB() :: Error :: ${JSON.stringify(erruserLogoutDB)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//fetchUser
module.exports.addUserDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addUserDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_users(:UserRef, :Firstname, :Lastname, :Email, :Phone,:DOB,:Gender, :Nationality, :Address,:State,:City, :Pincode,:Password,:DeviceToken, :IsActive, :CurrentTs )`,
      {
        UserRef: resolvedResult.UserRef,
        Firstname: resolvedResult.Firstname,
        Lastname: resolvedResult.Lastname,
        Email: resolvedResult.Email,
        Phone: resolvedResult.Phone,
        DOB: resolvedResult.DOB,
        Gender: resolvedResult.Gender,
        Nationality: resolvedResult.Nationality,
        Address: resolvedResult.Address,
        State: resolvedResult.State,
        City: resolvedResult.City,
        Pincode: resolvedResult.Pincode,
        Password: resolvedResult.Password,
        DeviceToken: resolvedResult.DeviceToken,
        IsActive: resolvedResult.IsActive,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addUserDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddUserDb) {
    logger.logInfo(`addUserDb() :: Error :: ${JSON.stringify(erraddUserDb)}`);
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddUserDb.sqlState &&
      erraddUserDb.sqlState == constant.ErrorCode.PhoneNo_Already_Exists
    ) {
      errorCode = constant.ErrorCode.PhoneNo_Already_Exists;
      errorMessage = constant.ErrorMessage.PhoneNo_Already_Exists;
    } else if (
      erraddUserDb.sqlState &&
      erraddUserDb.sqlState == constant.ErrorCode.Email_Already_Exists
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
//Fetch User
module.exports.fetchUserDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchUserDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(`CALL usp_fetch_users(:UserId)`, {
      UserId: resolvedResult.UserId,
    });

    logger.logInfo(
      `fetchUserDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0];
  } catch (errFetchUserDb) {
    logger.logInfo(
      `fetchUserDb() :: Error :: ${JSON.stringify(errFetchUserDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errFetchUserDb.sqlState &&
      errFetchUserDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchJobSeekerIdDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchJobSeekerIdDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL fetch_job_seeker_id(:UserId)`,
      {
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchJobSeekerIdDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return [rows[0][0][0], rows[0][1][0], { paymentDetails: rows[0][2] }];
  } catch (errfetchJobSeekerIdDb) {
    logger.logInfo(
      `fetchJobSeekerIdDb() :: Error :: ${JSON.stringify(
        errfetchJobSeekerIdDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errfetchJobSeekerIdDb.sqlState &&
      errfetchJobSeekerIdDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//advertisement

module.exports.addAdvertisementDb = async (
  functionContext,
  resolvedResult
  // imageUrl
) => {
  let logger = functionContext.logger;

  logger.logInfo("addAdvertisementDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_advertisement(:AdvertisementRef,:BusinessName,:ContactPersonName,:Phone,:Pincode,
        :State,:City,:BusinessCategory,:AddDescription,:UserType ,:UserId ,:Status,:CreatedOn)`,
      {
        AdvertisementRef: resolvedResult.AdvertisementRef,
        BusinessName: resolvedResult.BusinessName,
        ContactPersonName: resolvedResult.ContactPersonName,
        Phone: resolvedResult.Phone,
        Pincode: resolvedResult.Pincode,
        State: resolvedResult.State,
        City: resolvedResult.City,
        BusinessCategory: resolvedResult.BusinessCategory,
        AddDescription: resolvedResult.AddDescription,
        UserType: resolvedResult.UserType,
        UserId: resolvedResult.UserId,
        // VendorId: resolvedResult.VendorId,
        Status: resolvedResult.Status,
        // AdvertisementImage:imageUrl,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addAdvertisementDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddAdvertisementDb) {
    logger.logInfo(
      `addAdvertisementDb() :: Error :: ${JSON.stringify(
        erraddAdvertisementDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Reviews
module.exports.fetchReviewDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchReviewDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_reviews(:BusinessId)`,
      {
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `fetchReviewDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0] ? rows[0][0] : null;
    // return [rows[0][0], rows[0][0]];
  } catch (errfetchReviewDb) {
    logger.logInfo(
      `errfetchReviewDb() :: Error :: ${JSON.stringify(errfetchReviewDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchReviewDb.sqlState &&
      errfetchReviewDb.sqlState == constant.ErrorCode.No_Reviews_Found
    ) {
      errorCode = constant.ErrorCode.No_Reviews_Found;
      errorMessage = constant.ErrorMessage.No_Reviews_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//addReview
module.exports.addReviewDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addReviewDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_reviews(:UserId,:BusinessId,:Rating,:ReviewText,:CurrentTs )`,
      {
        UserId: resolvedResult.UserId,
        BusinessId: resolvedResult.BusinessId,
        Rating: resolvedResult.Rating,
        ReviewText: resolvedResult.ReviewText,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addReviewDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddReviewDb) {
    logger.logInfo(
      `addReviewDb() :: Error :: ${JSON.stringify(erraddReviewDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddReviewDb.sqlState &&
      erraddReviewDb.sqlState == constant.ErrorCode.Review_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Review_Already_Exists;
      errorMessage = constant.ErrorMessage.Review_Already_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//addSavedService
module.exports.addSavedServiceDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addSavedServiceDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_add_saved_services(:UserId,:BusinessId,:IsActive,:CurrentTs )`,
      {
        UserId: resolvedResult.UserId,
        BusinessId: resolvedResult.BusinessId,
        IsActive: resolvedResult.IsActive,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addSavedServiceDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchsavedservices) {
    logger.logInfo(
      `addSavedServiceDb() :: Error :: ${JSON.stringify(errfetchsavedservices)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchsavedservices.sqlState &&
      errfetchsavedservices.sqlState ==
      constant.ErrorCode.Saved_Service_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Saved_Service_Already_Exists;
      errorMessage = constant.ErrorMessage.Saved_Service_Already_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//fetch savedservices
module.exports.fetchSavedServicesDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchSavedServicesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_savedservices(:UserId)`,
      {
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchSavedServicesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
    //return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchSavedServices) {
    logger.logInfo(
      `fetchSavedServicesDb() :: Error :: ${JSON.stringify(
        errfetchSavedServices
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchSavedServices.sqlState &&
      errfetchSavedServices.sqlState ==
      constant.ErrorCode.No_Saved_Services_Available
    ) {
      errorCode = constant.ErrorCode.No_Saved_Services_Available;
      errorMessage = constant.ErrorMessage.No_Saved_Services_Available;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//fetch catalogue
module.exports.fetchCatalogueDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchCatalogueDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_catalogue(:BusinessId)`,
      {
        BusinessId: resolvedResult.BusinessId,
      }
    );

    logger.logInfo(
      `fetchCatalogueDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
    //return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchCatalogue) {
    logger.logInfo(
      `fetchCatalogueDb() :: Error :: ${JSON.stringify(errfetchCatalogue)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchCatalogue.sqlState &&
      errfetchCatalogue.sqlState == constant.ErrorCode.Catalogue_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Catalogue_Dont_Exists;
      errorMessage = constant.ErrorMessage.Catalogue_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Vendor Cateogries
module.exports.fetchVendorCategory = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchVendorCategory() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_fetch_vendor_wrt_categories(:SubCategoryId)`,
      {
        SubCategoryId: resolvedResult.SubCategoryId,
      }
    );

    logger.logInfo(
      `fetchVendorCategory() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0];
  } catch (errFetchUserDb) {
    logger.logInfo(
      `fetchVendorCategory() :: Error :: ${JSON.stringify(errFetchUserDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errFetchUserDb.sqlState &&
      errFetchUserDb.sqlState == constant.ErrorCode.No_Vendors_Found
    ) {
      errorCode = constant.ErrorCode.No_Vendors_Found;
      errorMessage = constant.ErrorMessage.No_Vendors_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Filters
module.exports.filterDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;
  logger.logInfo("filterDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL usp_filter(:City, :Rating, :UserId, :Trusted, :Certified, :Verified, :Popular, :RecentlyAdded, :Nearby, :Longitude, :Latitude, :ByRadius, :Radius, :SubCategoryId)`,
      {
        City: resolvedResult.City,
        Rating: resolvedResult.Rating,
        UserId: resolvedResult.UserId,
        Trusted: resolvedResult.Trusted,
        Certified: resolvedResult.Certified,
        Verified: resolvedResult.Verified,
        Popular: resolvedResult.Popular,
        RecentlyAdded: resolvedResult.RecentlyAdded,
        Nearby: resolvedResult.Nearby,
        Longitude: resolvedResult.Longitude,
        Latitude: resolvedResult.City,
        ByRadius: resolvedResult.ByRadius,
        Radius: resolvedResult.Radius,
        SubCategoryId: resolvedResult.SubCategoryId,
      }
    );

    logger.logInfo(
      `filterDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0];
  } catch (errFilterDb) {
    logger.logInfo(`filterDb() :: Error :: ${JSON.stringify(errFilterDb)}`);
    let errorCode = null;
    let errorMessage = null;
    if (
      errFilterDb.sqlState &&
      errFilterDb.sqlState == constant.ErrorCode.No_Vendors_Found
    ) {
      errorCode = constant.ErrorCode.No_Vendors_Found;
      errorMessage = constant.ErrorMessage.No_Vendors_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.filterbyRadiusDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;
  logger.logInfo("filterbyRadiusDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL filter_by_radius(:Radius, :Latitude, :Longitude)`,
      {
        Radius: resolvedResult.Radius,
        Latitude: resolvedResult.Latitude,
        Longitude: resolvedResult.Longitude,
      }
    );

    logger.logInfo(
      `filterbyRadiusDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0];
  } catch (errFilterDb) {
    logger.logInfo(`filterDb() :: Error :: ${JSON.stringify(errFilterDb)}`);
    let errorCode = null;
    let errorMessage = null;
    if (
      errFilterDb.sqlState &&
      errFilterDb.sqlState == constant.ErrorCode.No_Vendors_Found
    ) {
      errorCode = constant.ErrorCode.No_Vendors_Found;
      errorMessage = constant.ErrorMessage.No_Vendors_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};
//Fetch Categories
module.exports.fetchCategoriesDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchCataegoriesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_categories()`
      // {
      //   VendorId: resolvedResult.VendorId,
      // }
    );

    logger.logInfo(
      `fetchCataegoriesDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    var Categories = {};
    Categories = {
      AllCategories: rows[0][0] ? rows[0][0] : null,
      HomeScreenCategories: rows[0][1] ? rows[0][1] : null,
    };
    return Categories;
    // return rows[0][0] ? rows[0][0] : null;
    //return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchCategories) {
    logger.logInfo(
      `errfetchCategories() :: Error :: ${JSON.stringify(errfetchCategories)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchCategories.sqlState &&
      errfetchCategories.sqlState == constant.ErrorCode.Category_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.Category_Dont_Exists;
      errorMessage = constant.ErrorMessage.Category_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Forgot Password
module.exports.forgotPasswordDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("forgotPasswordDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_forgot_password(:Phone,:Email,:Password,:UserType)`,
      {
        Phone: resolvedResult.Phone ? resolvedResult.Phone : "",
        Email: resolvedResult.Email ? resolvedResult.Email : "",
        Password: resolvedResult.Password,
        UserType: resolvedResult.UserType,
      }
    );

    logger.logInfo(
      `forgotPasswordDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    // return rows[0][0] ? rows[0][0] : null;
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errforgotPassword) {
    logger.logInfo(
      `errforgotPassword() :: Error :: ${JSON.stringify(errforgotPassword)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errforgotPassword.sqlState &&
      errforgotPassword.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Sub  Categories
module.exports.fetchSubCategoriesDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchSubCataegoriesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_subcatergories(:CategoryId,:FetchAllSubCat)`,
      {
        CategoryId: resolvedResult.CategoryId,
        FetchAllSubCat: resolvedResult.FetchAllSubCat,
      }
    );

    logger.logInfo(
      `fetchSubCataegoriesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    let subcat = rows[0][0];

    subcat = subcat.sort((a, b) => a.Name.localeCompare(b.Name));

    return subcat;
    //return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchSubCategories) {
    logger.logInfo(
      `errfetchSubCategories() :: Error :: ${JSON.stringify(
        errfetchSubCategories
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchSubCategories.sqlState &&
      errfetchSubCategories.sqlState == constant.ErrorCode.No_Sub_Category_Found
    ) {
      errorCode = constant.ErrorCode.No_Sub_Category_Found;
      errorMessage = constant.ErrorMessage.No_Sub_Category_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Recently Added Services 5
module.exports.recentlyAdded5Db = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("recentlyAdded5Db() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_recently_added()`
    );

    logger.logInfo(
      `recentlyAdded5Db() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errRecentlyAdded5) {
    logger.logInfo(
      `errRecentlyAdded5() :: Error :: ${JSON.stringify(errRecentlyAdded5)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errRecentlyAdded5.sqlState &&
      errRecentlyAdded5.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Recently Added Services All
module.exports.recentlyAddedAllDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("recentlyAddedAllDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_recently_added_all()`
    );

    logger.logInfo(
      `recentlyAddedAllDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errRecentlyAddedAll) {
    logger.logInfo(
      `errRecentlyAddedAll() :: Error :: ${JSON.stringify(errRecentlyAddedAll)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errRecentlyAddedAll.sqlState &&
      errRecentlyAddedAll.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
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
      ` CALL usp_get_notification_user(:UserId)`,
      {
        UserId: resolvedResult.UserId,
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

//Delete Notifications
module.exports.deleteNotificationDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteNotificationDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_delete_notification_all(:NotificationRef) `,
      {
        NotificationRef: JSON.stringify(resolvedResult.NotificationRef),
      }
    );

    logger.logInfo(
      `deleteNotificationDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return [rows[0]];
  } catch (errDeleteNotification) {
    logger.logInfo(
      `errDeleteNotification() :: Error :: ${JSON.stringify(
        errDeleteNotification
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Register Token
module.exports.registerTokenDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("registerTokenDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_register_device_token( :UserId, :DeviceToken, :UserType, :AppType, :CurrentTs)`,
      {
        UserId: resolvedResult.UserId,
        DeviceToken: resolvedResult.DeviceToken,
        UserType: resolvedResult.UserType,
        AppType: resolvedResult.AppType,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `registerTokenDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errRegisterToken) {
    logger.logInfo(
      `registerTokenDb() :: Error :: ${JSON.stringify(errRegisterToken)}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Push Notification By User
module.exports.pushNotificationByUserDB = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("pushNotificationByUserDBDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_push_notification_by_user(:SubCategoryId, :UserId, :Latitude, :Longitude, :UserType, :CurrentTs)`,
      {
        SubCategoryId: resolvedResult.SubCategoryId,
        UserId: resolvedResult.UserId,
        Latitude: resolvedResult.Latitude,
        Longitude: resolvedResult.Longitude,
        UserType: resolvedResult.UserType,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `pushNotificationByUserDBDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return [rows[0][0], rows[0][1]];
  } catch (errPushNotificationByUserDB) {
    logger.logInfo(
      `pushNotificationByUserDBDb() :: Error :: ${JSON.stringify(
        errPushNotificationByUserDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.findNearbyLocations = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;


  logger.logInfo("findNearbyLocations() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL FindLocationsWithinRadius(:Latitude, :Longitude, :UserId, :SubCategoryId)`,
      {
        Latitude: resolvedResult.Latitude,
        Longitude: resolvedResult.Longitude,
        UserId: resolvedResult.UserId,
        SubCategoryId: resolvedResult.SubCategoryId,
      }
    );

    logger.logInfo(
      `pushNotificationByUserDBDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0],
        rows[0][1]
      )}`
    );

    return [rows[0][0], rows[0][1][0]];
  } catch (errPushNotificationByUserDB) {
    logger.logInfo(
      `pushNotificationByUserDBDb() :: Error :: ${JSON.stringify(
        errPushNotificationByUserDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Save Notification By User
module.exports.saveNotificationDB = async (pushNotificationDataContext) => {
  let logger = pushNotificationDataContext.logger;

  logger.logInfo("saveNotificationDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_save_notification_by_user( :UserId, :VendorId, :Payload, :CurrentTs)`,
      {
        UserId: pushNotificationDataContext.UserId,
        VendorId: pushNotificationDataContext.VendorId,
        Payload: JSON.stringify(pushNotificationDataContext.Payload),
        CurrentTs: pushNotificationDataContext.currentTs,
      }
    );

    logger.logInfo(
      `saveNotificationDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0];
  } catch (errSaveNotificationByUserDB) {
    logger.logInfo(
      `saveNotificationDB() :: Error :: ${JSON.stringify(
        errSaveNotificationByUserDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    pushNotificationDataContext.error = new errorModel.ErrorModel(
      errorMessage,
      errorCode
    );
    throw pushNotificationDataContext.error;
  }
};

//Fetch Popularservices
module.exports.fetchPopularServicesDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchPopularServicesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_popular_services()`
    );

    logger.logInfo(
      `fetchPopularServicesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
    //return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchPopularServices) {
    logger.logInfo(
      `errfetchPopularServices() :: Error :: ${JSON.stringify(
        errfetchPopularServices
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch Trending Services
module.exports.fetchTrendingServicesDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchTrendingServicesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_fetch_trending_services()`
    );

    logger.logInfo(
      `fetchTrendingServicesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
    //return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errfetchTrendingServices) {
    logger.logInfo(
      `errfetchPopularServices() :: Error :: ${JSON.stringify(
        errfetchPopularServices
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//update Password
module.exports.updatePasswordDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("updatePasswordDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL usp_update_pasword(:UserRef,:UserType,:OldPassword,:NewPassword,:ConfirmPassword)`,
      {
        UserRef: functionContext.UserRef,
        UserType: functionContext.UserType,
        OldPassword: resolvedResult.OldPassword,
        NewPassword: resolvedResult.NewPassword,
        ConfirmPassword: resolvedResult.ConfirmPassword,
      }
    );

    logger.logInfo(
      `updatePasswordDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    // return rows[0][0] ? rows[0][0] : null;
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errupdatePassword) {
    logger.logInfo(
      `errupdatePassword() :: Error :: ${JSON.stringify(errupdatePassword)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errupdatePassword.sqlState &&
      errupdatePassword.sqlState ==
      constant.ErrorCode
        .New_password_should_not_be_same_as_your_previous_password
    ) {
      errorCode =
        constant.ErrorCode
          .New_password_should_not_be_same_as_your_previous_password;
      errorMessage =
        constant.ErrorMessage
          .New_password_should_not_be_same_as_your_previous_password;
    } else if (
      errupdatePassword.sqlState &&
      errupdatePassword.sqlState == constant.ErrorCode.Passwords_do_not_match
    ) {
      errorCode = constant.ErrorCode.Passwords_do_not_match;
      errorMessage = constant.ErrorMessage.Passwords_do_not_match;
    } else if (
      errupdatePassword.sqlState &&
      errupdatePassword.sqlState == constant.ErrorCode.Old_Password_Incorrect
    ) {
      errorCode = constant.ErrorCode.Old_Password_Incorrect;
      errorMessage = constant.ErrorMessage.Old_Password_Incorrect;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.checkIfRegisteredDB = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("checkIfRegisteredDB() invoked!");

  try {
    let result = await databaseModule.knex.raw(
      `CALL usp_check_if_registered(:Phone, :UserType)`,
      {
        Phone: resolvedResult.Phone,
        UserType: resolvedResult.UserType,
      }
    );
    logger.logInfo("checkIfRegisteredDB():: Fetch Successfully!");

    return result[0][0][0];
  } catch (errDeleteRFQ) {
    const errorCode = constant.ErrorCode.ApplicationError;
    const errorMessage = constant.ErrorMessage.ApplicationError;

    functionContext.error = new coreRequestModel.ErrorModel(
      errorMessage,
      errorCode,
      JSON.stringify(errDeleteRFQ)
    );
    logger.logInfo(
      `checkIfRegisteredDB() :: Error :: ${JSON.stringify(errDeleteRFQ)}`
    );

    throw functionContext.error;
  }
};

//addCareerPreferences
module.exports.addCareerPreferencesDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("addCareerPreferencesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL add_user_career_preferences(
        :Ref,
        :UserId,
        :CategoryId,
        :Role,
        :Location,
        :Shift,
        :JobType,
        :EmployementType,
        :WorkStatus,
        :WorkExperience,
        :Salary,
        :HighestEducation
        )`,
      {
        Ref: resolvedResult.Ref,
        UserId: resolvedResult.UserId,
        CategoryId: resolvedResult.CategoryId,
        Role: resolvedResult.Role,
        Location: resolvedResult.Location,
        Shift: resolvedResult.Shift,
        JobType: resolvedResult.JobType,
        EmployementType: resolvedResult.EmployementType,
        WorkStatus: resolvedResult.WorkStatus,
        WorkExperience: resolvedResult.WorkExperience,
        Salary: resolvedResult.Salary,
        HighestEducation: resolvedResult.HighestEducation
      }
    );

    await databaseModule.knex('jobseekercareerpreferences').where({ Id: rows[0][0][0].Id }).update({ Verified: 1 });

    logger.logInfo(
      `addCareerPreferencesDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddCareerPreferencesDb) {
    logger.logInfo(
      `addCareerPreferencesDb() :: Error :: ${JSON.stringify(
        erraddCareerPreferencesDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddCareerPreferencesDb.sqlState &&
      erraddCareerPreferencesDb.sqlState ==
      constant.ErrorCode.Career_Already_Added
    ) {
      errorCode = constant.ErrorCode.Career_Already_Added;
      errorMessage = constant.ErrorMessage.Career_Already_Added;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//addCareerPreferences
module.exports.addKeySkillsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("addKeySkillsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL add_user_key_skills(
        :CareerId,
        :UserId,
        :KeySkills
        )`,
      {
        CareerId: resolvedResult.CareerId,
        UserId: resolvedResult.UserId,
        KeySkills: resolvedResult.KeySkills,
      }
    );

    logger.logInfo(
      `addKeySkillsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddKeySkillsDb) {
    logger.logInfo(
      `addKeySkillsDb() :: Error :: ${JSON.stringify(erraddKeySkillsDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddKeySkillsDb.sqlState &&
      erraddKeySkillsDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.addJobSeekerDetailsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("addJobSeekerDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL add_job_seeker_details(
        :CareerId,
        :UserId,
        :Gender,
        :MaritalStatus,
        :DOB,
        :Age,
        :DifferentlyAbled,
        :State,
        :City,
        :Phone,
        :Email,
        :CreatedOn
        )`,
      {
        CareerId: resolvedResult.CareerId,
        UserId: resolvedResult.UserId,
        Gender: resolvedResult.Gender,
        MaritalStatus: resolvedResult.MaritalStatus,
        DOB: resolvedResult.DOB,
        Age: resolvedResult.Age,
        DifferentlyAbled: resolvedResult.DifferentlyAbled,
        State: resolvedResult.State,
        City: resolvedResult.City,
        Phone: resolvedResult.Phone,
        Email: resolvedResult.Email,
        CreatedOn: functionContext.currentTs,
      }
    );

    await databaseModule.knex.raw('SET SQL_SAFE_UPDATES = 0');
    await databaseModule.knex('jobseekercareerpreferences').where({ UserId: resolvedResult.UserId }).update({ JobSeekerId: rows[0][0][0].Id });
    await databaseModule.knex.raw('SET SQL_SAFE_UPDATES = 1');

    logger.logInfo(
      `addJobSeekerDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddJobSeekerDetailsDb) {

    logger.logInfo(
      `addJobSeekerDetailsDb() :: Error :: ${JSON.stringify(
        erraddJobSeekerDetailsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddJobSeekerDetailsDb.sqlState &&
      erraddJobSeekerDetailsDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    } else if (
      erraddJobSeekerDetailsDb.sqlState &&
      erraddJobSeekerDetailsDb.sqlState ==
      constant.ErrorCode.Job_Seeker_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Job_Seeker_Already_Exists;
      errorMessage = constant.ErrorMessage.Job_Seeker_Already_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchJobSeekerDetailsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchJobSeekerDetailsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL fetch_jobseeker_details(
        :JobSeekerId,
        :UserId
        )`,
      {
        JobSeekerId: resolvedResult.JobSeekerId,
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchJobSeekerDetailsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    let details;

    if (
      resolvedResult?.JobSeekerId === null ||
      resolvedResult?.UserId === null
    ) {
      details = rows[0][0];
    } else {
      details = {
        JobSeekerDetails: rows[0][1],
        CareerPreferences: rows[0][0],
        Resume: rows[0][2],
      };
    }

    return details;
  } catch (errfetchJobSeekerDetailsDb) {
    logger.logInfo(
      `fetchJobSeekerDetailsDb() :: Error :: ${JSON.stringify(
        errfetchJobSeekerDetailsDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchJobSeekerDetailsDb.sqlState &&
      errfetchJobSeekerDetailsDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    } else if (
      errfetchJobSeekerDetailsDb.sqlState &&
      errfetchJobSeekerDetailsDb.sqlState ==
      constant.ErrorCode.Job_Seeker_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Job_Seeker_Already_Exists;
      errorMessage = constant.ErrorMessage.Job_Seeker_Already_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.addUserResumeDb = async (
  functionContext,
  resolvedResult,
  images
) => {
  let logger = functionContext.logger;
  let image = [];

  if (images === "[]") {
    resolvedResult?.Images?.split(",")?.forEach((element) => {
      image.push(element);
    });
    image = JSON.stringify(image);
  } else {
    image = images;
  }

  logger.logInfo("addUserResumeDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL add_edit_user_resume(
        :UserId,
        :ResumeRef,
        :Resume,
        :CurrentTs
        )`,
      {
        UserId: resolvedResult.UserId,
        ResumeRef: resolvedResult.ResumeRef,
        Resume: image,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `addUserResumeDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (erraddUserResumeDb) {
    logger.logInfo(
      `addUserResumeDb() :: Error :: ${JSON.stringify(erraddUserResumeDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      erraddUserResumeDb.sqlState &&
      erraddUserResumeDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.saveUnsaveJobsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("saveUnsaveJobsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL save_unsave_jobs(
        :UserId,
        :JobId,
        :IsActive,
        :CurrentTs
        )`,
      {
        UserId: resolvedResult.UserId,
        JobId: resolvedResult.JobId,
        IsActive: resolvedResult.IsActive,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `saveUnsaveJobsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0][0];
  } catch (errsaveUnsaveJobsDb) {
    logger.logInfo(
      `saveUnsaveJobsDb() :: Error :: ${JSON.stringify(errsaveUnsaveJobsDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errsaveUnsaveJobsDb.sqlState &&
      errsaveUnsaveJobsDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    } else if (
      errsaveUnsaveJobsDb.sqlState &&
      errsaveUnsaveJobsDb.sqlState ==
      constant.ErrorCode.Job_Seeker_Already_Exists
    ) {
      errorCode = constant.ErrorCode.Job_Seeker_Already_Exists;
      errorMessage = constant.ErrorMessage.Job_Seeker_Already_Exists;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }
    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchSavedJobsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchSavedJobsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL fetch_saved_jobs(:UserId)`,
      {
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchSavedJobsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchSavedJobs) {
    logger.logInfo(
      `errfetchSavedJobs() :: Error :: ${JSON.stringify(errfetchSavedJobs)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchSavedJobs.sqlState &&
      errfetchSavedJobs.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.applyJobsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("applyJobsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `
     CALL apply_jobs(
      :UserId, 
      :JobId,
      :Applied,
      :CurrentTs
      )`,
      {
        UserId: resolvedResult.UserId,
        JobId: resolvedResult.JobId,
        Applied: resolvedResult.Applied,
        CurrentTs: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `applyJobsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errapplyJobs) {
    logger.logInfo(
      `errapplyJobs() :: Error :: ${JSON.stringify(errapplyJobs)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errapplyJobs.sqlState &&
      errapplyJobs.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchAppliedJobsDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchAppliedJobsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `
     CALL fetch_applied_jobs(
      :UserId
      )`,
      {
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchAppliedJobsDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchAppliedJobs) {
    logger.logInfo(
      `errfetchAppliedJobs() :: Error :: ${JSON.stringify(errfetchAppliedJobs)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchAppliedJobs.sqlState &&
      errfetchAppliedJobs.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchEducationListDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchEducationListDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(` CALL fetch_education_list()`);

    logger.logInfo(
      `fetchEducationListDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchEducationList) {
    logger.logInfo(
      `errfetchEducationList() :: Error :: ${JSON.stringify(
        errfetchEducationList
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchEducationList.sqlState &&
      errfetchEducationList.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchJobRolesDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchJobRolesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(` CALL fetch_job_categories()`);

    logger.logInfo(
      `fetchJobRolesDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    let categories = rows[0][0];

    categories = categories.sort((a, b) => a.Name.localeCompare(b.Name));

    return categories;
  } catch (errfetchJobRoles) {
    logger.logInfo(
      `errfetchJobRoles() :: Error :: ${JSON.stringify(errfetchJobRoles)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchJobRoles.sqlState &&
      errfetchJobRoles.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchJobNotificationsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchJobRolesDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL fetch_job_notifications(:UserId)`,
      {
        UserId: resolvedResult?.UserId,
      }
    );

    logger.logInfo(
      `fetchJobRolesDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0] ? rows[0][0] : null;
  } catch (errfetchJobRoles) {
    logger.logInfo(
      `errfetchJobRoles() :: Error :: ${JSON.stringify(errfetchJobRoles)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errfetchJobRoles.sqlState &&
      errfetchJobRoles.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.deleteJobNotificationsDB = async (
  functionContext,
  resolvedResult,
  NotificationRef
) => {
  let logger = functionContext.logger;

  logger.logInfo("deleteJobNotificationsDB() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL delete_job_notifications(:DeleteAll, :NotificationRef, :UserId)`,
      {
        DeleteAll: resolvedResult?.DeleteAll,
        NotificationRef: NotificationRef ? NotificationRef : null,
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `deleteJobNotificationsDB() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    var Details = rows[0][0][0];
    return Details;
  } catch (errdeleteJobNotificationsDB) {
    logger.logInfo(
      `errdeleteJobNotificationsDB() :: Error :: ${JSON.stringify(
        errdeleteJobNotificationsDB
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

//Fetch User
module.exports.recommendedListDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("recommendedListDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `CALL recommended_list(:CategoryId)`,
      {
        CategoryId: resolvedResult.CategoryId,
      }
    );

    logger.logInfo(
      `recommendedListDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );

    return rows[0][0];
  } catch (errFetchUserDb) {
    logger.logInfo(
      `recommendedListDb() :: Error :: ${JSON.stringify(errFetchUserDb)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errFetchUserDb.sqlState &&
      errFetchUserDb.sqlState == constant.ErrorCode.User_Dont_Exists
    ) {
      errorCode = constant.ErrorCode.User_Dont_Exists;
      errorMessage = constant.ErrorMessage.User_Dont_Exists;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchUserResumeDb = async (functionContext, resolvedResult) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchUserResumeDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL fetch_user_resume(:UserId)`,
      {
        UserId: resolvedResult.UserId,
      }
    );

    logger.logInfo(
      `fetchUserResumeDb() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errFetchUserResume) {
    logger.logInfo(
      `errFetchUserResume() :: Error :: ${JSON.stringify(errFetchUserResume)}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errFetchUserResume.sqlState &&
      errFetchUserResume.sqlState == constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.fetchVendorBasedOnJobIdDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("fetchVendorBasedOnJobIdDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      ` CALL fetch_vendor_based_on_job_id(:JobId)`,
      {
        JobId: resolvedResult.JobId,
      }
    );

    logger.logInfo(
      `fetchVendorBasedOnJobIdDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errFetchVendorBasedOnJobIdDb) {
    logger.logInfo(
      `errFetchVendorBasedOnJobIdDb() :: Error :: ${JSON.stringify(
        errFetchVendorBasedOnJobIdDb
      )}`
    );
    let errorCode = null;
    let errorMessage = null;
    if (
      errFetchVendorBasedOnJobIdDb.sqlState &&
      errFetchVendorBasedOnJobIdDb.sqlState ==
      constant.ErrorCode.No_Service_Found
    ) {
      errorCode = constant.ErrorCode.No_Service_Found;
      errorMessage = constant.ErrorMessage.No_Service_Found;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};
