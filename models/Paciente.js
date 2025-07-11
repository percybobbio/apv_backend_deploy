import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema({
    nombreMascota:{
        type: String,
        required: true,
    },
    nombrePropietario:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas:{
        type: String,
        required: true
    },
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario",
    },
},
    {
        timestamps: true,
    }
);

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;