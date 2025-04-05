import passport from "passport";
import jwt from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/users.model.js";
dotenv.config();

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;


 export const cookiesExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["cookieHouse"];
    }
    console.log("Token extraído de la cookie:", token); 
    return token;
};


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


export const verifyToken = (req, res, next) => {
    const token = cookiesExtractor(req);  

    if (!token) {
       
        return res.redirect("/dashboard");
    }

    
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect("/dashboard");  
        }
        req.user = user;  
        next(); 
    })(req, res, next);  
};


