const express = require("express");

const router = express.Router();

const vendorAPI = require("../services/vendor");

//post requests
router.post("/addvendor", vendorAPI.addVendor);
router.post("/editvendor", vendorAPI.addVendor);
router.post("/addreviewreply", vendorAPI.addReviewReply);
router.post("/addleads", vendorAPI.addLeads);
router.post("/updatepackage", vendorAPI.packageUpdation);
router.post("/addcatalogue", vendorAPI.addCatalogue);
router.post("/addbusinessdetails", vendorAPI.addBusinessDetails);
router.post("/addnotificationbyvendor", vendorAPI.pushNotificationByVendor);
router.post(
  "/addbusinessverificationimage",
  vendorAPI.addBusinessVerificationImage
);
router.post("/subscribe", vendorAPI.subscribePackage);
router.post("/chatinitiated", vendorAPI.chatInitiated);
router.post("/savebusinesslink", vendorAPI.businessLink);
router.post("/addcompanydetails", vendorAPI.addCompanyDetails);
router.post("/addjobdetails", vendorAPI.addJobDetails);
router.post("/addjobsummary", vendorAPI.addJobSummary);
router.post("/deletejobs", vendorAPI.deleteJobs);
router.post("/jobnotifications", vendorAPI.jobNotifications);

//get requests
router.get("/fetchnotification", vendorAPI.fetchNotification);
router.get("/showbalanceads", vendorAPI.showBalanceAds);
router.get("/fetchvendor", vendorAPI.fetchVendor);
router.get("/fetchleads", vendorAPI.fetchLeads);
router.get("/displaypackagedetails", vendorAPI.showpackageDetails);
router.get("/getvendorsradius", vendorAPI.getVendorsRadius);
router.get("/fetchbusinessdetails", vendorAPI.fetchBusinessDetails);
router.get(
  "/fetchbusinessdetailswrtvendor",
  vendorAPI.fetchBusinessDetailsWrtVendor
);
router.get("/fetchchatinitiated", vendorAPI.fetchchatInitiated);
router.get("/fetchjobs", vendorAPI.fetchJobs);

router.post("/usermessagestatus", vendorAPI.updateUserVendorMessageStatus);

router.delete("/deleteuser", vendorAPI.deleteUser);

module.exports = router;
