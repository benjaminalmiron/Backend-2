import express from 'express';
import Cart from '../../daos/MONGO/models/cart.model.js';
import productsModel from '../../daos/MONGO/models/products.model.js';  
import passportAuth from '../../middlewares/passport.auth.js';  
import { verifyToken } from '../../middlewares/verifyToken.js';

const cartRouter = express.Router();


cartRouter.post('/add', verifyToken, passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    console.log('Cantidad recibida:', quantity);  

    try {
        
        let cart = await Cart.findOne({ user: userId });

        console.log("Carrito encontrado:", cart);

       
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
            await cart.save();
            console.log("Carrito creado:", cart);
        }

        
        const product = await productsModel.findById(productId);
        console.log('Producto encontrado:', product);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'No hay suficiente stock para este producto' });
        }

        
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        console.log("Índice del producto en el carrito:", productIndex);

        if (productIndex !== -1) {
            
            const newQuantity = cart.products[productIndex].quantity + parseInt(quantity, 10)
            if (product.stock < newQuantity) {
                return res.status(400).json({ error: 'La cantidad solicitada excede el stock disponible' });
            }
            cart.products[productIndex].quantity = newQuantity;
        } else {
           
            if (product.stock < quantity) {
                return res.status(400).json({ error: 'La cantidad solicitada excede el stock disponible' });
            }

            cart.products.push({ productId: product._id, quantity: parseInt(quantity, 10) });
        }
        await cart.save();
        console.log("Carrito guardado con el producto agregado:", cart);

        
        cart = await Cart.findById(cart._id).populate({
            path: 'products.productId',
            model: 'products2'  
        });

        console.log("Carrito con productos poblados:", cart);

       
        cart.products = cart.products.map(product => {
            console.log("Producto en carrito:", product);

            const productDetails = product.productId; 
            product.title = productDetails.title;
            product.price = productDetails.price;

           
            product.totalProductPrice = product.price * product.quantity;

            return product;
        });

      
        cart.totalAmount = cart.products.reduce((total, product) => {
            return total + (product.price * product.quantity); 
        }, 0);

        console.log("Total Amount calculado:", cart.totalAmount);

        
        await cart.save();

       
        console.log("Carrito final con productos y total:", cart);

        if (req.body.logout) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/cart/view');
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: 'Hubo un problema al agregar el producto al carrito' });
    }
});

cartRouter.get('/view', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;  

    try {
        
        const cart = await Cart.findOne({ user: userId }).populate('products.productId');

        if (!cart) {
            return res.status(404).send('No se encontró el carrito');
        }

        
        cart.products = cart.products.map(product => {
            const productDetails = product.productId; 
            product.title = productDetails.title;
            product.price = productDetails.price;
            product.totalProductPrice = productDetails.price * product.quantity; 

            return product;
        });

       
        cart.totalAmount = cart.products.reduce((total, product) => {
            return total + (product.price * product.quantity);  
        }, 0);

        
        res.render('carrito', { cart });

    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Hubo un problema al obtener el carrito");
    }
});


cartRouter.post('/update-quantity/:productId', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;  
    const { productId } = req.params;
    const { quantity } = req.body;  

    try {
        
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex !== -1) {
            
            cart.products[productIndex].quantity = parseInt(quantity, 10);
            await cart.save();

            
            cart = await Cart.findById(cart._id).populate('products.productId');

            
            cart.totalAmount = cart.products.reduce((total, product) => {
                return total + (product.productId.price * product.quantity);  
            }, 0);

            await cart.save();

            return res.json({ cart });
        } else {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
        res.status(500).json({ error: 'Hubo un problema al actualizar la cantidad del producto' });
    }
});


cartRouter.delete('/remove/:productId', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;  
    const { productId } = req.params;  
    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'No tienes un carrito' });
        }
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
        const productInCart = cart.products[productIndex];
        if (productInCart.quantity > 1) {
            productInCart.quantity -= 1;
        } else {
           
            cart.products.splice(productIndex, 1);
        }

        let newTotalAmount = cart.products.reduce((total, product) => {
            const price = product.productId.price;
            const quantity = product.quantity;
            if (typeof price !== 'number' || isNaN(price) || typeof quantity !== 'number' || isNaN(quantity)) {
                console.error("Precio o cantidad inválidos para el producto:", product.productId.title);
                return total;
            }

            return total + (price * quantity);
        }, 0);

       
        if (isNaN(newTotalAmount)) {
            console.error("Error: totalAmount calculado es NaN");
            return res.status(500).json({ error: 'Hubo un problema al calcular el total del carrito' });
        }

        cart.totalAmount = newTotalAmount;
        await cart.save();
        res.status(200).json({ message: 'Producto actualizado en el carrito', cart });

    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: 'Hubo un problema al actualizar el carrito' });
    }
});


export default cartRouter;
