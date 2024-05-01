class jobSeekerPayemnts {
  constructor(req) {
    this.JobSeekerId = req.body.JobSeekerId ? req.body.JobSeekerId : null;
    this.Amount = req.body.Amount ? req.body.Amount : null;
  }
}
class customerRequest {
  constructor(req) {
    this.Name = req.body.Name ? req.body.Name : null;
    this.Contact = req.body.Contact ? req.body.Contact : null;
    this.Email = req.body.Email ? req.body.Email : null;
    // this.GSTIn = req.body.GSTIn ? req.body.GSTIn : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : null;
  }
}
class createSubscriptionRequest {
  constructor(req) {
    this.PlanId = req.body.PlanId ? req.body.PlanId : null;
    this.CustomerId = req.body.CustomerId ? req.body.CustomerId : null;
  }
}

class paymentSuccessRequest {
  constructor(req) {
    this.SubscriptionId = req.body.SubscriptionId
      ? req.body.SubscriptionId
      : null;
    this.RazorpayPaymentId = req.body.RazorpayPaymentId
      ? req.body.RazorpayPaymentId
      : null;
    this.RazorpaySignature = req.body.RazorpaySignature
      ? req.body.RazorpaySignature
      : null;
    this.VendorId = req.body.VendorId ? req.body.VendorId : 0;
    this.BusinessId = req.body.BusinessId ? req.body.BusinessId : 0;
    this.PackageId = req.body.PackageId ? req.body.PackageId : null;
  }
}

class createPaymentIntentRequest {
  constructor(req) {
    this.amount = req.body.amount ? req.body.amount : null;
    this.name = req.body.name ? req.body.name : null;
    this.email = req.body.email ? req.body.email : null;
    this.phone = req.body.phone ? req.body.phone : null;
    this.address = req.body.address ? req.body.address : null;
    this.city = req.body.city ? req.body.city : null;
    this.pincode = req.body.pincode ? req.body.pincode : null;
  }
}
class createPaymentIntentResponse {
  constructor() {
    (this.Error = null),
      (this.Details = { ClientSecret: null }),
      (this.RequestID = null);
  }
}

class addWalletAmountRequest {
  constructor(req) {
    this.paymentType = req.body.paymentType ? req.body.paymentType : null; //1 : vendorPayment , 2: jobSeekerPayment
    this.vendorId = req.body.vendorId ? req.body.vendorId : null;
    this.businessId = req.body.businessId ? req.body.businessId : null;
    this.packageId = req.body.packageId ? req.body.packageId : null;
    this.jobSeekerId = req.body.jobSeekerId ? req.body.jobSeekerId : null;
    this.amount = req.body.amount ? req.body.amount : null;
    this.paymentId = req.body.paymentId ? req.body.paymentId : null;
    this.paymentStatus = req.body.paymentStatus ? req.body.paymentStatus : null;
  }
}
class addWalletAmountResponse {
  constructor() {
    (this.Error = null), (this.Details = null), (this.RequestID = null);
  }
}

class getPaymentDetailsRequest {
  constructor(req) {
    this.paymentType = req.query.paymentType ? req.query.paymentType : 0; //1 : vendorPayment , 2: jobSeekerPayment
    this.vendorId = req.query.vendorId ? req.query.vendorId : 0;
    this.jobSeekerId = req.query.jobSeekerId ? req.query.jobSeekerId : 0;
  }
}
class getPaymentDetailsResponse {
  constructor() {
    (this.Error = null), (this.PaymentDetails = null), (this.RequestID = null);
  }
}

module.exports.customerRequest = jobSeekerPayemnts;
module.exports.customerRequest = customerRequest;
module.exports.createSubscriptionRequest = createSubscriptionRequest;
module.exports.paymentSuccessRequest = paymentSuccessRequest;
module.exports.createPaymentIntentRequest = createPaymentIntentRequest;
module.exports.createPaymentIntentResponse = createPaymentIntentResponse;
module.exports.addWalletAmountRequest = addWalletAmountRequest;
module.exports.addWalletAmountResponse = addWalletAmountResponse;
module.exports.getPaymentDetailsRequest = getPaymentDetailsRequest;
module.exports.getPaymentDetailsResponse = getPaymentDetailsResponse;
