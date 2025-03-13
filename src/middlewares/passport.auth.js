import passport from 'passport';

const passportAuth = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function(error, user, info) {
            if (error) return next(error);  
            if (!user) {
                
                return res.status(401).send({
                    error: info && info.message ? info.message : "No autorizado"
                });
            }
            req.user = user;  
            next();  
        })(req, res, next);  
    };
};

export default passportAuth;
