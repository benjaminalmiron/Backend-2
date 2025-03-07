import jwt from 'jsonwebtoken';

export const secretKey= "fjkhgshgsld"

export const createToken = payload => 
     jwt.sign(payload, secretKey, {expiresIn: '1d'});


export const verifyToken = token => jwt.verify(token, secretKey);
export const decodeToken = token => jwt.decode(token, {complete: true});

export default jwt;



