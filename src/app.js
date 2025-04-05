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
import ticketRouter from './routes/api/ticket.router.js';
import emailRouter from './routes/api/mails.router.js';

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
        const numA = Number(a);
        const numB = Number(b);
        if (isNaN(numA) || isNaN(numB)) {
          return 0;
        }
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
    cookie: { secure: false } 
}));
app.use(flash());

const URIMongoDB = process.env.URIMONGO;

if (!URIMongoDB) {
    console.error('URIMONGO no está definida en el archivo .env');
    process.exit(1);
}

conectDB();


app.get("/", async (req, res) => {
    try {
        const products = await productsModel.find();
        const user = req.user || null; 
        res.render("products", {
            products: products,
            user: user, 
        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Hubo un error al obtener los productos.");
    }
});

     app.get("/dashboard", async (req, res) => {
        console.log("Ruta / recibida");
        const isLoggedIn = req.cookies.cookieHouse ? true : false;
        if (isLoggedIn) {
            console.log("Usuario logueado, redirigiendo a /dashboard");
            return res.redirect("/dashboard");
        }
        const flashMessage = req.flash('success_msg');  
        res.render("login", { success_msg: flashMessage });
    }); 
    
app.get('/cart', passportAuth('jwt'), async (req, res) => {
    const userId = req.user._id; 
    try {
       
        const cart = await Cart.findOne({ user: userId }).populate('products.productId');
        console.log("Carrito con productos poblados:", cart); 
        res.render('carrito', { cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error al obtener el carrito");
    }
});

app.use('/api', ticketRouter);     
app.use('/cart', cartRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
const userRouterInstance = new userRouter();

app.use("/api/users", usersRouter);
app.use("/api", emailRouter)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
