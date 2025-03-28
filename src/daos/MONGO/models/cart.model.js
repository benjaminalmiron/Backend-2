import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Relacionamos con el usuario
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'products2', required: true },  // Relacionamos con el producto
            quantity: { type: Number, required: true, default: 1 }  // Cantidad del producto en el carrito
        }
    ],
    totalAmount: { type: Number, default: 0 },  // Total del carrito
    createdAt: { type: Date, default: Date.now }  // Fecha de creación
});

const Cart = model('Cart', cartSchema);

export default Cart;

