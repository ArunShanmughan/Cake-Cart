const userdata = require("../models/userDB");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

const getAdmin = (req, res) => {
  try {
    if (!req.session.adminLogged) {
      res.render("admin/adminlog");
    } else {
      res.redirect("/admindash");
    }
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const postAdmin = (req, res) => {
  try {
    if (process.env.ADMIN_PASSWORD == req.body.password) {
      req.session.adminLogged = true;
      res.redirect("/admindash");
    } else {
      res.render("admin/adminlog", { message: "invalid email or password" });
    }
  } catch (error) {
    console.log("something went wrong", error);
  }
};

const getAdminDash = (req, res) => {
  try {
    if (req.session.adminLogged) {
      res.render("admin/admindash");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const getUserManagment = async (req, res) => {
  try {
    if (req.session.adminLogged) {
      const userdetails = await userdata.find();
      res.render("admin/userManagment", { userinfo: userdetails });
    }
  } catch (error) {
    console.log("Something went Wrong", error);
  }
};

const userBlock = async (req, res) => {
  try {
    await userdata.updateOne(
      { _id: req.query.id },
      { $set: { isBlocked: false } }
    );
    res.send({ success: true });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const userUnBlock = async (req, res) => {
  try {
    await userdata.updateOne(
      { _id: req.query.id },
      { $set: { isBlocked: true } }
    );
    res.send({ success: true });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const getCategoryManagment = async (req, res) => {
  try {
    if (req.session.adminLogged) {
      const catDetails = await categoryModel.find();
      res.render("admin/categoryManagment", { categoryinfo: catDetails });
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const getProductManagment = async (req, res) => {
  try {
    if (req.session.adminLogged) {
      const productdetails = await productModel.find().populate("category");
      // const categorydetails = await categoryModel.find({
      //   _id: productdetails._id,
      // })
      res.render("admin/productManagment", {
        productData: productdetails,
        // categoryModel: categorydetails,
      });
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const categoryList = async (req, res) => {
  try {
    await categoryModel.updateOne(
      { _id: req.query.id },
      { $set: { isListed: false } }
    );
    res.send({ list: true });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const categoryUnList = async (req, res) => {
  try {
    await categoryModel.updateOne(
      { _id: req.query.id },
      { $set: { isListed: true } }
    );
    res.send({ unlist: true });
  } catch (error) {
    console.log("Something Went wrong", error);
  }
};

const getAddCategory = async (req, res) => {
  try {
    const categoryName = req.body.category;
    const description = req.body.categoryDes;
    console.log(req.body);

    const categoryExists = await categoryModel.findOne({
      categoryName: { $regex: new RegExp("^" + req.body.category + "$", "i") },
    });

    if (categoryExists) {
      res.send({ invalid: true });
    } else {
      const newCategory = new categoryModel({
        categoryName,
        description,
      });
      await newCategory.save();
      res.send({ success: true });
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

const postEditCategory = async (req, res) => {
  try {
    const catDetails = await categoryModel.findOne({
      categoryName: {
        $regex: new RegExp(
          "^" + req.body.categoryName.toLowerCase() + "$",
          "i"
        ),
      },
    });

    if (
      /^\s*$/.test(req.body.categoryName) ||
      /^\s*$/.test(req.body.categoryDes)
    ) {
      res.send({ noValue: true });
    } else if (catDetails && catDetails._id != req.body.categoryId) {
      res.send({ exists: true });
    } else {
      await categoryModel.updateOne(
        { _id: req.body.categoryId },
        {
          $set: {
            categoryName: req.body.categoryName,
            description: req.body.categoryDes,
          },
        }
      );
      res.send({ success: true });
    }
  } catch (error) {
    console.log("Something went Wrong", error);
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
    if (req.session.adminLogged) {
      const categorydetails = await categoryModel.find();
      res.render("admin/addproduct", { categoryModel: categorydetails });
    }
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};


const postAddProduct = async(req,res)=>{
  // console.log(req.files)
  try {
    if(req.session.adminLogged){
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
    let images = [];
    for(let i=0;i<req.files.length;i++){
      images[i]=req.files[i].filename;
    }
    const productDetails = await productModel.find({ productName: { $regex: new RegExp('^' + req.body.productName.toLowerCase() + '$', 'i') } })
        if (/^\s*$/.test(req.body.productName) || /^\s*$/.test(req.body.productPrice) || /^\s*$/.test(req.body.productStock)) {
            res.send({ noValue: true })
        }else if (productDetails.length > 0 && req.body.productName != productDetails.productName ) {
          res.send({ exists: true })
      } else {
          await productCollection.updateOne({ _id: req.params.id }, {
              $set: {
                  productName: req.body.productName,
                  category: req.body.parentCategory,
                  Images: images,
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



module.exports = {
  getAdmin,
  postAdmin,
  getAdminDash,
  getUserManagment,
  userBlock,
  userUnBlock,
  getCategoryManagment,
  getProductManagment,
  categoryList,
  categoryUnList,
  getAddCategory,
  postEditCategory,
  productBlock,
  productUnBlock,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct
};
