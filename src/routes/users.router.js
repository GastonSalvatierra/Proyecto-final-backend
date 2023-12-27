import { Router } from "express";
const router= Router();
import { uploader } from "../utils.js";
import { changeRoleIfFilesExist } from "../controllers/user.controller.js";

// Ejemplo de cómo obtener el userId en el servidor
router.get('/userId', (request, response) => {
    const session = request.session;
    
    if (session && session.user && session.user.cart) {
        const userId = session.user.cart;
        response.json({ userId }); // Devolver el userId al cliente
    } else {
        response.status(403).send('Usuario no autenticado');
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