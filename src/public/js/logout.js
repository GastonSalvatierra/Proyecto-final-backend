let carrito = [];

// Obtener todos los elementos con la clase .addProduct
const addButtons = document.querySelectorAll('.addProduct');


document.addEventListener('DOMContentLoaded', () => {

const form = document.getElementById('closeAll');

form.addEventListener('click', () => {
    // Realiza una solicitud al servidor para destruir la sesión
    fetch('/api/products/pages/1', {
        method: 'POST', // Puedes utilizar el método POST para enviar una solicitud al servidor para destruir la sesión
    })
    .then(response => {
        if (response.ok) {
            // Si la solicitud fue exitosa, redirige a la página de inicio de sesión
            window.location.replace('/');
        } else {
            console.error('Error al cerrar sesión');
        }
    })
    .catch(error => {
        console.error('Error al cerrar sesión:', error);
    });
});




addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cardId = button.closest('.card-body').id;
        const cardTitle = button.closest('.card-body').querySelector('.card-title').innerText;
        const cardPrice = button.closest('.card-body').querySelector('.card-price').innerText;

        // Verificar si el producto ya está en el carrito
        let productoEnCarrito = carrito.find(producto => producto.id === cardId);

        if (!productoEnCarrito) {
            // Si el producto no está en el carrito, añadirlo con cantidad 1
            const nuevoProducto = {
                id: cardId,
                title: cardTitle,
                price: cardPrice,
                quantity: 1
            };
            carrito.push(nuevoProducto);
        } else {
            // Si el producto ya está en el carrito, aumentar su cantidad
            productoEnCarrito.quantity++;
        }

        // Aquí podrías actualizar la UI mostrando el contenido del carrito o hacer otras acciones necesarias
        console.log('Carrito:', carrito);

        cantidadTotal();
        renderizarCarrito();
    });
});


function cantidadTotal() {
    const total = carrito.reduce((acc,p) => acc+p.quantity,0)

    const c = document.getElementById('resultado');
    c.innerText = parseInt(total);

}

function renderizarCarrito(){

    let carritoHTML = document.querySelector('#carrito');

    carritoHTML.innerHTML = '';

    carrito.forEach((p,index)=> {
    
        let producto = document.createElement('div');
        producto.classList.add('col-12');
        producto.classList.add('col-md-4');
        producto.classList.add('mb-5');
        producto.classList.add('d-flex');
        producto.classList.add('justify-content-center');

        producto.innerHTML = `
        <div class="card text-dark" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${p.title}</h5>
                <p>$${p.price}</p>
                <p>Cantidad: ${p.quantity}</p>
                <button class="btn-delete btn btn-danger">Eliminar</button>                
            </div>
        </div>
        `

        producto.querySelector('button').addEventListener('click', ()=>{
            eliminarProductoDelCarrito(index);
        })

        carritoHTML.appendChild(producto);
        calcularTotal();
    })
    guardandoCarrito(carrito);
}

function eliminarProductoDelCarrito(indice){
    (carrito[indice].quantity <= 1)? carrito.splice(indice,1) : carrito[indice].quantity--

    renderizarCarrito();
    cantidadTotal();
    calcularTotal();
}

function calcularTotal(){
    let total = 0;

    carrito.forEach((p)=>{
        priceText = p.price.substring(8);
        total += priceText * p.quantity;
    })
    const t = document.getElementById('total');

    t.innerHTML = `<h5>$ ${total.toFixed(2)}</h5>`
}

const guardandoCarrito = (carrito)  => {
    localStorage.setItem('carrito',JSON.stringify(carrito));
}

const mantenerCarrito = () => {
    const carritoStorage = JSON.parse(localStorage.getItem('carrito'));
    return carritoStorage;
}


if(localStorage.getItem('carrito')){
    carrito= mantenerCarrito();
    cantidadTotal();
    renderizarCarrito();
}

const buttonFinal = document.querySelector('.btn-compra-final');
buttonFinal.addEventListener('click', () => {
    fetch('http://localhost:8080/api/carts/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carrito)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                return response.json().then(data => {
                    throw new Error(`No hay suficiente stock del producto: ${data.productTitle}`);
                });
            } else {
                alert('No cargaste ningun producto');
            }
        } else if (response.status === 201) {
            alert('¡Compra realizada con éxito!');
            carrito = [];
            renderizarCarrito();
            calcularTotal(); 
            cantidadTotal();
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        if (error.message.startsWith('No hay suficiente stock del producto')) {
            alert(error.message);
            console.error('Hubo un problema con la petición fetch:', error);
        } else {
            alert(`Error: ${error}`);
            console.error('Hubo un problema con la petición fetch:', error);
            // Manejar otros errores aquí
        }
    });
});

document.getElementById('uploadFilesBtn').addEventListener('click', () => {
    fetch('http://localhost:8080/api/users/userId') // Obtener el userId desde el servidor
        .then(response => response.json())
        .then(data => {
            const userId = data.userId;
            const url = `http://localhost:8080/api/users/${userId}/documents`;

            // Verificar si los tres campos tienen archivos seleccionados
            const profileFile = document.getElementById('photo-dni').files[0];
            const documentsFile = document.getElementById('certificate-domicile').files[0];
            const productsFile = document.getElementById('account-statement').files[0];

            if (!profileFile || !documentsFile || !productsFile) {
                alert('Por favor, adjunta los tres archivos.');
                return;
            }

            // Crear el objeto FormData para subir los archivos
            const formData = new FormData();
            formData.append('profile', profileFile);
            formData.append('documents', documentsFile);
            formData.append('products', productsFile);

            // Realizar la solicitud POST para subir los archivos
            fetch(url, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(result => {
                    alert('Archivos subidos con éxito.');
                    console.log(result); // Manejar la respuesta del servidor

                    // Cambiar el rol a "premium"
                    const premiumUrl = `http://localhost:8080/api/users/premium/${userId}`;
                    fetch(premiumUrl, {
                        method: 'GET',
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert('Nuevo usuario premium!'); // Manejar la respuesta del cambio de rol
                            window.location.replace('/')
                        })
                        .catch(error => {
                            console.error('Error al cambiar a premium:', error); // Manejar errores
                        });
                })
                .catch(error => {
                    console.error('Error al subir archivos:', error); // Manejar errores
                });
        })
        .catch(error => {
            console.error('Error al obtener userId:', error); // Manejar errores
        });
});

  






});




