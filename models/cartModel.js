const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "collection" },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "productCollection",
    },
    productQuantity: { type: Number, required: true, default: 1, min: 1 },
    totalCostPerProduct: { type: Number },
  },
  { strictPopulate: false }
);

const cartCollection = mongoose.model("carts", cartSchema);

module.exports = cartCollection;