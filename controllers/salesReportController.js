const orderData = require("../models/orderModel");
const userData = require("../models/userDB");
const formatDate = require("../services/formatDate");
// const getSalesData = require("../services/salesData")
const exceljs = require("exceljs");
const fs = require("fs");
const puppeteer = require("puppeteer");


const getSalesReport = async (req, res) => {
  try {
    if (req.session?.admin?.salesData) {
      let { salesData, dateValues } = req.session.admin;
      return res.render("admin/salesReport", { salesData, dateValues });
    }

    let page = Number(req.query.page) || 1;
    let limit = 10;
    let skip = (page - 1) * limit;

    let count = await orderData.countDocuments({ isListed: true });

    let salesData = await orderData
      .find({ orderStatus: "delivered" })
      .populate("userId")
      .skip(skip)
      .limit(limit);
      let orderCart = await orderData.find({orderStatus:"delivered"}).populate("cartData");
      console.log("this is salesdata ->",salesData)
      console.log("this is salesdata.cartData ->",orderCart.cartData)
      console.log("this is Count ->",count)
      console.log("this is limt ->",limit)
    res.render("admin/salesReport", {
      salesData,
      dateValues: null,
      count,
      limit,
      page,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports={getSalesReport}