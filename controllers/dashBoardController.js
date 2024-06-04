const dashboardHelper = require("../services/dashBoardChart");
const userModel = require("../models/userDB");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

const getDashBoardData = async (req, res) => {
  try {
    const [
      productCount,
      categoryCount,
      pendingOrders,
      completedOrdersCount,
      currentDayRevenue,
      fourteenDayRevenue,
      categoryWiseRevenue,
      totalRevenue,
      monthlyRevenue,
      activeUsers,
    ] = await Promise.all([
      dashboardHelper.productsCount(),
      dashboardHelper.categoryCount(),
      dashboardHelper.pendingOrders(),
      dashboardHelper.completedOrdersCount(),
      dashboardHelper.currentDayRevenue(),
      dashboardHelper.fourteenDaysRevenue(),
      dashboardHelper.categoryWiseRevenue(),
      dashboardHelper.totalRevenue(),
      dashboardHelper.monthlyRevenue(),
      dashboardHelper.activeUsers()
    ]);

    const data = {
      productCount,
      categoryCount,
      pendingOrders,
      completedOrdersCount,
      currentDayRevenue,
      fourteenDayRevenue,
      categoryWiseRevenue,
      totalRevenue,
      monthlyRevenue,
      activeUsers
    }
    console.log("coming to the function for geting promise datas",data)
    res.json(data);
  } catch (error) {
    console.log("Something went wrong",error);
    res.send({error});
  }
};

module.exports = {
  getDashBoardData,
};
