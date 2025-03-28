import passport from 'passport';

const passportAuth = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return res.status(401).send({
                    error: info && info.message ? info.message : "No autorizado"
                });
            }

            req.user = user;  // Aquí estamos asignando el usuario autenticado a req.user
            console.log("Usuario autenticado:", req.user);  // Verifica que req.user se esté asignando correctamente
            next();
        })(req, res, next);
    };
};

export default passportAuth;


