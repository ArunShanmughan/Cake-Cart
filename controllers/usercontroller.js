const userData = require("../models/userDB")

const getlandingpage = (req, res) => {
  res.render("users/homePage");
};
7
const getLogin = (req, res) => {
  try {
  res.render("users/login");
  } catch (error) {
    console.log("something went wrong",error)
  }
};

const postLogin = async(req,res)=>{
  try {
    const check  = await userData.findOne({email:req.body.email})
    if(check.password==req.body.password){
      res.render("users/homepage")
    }else{
      res.redirect("users/login")
    }
  } catch (error) {
    
  }
  
}
const getSignup = (req,res)=>{
  res.render("users/signup.ejs");
};

const postSignup = async(req,res)=>{
  try {
    console.log(req.body)
  const data = {
      fName: req.body.firstname,
      lName: req.body.lastname,
      email: req.body.email,
      mobile: req.body.phonenumber,
      address: req.body.address,
      postCode:req.body.postCode,
      country: req.body.country,
      password:req.body.password,
  }
    await userData.insertMany([data]);
    req.session.isLogged = true;
    res.redirect("/");
  } catch (error) {
    console.log("Error during signup:", error);
  }
}

const getCategory = (req,res)=>{
  res.render("users/category.ejs")
};

const getCart = (req, res) => {
  res.render("users/cart");
};

const getCheckout=(req, res) => {
  res.render("users/checkout");
};

module.exports={
  getlandingpage,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getCategory,
  getCart,
  getCheckout,
}