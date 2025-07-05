import express from "express";
import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        console.log("Si tiene token");
        // Si el token existe, lo guardamos en la variable token
    try {
        //Al usar split, busca el espacio y lo divide en dos partes, la primera es la palabra (Bearer) y la segunda es el token en sí, por lo que guarda un array por ello se solicita el [1]
        token = req.headers.authorization.split(" ")[1]; // Bearer token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token usando la clave secreta
        // Busca el veterinario en la base de datos usando el id del token y excluye los campos password, token y confirmado con select
        // con req.veterinario se guarda en una sesion con la informacion del veterinario
        req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); 
        return next();        
    } catch (error) {
        const e = new Error("Token no valido");
        return res.status(403).json({ msg: e.message });
        }
    }

    if (!token) {
        const error = new Error("Token inexistente");
        return res.status(403).json({ msg: error.message });
    }

    next(); // Si todo sale bien, se llama a la siguiente función middleware
    
};

export default checkAuth;