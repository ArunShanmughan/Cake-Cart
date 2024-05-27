const orderData = require("../models/orderModel");
const userData = require("../models/userDB");
const formatDate = require("../services/formatDate");
const getSalesData = require("../services/salesData")
const exceljs = require("exceljs");
const fs = require("fs");
const puppeteer = require("puppeteer");




module.exports={getSalesReport}