const express = require("express");
const router = express.Router();
const {
  getlandingpage,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getOtp,
  postOtp,
  getLogout,
  getMyAccount,
  getOrderHistory,
  getMyAddress,
  getAddAddress,
  postAddAddress,
  getEditAddress,
  postEditAddress,
  getDeleteAddress,
  getChangePassword,
  postChangePassword,
  getAddToCart,
  getCart,
} = require("../controllers/usercontroller");

const {
  getProducts,
  getSingleProduct,
  getSearchProduct,
  getSortData,
} = require("../controllers/userProductController");

router.get("/", getlandingpage);
router.get("/views/users/login", getLogin);
router.post("/views/users/login", postLogin);
router.get("/signup", getSignup);
router.post("/views/users/signup", postSignup);
router.get("/views/users/otp", getOtp);
router.post("/views/users/otp", postOtp);
router.get("/resendOTP", getOtp);
router.get("/views/users/logout", getLogout);
router.get("/myAccount", getMyAccount);
router.get("/orderHistory", getOrderHistory);
router.get("/myAddress", getMyAddress);
router.get("/addAddress", getAddAddress);
router.post("/addAddress", postAddAddress);
router.get("/editAddress", getEditAddress);
router.post("/editAddress", postEditAddress);
router.get("/deleteAddress", getDeleteAddress);
router.get("/changePassword", getChangePassword);
router.post("/changePassword",postChangePassword);
router.post("/addToCart/:id",getAddToCart);
router.get("/cart",getCart);

//user side product Controllers
router.get("/products", getProducts);
router.get("/singleProduct", getSingleProduct);
router.post("/searchProducts", getSearchProduct);
router.get("/products/sort/sortValue", getSortData);

module.exports = router;
