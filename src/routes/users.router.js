import { Router } from "express";
const router= Router();
import { uploader } from "../utils.js";
import { changeRoleIfFilesExist } from "../controllers/user.controller.js";

router.get("/premium/:uid" , changeRoleIfFilesExist);


// Usando Multer
router.post("/:uid/documents", uploader.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'documents', maxCount: 1 },
    { name: 'products', maxCount: 1 },
]), (request, response) => {
    if (!request.files) {
        return response.status(400).send({ status: "error", mensaje: "No se adjunto archivo." });
    }else{
        response.send({ status: "Success", message: "Archivo agregado con exito" });
    }
});





export default router;