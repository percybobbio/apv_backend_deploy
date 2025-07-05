import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

//la funcion .Schema() se usa para definir un objeto con la estructura que tendran los datos del modelo
//No se requiere asignar id lo hace automaticamente

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true
    },
    web:{
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarId()
    },
    confirmado:{
        type: Boolean,
        default: false
    }
});

//Esta funcion es un middleware de mongoose
veterinarioSchema.pre('save', async function(next) {
    //Esta linea es para que si el password ya esta con hash no lo vuelva hacer
    if(!this.isModified("password")){
        //Esto se usa para que se ejecute el siguiente middleware para que no vuelva a ejecutar el codigo
        next();
    };
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

//Con methods se pueden agregar funciones que se registren solo en el modelo
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario;