// const { escapeXML } = require("ejs");
const userData = require("../models/userDB")
const transport = require('../services/sendOTP')

const getlandingpage = (req, res) => {
  try {
    // console.log(req.session.isLogged)
    if(req.session.isLogged){
      res.render("users/homePage",{islogin:true});
    }else{
      res.render("users/homePage",{islogin:false});
    }
  } catch (error) {
    console.log("something went wrong", error)
  }
  
};


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
      req.session.isLogged = true;
      // console.log(req.session.isLogged)
      res.redirect("/")
    }else{
      res.render("users/login",{message:"Username or Password is incorrect"})
    }
  } catch (error) {
    console.log("Something went Wrong",error)
  }
}

const getOtp = async(req,res)=>{
  try {
    const userEmail = req.session.email;
    // console.log(userEmail);
    const userDetail = await userData.findOne({email:userEmail});
    const oneTimePassword = () => Math.floor(1000 + Math.random() * 9000);
    req.session.OTP= oneTimePassword()
    await transport.sendMail({
      from:process.env.MAIL_ID,
      to:userEmail,
      subject:"Signup OTP for Cake Cart",
      text:`Here is your One Time Password for registration ${req.session.OTP}`
    })
      res.render("users/otp")
  } catch (error) {
    console.log("something went wrong", error)
  }
}

const postOtp = async(req,res)=>{
  try {
    if(req.session.OTP==req.body.otp){
      res.redirect("/");
    }else{
      res.render("/views/users/otp",{message:"Invalid OTP"})
    }
  } catch (error) {
    console.log("Something went wrong", error);
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
  const exist = await userData.findOne({email:req.body.email});
  console.log(exist)
  if(exist!=null){
    res.render("users/signup",{message:"This is an Existing user"})
  }else{
    await userData.insertMany([data]);
    req.session.email = req.body.email;
    req.session.isLogged = true;
    res.redirect("/views/users/otp");
  }
  } catch (error) {
    console.log("Error during signup:", error);
  }
}

const getCategory = (req,res)=>{
  res.render("users/category")
};

const getCart = (req, res) => {
  res.render("users/cart");
};

const getCheckout=(req, res) => {
  res.render("users/checkout");
};

const getLogout = (req,res)=>{
  req.session.isLogged=false;
  res.redirect("/")
}

module.exports={
  getlandingpage,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getOtp,
  postOtp,
  getCategory,
  getCart,
  getCheckout,
  getLogout
}