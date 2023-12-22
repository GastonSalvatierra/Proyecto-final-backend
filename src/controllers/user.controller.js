import fs from 'fs';
import path from 'path';
import userModel from '../services/dao/db/models/user.js';
import __dirname from '../utils.js';

const checkFileExists = (directory) => {
    const files = fs.readdirSync(directory);
    return files.length > 0;
};

// Función para cambiar el rol en la base de datos
export const changeRoleIfFilesExist = async (request, response) => {
    const profileDirectory = path.join(__dirname, '/public/img/profile');
    const documentsDirectory = path.join(__dirname, '/public/img/documents');
    const productsDirectory = path.join(__dirname, '/public/img/products');
    
    
    const profileFilesExist = checkFileExists(profileDirectory);
    const documentsFilesExist = checkFileExists(documentsDirectory);
    const productsFilesExist = checkFileExists(productsDirectory);
    
    if (profileFilesExist && documentsFilesExist && productsFilesExist) {
        try {
            // Obtener el usuario de la base de datos (suponiendo que tienes el ID del usuario en la solicitud)
            const userId = request.params.uid; // Suponiendo que el ID del usuario está en los parámetros de la solicitud
            const user = await userModel.findById(userId);

            if (!user) {
                return response.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }

            // Cambiar el rol del usuario
            user.role = 'premium';

            // Guardar los cambios en la base de datos
            await user.save();

            return response.send({ status: 'success', message: 'Rol del usuario cambiado con éxito' });
        } catch (error) {
            return response.status(500).send({ status: 'error', message: 'Error al cambiar el rol del usuario' });
        }
    } else {
        return response.send({ status: 'info', message: 'Faltan archivos en las carpetas para ser premium!' });
    }
};
