import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const secretKey = process.env.SECRET_KEY;
console.log('SECRET_KEY:', process.env.SECRET_KEY);

if (!secretKey) {
    throw new Error('La clave secreta (secretKey) no está definida en las variables de entorno.');
}

export const createToken = (payload) => 
    jwt.sign(payload, secretKey, { expiresIn: '1d' });

export const verifyToken = (token) => jwt.verify(token, secretKey);
export const decodeToken = (token) => jwt.decode(token, { complete: true });

export default jwt;


