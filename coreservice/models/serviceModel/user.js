class userLoginRequest {
  constructor(req) {
    this.Username = req.body.Username ? req.body.Username : null;
    this.Password = req.body.Password ? req.body.Password : null;
    this.Flag = req.body.Flag ? req.body.Flag : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
  }
}

class userLoginResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        AuthToken: null,
        UserRef: null,
        UserType: null,
        UserId: null,
      }),
      (this.RequestId = null);
  }
}
//User Logout
class userLogoutRequest {
  constructor(req) {
    this.UserRef = req.body.UserRef ? req.body.UserRef : null;

    this.UserType = req.body.UserType ? req.body.UserType : null;
  }
}

class userLogoutResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//AddUser
class addUserRequest {
  constructor(req) {
    this.UserRef = req.body.UserRef ? req.body.UserRef : null;
    this.Firstname = req.body.Firstname ? req.body.Firstname : null;
    this.Lastname = req.body.Lastname ? req.body.Lastname : null;
    this.Email = req.body.Email ? req.body.Email : null;
    this.Phone = req.body.Phone ? req.body.Phone : null;
    this.DOB = req.body.DOB ? req.body.DOB : null;
    this.Gender = req.body.Gender ? req.body.Gender : null;
    this.Nationality = req.body.Nationality ? req.body.Nationality : null;
    this.Address = req.body.Address ? req.body.Address : null;
    this.State = req.body.State ? req.body.State : null;
    this.City = req.body.City ? req.body.City : null;
    this.Pincode = req.body.Pincode ? req.body.Pincode : null;
    this.Password = req.body.Password ? req.body.Password : null;
    this.DeviceToken = req.body.DeviceToken ? req.body.DeviceToken : null;
    this.IsActive = req.body.IsActive ? req.body.IsActive : null;
  }
}

class addUserResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch User Information
class fetchUserRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchUserResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        UserDetails: null,
        UserType: null,
      });
  }
}
//addadvertisement
class addAdvertisementRequest {
  constructor(req) {
    this.AdvertisementRef = req.body.AdvertisementRef
      ? req.body.AdvertisementRef
      : null;
    this.BusinessName = req.body.BusinessName ? req.body.BusinessName : null;
    this.ContactPersonName = req.body.ContactPersonName
      ? req.body.ContactPersonName
      : null;
    this.Phone = req.body.Phone ? req.body.Phone : null;
    this.Pincode = req.body.Pincode ? req.body.Pincode : null;
    this.State = req.body.State ? req.body.State : null;
    this.City = req.body.City ? req.body.City : null;
    this.BusinessCategory = req.body.BusinessCategory
      ? req.body.BusinessCategory
      : null;
    this.AddDescription = req.body.AddDescription
      ? req.body.AddDescription
      : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    // this.VendorId = req.body.VendorId ? req.body.VendorId : null;
    this.Status = req.body.Status ? req.body.Status : null;
    // this.AdvertisementImage = req.body.AdvertisementImage
    //   ? req.body.AdvertisementImage
    //   : null;
  }
}

class addAdvertisementResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class fetchReviewRequest {
  constructor(req) {
    this.BusinessId = req.query.BusinessId ? req.query.BusinessId : null;
  }
}

class fetchReviewResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Add Review
class addReviewRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.Rating = req.body.Rating ? req.body.Rating : null;
    this.ReviewText = req.body.ReviewText ? req.body.ReviewText : null;
  }
}

class addReviewResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Add addSavedService
class addSavedServiceRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.IsActive = req.body.IsActive ? req.body.IsActive : null;
  }
}

class addSavedServiceResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
//Fetch savedservices
class fetchSavedServicesRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchSavedServicesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch catalogue
class fetchCatalogueRequest {
  constructor(req) {
    this.BusinessId = req.query.BusinessId ? req.query.BusinessId : null;
  }
}

class fetchCatalogueResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch VendorCategories
class fetchVendorCategoriesRequest {
  constructor(req) {
    this.SubCategoryId = req.query.SubCategoryId
      ? req.query.SubCategoryId
      : null;
  }
}

class fetchVendorCategoriesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch categories
class fetchCategoriesRequest {
  constructor(req) {
    this.VendorId = req.query.VendorId ? req.query.VendorId : null;
  }
}

class fetchCategoriesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
//Forgot Password
class forgotPasswordRequest {
  constructor(req) {
    this.Phone = req.body.Phone ? req.body.Phone : null;
    this.Email = req.body.Email ? req.body.Email : null;
    this.Password = req.body.Password ? req.body.Password : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
  }
}

class forgotPasswordResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch  sub  categories
class fetchSubCategoriesRequest {
  constructor(req) {
    this.CategoryId = req.query.CategoryId ? req.query.CategoryId : null;
    this.FetchAllSubCat = req.query.FetchAllSubCat
      ? req.query.FetchAllSubCat
      : null;
  }
}

class fetchSubCategoriesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Filters
class filterRequest {
  constructor(req) {
    this.City = req.query.City ? req.query.City : null;
    this.Rating = req.query.Rating ? req.query.Rating : null;
    this.UserId = req.query.UserId ? req.query.UserId : null;
    this.Trusted = req.query.Trusted ? req.query.Trusted : null;
    this.Certified = req.query.Certified ? req.query.Certified : null;
    this.Verified = req.query.Verified ? req.query.Verified : null;
    this.Popular = req.query.Popular ? req.query.Popular : null;
    this.RecentlyAdded = req.query.RecentlyAdded
      ? req.query.RecentlyAdded
      : null;
    this.Nearby = req.query.Nearby ? req.query.Nearby : null;
    this.Longitude = req.query.Longitude ? req.query.Longitude : null;
    this.Latitude = req.query.Latitude ? req.query.Latitude : null;
    this.ByRadius = req.query.ByRadius ? req.query.ByRadius : null;
    this.Radius = req.query.Radius ? req.query.Radius : null;
    this.SubCategoryId = req.query.SubCategoryId
      ? req.query.SubCategoryId
      : null;
  }
}

class filterResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// Recently Added 5
class recentlyAdded5Response {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class recentlyAddedAllResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Notification fetch
class fetchNotificationRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}
class fetchNotificationResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// delete notification
class deleteNotificationRequest {
  constructor(req) {
    this.NotificationRef = req.body.NotificationRef
      ? req.body.NotificationRef
      : null;
  }
}
class deleteNotificationResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// pushNotificationByUserRequest notification
class pushNotificationByUserRequest {
  constructor(req) {
    this.SubCategoryId = req.body.SubCategoryId ? req.body.SubCategoryId : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.Latitude = req.body.Latitude ? req.body.Latitude : null;
    this.Longitude = req.body.Longitude ? req.body.Longitude : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
  }
}
class pushNotificationByUserResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class registerTokenRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.DeviceToken = req.body.DeviceToken ? req.body.DeviceToken : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
    this.AppType = req.body.AppType ? req.body.AppType : null;
  }
}
class registerTokenResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
//Popular Services

class fetchPopularServicesRequest {
  constructor(req) {
    //  this.VendorId = req.query.VendorId ? req.query.VendorId : null;
  }
}

class fetchPopularServicesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Trending Services

class fetchTrendingServicesRequest {
  constructor(req) {
    //  this.VendorId = req.query.VendorId ? req.query.VendorId : null;
  }
}

class fetchTrendingServicesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Upadte Password
class updatePasswordRequest {
  constructor(req) {
    //this.UserRef = req.body.UserRef ? req.body.UserRef : null;
    this.OldPassword = req.body.OldPassword ? req.body.OldPassword : null;
    this.NewPassword = req.body.NewPassword ? req.body.NewPassword : null;
    this.ConfirmPassword = req.body.ConfirmPassword
      ? req.body.ConfirmPassword
      : null;
  }
}

class updatePasswordResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class checkIfRegisteredRequest {
  constructor(req) {
    this.Phone = req.body.Phone ? req.body.Phone : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
  }
}

class checkIfRegisteredResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestId = null);
  }
}

class addCareerPreferencesRequest {
  constructor(req) {
    this.Ref = req.body.Ref ? req.body.Ref : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
    this.Role = req.body.Role ? req.body.Role : null;
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
    this.Location = req.body.Location ? req.body.Location : null;
    this.HighestEducation = req.body.HighestEducation
      ? req.body.HighestEducation
      : null;
  }
}

class addCareerPreferencesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class addKeySkillsRequest {
  constructor(req) {
    this.CareerId = req.body.CareerId ? req.body.CareerId : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.KeySkills = req.body.KeySkills ? req.body.KeySkills : null;
  }
}

class addKeySkillsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
class addJobSeekerDetailsRequest {
  constructor(req) {
    this.CareerId = req.body.CareerId ? req.body.CareerId : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.Gender = req.body.Gender ? req.body.Gender : null;
    this.MaritalStatus = req.body.MaritalStatus ? req.body.MaritalStatus : null;
    this.DOB = req.body.DOB ? req.body.DOB : null;
    this.Age = req.body.Age ? req.body.Age : null;
    this.DifferentlyAbled = req.body.DifferentlyAbled
      ? req.body.DifferentlyAbled
      : null;
    this.State = req.body.State ? req.body.State : null;
    this.City = req.body.City ? req.body.City : null;
    // this.Languages = req.body.Languages ? req.body.Languages : null; 
    this.Phone = req.body.Phone ? req.body.Phone : null;
    this.Email = req.body.Email ? req.body.Email : null;
  }
}

class addJobSeekerDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
class fetchJobSeekerDetailsRequest {
  constructor(req) {
    this.JobSeekerId = req.query.JobSeekerId ? req.query.JobSeekerId : null;
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchJobSeekerDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class addUserResumeRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.ResumeRef = req.body.ResumeRef ? req.body.ResumeRef : null;
    this.Resume = req.body.Resume ? req.body.ResumeRef : null;
  }
}

class addUserResumeResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
class saveUnsaveJobsRequest {
  constructor(req) {
    // this.Ref = req.body.Ref ? req.body.Ref : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.JobId = req.body.JobId ? req.body.JobId : null;
    this.IsActive = req.body.IsActive ? req.body.IsActive : null;
  }
}

class saveUnsaveJobsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class fetchSavedJobsRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchSavedJobsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
class appliedJobsRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.JobId = req.body.JobId ? req.body.JobId : null;
    this.Applied = req.body.Applied ? req.body.Applied : null;
  }
}

class appliedJobsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class fetchAppliedJobsRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchAppliedJobsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class fetchEducationListResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
class fetchJobRolesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class fetchJobNotificationsRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
  }
}

class fetchJobNotificationsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class deleteJobNotificationsRequest {
  constructor(req) {
    this.DeleteAll = req.body.DeleteAll ? req.body.DeleteAll : null;
    this.NotificationRef = req.body.NotificationRef
      ? req.body.NotificationRef
      : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
  }
}

class deleteJobNotificationsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class recommendedListRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
    this.CategoryId = req.query.CategoryId ? req.query.CategoryId : null;
  }
}

class recommendedListResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        UserDetails: null,
        UserType: null,
      });
  }
}

//Register Token
module.exports.registerTokenRequest = registerTokenRequest;
module.exports.registerTokenResponse = registerTokenResponse;
//Notification
module.exports.fetchNotificationRequest = fetchNotificationRequest;
module.exports.fetchNotificationResponse = fetchNotificationResponse;

module.exports.deleteNotificationRequest = deleteNotificationRequest;
module.exports.deleteNotificationResponse = deleteNotificationResponse;

module.exports.pushNotificationByUserRequest = pushNotificationByUserRequest;
module.exports.pushNotificationByUserResponse = pushNotificationByUserResponse;

//Recently Added ALL
module.exports.recentlyAddedAllResponse = recentlyAddedAllResponse;
//Recently Added LIMIT 5
module.exports.recentlyAdded5Response = recentlyAdded5Response;
//Filter
module.exports.filterRequest = filterRequest;
module.exports.filterResponse = filterResponse;
//Login
module.exports.UserLoginRequest = userLoginRequest;
module.exports.UserLoginResponse = userLoginResponse;
//AddUser
module.exports.addUserRequest = addUserRequest;
module.exports.addUserResponse = addUserResponse;

//Fetch User Information
module.exports.fetchUserRequest = fetchUserRequest;
module.exports.fetchUserResponse = fetchUserResponse;
//Addadverisement
module.exports.addAdvertisementRequest = addAdvertisementRequest;
module.exports.addAdvertisementResponse = addAdvertisementResponse;
//Fetch Review Information
module.exports.fetchReviewRequest = fetchReviewRequest;
module.exports.fetchReviewResponse = fetchReviewResponse;
//Add review
module.exports.addReviewRequest = addReviewRequest;
module.exports.addReviewResponse = addReviewResponse;
//Add SavedService
module.exports.addSavedServiceRequest = addSavedServiceRequest;
module.exports.addSavedServiceResponse = addSavedServiceResponse;
//Fetch saved services
module.exports.fetchSavedServicesRequest = fetchSavedServicesRequest;
module.exports.fetchSavedServicesResponse = fetchSavedServicesResponse;
//Fetch Catalogue
module.exports.fetchCatalogueRequest = fetchCatalogueRequest;
module.exports.fetchCatalogueResponse = fetchCatalogueResponse;
//Fetch VendorCategories
module.exports.fetchVendorCategoriesRequest = fetchVendorCategoriesRequest;
module.exports.fetchVendorCategoriesResponse = fetchVendorCategoriesResponse;
//Fetch Categories
module.exports.fetchCategoriesRequest = fetchCategoriesRequest;
module.exports.fetchCategoriesResponse = fetchCategoriesResponse;
//Forgot Password
module.exports.forgotPasswordRequest = forgotPasswordRequest;
module.exports.forgotPasswordResponse = forgotPasswordResponse;
//Fetch Sub CAtegories
module.exports.fetchSubCategoriesRequest = fetchSubCategoriesRequest;
module.exports.fetchSubCategoriesResponse = fetchSubCategoriesResponse;
//user Logout
module.exports.userLogoutRequest = userLogoutRequest;
module.exports.userLogoutResponse = userLogoutResponse;
//popular services
module.exports.fetchPopularServicesRequest = fetchPopularServicesRequest;
module.exports.fetchPopularServicesResponse = fetchPopularServicesResponse;

//Trending services
module.exports.fetchTrendingServicesRequest = fetchTrendingServicesRequest;
module.exports.fetchTrendingServicesResponse = fetchTrendingServicesResponse;

//update password
module.exports.updatePasswordRequest = updatePasswordRequest;
module.exports.updatePasswordResponse = updatePasswordResponse;

module.exports.CheckIfRegisterdRequest = checkIfRegisteredRequest;
module.exports.CheckIfRegisterdResponse = checkIfRegisteredResponse;

module.exports.addCareerPreferencesRequest = addCareerPreferencesRequest;
module.exports.addCareerPreferencesResponse = addCareerPreferencesResponse;

module.exports.addKeySkillsRequest = addKeySkillsRequest;
module.exports.addKeySkillsResponse = addKeySkillsResponse;

module.exports.addJobSeekerDetailsRequest = addJobSeekerDetailsRequest;
module.exports.addJobSeekerDetailsResponse = addJobSeekerDetailsResponse;

module.exports.fetchJobSeekerDetailsRequest = fetchJobSeekerDetailsRequest;
module.exports.fetchJobSeekerDetailsResponse = fetchJobSeekerDetailsResponse;

module.exports.addUserResumeRequest = addUserResumeRequest;
module.exports.addUserResumeResponse = addUserResumeResponse;

module.exports.saveUnsaveJobsRequest = saveUnsaveJobsRequest;
module.exports.saveUnsaveJobsResponse = saveUnsaveJobsResponse;

module.exports.fetchSavedJobsRequest = fetchSavedJobsRequest;
module.exports.fetchSavedJobsResponse = fetchSavedJobsResponse;

module.exports.appliedJobsRequest = appliedJobsRequest;
module.exports.appliedJobsResponse = appliedJobsResponse;

module.exports.fetchAppliedJobsRequest = fetchAppliedJobsRequest;
module.exports.fetchAppliedJobsResponse = fetchAppliedJobsResponse;

module.exports.fetchEducationListResponse = fetchEducationListResponse;

module.exports.fetchJobRolesResponse = fetchJobRolesResponse;

module.exports.fetchJobNotificationsRequest = fetchJobNotificationsRequest;
module.exports.fetchJobNotificationsResponse = fetchJobNotificationsResponse;

//delete job notifications posted by vendor
module.exports.deleteJobNotificationsRequest = deleteJobNotificationsRequest;
module.exports.deleteJobNotificationsResponse = deleteJobNotificationsResponse;

module.exports.recommendedListRequest = recommendedListRequest;
module.exports.recommendedListResponse = recommendedListResponse;
