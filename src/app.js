import express from 'express';
import { conectDB, configObject } from './config/index.js';
import sessionsRouter from './routes/api/sessions.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import __dirname from "./dirname.js"
import { engine } from 'express-handlebars';
import passport from 'passport';
import { inicializarPassport } from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/api/usersParams.router.js';
import session from 'express-session';
import flash from 'connect-flash';
import usersRouter from './routes/api/users.router.js';
import productsRouter from './routes/products.router.js';
import cors from 'cors';
import productsModel from './daos/MONGO/models/products.model.js';
import passportAuth from './middlewares/passport.auth.js';
import Cart from "./daos/MONGO/models/cart.model.js"
import cartRouter from './routes/api/carts.router.js';
import methodOverride from 'method-override'


dotenv.config();



const app = express();
const PORT = configObject.port;
const staticDir = path.join(__dirname,  'public');
app.use(express.static(staticDir));
console.log('Archivos estáticos sirven desde:', staticDir);
app.use(methodOverride('_method'))



app.engine('handlebars', engine({
    helpers: {
      multiply: function(a, b) {
        // Asegurarse de que ambos valores son números antes de multiplicar
        const numA = Number(a);
        const numB = Number(b);
  
        // Si no son números, devolver 0
        if (isNaN(numA) || isNaN(numB)) {
          return 0;
        }
  
        // Realiza la multiplicación
        return numA * numB;
      }
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }
  }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
inicializarPassport();
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors());


app.use(session({
    secret: 'mi-secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Cambia a true si usas HTTPS
}));
app.use(flash());


const URIMongoDB = process.env.URIMONGO;

if (!URIMongoDB) {
    console.error('URIMONGO no está definida en el archivo .env');
    process.exit(1);
}

/* mongoose.connect(URIMongoDB)
    .then(() => console.log("Conexión a base de datos exitosa"))
    .catch((error) => {
        console.error("Error en conexión: ", error);
        process.exit();
    }); */

conectDB();



// En tu ruta de productos, asegúrate de pasar el usuario a la vista
app.get("/", async (req, res) => {
    try {
        const products = await productsModel.find();
        const user = req.user || null;  // Pasar el usuario (si está autenticado)

        res.render("products", {
            products: products,
            user: user,  // Asegúrate de pasar el usuario a la vista
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Hubo un error al obtener los productos.");
    }
});


    
    
    
    
    

     app.get("/dashboard", async (req, res) => {
        console.log("Ruta / recibida");
    
        // Verificar si la cookie 'cookieHouse' existe (indicando que el usuario está logueado)
        const isLoggedIn = req.cookies.cookieHouse ? true : false;
        /* console.log("Estado de login (cookieHouse): ", isLoggedIn); */
    
        if (isLoggedIn) {
            // Si está logueado, redirigir a la página de inicio
            console.log("Usuario logueado, redirigiendo a /dashboard");
            return res.redirect("/dashboard");
        }
    
        // Pasar el mensaje flash a la vista de login
        const flashMessage = req.flash('success_msg');  // Recuperar mensaje flash
        /* console.log("Mensaje flash para mostrar: ", flashMessage); */
    
        // Si no está logueado, renderizar el formulario de login
        /* console.log("Renderizando login"); */
        res.render("login", { success_msg: flashMessage });
    }); 
    
   

// Ruta para mostrar el carrito
app.get('/cart', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id;  // Usamos el user ID del usuario autenticado
    try {
        // Buscar el carrito y poblar los productos
        const cart = await Cart.findOne({ user: userId }).populate('products.productId');
        
        console.log("Carrito con productos poblados:", cart);  // Verificar si el carrito tiene los productos correctamente poblados

        // Renderizar la vista carrito.handlebars
        res.render('carrito', { cart });

    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error al obtener el carrito");
    }
});


    
app.use('/cart', cartRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
const userRouterInstance = new userRouter();
/* app.use("/api/users", userRouterInstance.returnRouter()); */
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
