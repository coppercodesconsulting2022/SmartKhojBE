const express = require("express");

const router = express.Router();

const paymentServices = require("../services/payments");
// const payment = require("../payments/paymentController");

// router.post("/createpayment", paymentServices.createPayment);
// router.post("/paymentsuccess", paymentServices.paymentSuccess);
// router.post("/createcustomer", paymentServices.createCustomer);
// router.post("/savesubscription", paymentServices.createSubscription);
// router.post(
//   "/paymentverification",
//   paymentServices.subscriptionPaymentVerfication
// );

router.post("/createpaymentintent", paymentServices.CreatePaymentIntent);
router.post("/addwalletamount", paymentServices.AddWalletAmount);
router.get("/paymentdetails", paymentServices.getPaymentDetails);

module.exports = router;
