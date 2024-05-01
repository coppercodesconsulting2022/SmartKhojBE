const razorpay = require("../common/paymentConfig");

const createSubscription = async (PlanId, customerId) => {
  const startDate = new Date().toISOString();

  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);
  const endDateTimestamp = endDate.toISOString();

  const params = {
    plan_id: PlanId,
    customer_id: customerId,
    // start_at: 1577385995,
    // end_at: 1603737004,
    total_count: 1,
    quantity: 1,
    customer_notify: 1,
  };
  const response = razorpay.subscriptions.create(params);

  if (response) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(Error);
  }
};

const subscriptionDetails = async (subscriptionId) => {
  const response = razorpay.subscriptions.fetch(subscriptionId);

  if (response) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(Error);
  }
};

module.exports = { createSubscription, subscriptionDetails };
