const express = require("express");

const router = express.Router();

const adminAPI = require("../services/admin");

//post requests
router.post("/addcategories", adminAPI.addCategories);
router.post("/addsubcategories", adminAPI.addSubCategories);
router.post("/addpopularservices", adminAPI.addPopularServices);
router.post("/addtrendingservices", adminAPI.addTrendingServices);
router.post("/blockunblockaccount", adminAPI.blockUnblockAccount);
router.post("/deletereview", adminAPI.deleteReview);
router.post("/approverejectvendors", adminAPI.approveRejectVendors);
router.post("/paymentapproval", adminAPI.paymentApproval);
router.post("/addmaster", adminAPI.addMaster);
router.post("/deleteadvertisement", adminAPI.deletedAvertisement);
router.post("/deletetrendingservices", adminAPI.deleteTrendingServices);
router.post("/deletepopularservices", adminAPI.deletePopularServices);
router.post("/deletecategories", adminAPI.deleteCategory);
router.post("/addadminadvertisement", adminAPI.addAdminAdvertisement);
router.post("/approvalofbusiness", adminAPI.approvalOfBusiness);
router.post("/initiateadminchat", adminAPI.adminChatInitiation);
router.post("/verify", adminAPI.verify);

//get requests
router.get("/fetchapprovedrejectvendors", adminAPI.fetchapproveRejectVendors);
router.get("/fetchpaymentdetails", adminAPI.fetchPaymentDetails);
router.get("/revenuegenerated", adminAPI.fetchRevenueGenerated);
router.get("/fetchdata", adminAPI.fetchData);
router.get("/fetchmasterdetails", adminAPI.fetchMasterDetails);
router.get("/fetchAdvertisements", adminAPI.fetchAdvertisements);
router.get("/adminchats", adminAPI.fetchaAdminChat);
router.get("/adspaces", adminAPI.fetchAdSpaces);

//delete requests
router.delete("/djobseeker", adminAPI.deleteJobSeeker);

//patch requests
router.patch("/blockjobseeker", adminAPI.blockJobSeeker);

module.exports = router;
