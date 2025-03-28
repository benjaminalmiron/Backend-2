const authorization = role => { 
    return async (req, res, next) => {
        console.log("req.user:", req.user);  // Agrega un log aquí para ver qué hay en req.user

        if (!req.user) {
            return res.status(401).send("No autorizado");
        }
        if (req.user.role !== role) {
            return res.status(401).send("No tenes permisos");
        }
        next();
    }
}

export default authorization;
