import express from 'express';
import { conectDB, configObject } from './config/index.js';
import sessionsRouter from './routes/api/sessions.router.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import rootDir from "./dirname.js"
import { engine } from 'express-handlebars';
import passport from 'passport';
import { inicializarPassport } from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/api/usersParams.router.js';



dotenv.config();

const app = express();
const PORT = configObject.port;

app.engine("handlebars", engine({ defaultLayout: false }));  // Deshabilitar el layout por defecto
app.set("view engine", "handlebars");
app.set("views", path.join(rootDir, "src", "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
inicializarPassport();
app.use(passport.initialize());
app.use(cookieParser());

const URIMongoDB = process.env.URIMONGO;

if (!URIMongoDB) {
    console.error('URIMONGO no está definida en el archivo .env');
    process.exit(1);
}

mongoose.connect(URIMongoDB)
    .then(() => console.log("Conexión a base de datos exitosa"))
    .catch((error) => {
        console.error("Error en conexión: ", error);
        process.exit();
    });

app.get("/", (req, res) => {
    res.render("login")
});

app.use("/api/sessions", sessionsRouter);
const userRouterInstance = new userRouter();
app.use("/api/users", userRouterInstance.returnRouter());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
