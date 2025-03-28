import express from 'express';
import Cart from '../../daos/MONGO/models/cart.model.js';
import productsModel from '../../daos/MONGO/models/products.model.js';  // Asegúrate de tener el modelo de productos importado
import passportAuth from '../../middlewares/passport.auth.js';  // Si estás usando autenticación
import { verifyToken } from '../../middlewares/verifyToken.js';

const cartRouter = express.Router();


cartRouter.post('/add', verifyToken, passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    console.log('Cantidad recibida:', quantity);  // Verificar el valor de quantity en la solicitud

    try {
        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: userId });

        console.log("Carrito encontrado:", cart);

        // Si no existe un carrito, lo creamos
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
            await cart.save();
            console.log("Carrito creado:", cart);
        }

        // Buscar el producto en la base de datos
        const product = await productsModel.findById(productId);
        console.log('Producto encontrado:', product);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Buscar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        console.log("Índice del producto en el carrito:", productIndex);

        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, no lo volvemos a agregar
            // Solo actualizamos la cantidad si es necesario
            cart.products[productIndex].quantity = cart.products[productIndex].quantity + parseInt(quantity, 10); // Asegúrate de que sea un número
        } else {
            // Si no está en el carrito, lo agregamos con la cantidad correcta
            cart.products.push({ productId: product._id, quantity: parseInt(quantity, 10) });
        }

        // Guardar el carrito actualizado
        await cart.save();
        console.log("Carrito guardado con el producto agregado:", cart);

        // Realizar el populate para obtener los detalles del producto
        cart = await Cart.findById(cart._id).populate({
            path: 'products.productId',
            model: 'products2'  // Asegúrate de usar el nombre correcto del modelo
        });

        console.log("Carrito con productos poblados:", cart);

        // Ahora asegurémonos de que el precio y el nombre del producto estén correctamente asignados
        cart.products = cart.products.map(product => {
            console.log("Producto en carrito:", product);

            const productDetails = product.productId;  // Aquí tomamos el producto ya poblado
            product.title = productDetails.title;
            product.price = productDetails.price;

            // Calcular el precio total del producto en el carrito
            product.totalProductPrice = product.price * product.quantity;

            return product;
        });

        // Ahora calculamos el totalAmount del carrito
        cart.totalAmount = cart.products.reduce((total, product) => {
            return total + (product.price * product.quantity);  // Multiplicamos el precio por la cantidad
        }, 0);

        console.log("Total Amount calculado:", cart.totalAmount);

        // Guardar el carrito actualizado con el totalAmount
        await cart.save();

        // Log final para ver la estructura completa del carrito
        console.log("Carrito final con productos y total:", cart);

        // Renderizar la vista 'carrito' y pasar el carrito con los precios calculados
        
        res.redirect('/cart/view');
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: 'Hubo un problema al agregar el producto al carrito' });
    }
});










cartRouter.get('/view', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;  // Obtenemos el ID del usuario desde el JWT

    try {
        // Obtener el carrito del usuario y poblar los productos
        const cart = await Cart.findOne({ user: userId }).populate('products.productId');

        if (!cart) {
            return res.status(404).send('No se encontró el carrito');
        }

        // Calcular el precio total y otros detalles por producto
        cart.products = cart.products.map(product => {
            const productDetails = product.productId;  // Detalles del producto poblado
            product.title = productDetails.title;
            product.price = productDetails.price;
            product.totalProductPrice = productDetails.price * product.quantity;  // Total por producto

            return product;
        });

        // Calcular el totalAmount del carrito (el total de todos los productos en el carrito)
        cart.totalAmount = cart.products.reduce((total, product) => {
            return total + (product.price * product.quantity);  // Multiplicamos el precio por la cantidad
        }, 0);

        // Enviar el carrito actualizado con los detalles calculados a la vista
        res.render('carrito', { cart });

    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Hubo un problema al obtener el carrito");
    }
});


cartRouter.post('/update-quantity/:productId', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;  // Obtener el ID del usuario desde el JWT
    const { productId } = req.params;
    const { quantity } = req.body;  // La cantidad a la que se desea actualizar

    try {
        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Buscar el índice del producto en el carrito
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex !== -1) {
            // Si el producto existe en el carrito, actualizar la cantidad
            cart.products[productIndex].quantity = parseInt(quantity, 10); // Asegúrate de que sea un número
            await cart.save();

            // Volver a hacer el populate para obtener los detalles actualizados del carrito
            cart = await Cart.findById(cart._id).populate('products.productId');

            // Calcular el totalAmount del carrito
            cart.totalAmount = cart.products.reduce((total, product) => {
                return total + (product.productId.price * product.quantity);  // Multiplicamos el precio por la cantidad
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




// cartRouter.delete - Eliminar un producto del carrito o reducir su cantidad
cartRouter.delete('/remove/:productId', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;  // Obtener el ID del usuario desde el token JWT
    const { productId } = req.params;  // Obtener el ID del producto desde la URL

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'No tienes un carrito' });
        }

        // Buscar el índice del producto que se quiere eliminar o disminuir su cantidad
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Obtener el producto en el carrito
        const productInCart = cart.products[productIndex];

        // Si la cantidad es mayor que 1, disminuimos la cantidad en 1
        if (productInCart.quantity > 1) {
            productInCart.quantity -= 1;
        } else {
            // Si la cantidad es 1, eliminamos el producto del carrito
            cart.products.splice(productIndex, 1);
        }

        // Recalcular el totalAmount
        let newTotalAmount = cart.products.reduce((total, product) => {
            const price = product.productId.price;
            const quantity = product.quantity;

            // Verificar que el precio y la cantidad sean válidos
            if (typeof price !== 'number' || isNaN(price) || typeof quantity !== 'number' || isNaN(quantity)) {
                console.error("Precio o cantidad inválidos para el producto:", product.productId.title);
                return total;
            }

            // Sumamos el total basado en el precio y la cantidad
            return total + (price * quantity);
        }, 0);

        // Verificar que el totalAmount calculado sea un número válido
        if (isNaN(newTotalAmount)) {
            console.error("Error: totalAmount calculado es NaN");
            return res.status(500).json({ error: 'Hubo un problema al calcular el total del carrito' });
        }

        // Asignar el nuevo totalAmount calculado
        cart.totalAmount = newTotalAmount;

        // Guardar el carrito actualizado
        await cart.save();

        // Devolver el carrito actualizado
        res.status(200).json({ message: 'Producto actualizado en el carrito', cart });

    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: 'Hubo un problema al actualizar el carrito' });
    }
});











export default cartRouter;
