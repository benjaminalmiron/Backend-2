import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
});

const productsModel = model("products2", productSchema);


export default productsModel;