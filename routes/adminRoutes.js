const express = require("express");
const admRouter = express.Router();

const {getAdmin,postAdmin} = require("../controllers/admincontroller")

admRouter.get("/admin",getAdmin);
admRouter.post("/adminlog",postAdmin);

module.exports = admRouter;