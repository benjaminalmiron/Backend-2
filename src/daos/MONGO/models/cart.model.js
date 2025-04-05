import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'products2', required: true },  
            quantity: { type: Number, required: true, default: 1 } 
        }
    ],
    totalAmount: { type: Number, default: 0 },  
    createdAt: { type: Date, default: Date.now }  
});

const Cart = model('Cart', cartSchema);

export default Cart;

