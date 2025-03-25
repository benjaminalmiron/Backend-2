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



dotenv.config();



const app = express();
const PORT = configObject.port;
const staticDir = path.join(__dirname,  'public');
app.use(express.static(staticDir));
console.log('Archivos estáticos sirven desde:', staticDir);




app.engine("handlebars", engine({ defaultLayout: false }));  // Deshabilitar el layout por defecto
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
inicializarPassport();
app.use(passport.initialize());
app.use(cookieParser());



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



    app.get("/", (req, res) => {
        console.log("Ruta / recibida");
    
        // Verificar si la cookie 'cookieHouse' existe (indicando que el usuario está logueado)
        const isLoggedIn = req.cookies.cookieHouse ? true : false;
        console.log("Estado de login (cookieHouse): ", isLoggedIn);
    
        if (isLoggedIn) {
            // Si está logueado, redirigir a la página de inicio
            console.log("Usuario logueado, redirigiendo a /dashboard");
            return res.redirect("/dashboard");
        }
    
        // Pasar el mensaje flash a la vista de login
        const flashMessage = req.flash('success_msg');  // Recuperar mensaje flash
        console.log("Mensaje flash para mostrar: ", flashMessage);
    
        // Si no está logueado, renderizar el formulario de login
        console.log("Renderizando login");
        res.render("login", { success_msg: flashMessage });
    });
    
    
    

    app.get("/dashboard", (req, res) => {
        // Verifica si el usuario está logueado mediante la cookie
        const isLoggedIn = req.cookies.cookieHouse ? true : false;
    
        // Si el usuario no está logueado, redirige al login
        if (!isLoggedIn) {
            return res.redirect("/");  // Redirige al login si no está autenticado
        }
    
        // Si está logueado, renderiza el dashboard
        res.render("dashboard", { isLoggedIn: true });
    });
    

app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);
const userRouterInstance = new userRouter();
/* app.use("/api/users", userRouterInstance.returnRouter()); */
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
