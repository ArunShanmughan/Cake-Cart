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
  getCart,
  getCheckout,
  getLogout,
  getProducts,
  getSingleProduct,
  getSearchProduct,
} = require("../controllers/usercontroller");

router.get("/", getlandingpage);
router.get("/views/users/login", getLogin);
router.post("/views/users/login", postLogin);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/views/users/otp", getOtp);
router.post("/views/users/otp",postOtp);
router.get("/resendOTP",getOtp);
router.get("/views/users/cart", getCart);
router.get("/views/users/checkout", getCheckout);
router.get("/views/users/logout",getLogout);
router.get("/products",getProducts);
router.get("/singleProduct",getSingleProduct);
router.post("/searchProducts",getSearchProduct)



module.exports = router