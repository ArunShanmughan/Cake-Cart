const orderModel = require("../models/orderModel");


const getOrderManagment = async(req,res)=>{
  try {
    if(req.session.adminLogged){
      let orderDetails = await orderModel.find().populate("userId")
      console.log(orderDetails);
    res.render("admin/orderManagment",{orderData:orderDetails});
    }else{
      res.redirect("/admin")
    }
  } catch (error) {
    console.log("Something Went Wrong",error);
  }
}

const getChangeOrderStatus = async(req,res)=>{
  console.log(req.params);

  
  console.log("this is happening in the change order status processs",req.query)
  try {
    if(req.session.adminLogged){
    await orderModel.findOneAndUpdate({_id:req.params.ordId},{$set:{orderStatus:req.query.statusId}});
    res.send({success:true})
    }
  } catch (error) {
    console.log("Something Went Wrong",error)
  }
}


module.exports={getOrderManagment,getChangeOrderStatus}