import e, { Router } from "express";
import User from "../../models/users.model.js";
import { hash, isValidPassword } from "../../utils/hash.js";
import generateToken, { createToken } from "../../utils/Token.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import passport from "passport";
import passportAuth from "../../middlewares/passport.auth.js";
import authorization from "../../middlewares/authorization.middleware.js";
const sessionsRouter = Router(); 




sessionsRouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).send("Faltan campos por llenar");
    }
    if (!isNaN(username)) {
        return res.status(400).send("El nombre de usuario no puede ser solo un número");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("El correo electrónico debe ser de tipo @gmail.com");
    }

    if (password.length <= 4) {
        return res.status(400).send("La contraseña debe tener más de 4 caracteres");
    }
    const userFound = await User.findOne({ email });
    if (userFound) {
        return res.status(401).send("El usuario ya existe");
    }
    const newUser = { username, email, password: await hash(password) };
    const result = await User.create(newUser);
    res.status(201).send(result);
});



sessionsRouter.post("/login", async (req, res) => {
    console.log("Solicitud de login recibida:", req.body);
    const { email, password } = req.body;   
    if (!email || !password) {
        return res.status(400).send("Faltan campos por llenar");
    }
    const userFound = await User.findOne({ email });
    if (!userFound) {
        return res.status(401).send({status: "error", error: "Usuario no encontrado o credenciales incorrectas"});
    }
    if (!isValidPassword(password, userFound.password)) {
        return res.status(401).send({status: "error", error: "Contraseña incorrecta"});
    }

    const token = createToken({
        id: userFound._id,
        email: userFound.email,
        role: userFound.role
    });

    res.cookie("cookieHouse", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        samesite: "None",
        secure: true,
        httpOnly: true
    }).send({status: "ok", message: "Usuario logueado correctamente"});
    
});

sessionsRouter.get("/login", (req, res) => {
    
    res.render("login"); 
});
sessionsRouter.get("/register", (req, res) => {
    
    res.render("register");  
});

sessionsRouter.get("/current", passportAuth("jwt"), authorization("admin"), (req, res) => {
    if (!req.user) {
        return res.status(401).send({ error: "No autorizado" });
    }
    console.log("Usuario autenticado:", req.user);
    res.send({ Usuario: "autenticado", payload: req.user });
});

export default sessionsRouter;