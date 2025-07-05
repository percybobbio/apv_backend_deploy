import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import cors from 'cors';

const app = express();

//Se usa para indicar que express usara formato json
app.use(express.json());

//con este comando va a buscar el archivo .env automaticamente
dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

//Se usa para permitir el acceso a la api desde el frontend
const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen del request esta permitido
            callback(null, true);
        } else{
            //El origen del request no esta permitido
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

//De esta forma se asigna el puerto que se usara en el deployment caso contrario usa el 4000
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
});


