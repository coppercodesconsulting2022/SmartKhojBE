const joi = require("joi");

module.exports.userLogin = (requestParams) => {
  let joiSchema = joi.object({
    Username: joi.string().required(),
    Password: joi.string().required(),
    Flag: joi.number().optional().allow(null),
    UserType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//user Logout
module.exports.userLogout = (requestParams) => {
  let joiSchema = joi.object({
    UserRef: joi.string().required(),
    UserType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//FetchUsers
module.exports.fetchUser = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//AddUsers
module.exports.addUser = (requestParams) => {
  let joiSchema = joi.object({
    UserRef: joi.string().optional().allow(null),
    Firstname: joi.string().optional().allow(null),
    Lastname: joi.string().optional().allow(null),
    Email: joi.string().optional().allow(null),
    Phone: joi.string().optional().allow(null),
    DOB: joi.string().optional().allow(null),
    Gender: joi.string().optional().allow(null),
    Nationality: joi.string().optional().allow(null),
    Address: joi.string().optional().allow(null),
    State: joi.string().optional().allow(null),
    City: joi.string().optional().allow(null),
    Pincode: joi.string().optional().allow(null),
    Password: joi.string().optional().allow(null),
    DeviceToken: joi.string().optional().allow(null),
    IsActive: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//addadvertisement

module.exports.addAdvertisement = (requestParams) => {
  let joiSchema = joi.object({
    AdvertisementRef: joi.string().optional().allow(null),
    BusinessName: joi.string().optional(),
    ContactPersonName: joi.string().optional(),
    Phone: joi.string().optional(),
    Pincode: joi.string().optional(),
    State: joi.string().optional(),
    City: joi.string().optional(),
    BusinessCategory: joi.number().optional(),
    AddDescription: joi.string().optional(),
    UserType: joi.string().optional(),
    UserId: joi.number().optional(),
    // VendorId: joi.string().optional(),
    Status: joi.number().optional(),
    // AdvertisementImage: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.fetchReviews = (requestParams) => {
  let joiSchema = joi.object({
    VendorId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//AddReviews
module.exports.addReview = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    BusinessId: joi.number().required(),
    Rating: joi.number().required(),
    ReviewText: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//AddSavedService
module.exports.addSavedService = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    BusinessId: joi.number().required(),
    IsActive: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//fetch saved services
module.exports.fetchSavedservices = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    //VendorId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//fetch Catalogue
module.exports.fetchCatalogue = (requestParams) => {
  let joiSchema = joi.object({
    BusinessId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//filters
module.exports.filters = (requestParams) => {
  let joiSchema = joi.object({
    City: joi.string().optional().allow(null),
    Rating: joi.number().optional().allow(null),
    UserId: joi.number().optional().allow(null),
    Trusted: joi.number().optional().allow(null),
    Certified: joi.number().optional().allow(null),
    Verified: joi.number().optional().allow(null),
    Popular: joi.number().optional().allow(null),
    RecentlyAdded: joi.number().optional().allow(null),
    Nearby: joi.number().optional().allow(null),
    Longitude: joi.number().optional().allow(null),
    Latitude: joi.number().optional().allow(null),
    ByRadius: joi.number().optional().allow(null),
    Radius: joi.number().optional().allow(null),
    SubCategoryId: joi.required(),
  });
  return joiSchema.validate(requestParams);
};

//fetch Vendor wrt subcategory
module.exports.fetchVendorCategory = (requestParams) => {
  let joiSchema = joi.object({
    SubCategoryId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//forgot Password
module.exports.forgotPassword = (requestParams) => {
  let joiSchema = joi.object({
    Phone: joi.string().optional().allow(null),
    Email: joi.string().optional().allow(null),
    Password: joi.string().required(),
    UserType: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//fetch Notification
module.exports.fetchNotification = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

// delete notification
module.exports.deleteNotification = (requestParams) => {
  let joiSchema = joi.object({
    NotificationRef: joi.array().required(),
  });
  return joiSchema.validate(requestParams);
};

// by user notification
module.exports.pushNotificationByUserRequest = (requestParams) => {
  let joiSchema = joi.object({
    SubCategoryId: joi.number().required(),
    UserId: joi.number().required(),
    Latitude: joi.number().required(),
    Longitude: joi.number().required(),
    UserType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

// Register token
module.exports.registerToken = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    DeviceToken: joi.string().required(),
    UserType: joi.number().required(),
    AppType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//update Password
module.exports.updatePassword = (requestParams) => {
  let joiSchema = joi.object({
    //  UserRef: joi.string().required(),
    OldPassword: joi.string().required(),
    NewPassword: joi.string().required(),
    ConfirmPassword: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.checkIfRegisteredRequest = (requestParams) => {
  const joiSchema = joi.object({
    Phone: joi.string().required(),
    UserType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addCareerPreferences = (requestParams) => {
  let joiSchema = joi.object({
    Ref: joi.string().optional().allow(null),
    UserId: joi.number().required(),
    CategoryId: joi.number().required(),
    Role: joi.string().required(),
    Location: joi.string().required(),
    Shift: joi.string().required(),
    JobType: joi.string().required(),
    EmployementType: joi.string().required(),
    WorkStatus: joi.string().required(),
    WorkExperience: joi.string().required(),
    Salary: joi.string().required(),
    HighestEducation: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addKeySkills = (requestParams) => {
  let joiSchema = joi.object({
    CareerId: joi.number().required(),
    UserId: joi.number().required(),
    KeySkills: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addJobSeekerDetails = (requestParams) => {
  let joiSchema = joi.object({
    CareerId: joi.number().required(),
    UserId: joi.number().required(),
    Gender: joi.string().required(),
    MaritalStatus: joi.string().required(),
    DOB: joi.string().required(),
    Age: joi.string().required(),
    DifferentlyAbled: joi.string().required(),
    State: joi.string().required(),
    City: joi.string().required(),
    // Languages: joi.string().required(),
    Phone: joi.string().required(),
    Email: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.fetchJobSeekerDetails = (requestParams) => {
  let joiSchema = joi.object({
    JobSeekerId: joi.number().optional().allow(null),
    UserId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addUserResume = (requestParams) => {
  let joiSchema = joi.object({
    ResumeRef: joi.string().optional().allow(null),
    Resume: joi.string().optional().allow(null),
    UserId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.saveUnsaveJobs = (requestParams) => {
  let joiSchema = joi.object({
    // Ref: joi.string().optional().allow(null),
    UserId: joi.number().required(),
    JobId: joi.number().required(),
    IsActive: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.fetchSavedJobs = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.appliedJobs = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    JobId: joi.number().required(),
    Applied: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.fetchAppliedJobs = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.fetchJobNotifications = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.deleteJobNotifications = (requestParams) => {
  let joiSchema = joi.object({
    DeleteAll: joi.string().optional().allow(null),
    NotificationRef: joi.array().optional().allow(null),
    UserId: joi.number().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.recommendedList = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    CategoryId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
