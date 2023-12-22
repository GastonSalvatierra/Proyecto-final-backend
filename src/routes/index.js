// Importa los distintos routers
import { Router } from 'express';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import recuperoRouter from './recupero.router.js';
import sessionRouter from './session.router.js';
import githubLoginViewRouter from './github-login.views.router.js';
import viewsRouter from './views.router.js';
import mockRouter from './mock.router.js';
import loggerTestRouter from './loggerTest.router.js';
import emailRouter from './emails.router.js';
import usersRouter from './users.router.js';

// Crea un nuevo Router de Express
const router = Router();

// Usa los routers importados
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/recupero", recuperoRouter);
router.use("/api/session", sessionRouter);
router.use("/github", githubLoginViewRouter);
router.use("/", viewsRouter);
router.use("/mokingproducts", mockRouter);
router.use("/loggerTest", loggerTestRouter);
router.use("/api/email", emailRouter);
router.use("/api/users", usersRouter);

// Exporta el router unificado
export default router;
