const tarjetas = document.getElementById('tarjetas')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateTarjetas = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragmento = document.createDocumentFragment()

let carrito = {}

//Espera a que se cargue el dom//
document.addEventListener('DOMContentLoaded', () => {
    fetchDatos()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        renderizarCarrito()
    }
})
//captura el evento cuando se hace click en las tarjetas//
tarjetas.addEventListener('click', e => {
    agregarCarrito(e)
})
//captura el evento cuando se hace click en os items//
items.addEventListener('click', e => {

botonAccion(e)

})
//utiliza fetch para recopilar la información del json//
const fetchDatos = async () => {
    try {
        const res = await fetch("../js/productos.json")
        const datos = await res.json()
        renderizarProducto(datos)
    } catch (error) {
        console.log(error)
    }
}
//renderiza las tarjetas on la información del fetch//
const renderizarProducto = datos => {
    datos.forEach(producto => {
        templateTarjetas.querySelector('.titulo').textContent = producto.titulo
        templateTarjetas.querySelector('.desc').textContent = producto.desc
        templateTarjetas.querySelector('.precio').textContent = producto.precio
        templateTarjetas.querySelector('.imagenProducto').setAttribute("src", producto.imagenProducto)
        templateTarjetas.querySelector('.boton').dataset.id = producto.id
        const clonar = templateTarjetas.cloneNode(true)
        fragmento.appendChild(clonar)
    })
    tarjetas.appendChild(fragmento)
}
//selecciona todos los parent element del boton para guardar la info en el carrito//
const agregarCarrito = e => {
    if (e.target.classList.contains('boton')) {
        setearCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
//actualiza la cantidad del carrito//
const setearCarrito = objeto => {
    const producto ={
        id: objeto.querySelector('.boton').dataset.id,
        titulo: objeto.querySelector('.titulo').textContent,
        precio: objeto.querySelector('.precio').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito [producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    renderizarCarrito()
}
//renderiza los elementos del carrito//
const renderizarCarrito = () =>{
    items.innerHTML =''
    Object.values(carrito).forEach(producto =>{

        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.titulo
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clonar = templateCarrito.cloneNode(true)
        fragmento.appendChild(clonar)
        //setea el localstorage//
        localStorage.setItem('carrito', JSON.stringify(carrito))
    })
        items.appendChild(fragmento)
        renderizarFooter()
}
//renderiza la sección en donde se hace la suma del total//
const renderizarFooter= () =>{
    footer.innerHTML= ''
    if(Object.keys(carrito).length ===0){

        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=>acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad, precio})=>acc + cantidad * precio ,0)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clonar = templateFooter.cloneNode(true)
    fragmento.appendChild(clonar)
    footer.appendChild(fragmento)

    const botonVaciar = document.getElementById('vaciar-carrito')
    botonVaciar.addEventListener('click',() =>{
        carrito ={}
        renderizarCarrito()
    })
}
//otorga la funcionalidad a los botones de aumentar o reducir cantidad de productos//
const botonAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] ={...producto}
        renderizarCarrito()

    } 

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad ===0){
            delete carrito[e.target.dataset.id]
        }
        renderizarCarrito()
    }
    e.stopPropagation()
}
