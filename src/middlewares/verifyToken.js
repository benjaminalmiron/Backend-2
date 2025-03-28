import passport from "passport";
import { cookiesExtractor } from "../config/passport.config.js";  // Asumiendo que esta función está definida allí

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
    const token = cookiesExtractor(req);  // Extraemos el token de las cookies

    if (!token) {
        // Si no hay token, redirigir al usuario al dashboard (login)
        return res.redirect("/dashboard");  // Redirige al usuario a la página de inicio de sesión
    }

    // Si el token está presente, proceder con la autenticación usando Passport
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect("/dashboard");  // Si el token no es válido, redirigir al login
        }
        req.user = user;  // Asignamos el usuario al request
        next();  // Llamamos al siguiente middleware (la ruta o acción que el usuario intentaba realizar)
    })(req, res, next);  // Llamada explícita al middleware de Passport
};

