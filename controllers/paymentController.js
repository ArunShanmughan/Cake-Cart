// const paypal = require('paypal-rest-sdk');
// const cartModel = require("../models/cartModel");

// const {PAYPAL_MODE,PAYPAL_CLIENT_KEY,PAYPAL_SECRET_KEY}= process.env;

// paypal.configure({
//   'mode':PAYPAL_MODE,
//   'client_id':PAYPAL_CLIENT_KEY,
//   'client_secret':PAYPAL_SECRET_KEY
// });
// let forOrder = await cartModel.find()

//     const create_payment_json = {
//       "intent":"sale",
//       "payer":{
//         "payment_method":"paypal"
//       },
//       "redirect_urls":{
//         "retrun_url":"http://localhost:3000/success",
//         "cancel_url":"http://localhost:3000/cancel"
//       },
//       "trancactions":[{
//         "item_list":[{
//           "name":
//         }]
//       }]
//     }
