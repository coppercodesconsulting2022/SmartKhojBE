const razorpay = require("../common/paymentConfig");

const createOrder = async (amount) => {
  try {
    const options = {
      amount: amount, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Math.random()}`,
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    return error;
  }
};

module.exports = createOrder;
