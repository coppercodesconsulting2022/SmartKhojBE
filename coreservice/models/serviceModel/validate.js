const momentTimezone = require("moment-timezone");

class errorModel {
  constructor(errorMessage, errorCode) {
    this.ErrorCode = errorCode;
    this.ErrorMessage = errorMessage;
  }
}

class validateRequest {
  constructor(req) {
    (this.apiUri = req.path),
      (this.authToken = req.headers.authtoken),
      (this.authorization = req.headers.authorization),
      (this.appVersion = req.headers.appversion);
  }
}

class validateResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}

module.exports.ErrorModel = errorModel;
module.exports.ValidateRequest = validateRequest;
module.exports.ValidateResponse = validateResponse;
