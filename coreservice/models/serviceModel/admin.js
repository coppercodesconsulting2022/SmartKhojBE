class addCategoriesRequest {
  constructor(req) {
    this.CategoryRef = req.body.CategoryRef ? req.body.CategoryRef : null;
    this.Name = req.body.Name ? req.body.Name : null;
    this.CategoriesIcon = req.body.CategoriesIcon
      ? req.body.CategoriesIcon
      : null;
    //this.Status = req.body.Status ? req.body.Status : null;
  }
}

class addCategoriesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class addSubCategoriesRequest {
  constructor(req) {
    this.SubCategoryRef = req.body.SubCategoryRef
      ? req.body.SubCategoryRef
      : null;
    this.CategoryRef = req.body.CategoryRef ? req.body.CategoryRef : null;
    this.Name = req.body.Name ? req.body.Name : null;
    // this.Status = req.body.Status ? req.body.Status : null;
  }
}

class addSubCategoriesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//add popular services
class addPopularServicesRequest {
  constructor(req) {
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
    this.Image = req.body.Image ? req.body.Image : null;
  }
}

class addPopularServicesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//add Trending Services
class addTrendingServicesRequest {
  constructor(req) {
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
    this.Image = req.body.Image ? req.body.Image : null;
  }
}

class addTrendingServicesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//block unblock  account
class blockUnblockAccountRequest {
  constructor(req) {
    this.UserRef = req.body.UserRef ? req.body.UserRef : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
    this.Status = req.body.Status ? req.body.Status : null;
  }
}

class blockUnblockAccountResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//delete Review
class deleteReviewRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
  }
}

class deleteReviewResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Approve Reject Vendors
class approveRejectVendorsRequest {
  constructor(req) {
    this.VendorRef = req.body.VendorRef ? req.body.VendorRef : null;
    this.Status = req.body.Status ? req.body.Status : null;
  }
}

class approveRejectVendorsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

// fetch Approved Reject Vendors
class fetchApprovedRejectVendorsRequest {
  constructor(req) {
    this.Status = req.query.Status ? req.query.Status : null;
  }
}

class fetchApprovedRejectVendorsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
//Payment Approval Request
class paymentApprovalRequest {
  constructor(req) {
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
    this.IsApproved = req.body.IsApproved ? req.body.IsApproved : null;
  }
}
//Payment Approval Request
class paymentApprovalResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//FETCH PAYMENT DETAILS
class fetchPaymentDetailsRequest {
  constructor(req) {
    this.UserId = req.query.UserId ? req.query.UserId : null;
    this.UserType = req.query.UserType ? req.query.UserType : null;
  }
}
//fetch payment details
class fetchPaymentDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Add master

class addMasterRequest {
  constructor(req) {
    this.MasterRef = req.body.MasterRef ? req.body.MasterRef : null;
    this.Firstname = req.body.Firstname ? req.body.Firstname : null;
    this.Lastname = req.body.Lastname ? req.body.Lastname : null;
    this.Username = req.body.Username ? req.body.Username : null;
    this.Email = req.body.Email ? req.body.Email : null;
    this.Phone = req.body.Phone ? req.body.Phone : null;
    this.Passsword = req.body.Passsword ? req.body.Passsword : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
  }
}

class addMasterResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
//Fetch Revenue Generated Request

class fetchRevenueGeneratedRequest {
  constructor(req) {
    this.SalesId = req.query.SalesId ? req.query.SalesId : null;
  }
}
//Fetch Revenue Generated Response
class fetchRevenueGeneratedResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
//DELETE ADVERTISEMENT
class deletedAvertisementRequest {
  constructor(req) {
    this.AdvertisementRef = req.body.AdvertisementRef
      ? req.body.AdvertisementRef
      : null;
  }
}
//delete Advertisement Response
class deletedAvertisementResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch data Request

class fetchDataRequest {
  constructor(req) {
    //this.SalesId = req.query.SalesId ? req.query.SalesId : null;
  }
}
//Fetch Data Response
class fetchDataResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch Master Details Request

class fetchMasterDetailsRequest {
  constructor(req) {
    this.UserType = req.query.UserType ? req.query.UserType : null;
  }
}
//Fetch Master Details  Response
class fetchMasterDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}
//DELETE TRENDING SERVICES
class deletedTrendingServicesRequest {
  constructor(req) {
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
  }
}
//delete trending Response
class deletedTrendingServicesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//DELETE CATEGORY REQUEST
class deletedCategoryRequest {
  constructor(req) {
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
    this.SubCategoryId = req.body.SubCategoryId ? req.body.SubCategoryId : null;
  }
}
//delete category Response
class deletedCategoryResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//Fetch Advertisement Details Request

class fetchAdvertisementDetailsRequest {
  constructor(req) {
    this.Status = req.query.Status ? req.query.Status : null;
    this.AppType = req.query.AppType ? req.query.AppType : null;
  }
}
//Fetch advertisement  Details  Response
class fetchAdvertisementDetailsResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//add admin advertisemet Request

class addAdminAdvertisementRequest {
  constructor(req) {
    this.AdvertisementtId = req.body.AdvertisementtId
      ? req.body.AdvertisementtId
      : null;
    this.Image = req.body.Image ? req.body.Image : null;
    this.Status = req.body.Status ? req.body.Status : null;
    this.AppType = req.body.AppType ? req.body.AppType : null;
    this.AdLink = req.body.AdLink ? req.body.AdLink : null;
    this.AdSpaceId = req.body.AdSpaceId ? req.body.AdSpaceId : null;
    this.ImageOperation = req.body.ImageOperation
      ? req.body.ImageOperation
      : null;
  }
}
//add admin advertisemet  Response
class addAdminAdvertisementResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//aapproval of business request
class approvalOfBusinessRequest {
  constructor(req) {
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
  }
}
//approval of business Response
class approvalOfBusinessResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//DELETE POPULAR SERVICES
class deletedPopularServicesRequest {
  constructor(req) {
    this.CategoryId = req.body.CategoryId ? req.body.CategoryId : null;
  }
}
//delete popular Response
class deletedPopularServicesResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

//DELETE JOB SEEKER
class deletedJobSeekerRequest {
  constructor(req) {
    this.JobSeekerId = req.body.JobSeekerId ? req.body.JobSeekerId : null;
    this.CareerId = req.body.CareerId ? req.body.CareerId : null;
    this.ResumeId = req.body.ResumeId ? req.body.ResumeId : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
  }
}

class deletedJobSeekerResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

class blockJobSeekerRequest {
  constructor(req) {
    this.JobSeekerId = req.body.JobSeekerId ? req.body.JobSeekerId : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.Block = req.body.Block ? req.body.Block : null;
  }
}

class blockJobSeekerResponse {
  constructor() {
    (this.Error = null), (this.RequestId = null), (this.Details = null);
  }
}

class adminChatInitiationRequest {
  constructor(req) {
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.UserType = req.body.UserType ? req.body.UserType : null;
  }
}

class adminChatInitiationResponse {
  constructor() {
    (this.Error = null), (this.RequestId = null), (this.Details = null);
  }
}
class verifyRequest {
  constructor(req) {
    this.JobSeekerId = req.body.JobSeekerId ? req.body.JobSeekerId : null;
    this.UserId = req.body.UserId ? req.body.UserId : null;
    this.CareerId = req.body.CareerId ? req.body.CareerId : null;
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
  }
}

class verifyResponse {
  constructor() {
    (this.Error = null), (this.RequestId = null), (this.Details = null);
  }
}
class fetchAdminChatResponse {
  constructor() {
    (this.Error = null), (this.RequestId = null), (this.Details = null);
  }
}
class fetchAdSpacesResponse {
  constructor() {
    (this.Error = null), (this.RequestId = null), (this.Details = null);
  }
}

//add categories
module.exports.addCategoriesRequest = addCategoriesRequest;
module.exports.addCategoriesResponse = addCategoriesResponse;

//add  Sub categories
module.exports.addSubCategoriesRequest = addSubCategoriesRequest;
module.exports.addSubCategoriesResponse = addSubCategoriesResponse;

//add  Popular service
module.exports.addPopularServicesRequest = addPopularServicesRequest;
module.exports.addPopularServicesResponse = addPopularServicesResponse;

//add  Trending services
module.exports.addTrendingServicesRequest = addTrendingServicesRequest;
module.exports.addTrendingServicesResponse = addTrendingServicesResponse;

//block unblock account
module.exports.blockUnblockAccountRequest = blockUnblockAccountRequest;
module.exports.blockUnblockAccountResponse = blockUnblockAccountResponse;

//delete Review
module.exports.deleteReviewRequest = deleteReviewRequest;
module.exports.deleteReviewResponse = deleteReviewResponse;

//approve reject vendors
module.exports.approveRejectVendorsRequest = approveRejectVendorsRequest;
module.exports.approveRejectVendorsResponse = approveRejectVendorsResponse;

//Fetch approved reject vendors
module.exports.fetchApprovedRejectVendorsRequest =
  fetchApprovedRejectVendorsRequest;
module.exports.fetchApprovedRejectVendorsResponse =
  fetchApprovedRejectVendorsResponse;

//payment approval
module.exports.paymentApprovalRequest = paymentApprovalRequest;
module.exports.paymentApprovalResponse = paymentApprovalResponse;

//fetch payment details
module.exports.fetchPaymentDetailsRequest = fetchPaymentDetailsRequest;
module.exports.fetchPaymentDetailsResponse = fetchPaymentDetailsResponse;

//add Master
module.exports.addMasterRequest = addMasterRequest;
module.exports.addMasterResponse = addMasterResponse;

//Fetch Revenue Generted
module.exports.fetchRevenueGeneratedRequest = fetchRevenueGeneratedRequest;
module.exports.fetchRevenueGeneratedResponse = fetchRevenueGeneratedResponse;

//delete Advertisement
module.exports.deletedAvertisementRequest = deletedAvertisementRequest;
module.exports.deletedAvertisementResponse = deletedAvertisementResponse;

//Fetch Data
module.exports.fetchDataRequest = fetchDataRequest;
module.exports.fetchDataResponse = fetchDataResponse;

//Fetch Master details
module.exports.fetchMasterDetailsRequest = fetchMasterDetailsRequest;
module.exports.fetchMasterDetailsResponse = fetchMasterDetailsResponse;

//delete trending services details
module.exports.deletedTrendingServicesRequest = deletedTrendingServicesRequest;
module.exports.deletedTrendingServicesResponse =
  deletedTrendingServicesResponse;

//delete category request
module.exports.deletedCategoryRequest = deletedCategoryRequest;
module.exports.deletedCategoryResponse = deletedCategoryResponse;

//Fetch Advertisement Request
module.exports.fetchAdvertisementDetailsRequest =
  fetchAdvertisementDetailsRequest;
module.exports.fetchAdvertisementDetailsResponse =
  fetchAdvertisementDetailsResponse;

//add admin advertisement
module.exports.addAdminAdvertisementRequest = addAdminAdvertisementRequest;
module.exports.addAdminAdvertisementResponse = addAdminAdvertisementResponse;

//approval of business
module.exports.approvalOfBusinessRequest = approvalOfBusinessRequest;
module.exports.approvalOfBusinessResponse = approvalOfBusinessResponse;

//delete popular services
module.exports.deletedPopularServicesRequest = deletedPopularServicesRequest;
module.exports.deletedPopularServicesResponse = deletedPopularServicesResponse;

//delete job seeker
module.exports.deletedJobSeekerRequest = deletedJobSeekerRequest;
module.exports.deletedJobSeekerResponse = deletedJobSeekerResponse;

//block job seeker
module.exports.blockJobSeekerRequest = blockJobSeekerRequest;
module.exports.blockJobSeekerResponse = blockJobSeekerResponse;

//admin chat initiation
module.exports.adminChatInitiationRequest = adminChatInitiationRequest;
module.exports.adminChatInitiationResponse = adminChatInitiationResponse;

module.exports.fetchAdminChatResponse = fetchAdminChatResponse;
module.exports.fetchAdSpacesResponse = fetchAdSpacesResponse;

module.exports.verifyRequest = verifyRequest;
module.exports.verifyResponse = verifyResponse;
