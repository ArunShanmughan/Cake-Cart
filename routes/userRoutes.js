const express = require("express");
const router = express.Router();
const {
  getlandingpage,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getCategory,
  getCart,
  getCheckout,
} = require("../controllers/usercontroller");

router.get("/", getlandingpage);
router.get("/views/users/login", getLogin);
router.post("/views/users/login", postLogin)
router.get("/views/users/signup", getSignup);
router.post("/views/users/signup", postSignup);
router.get("/views/users/category", getCategory);
router.get("/views/users/cart", getCart);
router.get("/views/users/checkout", getCheckout);



module.exports = router