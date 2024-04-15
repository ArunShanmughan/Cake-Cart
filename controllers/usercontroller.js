// const { escapeXML } = require("ejs");
const userData = require("../models/userDB")
const transport = require('../services/sendOTP')
const productModel = require("../models/productModel")
const categoryModel = require("../models/categoryModel")
const addressModel = require("../models/addressModel");
const { postAddProduct } = require("./productcontroller");

const getlandingpage = async(req, res) => {
  try {
    const categoryInfo = await categoryModel.find()
    const ProductInfo = await productModel.find().populate("category")
    // console.log(req.session.isLogged)
    if(req.session.isLogged){
      req.session.otpRequest=false;
      res.render("users/homePage",{islogin:req.session.isLogged,categoryInfo:categoryInfo,productInfo:ProductInfo});
    }else{
      res.render("users/homePage",{islogin:null,categoryInfo:categoryInfo,productInfo:ProductInfo});
    }
  } catch (error) {
    console.log("something went wrong", error)
  }
  
};


const getLogin = (req, res) => {
  try {
    if(!req.session.isLogged){
      console.log("loginpage is rendering")
      res.render("users/login");
    }else{
      res.redirect("/")
    }
  } catch (error) {
    console.log("something went wrong",error)
  }
};

const postLogin = async(req,res)=>{
  try {
    const check  = await userData.findOne({email:req.body.email})
    if(check.password==req.body.password&&check.isBlocked==false){
      req.session.isLogged = true;
      req.session.userInfo = check;
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
    if(req.session.otpRequest){
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
  }else{
    res.redirect("/views/users/login")
  }
  } catch (error) {
    console.log("something went wrong", error)
  }
}

const postOtp = async(req,res)=>{
  try {
    if(req.session.OTP==req.body.otp){
      req.session.isLogged=true;
      res.redirect("/");
    }else{
      res.render("users/otp",{message:"Invalid OTP"})
    }
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

const getSignup = (req,res)=>{
  try {
    res.render("users/signup");
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
};

const postSignup = async(req,res)=>{
  try {
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
  if(exist!=null){
    res.render("users/signup",{message:"This is an Existing user"})
  }else{
    await userData.insertMany([data]);
    req.session.email = req.body.email;
    req.session.isLogged = true;
    req.session.otpRequest = true;
    res.redirect("/views/users/otp");
  }
  } catch (error) {
    console.log("Error during signup:", error);
  }
}

const getMyAccount = async(req,res)=>{
  try {
    if(req.session.isLogged){
    res.render("users/myAccount",{islogin:req.session.isLogged,userData:req.session.userInfo});
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const getOrderHistory = async(req,res)=>{
  try {
    if(req.sesion.isLogged){
    res.render("users/orderHistory",{islogin:req.session.isLogged,userData:req.session.userInfo});
    }
  } catch (error) {
    console.log("Something Went wrong",error);
  }
}

const getMyAddress = async(req,res)=>{
  try {
    if(req.session.isLogged){
      console.log("address page is getting")
    let userAddress = await addressModel.find({userId:req.session.userInfo._id})
    console.log("something",userAddress)
    res.render("users/myAddress",{islogin:req.session.isLogged,userAdd:userAddress});
    }
  } catch (error) {
    console.log("Something Went wrong",error);
  }
}

const getAddAddress = async(req,res)=>{
  try {
    if(req.session.isLogged){
      let addressData = await addressModel.find()
      res.render("users/addAddress",{islogin:req.session.isLogged})
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const postAddAddress = async(req,res)=>{
  try {
    const addAddress = new addressModel({
      userId:req.session.userInfo._id,
      addressHead:req.body.addressTitle,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      phone:req.body.phone,
  });

  // const addressDetail = await addressModel.find({ addressLine1: { $regex: new RegExp('^' + req.body.addressline1.toLowerCase() + '$', 'i') } })
  if (/^\s*$/.test(req.body.addressline1) || /^\s*$/.test(req.body.addressline2) || /^\s*$/.test(req.body.firstname)|| /^\s*$/.test(req.body.lastname) || /^\s*$/.test(req.body.phonenumber)){
    res.send({noValue:true})
  }else {
    res.send({ success: true })
    addAddress.save()
  }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}


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
  getCart,
  getCheckout,
  getLogout,
  getMyAccount,
  getOrderHistory,
  getMyAddress,
  getAddAddress,
  postAddAddress,
}