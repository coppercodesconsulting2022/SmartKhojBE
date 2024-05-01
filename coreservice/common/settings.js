module.exports.Settings = {
  APP_KEY: null,
  APP_SECRET: null,
};

module.exports.FileConfiguration = {
  FileSize: process.env.FileSize,
  RFQLocalStorage: process.env.RFQLocalStorage,
  QuotationLocalStorage: process.env.QuotationLocalStorage,
  RemoteStorage: process.env.RemoteStorage,
  QuoatationRemoteStorage: process.env.QuoatationRemoteStorage,
  RFQFileUrl: process.env.RFQFileUrl,
  FileUrl: process.env.FileUrl,
  QuotationFileUrl: process.env.QuotationFileUrl,
  ImagesStorage: process.env.ImagesStorage,
  secure: false,
};

module.exports.RazorPayConfig = {
  key_id: "rzp_test_RmdPYtidKZwU0Y",
  key_secret: "vBtlO6AyRcyFnZXbP35SZXGU",
};
