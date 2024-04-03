const adminData = require("../models/adminDB");
const userdata = require("../models/userDB");
const categoryModel = require("../models/categoryModel");

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
      res.redirect("/admin", { message: "invalid email or password" });
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
  } catch (error) {}
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
  } catch (err) {
    console.log(err);
  }
};

const userUnBlock = async (req, res) => {
  try {
    await userdata.updateOne(
      { _id: req.query.id },
      { $set: { isBlocked: true } }
    );
    res.send({ success: true });
  } catch (err) {
    console.log(err);
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

const getProductManagment = (req, res) => {
  try {
    if (req.session.adminLogged) {
      res.render("admin/productManagment");
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
  } catch (err) {
    console.log(err);
  }
};

const categoryUnList = async (req, res) => {
  try {
    await categoryModel.updateOne(
      { _id: req.query.id },
      { $set: { isListed: true } }
    );
    res.send({ unlist: true });
  } catch (err) {
    console.log(err);
  }
};

const getAddCategory = async (req, res) => {
  try {
    const categoryName = req.body.category;
    const description = req.body.categoryDes;
    console.log(req.body)

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

const postEditCategory = async(req,res)=>{
  try {
    const catDetails = await categoryModel.findOne({ categoryName: { $regex: new RegExp('^' + req.body.categoryName.toLowerCase() + '$', 'i') } })

    if(/^\s*$/.test(req.body.categoryName) || /^\s*$/.test(req.body.categoryDes)) {
      res.send({ noValue: true })
    } else if (catDetails) {
      res.send({ exists: true })
    }else{
      await categoryModel.updateOne({ _id:req.body.categoryId }, { $set: { categoryName: req.body.categoryName, description: req.body.categoryDes } })
            res.send({ success: true })
    }
  } catch (error) {
    console.log("Something went Wrong",error)
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
};
