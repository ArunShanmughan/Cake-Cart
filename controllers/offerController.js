const productOfferModel = require("../models/productOfferModel");
const formatDate = require("../services/formatDate");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const applyProductOffers =
  require("../services/applyProductOffer").applyProductOffer;

const getOfferManagment = async (req, res) => {
  try {
    //updating currentStatus field by checking with the current date
    

    let productOffers = await productOfferModel.find();
    console.log(productOffers)
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
      i.endDateFormated = formatDate(i.endDate, "YYYY-MM-DD");
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

const postNewOffer = async(req,res)=>{
  console.log("coming to this postNewOffer function with req.body")
  try {
    console.log(req.body)
    let {productName}=req.body;
    let existingOffer = await productOfferModel.findOne({productName});

    if(!existingOffer){
      let productData = await productModel.findOne({productName});

      let {productOfferPercentage,startDate,endDate} = req.body;

      await productOfferModel.insertMany([
        {productId:productData._id,
          productName,
          productOfferPercentage,
          startDate: new Date(startDate),
          endDate:new Date(endDate),
        }
      ]);
      await applyProductOffers("postNewOffer");
      res.send({success:true})
    }else{
      res.send({success:false});
    }
  } catch (error) {
    console.log("Something went wrong",error);
  }
}

module.exports = { getOfferManagment,postNewOffer };
