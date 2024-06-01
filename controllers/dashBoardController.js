const dashboardHelper = require("../services/dashBoardChart");
const userModel = require("../models/userDB");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

const getDashBoardData = async(req,res)=>{
  try {
    const [productCount,categoryCount,pendingOrders,completedOrders,currentDayRevenue,fourteenDayRevenue,categoryWiserevenue,TotalRevenue,monthlyRevenue,ActiveUsers] = await Promise.all([])
  } catch (error) {
    
  }
}

module.exports={
  getDashBoardData
}