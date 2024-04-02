const adminData = require("../models/adminDB");
const userdata = require("../models/userDB") 

const getAdmin = (req,res)=>{
  try {
    if(!req.session.adminLogged){
    res.render("admin/adminlog");
    }else{
      res.redirect("/admindash")
    }
  } catch (error) {
    console.log("Something went wrong",error);
  }
}

const postAdmin =  (req,res)=>{
  try {
    if(process.env.ADMIN_PASSWORD==req.body.password){
      req.session.adminLogged = true;
      res.redirect("/admindash")
    }else{
      res.redirect("/admin",{message:"invalid email or password"})
    }
  } catch (error) {
    console.log("something went wrong",error);
  }
}

const getAdminDash = (req,res)=>{
  try {
    if(req.session.adminLogged){
      res.render("admin/admindash")
    }else{
      res.redirect("/admin");
    }
  } catch (error) {
    
  }
}

const getUserManagment = async(req,res)=>{
  try {
    if(req.session.adminLogged){
      const userdetails = await userdata.find();
      res.render("admin/userManagment",{userinfo:userdetails})
    }
  } catch (error) {
    console.log("Something went Wrong", error)
  }
}

const userBlock = async (req, res) => {
  try {
      await userdata.updateOne({ _id: req.query.id }, { $set: { isBlocked: false } })
      res.send({ success: true })
  } catch (err) {
      console.log(err);
  }
}

const userUnBlock = async (req, res) => {
  try {
      await userdata.updateOne({ _id: req.query.id }, { $set: { isBlocked: true } })
      res.send({ success: true })
  } catch (err) {
      console.log(err);
  }
}

module.exports={getAdmin,
                postAdmin,
                getAdminDash,
                getUserManagment,
                userBlock,
                userUnBlock}