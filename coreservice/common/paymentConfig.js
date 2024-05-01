const Razorpay = require("razorpay");
const RazorPayConfig = require("./settings").RazorPayConfig;

const razorpay = new Razorpay({
  key_id: RazorPayConfig.key_id,
  key_secret: RazorPayConfig.key_secret,
});

module.exports = razorpay;
