const userData = require("../models/userDB");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

const getProducts = async (req, res) => {
  try {
    const categoryInfo = await categoryModel.find({ isListed: true });
  let query = { isListed: true };
  if (req.query.searchId) {
    query.productName = { $regex: req.query.searchId, $options: "i" };
  } else if (req.query.id) {
    query.parentCategory = req.query.id;
  }

  const { ascSort } = req.session;
  const { desSort } = req.session;
  const { highValueSort } = req.session;
  const { lowValueSort } = req.session;
  const { newArrive } = req.session;

  req.session.ascSort = null;
  req.session.desSort = null;
  req.session.highValueSort = null;
  req.session.lowValueSort = null;
  req.session.newArrive = null;
  const productInfo = await productModel.find(query).populate("category");
  res.render("users/products", {
    islogin: req.session.isLogged,
    productInfo:
      ascSort || desSort || highValueSort || lowValueSort || newArrive || productInfo,
    categoryDet: categoryInfo,
  });
  } catch (error) {
    console.log("Something went Wrong",error);
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const productDetails = await productModel.findOne({ _id: req.query.id });
    const categoryDetails = await categoryModel.findOne({ _id: req.query.id });
    res.render("users/singleProduct", {
      islogin: req.session.isLogged,
      productInfo: productDetails,
      categoryInfo: categoryDetails,
    });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const getSearchProduct = async (req, res) => {
  try {
    const searchedProduct = await productModel.find({
      productName: { $regex: req.body.searchElement, $options: "i" },
    });
    if (searchedProduct.length > 0) {
      res.send({ searchProduct: true });
    } else {
      res.send({ searchProduct: false });
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const getSortData = async (req, res) => {
  try {
    if (req.query.sortId == 1) {
      const ascSortByName = await productModel.find().sort({ productName: 1 });
      req.session.ascSort = ascSortByName;
      res.send({ ascSort: true });
    } 
    else if (req.query.sortId == 2) {
      const desSortByName = await productModel.find().sort({ productName: -1 });
      req.session.desSort = desSortByName;
      res.send({ desSort: true });
    } 
    else if (req.query.sortId == 3) {
      const ascSortByPrice = await productModel.find().sort({ price: 1 });
      req.session.highValueSort = ascSortByPrice;
      res.send({ highValueSort: true });
    } 
    else if (req.query.sortId == 4) {
      const desSortByPrice = await productModel.find().sort({ price: -1 });
      req.session.lowValueSort = desSortByPrice;
      res.send({ lowValueSort: true });
    }else if(req.query.sortId == 5){
      const newArrivals = await productModel.find().sort({_id:-1});
      req.session.newArrive = newArrivals;
      res.send({newArrive:true})
    }
  } catch (error) {
    console.log("Something Went wrong", error);
  }
};

module.exports = {
  getProducts,
  getSingleProduct,
  getSearchProduct,
  getSortData,
};
