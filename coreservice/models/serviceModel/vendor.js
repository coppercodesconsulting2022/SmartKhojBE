//AddVendor
class addVendorRequest {
  constructor(req) {
    this.VendorRef = req.body.VendorRef ? req.body.VendorRef : null;
    this.Firstname = req.body.Firstname ? req.body.Firstname : null;
    this.Lastname = req.body.Lastname ? req.body.Lastname : null;
    this.Phone = req.body.Phone ? req.body.Phone : null;
    this.Email = req.body.Email ? req.body.Email : null;
    this.DOB = req.body.DOB ? req.body.DOB : null;
    this.Gender = req.body.Gender ? req.body.Gender : null;
    this.State = req.body.State ? req.body.State : null;
    this.Password = req.body.Password ? req.body.Password : null;
    this.Image = req.body.Image ? req.body.Image : null;
    this.IsActive = req.body.IsActive ? req.body.IsActive : null;
    // this.ImageOperation = req.body.ImageOperation
    //   ? req.body.ImageOperation
    //   : null;
  }
}

class addVendorResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
// Fetch Vendor
class fetchVendorRequest {
  constructor(req) {
    this.VendorRef = req.query.VendorRef ? req.query.VendorRef : null;
  }
}

class fetchVendorResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// Add Review Reply
class addReviewReplyRequest {
  constructor(req) {
    this.ReviewRef = req.body.ReviewRef ? req.body.ReviewRef : null;
    // this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.ReviewReply = req.body.ReviewReply ? req.body.ReviewReply : null;
  }
}

class addReviewReplyResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// Add leads
class addLeadsRequest {
  constructor(req) {
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.Calls = req.body.Calls ? req.body.Calls : 0;
    this.Visits = req.body.Visits ? req.body.Visits : 0;
    this.Leads = req.body.Leads ? req.body.Leads : 0;
  }
}

class addLeadsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch Leads
class fetchLeadsRequest {
  constructor(req) {
    this.BusinessId = req.query.BusinessId ? req.query.BusinessId : null;
  }
}

class fetchLeadsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// Package Updation
class packageUpdationRequest {
  constructor(req) {
    this.PackageName = req.body.PackageName ? req.body.PackageName : null;
    this.Amount = req.body.Amount ? req.body.Amount : null;
    this.IsCatalogue = req.body.IsCatalogue ? req.body.IsCatalogue : null;
    this.BalanceAds = req.body.BalanceAds ? req.body.BalanceAds : null;
    this.IsVerified = req.body.IsVerified ? req.body.IsVerified : 0;
    this.IsCertified = req.body.IsCertified ? req.body.IsCertified : 0;
    this.IsActive = req.body.IsActive ? req.body.IsActive : 0;
    this.IsTrusted = req.body.IsTrusted ? req.body.IsTrusted : 0;
    this.IsChat = req.body.IsChat ? req.body.IsChat : 0;
  }
}

class packageUpdationResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch Package details
class showpackageDetailsRequest {
  constructor(req) {
    this.BusinessId = req.query.BusinessId ? req.query.BusinessId : null;
  }
}

class showpackageDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// Show Balance Ads
class showBalanceAdsRequest {
  constructor(req) {
    this.BusinessId = req.query.BusinessId ? req.query.BusinessId : null;
  }
}

class showBalanceAdsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//add catalogue

class addCatalogueRequest {
  constructor(req) {
    this.ProductRef = req.body.ProductRef ? req.body.ProductRef : null;
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.ProductTitle = req.body.ProductTitle ? req.body.ProductTitle : null;
    this.Amount = req.body.Amount ? req.body.Amount : null;
    this.ProductDescription = req.body.ProductDescription
      ? req.body.ProductDescription
      : null;
    this.Image = req.body.Image ? req.body.Image : null;
    this.Quantity = req.body.Quantity ? req.body.Quantity : 0;
    this.Phone = req.body.Phone ? req.body.Phone : null;
  }
}

class addCatalogueResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//GET VENDOR RADIUS
class getVendorsRadiusRequest {
  constructor(req) {
    this.SubCategoryId = req.query.SubCategoryId
      ? req.query.SubCategoryId
      : null;
    this.Latitude = req.query.Latitude ? req.query.Latitude : null;
    this.Longitude = req.query.Longitude ? req.query.Longitude : null;
    // this.Radius = req.query.Radius ? req.query.Radius : null;
  }
}

class getVendorsRadiusResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//ADD BUSINESS DETAILS
class addBusinessDetailsRequest {
  constructor(req) {
    this.BusinessRef = req.body.BusinessRef ? req.body.BusinessRef : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
    this.BusinessName = req.body.BusinessName ? req.body.BusinessName : null;
    this.OwnerName = req.body.OwnerName ? req.body.OwnerName : null;
    this.BusinessCategoryId = req.body.BusinessCategoryId
      ? req.body.BusinessCategoryId
      : 0;
    this.DateOfBusiness = req.body.DateOfBusiness
      ? req.body.DateOfBusiness
      : null;
    this.ContactNumber = req.body.ContactNumber ? req.body.ContactNumber : null;
    this.Email = req.body.Email ? req.body.Email : null;
    this.GST = req.body.GST ? req.body.GST : null;
    this.Address = req.body.Address ? req.body.Address : null;
    this.Pincode = req.body.Pincode ? req.body.Pincode : null;
    this.City = req.body.City ? req.body.City : null;
    this.State = req.body.State ? req.body.State : null;
    this.Landmark = req.body.Landmark ? req.body.Landmark : null;
    this.Latitude = req.body.Latitude ? req.body.Latitude : null;
    this.Longitude = req.body.Longitude ? req.body.Longitude : null;
    // this.Location = req.body.Location ? req.body.Location : null;
    this.Images = req.body.Images ? req.body.Images : null;
    this.Description = req.body.Description ? req.body.Description : null;
    this.ServingCities = req.body.ServingCities ? req.body.ServingCities : null;
    this.Services = req.body.Services ? req.body.Services : null;
    this.OtherServices = req.body.OtherServices ? req.body.OtherServices : null;
    //this.BusineessImage = req.body.BusineessImage ? req.body.BusineessImage : null;
    this.Sunday = req.body.Sunday ? req.body.Sunday : 0;
    this.Monday = req.body.Monday ? req.body.Monday : 0;
    this.Tuesday = req.body.Tuesday ? req.body.Tuesday : 0;
    this.Wednesday = req.body.Wednesday ? req.body.Wednesday : 0;
    this.Thursday = req.body.Thursday ? req.body.Thursday : 0;
    this.Friday = req.body.Friday ? req.body.Friday : 0;
    this.Saturday = req.body.Saturday ? req.body.Saturday : 0;
    this.StartTime = req.body.StartTime ? req.body.StartTime : null;
    this.EndTime = req.body.EndTime ? req.body.EndTime : null;
    this.SalesPersonId = req.body.SalesPersonId ? req.body.SalesPersonId : null;
  }
}

class addBusinessDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// pushNotificationBy Vendor notification
class pushNotificationByVendorRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
  }
}
class pushNotificationByVendorResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Add business verification image
class addBusinessVerificationImageRequest {
  constructor(req) {
    this.BusinessRef = req.body.BusinessRef ? req.body.BusinessRef : null;
    this.BusineessImage = req.body.BusineessImage
      ? req.body.BusineessImage
      : null;
  }
}

class addBusinessVerificationImageResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch Business Details
class fetchBusinessDetailsRequest {
  constructor(req) {
    this.SubCategoryId = req.query.SubCategoryId ? req.query.SubCategoryId : 0;
    this.BusinessId = req.query.BusinessId ? req.query.BusinessId : 0;
  }
}

class fetchBusinessDetailsResponse {
  constructor() {
    (this.Error = null),
      (this.RequestID = null),
      (this.Details = {}),
      (this.AllBusinessDetails = {});
  }
}

//Fetch Business Details Wrt Vendor
class fetchBusinessDetailsWrtVendorRequest {
  constructor(req) {
    this.VendorId = req.query.VendorId ? req.query.VendorId : null;
  }
}

class fetchBusinessDetailsWrtVendorResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Notification fetch
class fetchNotificationRequest {
  constructor(req) {
    this.VendorId = req.query.VendorId ? req.query.VendorId : null;
  }
}
class fetchNotificationResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Subscribe Package
// pushNotificationBy Vendor notification
class subscribePackageRequest {
  constructor(req) {
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.PackageId = req.body.PackageId ? req.body.PackageId : null;
    this.PlanId = req.body.PlanId ? req.body.PlanId : null;
    this.PlanName = req.body.PlanName ? req.body.PlanName : null;
    this.SubscriptionId = req.body.SubscriptionId
      ? req.body.SubscriptionId
      : null;
    this.SubscriptionURL = req.body.SubscriptionURL
      ? req.body.SubscriptionURL
      : null;
    this.SubscriptionStatus = req.body.SubscriptionStatus
      ? req.body.SubscriptionStatus
      : null;
    this.PaymentId = req.body.PaymentId ? req.body.PaymentId : null;
    this.PaymentMode = req.body.PaymentMode ? req.body.PaymentMode : null;
    this.Amount = req.body.Amount ? req.body.Amount : null;
    this.InvoiceId = req.body.InvoiceId ? req.body.InvoiceId : null;
    this.paymentStatus = req.body.paymentStatus ? req.body.paymentStatus : null;
  }
}
class subscribePackageResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//chat initiated request
class chatInitiatedRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : 0;
    this.VendorId = req.body.VendorId ? req.body.VendorId : 0;
    this.UserType = req.body.UserType ? req.body.UserType : 0;
  }
}
//chat inititated response
class chatInitiatedResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//fetch chat initiated request

class fetchchatInitiatedRequest {
  constructor(req) {
    this.UserType = req.query.UserType ? req.query.UserType : null;
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchchatInitiatedResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Buiness Link Request
class saveBusinessLinkRequest {
  constructor(req) {
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.BusinessLink = req.body.BusinessLink ? req.body.BusinessLink : null;
  }
}
//chat inititated response
class saveBusinessLinkResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class addCompanyDetailsRequest {
  constructor(req) {
    this.JobRef = req.body.JobRef ? req.body.JobRef : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
    this.Logo = req.body.Logo ? req.body.Logo : null;
    this.Companyname = req.body.Companyname ? req.body.Companyname : null;
    this.CompanyEmail = req.body.CompanyEmail ? req.body.CompanyEmail : null;
    this.State = req.body.State ? req.body.State : null;
    this.City = req.body.City ? req.body.City : null;
    this.Location = req.body.Location ? req.body.Location : null;
    this.CompanyDescription = req.body.CompanyDescription
      ? req.body.CompanyDescription
      : null;
  }
}

class addCompanyDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class addJobDetailsRequest {
  constructor(req) {
    this.JobId = req.body.JobId ? req.body.JobId : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
    this.JobPosition = req.body.JobPosition ? req.body.JobPosition : null;
    this.Salary = req.body.Salary ? req.body.Salary : null;
    this.Shift = req.body.Shift ? req.body.Shift : null;
    this.JobType = req.body.JobType ? req.body.JobType : null;
    this.EmployementType = req.body.EmployementType
      ? req.body.EmployementType
      : null;
    this.WorkStatus = req.body.WorkStatus ? req.body.WorkStatus : null;
    this.WorkExperience = req.body.WorkExperience
      ? req.body.WorkExperience
      : null;
    this.JobDescription = req.body.JobDescription
      ? req.body.JobDescription
      : null;
    this.JobResponsibilities = req.body.JobResponsibilities
      ? req.body.JobResponsibilities
      : null;
    this.JobRequirement = req.body.JobRequirement
      ? req.body.JobRequirement
      : null;
  }
}

class addJobDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class addJobSummaryRequest {
  constructor(req) {
    this.JobId = req.body.JobId ? req.body.JobId : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
    this.Education = req.body.Education ? req.body.Education : null;
    this.Vacancy = req.body.Vacancy ? req.body.Vacancy : null;
    // this.Skills = req.body.Skills ? req.body.Skills : null;
    // this.Duration = req.body.Duration ? req.body.Duration : null;
  }
}

class addJobSummaryResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class fetchJobsRequest {
  constructor(req) {
    this.VendorId = req.query.VendorId ? req.query.VendorId : null;
    this.JobId = req.query.JobId ? req.query.JobId : null;
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchJobsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
class deleteJobsRequest {
  constructor(req) {
    this.DeleteAll = req.body.DeleteAll ? req.body.DeleteAll : null;
    this.JobId = req.body.JobId ? req.body.JobId : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
  }
}

class deleteJobsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class jobNotificationsRequest {
  constructor(req) {
    this.VendorRef = req.body.VendorRef ? req.body.VendorRef : null;
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
    this.JobId = req.body.JobId ? req.body.JobId : null;
  }
}

class jobNotificationsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class deleteUserRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : 0;
    this.Type = req.query.Type ? req.query.Type : 0;
  }
}

class deleteUserResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class updateUserVendorMessageStatusRequest {
  constructor(req) {
    this.UserType = req.body.UserType ? req.body.UserType : 0;
    this.VendorId = req.body.VendorId ? req.body.VendorId : 0;
    this.UserId = req.body.UserId ? req.body.UserId : 0;
    this.VendorStatus = req.body.VendorStatus ? req.body.VendorStatus : 0;
    this.UserStatus = req.body.UserStatus ? req.body.UserStatus : 0;
  }
}

class updateUserVendorMessageStatusResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Subscribe Package
module.exports.subscribePackageRequest = subscribePackageRequest;
module.exports.subscribePackageResponse = subscribePackageResponse;

//Fetch Notification
module.exports.fetchNotificationRequest = fetchNotificationRequest;
module.exports.fetchNotificationResponse = fetchNotificationResponse;
// Add Notification
module.exports.pushNotificationByVendorRequest =
  pushNotificationByVendorRequest;
module.exports.pushNotificationByVendorResponse =
  pushNotificationByVendorResponse;
//Get vendor radius
module.exports.getVendorsRadiusRequest = getVendorsRadiusRequest;
module.exports.getVendorsRadiusResponse = getVendorsRadiusResponse;

//AddVendor
module.exports.addVendorRequest = addVendorRequest;
module.exports.addVendorResponse = addVendorResponse;

//Fetch Vendor
module.exports.fetchVendorRequest = fetchVendorRequest;
module.exports.fetchVendorResponse = fetchVendorResponse;

//Add review Reply
module.exports.addReviewReplyRequest = addReviewReplyRequest;
module.exports.addReviewReplyResponse = addReviewReplyResponse;
//Add Leads
module.exports.addLeadsRequest = addLeadsRequest;
module.exports.addLeadsResponse = addLeadsResponse;
//Fetch Leads
module.exports.fetchLeadsRequest = fetchLeadsRequest;
module.exports.fetchLeadsResponse = fetchLeadsResponse;

//Package Updation
module.exports.packageUpdationRequest = packageUpdationRequest;
module.exports.packageUpdationResponse = packageUpdationResponse;

//Fetch Package details
module.exports.showpackageDetailsRequest = showpackageDetailsRequest;
module.exports.showpackageDetailsResponse = showpackageDetailsResponse;

//Show Balance Ads
module.exports.showBalanceAdsRequest = showBalanceAdsRequest;
module.exports.showBalanceAdsResponse = showBalanceAdsResponse;

//add catalogue
module.exports.addCatalogueRequest = addCatalogueRequest;
module.exports.addCatalogueResponse = addCatalogueResponse;

//add Business Details
module.exports.addBusinessDetailsRequest = addBusinessDetailsRequest;
module.exports.addBusinessDetailsResponse = addBusinessDetailsResponse;

//add businessverification image
module.exports.addBusinessVerificationImageRequest =
  addBusinessVerificationImageRequest;
module.exports.addBusinessVerificationImageResponse =
  addBusinessVerificationImageResponse;

//Fetch Business Details
module.exports.fetchBusinessDetailsRequest = fetchBusinessDetailsRequest;
module.exports.fetchBusinessDetailsResponse = fetchBusinessDetailsResponse;

//Fetch Business Details Wrt Vendor
module.exports.fetchBusinessDetailsWrtVendorRequest =
  fetchBusinessDetailsWrtVendorRequest;
module.exports.fetchBusinessDetailsWrtVendorResponse =
  fetchBusinessDetailsWrtVendorResponse;

//chat initiated
module.exports.chatInitiatedRequest = chatInitiatedRequest;
module.exports.chatInitiatedResponse = chatInitiatedResponse;

//fetch chat inititated
module.exports.fetchchatInitiatedRequest = fetchchatInitiatedRequest;
module.exports.fetchchatInitiatedResponse = fetchchatInitiatedResponse;

//save Buiness Link
module.exports.saveBusinessLinkRequest = saveBusinessLinkRequest;
module.exports.saveBusinessLinkResponse = saveBusinessLinkResponse;

//add company details by vendor
module.exports.addCompanyDetailsRequest = addCompanyDetailsRequest;
module.exports.addCompanyDetailsResponse = addCompanyDetailsResponse;

//add job details by vendor
module.exports.addJobDetailsRequest = addJobDetailsRequest;
module.exports.addJobDetailsResponse = addJobDetailsResponse;

//add job details by vendor
module.exports.addJobSummaryRequest = addJobSummaryRequest;
module.exports.addJobSummaryResponse = addJobSummaryResponse;

//fetch jobs posted by vendor
module.exports.fetchJobsRequest = fetchJobsRequest;
module.exports.fetchJobsResponse = fetchJobsResponse;

//delete jobs posted by vendor
module.exports.deleteJobsRequest = deleteJobsRequest;
module.exports.deleteJobsResponse = deleteJobsResponse;

//jon notifiations to user
module.exports.jobNotificationsRequest = jobNotificationsRequest;
module.exports.jobNotificationsResponse = jobNotificationsResponse;

//delete user
module.exports.deleteUserRequest = deleteUserRequest;
module.exports.deleteUserResponse = deleteUserResponse;

//delete user
module.exports.updateUserVendorMessageStatusRequest =
  updateUserVendorMessageStatusRequest;
module.exports.updateUserVendorMessageStatusResponse =
  updateUserVendorMessageStatusResponse;
