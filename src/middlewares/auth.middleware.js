import jsw from 'jsonwebtoken';
import { secretKey } from '../utils/Token.js';

 const authMiddleware = (req, res, next) => { 
    const auth = req.headers["authorization"];
    const token = auth.split(" ")[1];
   /*  if (!auth) {
        return res.status(401).send("No estas autorizado");
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send("No estas autorizado");
    } */
    jsw.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send("No estas autorizado")}
            console.log(decoded)
        req.user = decoded;
        next();
    });
}

export default authMiddleware;