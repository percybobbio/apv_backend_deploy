import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id; //Se agrega el veterinario al paciente
    try {
        const pacienteAlmacenado = await paciente.save(); //Se guarda el paciente en la base de datos
        res.json(pacienteAlmacenado); //Se envia el paciente al frontend
        
    } catch (error) {
        console.log(error);
    }   
    
}
const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario); //Se busca el paciente por el veterinario
    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const {id} = req.params; //Se obtiene el id del paciente
    const paciente = await Paciente.findById(id); //Se busca el paciente por el id
    
    if(!paciente){
        return res.status(404).json({msg: 'Paciente no encontrado'}); //Si el paciente no existe, se envia un mensaje de error
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no valida'}); //Si el paciente no pertenece al veterinario, se envia un mensaje de error
    }
    
    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
    const {id} = req.params; //Se obtiene el id del paciente
    const paciente = await Paciente.findById(id); //Se busca el paciente por el id
    
    if(!paciente){
        return res.status(404).json({msg: 'Paciente no encontrado'}); //Si el paciente no existe, se envia un mensaje de error
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no valida'}); //Si el paciente no pertenece al veterinario, se envia un mensaje de error
    }

    //Actualizar paciente
    paciente.nombreMascota = req.body.nombreMascota || paciente.nombreMascota; //Se actualiza el nombre del paciente;
    paciente.nombrePropietario = req.body.nombrePropietario || paciente.nombrePropietario; //Se actualiza el propietario del paciente;
    paciente.email = req.body.email || paciente.email; //Se actualiza el email del paciente;
    paciente.fecha = req.body.fecha || paciente.fecha; //Se actualiza la fecha del paciente;
    paciente.sintomas = req.body.sintomas || paciente.sintomas; //Se actualiza los sintomas del paciente;

    try {
        const pacienteActualizado = await paciente.save(); //Se guarda el paciente en la base de datos
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente = async (req, res) => {
    const {id} = req.params; //Se obtiene el id del paciente
    const paciente = await Paciente.findById(id); //Se busca el paciente por el id
    
    if(!paciente){
        return res.status(404).json({msg: 'Paciente no encontrado'}); //Si el paciente no existe, se envia un mensaje de error
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no valida'}); //Si el paciente no pertenece al veterinario, se envia un mensaje de error
    }

    try {
        await paciente.deleteOne(); //Se elimina el paciente de la base de datos
        res.json({msg: 'Paciente eliminado'}); //Se envia un mensaje de exito
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};