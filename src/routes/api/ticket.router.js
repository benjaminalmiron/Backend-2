
import express from 'express';
import Ticket from '../../daos/MONGO/models/ticket.model.js'; // Asegúrate de que el modelo de Ticket esté bien importado
import Cart from '../../daos/MONGO/models/cart.model.js'; // Importa el modelo de Cart si lo necesitas
import { verifyToken } from '../../middlewares/verifyToken.js'; // Verifica que el usuario esté autenticado

const ticketRouter = express.Router();

ticketRouter.get('/checkout/success/:ticketCode', async (req, res) => {
    const { ticketCode } = req.params;

    try {
        const ticket = await Ticket.findOne({ code: ticketCode });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado.' });
        }
        res.render('checkout', { ticket });

    } catch (error) {
        console.error('Error al mostrar el ticket:', error);
        res.status(500).json({ message: 'Hubo un error al mostrar tu ticket.' });
    }
});



ticketRouter.post('/checkout', verifyToken, async (req, res) => {
    const { purchaser } = req.body; 

    const cart = await Cart.findOne({ user: req.user._id }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: 'Tu carrito está vacío.' });
    }

    
    const totalAmount = cart.products.reduce((total, product) => {
        if (!product.productId || !product.productId.price || isNaN(product.productId.price) || isNaN(product.quantity)) {
            console.error('Producto inválido:', product);
            return total;  
        }

        return total + (product.productId.price * product.quantity);  
    }, 0);

   
    if (isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ message: 'El monto de la compra es inválido.' });
    }

    try {
       
        const newTicket = new Ticket({
            amount: totalAmount, 
            purchaser,
        });

       
        await newTicket.save();

        
        await Cart.updateOne(
            { user: req.user._id },
            { $set: { products: [] } }  
        );
        res.redirect(`/api/checkout/success/${newTicket.code}`);

    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ message: 'Hubo un error al procesar tu compra.' });
    }
});




export default ticketRouter