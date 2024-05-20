// const paypal = require("paypal-rest-sdk");
// const cartModel = require("../models/cartModel");

// const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

// paypal.configure({
//   mode: PAYPAL_MODE,
//   client_id: PAYPAL_CLIENT_KEY,
//   client_secret: PAYPAL_SECRET_KEY,
// });

// const onlinePayment = async (req, res) => {
//   const orderDetails = await cartModel
//     .find({
//       userId: req.session.userInfo._id,
//     })
//     .populate("productId");
//   console.log("comsing to this onlinepayment", orderDetails);

//   let items = [];
//   for (let i = 0; i < orderDetails.length; i++) {
//     items.push({
//       name: orderDetails[i].productId.productName,
//       price: orderDetails[i].productId.price,
//       currency: "USD",
//       quantity: orderDetails[i].productId.quantity,
//     });
//   }

//   const total = orderDetails.reduce(
//     (acc, val) => acc + val.totalCostPerProduct,
//     0
//   );
//   req.session.total = total;
//   console.log(total);
//   console.log(items);

//   try {
//     const create_payment_json = {
//       intent: "sale",
//       payer: {
//         payment_method: "paypal",
//       },
//       redirect_urls: {
//         // Change made here: redirect_urls instead of redirect_url
//         return_url: "http://localhost:8001/orderinfo",
//         cancel_url: "http://localhost:8001/checkout",
//       },
//       transactions: [
//         {
//           // Change made here: transactions instead of transaction
//           item_list: {
//             items: items,
//           },
//           amount: {
//             currency: "USD",
//             total: total,
//           },
//         },
//       ],
//     };
//     paypal.payment.create(
//       await create_payment_json,
//       async function (error, payment) {
//         if (error) {
//           console.log(error);
//         } else {
//           req.session.paymentId = payment.id;
//           for (let i = 0; i < payment.links.length; i++) {
//             if (payment.links[i].rel === "approval_url") {
//               res.redirect(payment.links[i].href);
//             }
//           }
//         }
//       }
//     );
//   } catch (error) {
//     console.log("Something went wrong", error);
//   }
// };

// module.exports = { onlinePayment };

const paypal = require("paypal-rest-sdk");
const cartModels = require("../models/cartModel");

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_KEY,
  client_secret: PAYPAL_SECRET_KEY,
});

const onlinePayments = async (req, res) => {
  console.log(
    "this is the req.session.userInfo details .....=",
    req.session.userInfo
  );
  try {
    const create_payment_json = {
            intent: "sale",
            payer: {
              payment_method: "paypal",
            },
            redirect_urls: {
              // Change made here: redirect_urls instead of redirect_url
              return_url: "http://localhost:8001/orderinfo",
              cancel_url: "http://localhost:8001/checkout",
            },
            transactions: [
              {
                // Change made here: transactions instead of transaction
                item_list: {
                  items: items,
                },
                amount: {
                  currency: "USD",
                  total: total,
                },
              },
            ],
          };
          paypal.payment.create(
            await create_payment_json,
            async function (error, payment) {
              if (error) {
                console.log(error);
              } else {
                req.session.paymentId = payment.id;
                for (let i = 0; i < payment.links.length; i++) {
                  if (payment.links[i].rel === "approval_url") {
                    res.redirect(payment.links[i].href);
                  }
                }
              }
            }
          );
    
  } catch (error) {}
};
