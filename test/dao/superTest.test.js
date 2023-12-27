import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";


const expect = chai.expect;

const requester = supertest('http://localhost:8080');

let userMock;
let product;
let cart;


describe("----TEST DE SESION EN LA APP---", () => {

    //SECCION 1 - REGISTRO DE USUARIO

        describe("test de creacion de usuario", () => {

            /* beforeEach(function() {
                this.timeout(5000); 
                mongoose.connection.collections.users.drop();
            }); --------CONSULTAR POR QUE NO FUNCIONA------ */

            it("Crear usuario: en este test verificamos si el usuario se guarda en la db confirmando su existencia.", async function () {

                //GIVEN
                let userResgister =  {
                    first_name: "Manolo",
                    last_name: "Perez",
                    email: "Manolo@gmail.com",
                    age: 25,
                    role:"admin",
                    cart:[],     
                    password: "holahola"
                }

                userMock = userResgister;

                //PARA LAS SIGUIENTES PRUEBAS COMENTAR ESTE FRAGMENTO DE CODIGO

                //THEN
                let result = await requester.post('/api/session/register').send(userMock);
                console.log(result);

                //ASSERT
                expect (result.statusCode).is.equals(200);
                expect (result.statusCode).is.be.ok
                expect(result.body.status).to.equal('success');

                //COMENTAR HASTA ACA. NO SE HABILITA LA SESSION. DEBIDO AL BEFOREEACH NO PUEDO ELIMINAR EL USUARIO YA CREADO. 
            })

        })


    //SECCION 2 - LOGIN DE USUARIO

        describe("test de login de usuario", () => {

            it ("Ingreso de usuario: en este test verificamos el ingreso correcto de nuestro usuario recien creado", async function () {

                //GIVEN
                let {email,password} = userMock  

                //THEN
                let result = await requester.post('/api/session/login').send({email,password});

                //ASSERT
                expect (result.statusCode).is.equals(200);
                expect (result.statusCode).is.be.ok
                expect(result.body.message).to.equal("¡Primer logueo realizado! :)" );
                
            })               
        })


    //SECCION  - LOGOUT DE USUARIO

        describe("test para eliminar sesion del usuario", () => {

           /*  it ("Cierre de sesion de usuario: en este test corroboramos que el usuario puede cerrar su sesion conrrectamente", async function () {

                 //GIVEN
                 let random = 1  

                 //THEN
                 let result = await requester.post(`/api/products/pages/${random}`); 
                 //ASSERT
                 expect (result.statusCode).is.equals(200);
                 expect (result.statusCode).is.be.ok
                 expect(result.body.message).to.equal("sesion cerrada con exito.");
                 
             }) */
                
        })

});
//ESTO YA ESTA OK 


describe("----TEST DE CRUD EN LOS PRODUCTOS----", () => {

    //SECCION 1 - CREAR PRODUCTO

    describe("test de creacion de producto", () => {

        

        it("Crear producto: en este test verificamos si se crea un producto de manera correcta.", async function () {

            //GIVEN
            let productMock =  {
            title: "product-test-1",
            description:  "description-test-1",
            code: 1,
            price: 15, 
            status: true,
            stock: 5,
            category: "bazar",
            thumbnail: ["1.jpg"],
            owner: "user"
            }

            product = productMock;

            //THEN
            let result = await requester.post('/api/products').send(productMock);

            //ASSERT
            expect (result.statusCode).is.equals(201);
            expect (result.statusCode).is.be.ok
            expect(result.body.message).to.equal('Producto creado con exito!');

        })

    })


//SECCION 2 - ACTUALIZAR PRODUCTO

    describe("test para actualizar producto", () => {

    it("Actualizar producto: en este test verificamos que se actulice el producto de manera correcta", async function () {

            //GIVEN
            let productMock =  {
            title: "product-test-1-actulizado",
            description:  "description-test-1-actualizado",
            code: 1,
            price: 15, 
            status: true,
            stock: 5,
            category: "bazar",
            thumbnail: ["1.jpg"],
            owner: "user"
            }

            product = productMock;

            //THEN
            let result = await requester.put('/api/products/6560c59fd69d0f17d12a5c2c').send(productMock);

            //ASSERT
            expect (result.statusCode).is.equals(201);
            expect (result.statusCode).is.be.ok
            expect(result.body.message).to.equal('exito al actulizar el producto');

        })
        
            
    })

//SECCION  - ELIMINAR PRODUCTO

    describe("test para eliminar un producto", () => {

        it("Eliminar producto: en este test verificamos que se elimine el producto de manera correcta", async function () {

            //GIVEN
            let randomId = "6560c6f3036c048914ff730d" 

            //THEN
            let result = await requester.delete(`/api/products/${randomId}`);

            //ASSERT
            expect (result.statusCode).is.equals(201);
            expect (result.statusCode).is.be.ok
            expect(result.body.message).to.equal('exito al eliminar el producto'); 

        })
        
            
    })

});
//ESTO YA ESTA OK 


describe("----TEST DE CRUD EN EL CARRITO----", () => {

//SECCION 1 - CREAR CARRITO

describe("test de creacion de un carrito", () => {
    it("Crear carrito: en este test verificamos si se crea un carrito de manera correcta.", async function () {

        //GIVEN
        let cartMock =  {
            products: [
              {
                product: {},
                quantity: 1
              }
            ]
        }
        cart = cartMock;

        //THEN
        let result = await requester.post('/api/carts').send(cartMock);

        //ASSERT
        expect (result.statusCode).is.equals(201);
        expect (result.statusCode).is.be.ok
        expect(result.body.message).to.equal('carrito creado con exito!');

    })

})

//SECCION 2 - ACTUALIZAR CARRITO

describe("test para actualizar carrito", () => {

it("Actualizar carrito: en este test verificamos que se actulice el carrito de manera correcta", async function () {

        //GIVEN
        let randomId = "6560e2cd2c6d42864438b321";
        let cartMock = 
            {
                products: [
                  {
                    product: {},
                    quantity: 10000
                  }
                ]
            }


        //THEN
        let result = await requester.put(`/api/carts/${randomId}`).send(cartMock);

        //ASSERT
        expect (result.statusCode).is.equals(201);
        expect (result.statusCode).is.be.ok
        expect(result.body.message).to.equal('carrito actualizado con exito');

    })
 
})

//SECCION  - ELIMINAR PRODUCTO

describe("test para eliminar todos los productos del carrito", () => {

    it("Eliminar productos del carrito: en este test verificamos que se eliminen los productos de manera correcta", async function () {

        //GIVEN
        let randomId = "6560e7fcdca98e02e3b8100a" 

        //THEN
        let result = await requester.delete(`/api/carts/${randomId}`);

        //ASSERT
        expect (result.statusCode).is.equals(201);
        expect (result.statusCode).is.be.ok
        expect(result.body.message).to.equal('productos eliminados del carrito correctamente'); 

    })
    
        
})

});
//ESTO YA ESTA OK 