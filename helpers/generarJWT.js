import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    // Implementación pendiente
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export default generarJWT;