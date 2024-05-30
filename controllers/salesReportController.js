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
      console.log("this is true and the data send according to the session");
      return res.render("admin/salesReport", {
        salesData,
        dateValues,
        page,
        limit,
        skip,
      });
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
    console.log("this is the req.body in postSalesDateFilter", req.body);
    let { dateFrom, dateTo } = req.body;
    console.log(dateFrom);
    console.log(dateTo);
    let salesDateFilter = await orderData
      .find({
        orderDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
        orderStatus: "delivered",
      })
      .populate("userId");

    console.log("this is the date filtered data", salesDateFilter);

    let salesData = salesDateFilter.map((k) => {
      k.orderDateFormatted = formatDate(k.orderDate);
      return k;
    });

    console.log("salesDate after mapping", salesData);

    req.session.admin = {};
    req.session.admin.dateValues = req.body;
    req.session.admin.salesData = JSON.parse(JSON.stringify(salesData));
    console.log(
      "this is the session for seeing the date values passed",
      req.session.admin.dateValues
    );
    console.log(
      "this session is to check the values passed after filtering the data",
      req.session.admin.salesData
    );
    res.send({ success: true });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

const salesReportPdfDownload = async (req, res) => {
  try {
    console.log(req.query);
    let startDate, endDate;
    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
    }
    //need to comeplte from here

    const salesData = await orderData
      .find({
        orderDate: { $gte: startDate, $lte: endDate },
        orderStatus: "delivered",
      })
      .populate("userId")
      .populate({
        path: "cartData.productId",
        model: "products",
        as: "productDetails",
      })
      .populate("couponOffers");

    console.log(salesData);
    const browser = await puppeteer.launch({ headless: true });
      let htmlContent = `
        <h1 style="text-align: center;">Sales Report</h1>
        <table style="width:100%">
          <tr>
          <th>Order Number</th>
          <th>UserName</th>
          <th>Order Date</th>
          <th>Products</th>
          <th>Product Offer</th>
          <th>Quantity</th>
          <th>Before Offer</th>
          <th>Total Cost</th>
          <th>Payment Method</th>
          <th>Status</th>
          <th>Coupons</th>
          <th>Before Coupon</th>
          <th>Ordered Price</th>
          </tr>`;

      salesData.forEach((order, i) => {
        htmlContent += `
          <tr>
          <td>${order.orderNumber}</td>
          <td>${order.userId.fName}</td>
          <td>${formatDate(order.orderDate)}</td>
          <td>${order.cartData
            .map((item) => item.productId.productName)
            .join(", ")}</td>
          <td>${order.cartData
            .map((item) =>
              item.productId.productOfferPercentage
                ? item.productId.productOfferPercentage
                : "Nil"
            )
            .join(", ")}</td>
          <td>${order.cartData
            .map((item) => item.productId.productQuantity)
            .join(", ")}</td>
          <td>${order.cartData
            .map(
              (item) => item.productId.priceBeforeOffer * item.productQuantity
            )
            .join(", ")}</td>
          <td>${order.cartData
            .map((item) => item.totalCostPerProduct)
            .join(", ")}</td>
          <td>${order.paymentType}</td>
          <td>${order.orderStatus}</td>
          <td>${order.couponOffers ? order.couponOffers.couponCode : "Nil"}</td>
          <td>${
            order.couponOffers
              ? Math.round(
                  order.grandTotalCost /
                    (1 - order.couponOffers.discountPercentage / 100)
                )
              : "Nil"
          }</td>
          <td>${order.grandTotalcost}</td>
          </tr>`;
      });
      htmlContent += `</table>`;

    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000); // Increased timeout to 1 minute
      await page.setContent(htmlContent);
      console.log("aaaaaaaaaaaaaaaaaaaa");

      const pdfBuffer = await page.pdf({ format: "A4" });
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; Filename=salesReport.pdf"
      );

      res.send(pdfBuffer);
      console.log("cccccccccccccccccccccccccccccccc");
    } catch (error) {
      console.error("Error generating PDF:", error);
      res
        .status(500)
        .send("Error generating PDF report. Check server logs for details."); // More informative error message
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.log("Somethng wemt wrong in downloading pdf", error);
  }
};

module.exports = {
  getSalesReport,
  postSalesDateFilter,
  salesReportPdfDownload,
};
