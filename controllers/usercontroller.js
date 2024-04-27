// const { escapeXML } = require("ejs");
const userData = require("../models/userDB")
const transport = require('../services/sendOTP')
const productModel = require("../models/productModel")
const categoryModel = require("../models/categoryModel")
const addressModel = require("../models/addressModel");
const { postAddProduct } = require("./productcontroller");
const cartModel = require("../models/cartModel")

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
    }else{
      res.redirect("/views/users/login")
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const getOrderHistory = async(req,res)=>{
  try {
    if(req.sesion.isLogged){
    res.render("users/orderHistory",{islogin:req.session.isLogged,userData:req.session.userInfo});
    }else{
      res.redirect("/views/users/login")
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
    res.render("users/myAddress",{islogin:req.session.isLogged,userAdd:userAddress});
    }else{
      res.redirect("/views/users/login")
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
    }else{
      res.redirect("/views/users/login")
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

const getEditAddress = async(req,res)=>{
  try {
    console.log(req.query);
    if(req.session.isLogged){
      let presentAddress = await addressModel.findOne({_id:req.query.addId});
      console.log(presentAddress);
      res.render("users/editAddress",{presentAddress,islogin:req.session.isLogged})
    }else{
      res.redirect("/views/users/login")
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const postEditAddress = async (req,res)=>{
  try {
    await addressModel.updateOne({_id:req.query.editAddId},{$set:{
      addressHead: req.body.addressTitle,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      phone: req.body.phone,
    }
    });
    res.redirect("/myAddress");
  } catch (error) {
    console.log("Something Went wrong",error);
  }
}

const getDeleteAddress = async(req,res)=>{
  try {
    if(req.session.isLogged){
      await addressModel.deleteOne({_id:req.query.dltId});
      res.redirect("/myAddress");
    }else{
      res.redirect("/views/users/login")
    }
  } catch (error) {
    console.log("Something Went wrong",error);
  }
}

const getChangePassword = async(req,res)=>{
  try {
    if(req.session.isLogged){
      res.render("users/changePassword",{islogin:req.session.isLogged});
    }else{
      res.redirect("/views/users/login");
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const postChangePassword = async(req,res)=>{
  try {
    if(req.session.userInfo.password==req.body.currentPassword){
      await userData.updateOne({_id:req.session.userInfo._id},{$set:{password:req.body.newPassword}})
      res.redirect("/myAddress")
    }else{
      let warning  = "Please enter valid existing password"
      res.render("users/changePassword",{message:warning,islogin:req.session.isLogged});
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}


const getAddToCart = async(req, res) => {
  try {
    console.log(req.params)
    let existingProduct = await cartModel.findOne({
      productId:req.params.id
    })
    console.log(existingProduct)
    if(existingProduct){
      await cartModel.updateOne(
        {_id:existingProduct._id},
        {$inc:{productQuantity: 1}}
      );
    }else{
      await cartModel.insertMany([
        {userId:req.session.userInfo._id,
        productId:req.params.id,
        productQuantity:req.body.productQuantity
       },
      ]);
    }
    res.send({success:true})
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
};


async function wholeTotal(req){
  try {
    let usersCartData = await cartModel.find({userId:req?.session?.userInfo?._id}).populate("productId");

    let wholeTotal = 0;
    for(const k of usersCartData){
      wholeTotal += k.productId.price * k.productQuantity;
      await cartModel.updateOne({_id:k._id},{$set:{totalCostPerProduct:k.productId.price * k.productQuantity}}) 
    }
    usersCartData = await cartModel.find({userId:req.session.userInfo._id}).populate("productId");

    req.session.wholeTotal = wholeTotal;

    return JSON.parse(JSON.stringify(usersCartData))
    
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
  
}


const getCart = async(req,res)=>{
  try {
    if(req.session.isLogged){
      let usersCartData = await wholeTotal(req);
      // let cartDetails = await cartModel.find({ userId: req.session?.userInfo?._id }).populate("productId");
      console.log("the page rerenderring");
      res.render("users/cart",{islogin:req.session.isLogged,userCartData:usersCartData,wholeTotal:req.session.wholeTotal})
    }else{
      res.redirect("/views/users/login");
    }
  } catch (error) {
    console.log("Something went wrong",error)
  }
}

const postDeleteCart = async(req,res)=>{
  try {
    await cartModel.findOneAndDelete({_id:req.params.id});
    res.send({success:true})
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const getDecQtyCart = async(req,res)=>{
  try {
    let cartFindData = await cartModel.findOne({_id:req.params.id}).populate("productId");
    if(cartFindData.productQuantity>1){
      cartFindData.productQuantity--
    }
    cartFindData= await cartFindData.save()
    await wholeTotal(req);
    res.json({
      success:true,
      cartFindData,
      currentUser:req.session.userInfo,
      wholeTotal:req.session.wholeTotal
    })
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const getIncQtyCart = async(req,res)=>{
  try {
    let cartFindData = await cartModel.findOne({_id:req.params.id}).populate("productId");
    console.log(cartFindData)
    if(cartFindData.productQuantity<cartFindData.productId.quantity){
      cartFindData.productQuantity++
    }
    cartFindData = await cartFindData.save()
    await wholeTotal(req);
    res.json({
      success:true,
      cartFindData,
      currentUser:req.session.userInfo,
      wholeTotal:req.session.wholeTotal,
    })
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const getCheckout = async(req, res) => {
  try {
    if(req.session.isLogged){
      let addressData = await addressModel.find({userId:req.session.userInfo._id}).populate("addressModel");
      await wholeTotal(req);
      res.render("users/checkout",{islogin:req.session.isLogged,locationData:addressData,grandTotal:req?.session?.wholeTotal});
      console.log("coming to checkout page")
      }else{
        res.redirect("/views/users/login")
      }
  } catch (error) {
    console.log("Something went wrong",error);
  }
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
  getLogout,
  getMyAccount,
  getOrderHistory,
  getMyAddress,
  getAddAddress,
  postAddAddress,
  getEditAddress,
  postEditAddress,
  getDeleteAddress,
  getChangePassword,
  postChangePassword,
  getAddToCart,
  getCart,
  postDeleteCart,
  getDecQtyCart,
  getIncQtyCart,
  getCheckout,
}