import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import multer from 'multer';



export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
//console.log(`datos a validar: user-password : ${user.password}, password ${password} `);
return bcrypt.compareSync(password, user.password)
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Configuración MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';

        if (file.fieldname === 'profile') {
            uploadPath = 'profile/';
        } else if (file.fieldname === 'products') {
            uploadPath = 'products/';
        } else if (file.fieldname === 'documents') {
            uploadPath = 'documents/';
        }

        cb(null, `${__dirname}/public/img/${uploadPath}`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const uploader = multer({
    storage,
    onError: function (err, next) {
        console.log(err);
        next();
    }
});



export default __dirname;