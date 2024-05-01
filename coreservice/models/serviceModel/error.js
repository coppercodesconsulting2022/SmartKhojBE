class errorModel {
	constructor(errorMessage, errorCode) {
		this.ErrorCode = errorCode;
		this.ErrorMessage = errorMessage;
	}
}

module.exports.ErrorModel = errorModel;
