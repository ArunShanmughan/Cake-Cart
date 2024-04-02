const express = require("express");
const admRouter = express.Router();

const {getAdmin,
      postAdmin,
      getAdminDash,
      getUserManagment,
      userBlock,
      userUnBlock} = require("../controllers/admincontroller")

admRouter.get("/admin",getAdmin);
admRouter.post("/adminlog",postAdmin);
admRouter.get("/admindash",getAdminDash);
admRouter.get("/usersmanagment",getUserManagment);
admRouter.get("/userBlock",userBlock);
admRouter.get("/userUnBlock",userUnBlock);


module.exports = admRouter;