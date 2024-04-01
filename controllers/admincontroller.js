const adminData = require("../models/adminDB");

const getAdmin = (req,res)=>{
  try {
    res.render("admin/adminlog");
  } catch (error) {
    console.log("Something went wrong",error);
  }
}

const postAdmin =  (req,res)=>{
  try {
    if(process.env.ADMIN_PASSWORD==req.body.password){
      req.session.adminLogged = true;
      res.redirect("admin/admindash")
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

module.exports={getAdmin,
                postAdmin}