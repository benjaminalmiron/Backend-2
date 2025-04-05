import passport from "passport";
import { cookiesExtractor } from "../config/passport.config.js";  

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

