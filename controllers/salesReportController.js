const orderData = require("../models/orderModel");
const userData = require("../models/userDB");
const formatDate = require("../services/formatDate");
// const getSalesData = require("../services/salesData")
const exceljs = require("exceljs");
const fs = require("fs");
const puppeteer = require("puppeteer");

const getSalesReport = async (req, res) => {
  try {
    
    let page = Number(req.query.page) || 1;
    let limit = 10;
    let skip = (page - 1) * limit;
    
    let count = await orderData.countDocuments({ isListed: true });
    if (req.session?.admin?.salesData) {
      let { salesData, dateValues } = req.session.admin;
      console.log("this is true and the data send according to the session")
      return res.render("admin/salesReport", { salesData, dateValues,page,limit,skip });
    }

    let salesData = await orderData
      .find({ orderStatus: "delivered" })
      .sort({ orderDate: -1 })
      .populate("userId")
      .populate({
        path: "cartData.productId",
        model: "products",
        as: "productDetails",
      })
      .populate("couponOffers")
      .skip(skip)
      .limit(limit);
    console.log("this is salesdata ->", salesData);
    salesData.forEach((order) => {
      order.cartData.forEach((item) => {
        console.log("Product Details: ", item.productDetails);
      });
    });
    console.log("this is salesdata ->");
    console.log("this is salesdata.cartData ->");
    console.log("this is Count ->", count);
    console.log("this is limt ->", limit);
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

const postSalesDateFilter = async (req, res) => {
  try {
    console.log("this is the req.body in postSalesDateFilter",req.body)
    let { dateFrom, dateTo } = req.body;
    console.log(dateFrom)
    console.log(dateTo)
    let salesDateFilter = await orderData
      .find({
        orderDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
        orderStatus: "delivered",
      })
      .populate("userId");

      console.log("this is the date filtered data",salesDateFilter)

    let salesData = salesDateFilter.map((k) => {
      k.orderDateFormatted = formatDate(k.orderDate);
      return k;
    });

    console.log("salesDate after mapping",salesData)

    req.session.admin = {};
    req.session.admin.dateValues = req.body;
    req.session.admin.salesData = JSON.parse(JSON.stringify(salesData));
    console.log("this is the session for seeing the date values passed",req.session.admin.dateValues);
    console.log("this session is to check the values passed after filtering the data",req.session.admin.salesData);
    res.send({ success: true });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

const salesReportPdfDownload = async(req,res)=>{
  try {
    console.log(req.body);
    let startDate,endDate;
    if(req.body.dateFrom&&req.body.dateTo){
      startDate= new Date(req.body.dateFrom);
      endDate= new Date(req.body.dateTo);
    }else{
      startDate= new Date();
      startDate.setDate(startDate.getDate()-7);
      endDate = new Date()
    }
    //need to comeplte from here



  } catch (error) {
    
  }
}

module.exports = { getSalesReport, postSalesDateFilter ,salesReportPdfDownload};
