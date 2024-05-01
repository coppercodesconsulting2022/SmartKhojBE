const databaseModule = require("../database/database");
const constant = require("../common/constant");
const errorModel = require("../models/serviceModel/error");

module.exports.addJobSeekerPaymentsDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("addJobSeekerPaymentsDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `
     CALL add_job_seeker_payments(
      :jobSeekerId, 
      :amount,
      :paymentStatus,
      :paymentId
      )`,
      {
        jobSeekerId: resolvedResult.jobSeekerId,
        amount: resolvedResult.amount,
        paymentStatus: resolvedResult.paymentStatus,
        paymentId: resolvedResult.paymentId,
      }
    );

    logger.logInfo(
      `addJobSeekerPaymentsDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errJobSeekerPaymentsDb) {
    logger.logInfo(
      `errJobSeekerPaymentsDb() :: Error :: ${JSON.stringify(
        errJobSeekerPaymentsDb
      )}`
    );
    let errorCode = constant.ErrorCode.Error_Blocking_Job_Seeker;
    let errorMessage = constant.ErrorMessage.Error_Blocking_Job_Seeker;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.updateVendorCustomerIdDb = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("updateVendorCustomerIdDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `
     CALL update_vendor_with_customer_id(
      :VendorId, 
      :CustomerId)`,
      {
        VendorId: resolvedResult.VendorId,
        CustomerId: resolvedResult.CustomerId,
      }
    );

    logger.logInfo(
      `updateVendorCustomerIdDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errupdateVendorCustomerIdDb) {
    logger.logInfo(
      `errupdateVendorCustomerIdDb() :: Error :: ${JSON.stringify(
        errJobSeekerPaymentsDb
      )}`
    );
    let errorCode = constant.ErrorCode.Error_Updating_Vendor;
    let errorMessage = constant.ErrorMessage.Error_Updating_Vendor;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.saveSubScriptionDetailsDB = async (
  functionContext,
  resolvedResult
) => {
  let logger = functionContext.logger;

  logger.logInfo("updateVendorCustomerIdDb() Invoked !");

  try {
    let rows = await databaseModule.knex.raw(
      `
     CALL save_subscription_details(
      :SubsriptionId, 
      :VendorId,
      :BusinessId,
      :PackageId,
      :Amount,
      :SubscriptionStatus,
      :PaymentId,
      :CreatedOn
      )`,
      {
        SubsriptionId: resolvedResult.SubscriptionId,
        VendorId: resolvedResult.VendorId,
        BusinessId: resolvedResult.BusinessId,
        PackageId: resolvedResult.PackageId,
        Amount: resolvedResult.Amount,
        SubscriptionStatus: resolvedResult.SubscriptionStatus,
        PaymentId: resolvedResult.RazorpayPaymentId,
        CreatedOn: functionContext.currentTs,
      }
    );

    logger.logInfo(
      `updateVendorCustomerIdDb() :: Returned Result :: ${JSON.stringify(
        rows[0][0]
      )}`
    );
    return rows[0][0][0] ? rows[0][0][0] : null;
  } catch (errupdateVendorCustomerIdDb) {
    logger.logInfo(
      `errupdateVendorCustomerIdDb() :: Error :: ${JSON.stringify(
        errJobSeekerPaymentsDb
      )}`
    );
    let errorCode = constant.ErrorCode.Error_Saving_Subscription_DB;
    let errorMessage = constant.ErrorMessage.Error_Saving_Subscription_DB;

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.addVendorWalletAmount = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;

  logger.logInfo("addWalletAmount() Invoked!");
  try {
    let result = await databaseModule.knex.raw(
      "CALL add_vendor_payment(:vendorId,:businessId,:packageId,:paymentId,:paymentStatus, :amount)",
      {
        vendorId: resolvedResult.vendorId,
        businessId: resolvedResult.businessId,
        packageId: resolvedResult.packageId,
        paymentId: resolvedResult.paymentId,
        paymentStatus: resolvedResult.paymentStatus,
        amount: resolvedResult.amount,
      }
    );

    logger.logInfo(`addWalletAmount() ::Successful`);

    return result[0][0][0];
  } catch (errOfferDetails) {
    logger.logInfo(
      `addWalletAmount() :: Error :: ${JSON.stringify(errOfferDetails)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errOfferDetails.sqlState &&
      errOfferDetails.sqlState == constant.ErrorCode.Invalid_User
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

module.exports.getVendorPaymentDetails = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;

  logger.logInfo("getVendorPaymentDetails() Invoked!");
  try {
    let result = await databaseModule.knex.raw(
      "CALL fetch_vendor_paymnets(:vendorId)",
      {
        vendorId: resolvedResult.vendorId,
      }
    );

    logger.logInfo(`getVendorPaymentDetails() ::Successful`);

    return { paymentDetails: result[0][0], packageDetails: result[0][1][0] };
  } catch (errOfferDetails) {
    logger.logInfo(
      `getVendorPaymentDetails() :: Error :: ${JSON.stringify(errOfferDetails)}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errOfferDetails.sqlState &&
      errOfferDetails.sqlState == constant.ErrorCode.No_Payments_Captured
    ) {
      errorCode = constant.ErrorCode.No_Payments_Captured;
      errorMessage = constant.ErrorMessage.No_Payments_Captured;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};

module.exports.getJobSeekerPaymentDetails = async (
  functionContext,
  resolvedResult
) => {
  var logger = functionContext.logger;

  logger.logInfo("getJobSeekerPaymentDetails() Invoked!");
  try {
    let result = await databaseModule.knex.raw(
      "CALL fetch_job_seeker_payments(:jobSeekerId)",
      {
        jobSeekerId: resolvedResult.jobSeekerId,
      }
    );

    logger.logInfo(`getJobSeekerPaymentDetails() ::Successful`);

    return result[0][0];
  } catch (errOfferDetails) {
    logger.logInfo(
      `getJobSeekerPaymentDetails() :: Error :: ${JSON.stringify(
        errOfferDetails
      )}`
    );
    let errorCode = null;
    let errorMessage = null;

    if (
      errOfferDetails.sqlState &&
      errOfferDetails.sqlState == constant.ErrorCode.No_Payments_Captured
    ) {
      errorCode = constant.ErrorCode.No_Payments_Captured;
      errorMessage = constant.ErrorMessage.No_Payments_Captured;
    } else {
      errorCode = constant.ErrorCode.ApplicationError;
      errorMessage = constant.ErrorMessage.ApplicationError;
    }

    functionContext.error = new errorModel.ErrorModel(errorMessage, errorCode);
    throw functionContext.error;
  }
};
