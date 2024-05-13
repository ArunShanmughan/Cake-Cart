const productOfferModel = require("../models/productOfferModel");
const formatDate = require("../services/formatDate");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

const getOfferManagment = async (req, res) => {
  try {
    //updating currentStatus field by checking with the current date
    let productOffers = await productOfferModel.find();
    productOffers.forEach(async (i) => {
      await productOfferModel.updateOne(
        { _id: i._id },
        {
          $set: {
            currentStatus: i.endDate >= new Date() && i.startDate <= new Date(),
          },
        }
      );
    });

    //formating the data according to the Date
    productOffers = productOffers.map((i) => {
      i.startDateFormated = formatDate(i.startDate, "YYYY-MM-DD");
      I.endDateFormatted = formatDate(i.endDate, "YYYY-MM-DD");
      return i;
    });

    const productData = await productModel.find();
    const categoryData = await categoryModel.find();

    res.render("admin/offerManagment", {
      productOffers,
      productData,
      categoryData,
    });
  } catch (error) {
    console.log("Something went wrong while rendering offermanagment");
  }
};

module.exports = { getOfferManagment };
