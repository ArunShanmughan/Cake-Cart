const userdata = require("../models/userDB");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const productCollection = require("../models/productModel");

const getProductManagment = async (req, res) => {
  try {
      const productdetails = await productModel.find().populate("category");
      res.render("admin/productManagment", {
        productData: productdetails,
      });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};


const productBlock = async (req, res) => {
  try {
    await productModel.updateOne(
      { _id: req.query.id },
      { $set: { isListed: false } }
    );
    res.send({ block: true });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};


const productUnBlock = async (req, res) => {
  try {
    await productModel.updateOne(
      { _id: req.query.id },
      { $set: { isListed: true } }
    );
    res.send({ unbBlock: true });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};


const getAddProduct = async (req, res) => {
  try {
      const categorydetails = await categoryModel.find();
      const productDetails = await productCollection.find()
      res.render("admin/addproduct", { categoryModel: categorydetails,productDetails});
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};


const postAddProduct = async(req,res)=>{
  // console.log(req.files)
  try {
    let images = [];
    for(let i=0;i<req.files.length;i++){
      images[i]=req.files[i].filename;
    }
    // console.log(images)
    // console.log(req.body);
    const addproduct = new productModel({
      productName: req.body.productName,
      category: req.body.parentCategory,
      images: images,
      price: req.body.productPrice,
      quantity: req.body.productQuantity
  });
  const productDetails = await productModel.find({ productName: { $regex: new RegExp('^' + req.body.productName.toLowerCase() + '$', 'i') } })
        if (/^\s*$/.test(req.body.productName) || /^\s*$/.test(req.body.productPrice) || /^\s*$/.test(req.body.productStock)) {
            res.send({ noValue: true })
        }
        else if (productDetails.length > 0) {
            res.send({ exists: true })
        } else {
            res.send({ success: true })
            addproduct.save()
        }
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
}


const getEditProduct = async(req,res)=>{
  try {
    if(req.session.adminLogged){
      const categoryDetails = await categoryModel.find()
      const categoryInfo = await categoryModel.findOne({ _id: req.query.catId })
      const productInfo = await productModel.findOne({ _id: req.query.proId })
    res.render("admin/editProduct",{productInfo:productInfo,categoryInfo:categoryInfo,categorydetails:categoryDetails});
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}


const postEditProduct = async(req,res)=>{
  try {
    if(req.files.length==0){
      const existingProduct = await productModel.findOne({_id:req.params.id});
      var imageFiles = existingProduct.images;
    }else if(req.files.length<3){
      res.send({noImage:true})
    }else{
    var imageFiles = [];
    for(let i=0;i<req.files.length;i++){
      imageFiles[i]=req.files[i].filename;
      }
    }
    const productDetails = await productModel.find({_id:{$ne:req.params.id},productName: { $regex: new RegExp('^' + req.body.productName.toLowerCase() + '$', 'i') } })
        if (/^\s*$/.test(req.body.productName) || /^\s*$/.test(req.body.productPrice) || /^\s*$/.test(req.body.productStock)) {
            res.send({ noValue: true })
        }else if (productDetails.length > 0 && req.body.productName != productDetails.productName ) {
          res.send({ exists: true })
      } else {
          await productModel.updateOne({ _id: req.params.id }, {
              $set: {
                  productName: req.body.productName,
                  category: req.body.parentCategory,
                  Images: imageFiles,
                  price: req.body.productPrice,
                  quantity: req.body.productStock
              }
          })
          res.send({ success: true })

      }
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
}


module.exports={
  getProductManagment,
  productBlock,
  productUnBlock,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct
}