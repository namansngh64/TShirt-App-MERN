const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  processRazorPayment,
  successPayment
} = require("../controllers/razorpayment");

router.param("userId", getUserById);

// router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);
router.post(
  "/payment/razorpay/:userId",
  isSignedIn,
  isAuthenticated,
  processRazorPayment
);
router.post(
  "/payment/razorpay/success/:userId",
  isSignedIn,
  isAuthenticated,
  successPayment
);

module.exports = router;
