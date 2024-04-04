const express = require("express");
const admRouter = express.Router();

const {getAdmin,
      postAdmin,
      getAdminDash,
      getUserManagment,
      userBlock,
      userUnBlock,
      getCategoryManagment,
      getProductManagment,
      categoryList,
      categoryUnList,
      getAddCategory,
      postEditCategory,
      productBlock,
      productUnBlock,
      getAddProduct,
      postAddProduct} = require("../controllers/admincontroller")

admRouter.get("/admin",getAdmin);
admRouter.post("/adminlog",postAdmin);
admRouter.get("/admindash",getAdminDash);
admRouter.get("/usersmanagment",getUserManagment);
admRouter.get("/userBlock",userBlock);
admRouter.get("/userUnBlock",userUnBlock);
admRouter.get("/categoryManagment",getCategoryManagment)
admRouter.get("/productManagment",getProductManagment)
admRouter.get("/categoryunlist",categoryList);
admRouter.get("/categorylist",categoryUnList);
admRouter.post("/addCategory",getAddCategory);
admRouter.post("/editCategory",postEditCategory);
admRouter.get("/productBlock",productBlock);
admRouter.get("/productUnBlock",productUnBlock);
admRouter.get("/addProduct",getAddProduct);
admRouter.post("/addProducts",postAddProduct);



module.exports = admRouter;