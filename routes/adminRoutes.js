const express = require("express");
const admRouter = express.Router();
const upload = require("../services/multer.js");

const {
  getAdmin,
  postAdmin,
  getAdminDash,
  getUserManagment,
  userBlock,
  userUnBlock,
  admLogout,
} = require("../controllers/admincontroller");

const {
  getCategoryManagment,
  categoryList,
  categoryUnList,
  getAddCategory,
  postEditCategory,
} = require("../controllers/categorycontroller.js");

const {
  getProductManagment,
  productBlock,
  productUnBlock,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
} = require("../controllers/productcontroller.js");

const {
  getOrderManagment,
  getChangeOrderStatus,
}= require("../controllers/orderController.js")

//admin Routers
admRouter.get("/admin", getAdmin);
admRouter.post("/adminlog", postAdmin);
admRouter.get("/admindash", getAdminDash);
admRouter.get("/usersmanagment", getUserManagment);
admRouter.get("/userBlock", userBlock);
admRouter.get("/userUnBlock", userUnBlock);
admRouter.get("/admLogOut",admLogout)

//Category Routers
admRouter.get("/categoryManagment", getCategoryManagment);
admRouter.get("/categoryunlist", categoryList);
admRouter.get("/categorylist", categoryUnList);
admRouter.post("/addCategory", getAddCategory);
admRouter.post("/editCategory", postEditCategory);

//Product Routers
admRouter.get("/productManagment", getProductManagment);
admRouter.get("/productBlock", productBlock);
admRouter.get("/productUnBlock", productUnBlock);
admRouter.get("/addProduct", getAddProduct);
admRouter.post("/addProducts", upload.any(), postAddProduct);
admRouter.get("/editProduct", getEditProduct);
admRouter.post("/editProducts/:id", upload.any(), postEditProduct);

//Order Managment Routers
admRouter.get("/ordermanagment",getOrderManagment);
admRouter.get("/orderStatusChange/:ordId",getChangeOrderStatus)

module.exports = admRouter;
