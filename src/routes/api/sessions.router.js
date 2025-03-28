import e, { Router } from "express";

import passportAuth from "../../middlewares/passport.auth.js";
import authorization from "../../middlewares/authorization.middleware.js";
import SessionsController from "../../controllers/sessions.controller.js";

const sessionsRouter = Router(); 
const {login, register, logout } = new SessionsController()



sessionsRouter.post("/register", register );

sessionsRouter.post('/logout', logout);

sessionsRouter.post("/login", login );

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
    const { username, email, role } = req.user;
    res.send({
        Usuario: "autenticado",
        username,
        email,
        role
    });
});

export default sessionsRouter;
