import passport from 'passport';

const passportAuth = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function(error, user, info) {
            if (error) return next(error);  // Si hay un error en la autenticación
            if (!user) {
                // Si no se encuentra al usuario, respondemos con un error 401
                return res.status(401).send({
                    error: info && info.message ? info.message : "No autorizado"
                });
            }
            req.user = user;  // Si el usuario es válido, lo asignamos a la petición
            next();  // Continuamos con la siguiente función de middleware
        })(req, res, next);  // Llamamos al método `authenticate` de Passport
    };
};

export default passportAuth;
