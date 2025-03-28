import passport from "passport";
import jwt from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/users.model.js";
dotenv.config();

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

// Extracción del token desde las cookies
 export const cookiesExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["cookieHouse"];
    }
    console.log("Token extraído de la cookie:", token); 
    return token;
};

// Inicializar Passport
export const inicializarPassport = () => {
    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookiesExtractor]),
        secretOrKey: process.env.SECRET_KEY
    }, async (dataToken, done) => {
        try {
            console.log("Datos del token:", dataToken);  
            const user = await User.findById(dataToken.id);
            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" });
            }
            return done(null, user);
        } catch (error) {
            console.error("Error en la estrategia de passport:", error);
            return done(error, false);
        }
    }));
};

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
    const token = cookiesExtractor(req);  // Extraemos el token de las cookies

    if (!token) {
        // Si no hay token, redirigir al usuario al dashboard (login)
        return res.redirect("/dashboard");
    }

    // Si el token está presente, continuar con el siguiente middleware (passport.authenticate)
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect("/dashboard");  // Si hay error en la autenticación, redirige al dashboard
        }
        req.user = user;  // Asignamos el usuario al request
        next();  // Llamamos al siguiente middleware
    })(req, res, next);  // Llamada explícita al middleware de Passport
};


