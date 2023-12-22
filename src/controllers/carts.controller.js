import {cartService} from '../services/factory.js'
import { devLogger } from '../config/logger_BASE.js';
import productsModel from '../services/dao/db/models/products.js';
import { emailPurchase } from './mailing.controller.js';



export const getCart = async (req, res) => {
    try {
        let carts = await cartService.getAll();
        req.logger = devLogger;
        req.logger.info('exito en getCart');
        res.send(carts);
    } catch (error) {
        req.logger.error('Esto es un error en getCart');
        res.status(500).send({error:  error, message: "No se pudo obtener el carrito."});
    }
}





export const getCartId = async (req, res) => {
    try {
        let cartId = req.params.cid;
        req.logger = devLogger;

        if (!cartId) {
            return res.status(400).send({ message: "El parámetro cid es inválido" });
          }
        
        let carts = await cartService.updateCartPopulate(cartId);
        res.send(carts);
        
    } catch (error) {
        req.logger.error('Esto es un error en getCartId');
        res.status(500).send({error:  error, message: "No se pudo obtener el carrito."});
    }
}


export const cartPurchase = async (req, res) => {
    try {
        const products = req.body;
        const productsUpdate = [];

        if (products.length === 0) {
            return res.status(400).send({ message: "La solicitud debe contener una lista de productos" });
        }

        for (const productData of products) {
            const productId = productData.id;
            const quantityToPurchase = productData.quantity;

            // Consultar el producto en la base de datos
            const product = await productsModel.findOne({ _id: productId });

            if (!product) {
                return res.status(400).send({ message: `Producto con ID ${productId} no encontrado` });
            }

            if (product.stock < quantityToPurchase) {
                return res.status(401).send({ message: `No hay suficiente stock para el producto con ID: ${productId}`, productTitle: product.title });
            }

            product.stock -= quantityToPurchase;
            const productSave = await product.save();
            productsUpdate.push(productSave);
        }

        function generateUniqueRandomNumber() {
            return Math.floor(Math.random() * 10000);
        }      

        const calculateTotalAmount = (products) => {
            const total = products.reduce((acc, product) => {
                const price = parseFloat(product.price.split(' ')[1]); // Extraer el valor numérico del precio
                const quantity = product.quantity;
                return acc + (price * quantity); // Sumar el precio * cantidad al acumulador
            }, 0);
        
            return total;
        };
        
        const cartTicket = {
            code: generateUniqueRandomNumber(),
            purchase_datatime: new Date(),
            amount: calculateTotalAmount(products),
            purchaser: req.session.user.email,
            products: products,
        };

        const generateTicket = await cartService.generateTicket(cartTicket)
        emailPurchase();
        
        req.logger.info('Exito en generateTicket');

        res.status(201).send({ message: "Productos comprados con éxito"});
        
    } catch (error) {
        console.error('Error en cartPurchase:', error);
        res.status(500).send({ error: error, message: "Hubo un error en la operación" });
    }
};

export const postCart = async (req, res) => {
    const cartDto = (req.body)
    console.log(cartDto);
    req.logger = devLogger;
    if (!cartDto) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    
    try {
        let result = await cartService.save(cartDto);
        res.status(201).send({message: "carrito creado con exito!"});
        req.logger.info('Exito en postCart');
    } catch (error) {
        req.logger.error('Esto es un error en postCart');
        res.status(500).send({error:  error, message: "No se pudo guardar el carrito."});
    }
}





export const deleteCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    req.logger = devLogger;
    if (!cartId || !productId) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }

    try {
        let result = await cartService.deleteCart(cartId, productId);
        res.status(201).send("producto eliminado correctamente");

    } catch (error) {
        req.logger.error('Esto es un error en deleteCart');
        res.status(500).send({error:  error, message: "No se pudo eliminar el carrito."});
    }
}





export const deleteCartId = async (req, res) => {
    const cartId = req.params.cid 
    req.logger = devLogger;
    if (!cartId) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    

    try {
        let result = await cartService.deleteAll(cartId);
        res.status(201).send({message:"productos eliminados del carrito correctamente"});
        
        req.logger.info('exito en deleteCartId');

    } catch (error) {
        req.logger.error('Esto es un error en deleteCartId');
        res.status(500).send({error:  error, message: "No se pudieron eliminar los productos."});
    }
}





export const putCart = async (req, res) => {
    const cartId = req.params.cid;
    const updateProducts = req.body;

    console.log(cartId,updateProducts);
    req.logger = devLogger;
    if (!cartId || !updateProducts) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    
    try {
        let result = await cartService.updateAll(cartId, updateProducts);
        res.status(201).send({message:"carrito actualizado con exito"});
        req.logger.info('exito en putCart');

    } catch (error) {
        req.logger.error('Esto es un error en updateProduct');
        res.status(500).send({error:  error, message: "No se pudo actualizar el carrito."});
    }
}





export const putCartPid = async (req, res) => {
   const cartId = req.params.cid;
    const productId = req.params.pid;
    const {quantity} = req.body;
    console.log(cartId,productId,quantity);
    req.logger = devLogger;

    if (!cartId|| !productId ||!quantity) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    

    try {
        let result = await cartService.updateQuantity(cartId,productId,quantity);
        res.status(201).send("cantidad actulizada con exito");
        req.logger.info('exito en putCartPid');
    } catch (error) {
        req.logger.error('Esto es un error en putCartPid');
        res.status(500).send({error:  error, message: "No se pudo actualizar el carrito."});
    }
}




