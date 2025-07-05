import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/GenerarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

const registrar =  async (req , res) => {
    const {email, nombre} = req.body;  

    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email: email});

    if (existeUsuario) {
        const error = new Error("Usuario registrado");
        return res.status(400).json({msg: error.message});
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar el email de confirmacion
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });
        res.json({veterinarioGuardado, msg : "Registrando Usuario"});
    } catch (error) {
        console.log(error);
        
    }
    
};

const perfil = (req, res) => {
    const { veterinario } = req; //Destructurando el veterinario que viene del middleware
    res.json({perfil: veterinario}); //Se envia el veterinario al frontend
};

const confirmar = async (req, res) => {
    //Para leer los parametros en node.js recordar usar params
    const {token} = req.params;

    //Se agrega await en lo que busca el usuario
    const usuarioConfirmar = await Veterinario.findOne({token: token});
    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }
    
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente"});
    } catch (error) {
        console.log(error);
        
    }
    
    
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;
    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email: email});
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message});
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    //Revisar el password
    if(await usuario.comprobarPassword(password)){        
        //Autenticacion correcta
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            web: usuario.web,
            telefono: usuario.telefono,
            token: generarJWT(usuario._id)
        });
        }
        else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
        
    }
};

const olvidePassword = async (req, res) => {
    const {email} = req.body;
    const existeVeterinario = await Veterinario.findOne({email: email});
    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    try {
        //El token se genera para asegurar que el usuario tiene acceso a la cuenta
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        //Enviar email con instrucciones
        emailOlvidePassword({
            email: email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });
        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
        
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const tokenValido = await Veterinario.findOne({token: token});
    if(tokenValido){
        //El token es valido el usuario existe
        res.json({msg: "Token valido y el usuario existe"});
    }else{
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message});

    }
    
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token: token});
    if(!veterinario){
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.password = password;
        veterinario.token = null;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"});
    } catch (error) {
        console.log(error); 
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error("Veterinario no encontrado");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;
        if(veterinario.email !== req.body.email){
            //Comprobar si el email ya esta registrado
            const existeEmail = await Veterinario.findOne({email: req.body.email});
            if(existeEmail){
                const error = new Error("El email ya esta en uso");
                return res.status(400).json({msg: error.message});
            }
            veterinario.email = req.body.email;
        }
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error);   
    }    
}

const actualizarPassword = async (req, res) => {
    //Leer los datos
    const {id} = req.veterinario; //Destructurando el id del veterinario que viene del middleware
    const {pwdActual, pwdNuevo} = req.body; //Destructurando el password actual y el nuevo password

    //Comprobar si el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error("Veterinario no encontrado");
        return res.status(400).json({msg: error.message});
    }

    //Comprobar si el password actual es correcto
    if(await veterinario.comprobarPassword(pwdActual)){
        //Asignar el nuevo password
        veterinario.password = pwdNuevo;
        await veterinario.save();
        res.json({msg: "Password actualizado correctamente"});        
    }else{
        const error = new Error("El password actual es incorrecto");
        return res.status(400).json({msg: error.message});
        
    }

    //Asignar el nuevo password
    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}