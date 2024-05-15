const express = require("express");
const admRouter = express.Router();
const upload = require("../services/multer.js");
const admAuth = require("../middlewares/adminAuth.js");

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
  getSingleOrder,
} = require("../controllers/orderController.js");

const {
  getOfferManagment,
  postNewOffer,
  putEditOffer,
  getCategoryOffer,
  ChangeCategoryOfferStatus,
  postNewCategoryOffer,
} = require("../controllers/offerController.js");

//admin Routers
admRouter.get("/admin", getAdmin);
admRouter.post("/adminlog", postAdmin);
admRouter.get("/admindash", admAuth, getAdminDash);
admRouter.get("/usersmanagment", admAuth, getUserManagment);
admRouter.get("/userBlock", admAuth, userBlock);
admRouter.get("/userUnBlock", admAuth, userUnBlock);
admRouter.get("/admLogOut", admAuth, admLogout);

//Category Routers
admRouter.get("/categoryManagment", admAuth, getCategoryManagment);
admRouter.get("/categoryunlist", admAuth, categoryList);
admRouter.get("/categorylist", admAuth, categoryUnList);
admRouter.post("/addCategory", admAuth, getAddCategory);
admRouter.post("/editCategory", admAuth, postEditCategory);

//Product Routers
admRouter.get("/productManagment", admAuth, getProductManagment);
admRouter.get("/productBlock", admAuth, productBlock);
admRouter.get("/productUnBlock", admAuth, productUnBlock);
admRouter.get("/addProduct", admAuth, getAddProduct);
admRouter.post("/addProducts", admAuth, upload.any(), postAddProduct);
admRouter.get("/editProduct", admAuth, getEditProduct);
admRouter.post("/editProducts/:id", admAuth, upload.any(), postEditProduct);

//Order Managment Routers
admRouter.get("/ordermanagment", admAuth, getOrderManagment);
admRouter.get("/orderStatusChange/:ordId", admAuth, getChangeOrderStatus);
admRouter.get("/viewOrder", admAuth, getSingleOrder);

//offer Managments Routes
admRouter.get("/offerManagment", admAuth, getOfferManagment);
admRouter.post("/addOffer", admAuth, postNewOffer);
admRouter.put("/editCurrentOffer/:id", admAuth, putEditOffer);
admRouter.get("/categoryOfferManagment",admAuth,getCategoryOffer);
admRouter.post("/categoryOfferStatus/:id",admAuth,ChangeCategoryOfferStatus)
admRouter.post("/newcategoryOffer",admAuth,postNewCategoryOffer)

module.exports = admRouter;
