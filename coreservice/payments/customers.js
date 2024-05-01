const razorpay = require("../common/paymentConfig");

const createCustomer = async ({ Name, Contact, Email, GSTIn }) => {
  try {
    const options = {
      name: Name,
      contact: Contact,
      email: Email,
      fail_existing: 0,
      gstin: GSTIn,
    };

    const customer = razorpay.customers.create(options);

    return customer;
  } catch (err) {
    return err;
  }
};

module.exports = { createCustomer };
