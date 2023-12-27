import { Router } from "express";
const router= Router();
import { uploader } from "../utils.js";
import { changeRoleIfFilesExist } from "../controllers/user.controller.js";
import userModel from "../services/dao/db/models/user.js";

let User = userModel;
// Ejemplo de cómo obtener el userId en el servidor
router.get('/userId', async(request, response) =>{
    
    if (request.session && request.session.user && request.session.user.cart) {
        const userId = request.session.user.cart;
        response.json({ userId }); // Devolver el userId al cliente
    } else {
        const userEmail = request.session.user.email;
        try {
            const user = await User.findOne({ email: userEmail }); // Busca el usuario por su correo electrónico
            if (user) {
                const userId = user._id; // Obtiene el _id del usuario encontrado en la base de datos
                response.json({ userId }); // Devuelve el userId al cliente
            } else {
                response.status(404).send('Usuario no encontrado');
            }
        } catch (error) {
            response.status(500).send('Error al buscar el usuario en la base de datos');
        }
    }
});

router.get("/premium/:uid" , changeRoleIfFilesExist);

router.post(`/:uid/documents`, uploader.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'documents', maxCount: 1 },
    { name: 'products', maxCount: 1 },
]), (request, response) => {
    const uploadedFiles = request.files;
    const numberOfUploadedFiles = Object.keys(uploadedFiles).length;

    if (numberOfUploadedFiles !== 3) {
        return response.status(400).send({ status: "error", message: "Debes adjuntar exactamente 3 archivos." });
    } else {
        response.send({ status: "Success", message: "Archivos agregados con éxito" });
    }
});







export default router;