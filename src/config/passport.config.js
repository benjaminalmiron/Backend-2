import passport from "passport";
import jwt from "passport-jwt";
import { secretKey } from "../utils/Token.js";
import  User  from "../models/users.model.js";

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

export const inicializarPassport = () => {
    

    const cookiesExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["cookieHouse"];
    }
    console.log("Token extraído de la cookie:", token); 
    return token;
};

    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookiesExtractor]),
        secretOrKey: secretKey
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
    
    
}

