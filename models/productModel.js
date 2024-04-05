const mongoose= require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoryModel",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: Array,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  });

const productCollection= mongoose.model('products',productSchema)

module.exports= productCollection