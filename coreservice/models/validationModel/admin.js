const joi = require("joi");

//AddVendor
module.exports.addCategories = (requestParams) => {
  let joiSchema = joi.object({
    CategoryRef: joi.string().optional().allow(null),
    Name: joi.string().required(),
    CategoriesIcon: joi.string().optional().allow(null),
    // Status: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//AddSubCategories
module.exports.addSubCategories = (requestParams) => {
  let joiSchema = joi.object({
    SubCategoryRef: joi.string().optional().allow(null),
    CategoryRef: joi.string().optional().allow(null),
    Name: joi.string().required(),
    //Status: joi.number().optional().allow(null),
    //CategoriesIcon:joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//Add popular services

module.exports.addPopularServices = (requestParams) => {
  let joiSchema = joi.object({
    CategoryId: joi.string().optional().allow(null),
    UserType: joi.string().optional().allow(null),
    Image: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//Add Trending Services
module.exports.addTrendingServices = (requestParams) => {
  let joiSchema = joi.object({
    CategoryId: joi.string().optional().allow(null),
    UserType: joi.string().optional().allow(null),
    Image: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//block unblock account
module.exports.blockUnblockAccount = (requestParams) => {
  let joiSchema = joi.object({
    UserRef: joi.string().optional().allow(null),
    UserType: joi.number().optional().allow(null),
    Status: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//delete Review
module.exports.deleteReview = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.string().optional().allow(null),
    BusinessId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//approve reject vendors
module.exports.approveRejectVendors = (requestParams) => {
  let joiSchema = joi.object({
    VendorRef: joi.string().optional().allow(null),
    Status: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//fetch approved reject vendors
module.exports.fetchApprovedRejectVendors = (requestParams) => {
  let joiSchema = joi.object({
    Status: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
//payment approval
module.exports.paymentApproval = (requestParams) => {
  let joiSchema = joi.object({
    VendorId: joi.number().required(),
    IsApproved: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//Fetch payment Details
module.exports.fetchPaymentDetails = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().optional().allow(null),
    UserType: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//Add Master
module.exports.addMaster = (requestParams) => {
  let joiSchema = joi.object({
    MasterRef: joi.string().optional().allow(null),
    Firstname: joi.string().optional().allow(null),
    Lastname: joi.string().optional().allow(null),
    Username: joi.string().optional().allow(null),
    Email: joi.string().optional().allow(null),
    Phone: joi.string().optional().allow(null),
    Passsword: joi.string().optional().allow(null),
    UserType: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//Fetch Revenue Generted
module.exports.fetchRevenueGenerated = (requestParams) => {
  let joiSchema = joi.object({
    SalesId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//delete Advertisement
module.exports.deleteAdvertisement = (requestParams) => {
  let joiSchema = joi.object({
    AdvertisementRef: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//fetch Master Details
module.exports.FetchMasterDetails = (requestParams) => {
  let joiSchema = joi.object({
    UserType: joi.number().optional().allow(0),
  });
  return joiSchema.validate(requestParams);
};

//delete Trending services
module.exports.deleteTrendingServices = (requestParams) => {
  let joiSchema = joi.object({
    CategoryId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//delete Category Request
module.exports.deleteCategory = (requestParams) => {
  let joiSchema = joi.object({
    CategoryId: joi.number().optional().allow(null),
    SubCategoryId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//fetch Addvertisement  Details
module.exports.FetchAddvertisementDetails = (requestParams) => {
  let joiSchema = joi.object({
    Status: joi.number().optional().allow(null),
    AppType: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//add admin advertisement  Request
module.exports.addadminadvertisemt = (requestParams) => {
  let joiSchema = joi.object({
    AdvertisementtId: joi.number().optional().allow(null),
    Image: joi.string().optional().allow(null),
    AdLink: joi.string().optional().allow(null),
    Status: joi.number().optional().allow(null),
    AppType: joi.number().optional().allow(null),
    AdSpaceId: joi.number().optional().allow(null),
    ImageOperation: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//approval of business
module.exports.approvalOfBusiness = (requestParams) => {
  let joiSchema = joi.object({
    BusinessId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//delete Popular services
module.exports.deletePopularServices = (requestParams) => {
  let joiSchema = joi.object({
    CategoryId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//delete job seeker
module.exports.deleteJobSeeker = (requestParams) => {
  let joiSchema = joi.object({
    JobSeekerId: joi.number().required(),
    CareerId: joi.number().required(),
    ResumeId: joi.number().required(),
    UserId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//block job seeker
module.exports.blockJobSeeker = (requestParams) => {
  let joiSchema = joi.object({
    JobSeekerId: joi.number().required(),
    UserId: joi.number().required(),
    Block: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//admin cha initiation
module.exports.adminChatInitiation = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    UserType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//block job seeker
module.exports.verify = (requestParams) => {
  let joiSchema = joi.object({
    JobSeekerId: joi.number().optional().allow(null),
    UserId: joi.number().optional().allow(null),
    VendorId: joi.number().optional().allow(null),
    CareerId: joi.number().optional().allow(null),
    BusinessId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
