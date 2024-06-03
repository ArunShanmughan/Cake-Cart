const usersModel = require("../models/userDB.js") 
const categoryCollection = require("../models/categoryModel.js");
const orderCollection = require("../models/orderModel.js");
const productCollection = require("../models/productModel.js");

const productsCount = async () => {
  try {
    return await productCollection.countDocuments();
  } catch (error) {
    console.error(error);
  }
};

const categoryCount = async () => {
  try {
    return await categoryCollection.countDocuments();
  } catch (error) {
    console.error(error);
  }
};

const pendingOrders = async () => {
  try {
    return await orderCollection.countDocuments({
      orderStatus: { $ne: "delivered" },
    });
  } catch (error) {
    console.error(error);
  }
};

const completedOrdersCount = async () => {
  try {
    return await orderCollection.countDocuments({ orderStatus: "delivered" });
  } catch (error) {
    console.error(error);
  }
};

const currentDayRevenue = async () => {
  try {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const result = await orderCollection.aggregate([
      { $match: { orderDate: { $gte: yesterday, $lt: today } } },
      { $group: { _id: "", totalRevenue: { $sum: "$grandTotalcost" } } },
    ]);
    return result.length > 0 ? result[0].totalRevenue : 0;
  } catch (error) {
    console.error(error);
  }
};

const fourteenDaysRevenue = async () => {
  try {
      const result = await orderCollection.aggregate([
          {
              $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
                  dailyRevenue: { $sum: "$grandTotalcost" },
              },
          },
          {
              $sort: { _id: 1 },
          },
          {
              $limit: 14,
          },
      ]);
      return {
          date: result.map((v) => v._id),
          revenue: result.map((v) => v.dailyRevenue),
      };
  } catch (error) {
      console.error(error);
  }
}

const totalRevenue = async () => {
  try {
      const result = await orderCollection.find({ 
          paymentId: { 
              $ne: null, 
              $ne: "payment pending" 
          } 
      });
      

      return {
          revenue: result.reduce((acc, curr) => (acc += curr.grandTotalcost), 0)
      };
  } catch (error) {
      console.error(error);
  }
}

const monthlyRevenue = async () => {
  try {
    const result = await orderCollection.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          dailyRevenue: { $sum: "$grandTotalcost" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 30,
      },
    ]);
   
    return {
      date: result.map((v) => v._id),
      revenue: result.map((v) => v.dailyRevenue),
    };
  } catch (error) {
    console.error(error);
  }
};

const categoryWiseRevenue = async () => {
  try {
    const result = await orderCollection.aggregate([
      { $unwind: "$cartData" },
      {
        $group: {
          _id: "$cartData.productId.parentCategory",
          revenuePerCategory: { $sum: "$cartData.totalCostPerProduct" },
        },
      },
    ]);

    let categoryData = await categoryCollection.find();

    if (!categoryData || categoryData.length === 0) {
      throw new Error("No category data found");
    }

    let finalData = {
      categoryName: result.map((v) => {
        let match = categoryData.find((catVal) => catVal._id == v._id);
        return match ? match.categoryName : "Unknown Category";}),
      revenuePerCategory: result.map((v) => v.revenuePerCategory),
    };

    return finalData;
  } catch (error) {
    console.error(error);
    throw error; // rethrow the error to be handled by the caller
  }
};

const activeUsers = async()=>{
  try {
    return await usersModel.find({isBlocked:false}).count()
  } catch (error) {
    console.log("Something Went wrong in the activeUSers",error);
  }
}

module.exports = {
  productsCount,
  categoryCount,
  pendingOrders,
  completedOrdersCount,
  currentDayRevenue,
  fourteenDaysRevenue,
  categoryWiseRevenue,
  totalRevenue,
  monthlyRevenue,
  activeUsers,
};