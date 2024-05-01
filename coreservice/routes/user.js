const express = require("express");

const router = express.Router();

const userAPI = require("../services/user");
const vendorAPI = require("../services/vendor");

//post request
router.post("/login", userAPI.userLogin);
router.post("/logout", userAPI.userLogout);
router.post("/adduser", userAPI.addUser); // token acces 0
router.post("/edituser", userAPI.addUser);
router.post("/postaddvertisement", userAPI.addAdvertisement);
router.post("/addreview", userAPI.addReview);
router.post("/addsavedservice", userAPI.addSavedService);
router.post("/forgotpassword", userAPI.forgotPassword);
router.post("/registertoken", userAPI.registerToken);
router.post("/addnotificationbyuser", userAPI.pushNotificationByUser);
router.post("/updatepassword", userAPI.updatePassword);
router.post("/checkifregistered", userAPI.checkIfRegistered);
router.post("/addcareerprefrences", userAPI.addCareerPreferences);
router.post("/addkeyskills", userAPI.addKeySkills);
router.post("/addjobseekerdetails", userAPI.addJobSeekerDetails);
router.post("/adduserresume", userAPI.addUserResume);
router.post("/saveunsavejobs", userAPI.saveUnsaveJobs);
router.post("/applyjobs", userAPI.appliedJobs);
router.post("/deletejobnotifications", userAPI.deleteJobNotifications);

// get requests
router.get("/filter", userAPI.filter);
router.get("/fetchnotification", userAPI.fetchNotification);
router.get("/fetchuser", userAPI.fetchUser);
router.get("/fetchreview", userAPI.fetchReviews);
router.get("/fetchsavedservices", userAPI.fetchSavedServices);
router.get("/fetchcatalogue", userAPI.fetchCatalogue);
router.get("/vendorcategories", userAPI.fetchVendorCategories);
router.get("/fetchcategories", userAPI.fetchCategories);
router.get("/fetchsubcategories", userAPI.fetchSubCategories);
router.get("/recentlyadded5", userAPI.recentlyAddedLimit);
router.get("/recentlyadded", userAPI.recentlyAddedAll);
router.get("/fetchpopularservices", userAPI.fetchPopularServices);
router.get("/fetchtrendingservices", userAPI.fetchTrendingServices);
router.delete("/deletenotification", userAPI.deleteNotification);
router.get("/fetchjobseekerdetails", userAPI.fetchJobSeekerDetails);
router.get("/fetchsavedjobs", userAPI.fetchSavedJobs);
router.get("/fetchappliedjobs", userAPI.fetchAppliedJobs);
router.get("/fetchqualifications", userAPI.fetchEducationList);
router.get("/fetchjobcategories", userAPI.fetchJobRoles);
router.get("/fetchjobnotifications", userAPI.fetchJobNotifications);
router.get("/recommendedlist", userAPI.recommendedList);

router.post("/vendormessagestatus", vendorAPI.updateUserVendorMessageStatus);

module.exports = router;
