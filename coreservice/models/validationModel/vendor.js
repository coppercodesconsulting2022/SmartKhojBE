const joi = require("joi");

//AddVendor
module.exports.addVendor = (requestParams) => {
  let joiSchema = joi.object({
    VendorRef: joi.string().optional().allow(null),
    Firstname: joi.string().optional().allow(null),
    Lastname: joi.string().optional().allow(null),
    Phone: joi.string().optional().allow(null),
    Email: joi.string().optional().allow(null),
    DOB: joi.string().optional().allow(null),
    Gender: joi.string().optional().allow(null),
    State: joi.string().optional().allow(null),
    Password: joi.string().optional().allow(null),
    Image: joi.string().optional().allow(null),
    IsActive: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//Fetch  Vendor
module.exports.fetchVendor = (requestParams) => {
  let joiSchema = joi.object({
    VendorRef: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
//Fetch Leads
module.exports.fetchLeads = (requestParams) => {
  let joiSchema = joi.object({
    BusinessId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//AddReviews Reply
module.exports.addReviewReply = (requestParams) => {
  let joiSchema = joi.object({
    ReviewRef: joi.string().required(),
    // BusinessId: joi.number().required(),
    ReviewReply: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//Addleads
module.exports.addLeads = (requestParams) => {
  let joiSchema = joi.object({
    BusinessId: joi.string().required(),
    Calls: joi.number().integer().min(0),
    Visits: joi.number().integer().min(0),
    Leads: joi.number().integer().min(0),
  });
  return joiSchema.validate(requestParams);
};

//Package Updation
module.exports.packageUpdation = (requestParams) => {
  let joiSchema = joi.object({
    PackageName: joi.string().required(),
    Amount: joi.number().required(),
    IsCatalogue: joi.number().required(),
    BalanceAds: joi.number().required(),
    IsActive: joi.number().required(),
    IsVerified: joi.number().required(),
    IsCertified: joi.number().required(),
    IsTrusted: joi.number().required(),
    IsChat: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//fetch package details
module.exports.showpackageDetails = (requestParams) => {
  let joiSchema = joi.object({
    BusinessId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//Show Balance Ads
module.exports.showBalanceAdsDetails = (requestParams) => {
  let joiSchema = joi.object({
    BusinessId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//add catalogue
module.exports.addBusinessDetail = (requestParams) => {
  let joiSchema = joi.object({
    BusinessRef: joi.string().optional().allow(null),
    VendorId: joi.string().required(),
    BusinessName: joi.string().required(),
    OwnerName: joi.string().required(),
    BusinessCategoryId: joi.number().required(),
    DateOfBusiness: joi.string().optional().allow(null),
    ContactNumber: joi.string().required(),
    Email: joi.string().optional().allow(null),
    GST: joi.string().optional().allow(null),
    Address: joi.string().required(),
    Pincode: joi.string().required(),
    City: joi.string().required(),
    State: joi.string().required(),
    Landmark: joi.string().required(),
    Latitude: joi.string().required(),
    Longitude: joi.string().required(),
    // Location: joi.number().optional().allow(null),
    Images: joi.string().optional().allow(null),
    Description: joi.string().required(),
    ServingCities: joi.string().required(),
    Services: joi.string().optional().allow(null),
    OtherServices: joi.string().optional().allow(null),
    // BusineessImage: joi.string().optional().allow(null),
    Sunday: joi.string().optional().allow(null),
    Monday: joi.string().optional().allow(null),
    Tuesday: joi.string().optional().allow(null),
    Wednesday: joi.string().optional().allow(null),
    Thursday: joi.string().optional().allow(null),
    Friday: joi.string().optional().allow(null),
    Saturday: joi.string().optional().allow(null),
    StartTime: joi.string().optional().allow(null),
    EndTime: joi.string().optional().allow(null),
    SalesPersonId: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//get vendors radius
module.exports.getVendorsRadius = (requestParams) => {
  let joiSchema = joi.object({
    SubCategoryId: joi.string().required(),
    Latitude: joi.string().required(),
    Longitude: joi.string().required(),
    Radius: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//add catalogue
module.exports.addCatalogueDetails = (requestParams) => {
  let joiSchema = joi.object({
    ProductRef: joi.string().optional().allow(null),
    BusinessId: joi.string().required(),
    ProductTitle: joi.string().required(),
    Amount: joi.string().required(),
    ProductDescription: joi.string().required(),
    Image: joi.string().optional().allow(null),
    Quantity: joi.number().optional().allow(null),
    Phone: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
//get vendors radius
module.exports.addBusinessVerificationImage = (requestParams) => {
  let joiSchema = joi.object({
    BusinessRef: joi.string().required(),
    BusineessImage: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
//Fetch Business Details
module.exports.fetchBusinessDetails = (requestParams) => {
  let joiSchema = joi.object({
    SubCategoryId: joi.string().optional().allow(null),
    BusinessId: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//Fetch Business Details Wrt Vendor
module.exports.fetchBusinessDetailsWrtVendor = (requestParams) => {
  let joiSchema = joi.object({
    VendorId: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

// by vendor notification
module.exports.pushNotificationByVendorRequest = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    VendorId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//fetch Notification
module.exports.fetchNotification = (requestParams) => {
  let joiSchema = joi.object({
    VendorId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//Subscribe Package
module.exports.subscribePackage = (requestParams) => {
  let joiSchema = joi.object({
    VendorId: joi.number().required(),
    BusinessId: joi.number().required(),
    PackageId: joi.number().required(),
    PlanId: joi.number().required(),
    PlanName: joi.string().required(),
    SubscriptionId: joi.number().required(),
    SubscriptionURL: joi.string().required(),
    SubscriptionStatus: joi.number().required(),
    PaymentId: joi.string().required(),
    PaymentMode: joi.string().required(),
    Amount: joi.string().required(),
    InvoiceId: joi.number().required(),
    paymentStatus: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//chat Initiated
module.exports.chatInitiated = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().optional().allow(0),
    VendorId: joi.number().optional().allow(0),
    UserType: joi.number().optional().allow(0),
  });
  return joiSchema.validate(requestParams);
};

//chat Initiated
module.exports.fetchchatInitiated = (requestParams) => {
  let joiSchema = joi.object({
    UserType: joi.string().required(),
    UserId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//Business Link
module.exports.saveBusinessLink = (requestParams) => {
  let joiSchema = joi.object({
    BusinessId: joi.number().optional().allow(null),
    BusinessLink: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//add company details for jobs
module.exports.addCompanyDetails = (requestParams) => {
  let joiSchema = joi.object({
    JobRef: joi.string().optional().allow(null),
    VendorId: joi.string().required(),
    Companyname: joi.string().required(),
    CompanyEmail: joi.string().required(),
    State: joi.string().required(),
    City: joi.string().required(),
    Logo: joi.string().optional().allow(null),
    Location: joi.string().required(),
    CompanyDescription: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addJobDetails = (requestParams) => {
  let joiSchema = joi.object({
    JobId: joi.number().optional().allow(null),
    VendorId: joi.number().required(),
    CategoryId: joi.number().required(),
    JobPosition: joi.string().required(),
    Salary: joi.string().required(),
    Shift: joi.string().required(),
    JobType: joi.string().required(),
    EmployementType: joi.string().required(),
    WorkStatus: joi.string().required(),
    WorkExperience: joi.string().required(),
    JobDescription: joi.string().required(),
    JobResponsibilities: joi.string().optional().allow(null),
    JobRequirement: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addJobSummary = (requestParams) => {
  let joiSchema = joi.object({
    JobId: joi.number().optional().allow(null),
    VendorId: joi.number().required(),
    Education: joi.string().required(),
    Vacancy: joi.string().required(),
    // Skills: joi.string().required(),
    // Duration: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.fetchJobs = (requestParams) => {
  let joiSchema = joi.object({
    VendorId: joi.string().optional().allow(null),
    JobId: joi.number().optional().allow(null),
    UserId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.deleteJobs = (requestParams) => {
  let joiSchema = joi.object({
    DeleteAll: joi.number().optional().allow(null),
    JobId: joi.string().optional().allow(null),
    VendorId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.jobNotification = (requestParams) => {
  let joiSchema = joi.object({
    CategoryId: joi.number().required(),
    JobId: joi.number().required(),
    VendorRef: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.deleteUser = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    Type: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.updateUserVendorMessageStatus = (requestParams) => {
  let joiSchema = joi.object({
    UserType: joi.number().required(),
    VendorId: joi.number().required(),
    UserId: joi.number().required(),
    VendorStatus: joi.number().optional().allow(null),
    UserStatus: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
