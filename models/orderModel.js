const mongoose =  require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId:{
      type:mongoose.Types.ObjectId,
      required:true,
      ref:"userDB"
    },
    orderNumber:{
      type:Number,
      required:true
    },
    orderDate:{
      type: Date,
      default: Date.now
    },
    paymentType:{
      type:String,
      default:"Cash on Delivery"
    },
    orderStatus:{
      type:String,
      required:true,
      default :"Pending"
    },
    addressChoosen:{
      type:mongoose.Types.ObjectId,
      required:true,
      ref:"addressModel"
    },
    cartData:{
      type:Array
    },
    grandTotalcost:{
      type:Number
    },
    paymentId:{
      type:String
    },
 },{timestamps:true}
);

const orderCollection = mongoose.model("orders",orderSchema)

module.exports = orderCollection;