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
  getMyAccount,
  getOrderHistory,
  getMyAddress,
  getAddAddress,
  postAddAddress,
} = require("../controllers/usercontroller");

const {
  getProducts,
  getSingleProduct,
  getSearchProduct,
  getSortData,
}=require("../controllers/userProductController");

router.get("/", getlandingpage);
router.get("/views/users/login", getLogin);
router.post("/views/users/login", postLogin);
router.get("/signup", getSignup);
router.post("/views/users/signup", postSignup);
router.get("/views/users/otp", getOtp);
router.post("/views/users/otp",postOtp);
router.get("/resendOTP",getOtp);
router.get("/views/users/cart", getCart);
router.get("/views/users/checkout", getCheckout);
router.get("/views/users/logout",getLogout);
router.get("/myAccount",getMyAccount);
router.get("/orderHistory",getOrderHistory);
router.get("/myAddress",getMyAddress);
router.get("/addAddress",getAddAddress);
router.post("/addAddress",postAddAddress);

//user side product Controllers
router.get("/products",getProducts);
router.get("/singleProduct",getSingleProduct);
router.post("/searchProducts",getSearchProduct);
router.get("/products/sort/sortValue",getSortData);



module.exports = router