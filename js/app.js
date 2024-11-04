import { obtenerProductosDeApi } from "./api.js"; // llamamos al archivo donde esta la api
import { Carrito } from "./carrito.js"; // llamamos al archivo donde esta la clase carrito

const carrito = new Carrito(); // creamos la variable carrito para acceder a todas las funciones de la clase carrito.

document.addEventListener("DOMContentLoaded", function () {
  async function cargarTabla(producto, currency) {
    const tableProducts = document.querySelector(".table-product tbody");
    tableProducts.innerHTML = ""; // Limpia la tabla

    // forEach recorre cada producto que y crea cada elemento
    producto.forEach((product) => {
      const tr = document.createElement("tr");

      // creamos el producto de la tabla 
      const productName = document.createElement("td");
      productName.innerText = `${product.title} 
      Ref: ${product.SKU}`;

      // creamos el tr donde va a ir el boton de menos, input y boton de mas
      const cantidad = document.createElement("td");

      // creamos el boton de menos
      const btnMenos = document.createElement("button");
      btnMenos.innerText = "-";
      btnMenos.classList.add("decrement");

      // creamos el input donde esta el valor de las cantidades
      const inputNumber = document.createElement("input");
      inputNumber.setAttribute("type", "number"); // ingresamos el tipo de dato
      inputNumber.setAttribute("class", "inputNumber"); // cremos una clase
      inputNumber.setAttribute("data-sku", product.SKU);
      inputNumber.value =
        carrito.obtenerInformacionProducto(product.SKU).quantity || 0;

        // creamos el boton de mas
      const btnMas = document.createElement("button");
      btnMas.innerText = "+";
      btnMas.classList.add("increment");

      // en cantidad(tr) ingresamos los valores que van dentro
      cantidad.append(btnMenos, inputNumber, btnMas);

      // creamos el precio del producto
      const productPrice = document.createElement("td");
      productPrice.innerText = `${product.price} ${currency}`;

      // creamos el total del producto 
      const totalProducto = document.createElement("td");
      totalProducto.innerText = `${(product.price * inputNumber.value).toFixed(
        2
      )} ${currency}`;
      totalProducto.setAttribute("id", `total-${product.SKU}`);

      tr.append(productName, cantidad, productPrice, totalProducto);
      tableProducts.append(tr);

      // creamos el evento para incrementar al dar click al boton de mas
      btnMas.addEventListener("click", () => {
        inputNumber.value++;
        carrito.actualizarUnidades(product.SKU, 1);
        actualizarTotalProducto(product.SKU, product.price, currency);
        actualizarTotalCarrito(producto, currency);
        actualizarCarritoListado(
          product.SKU,
          product.title,
          product.price,
          currency
        );
      });

      // creamos el evento para decrementar al dar click al boton de menos
      btnMenos.addEventListener("click", () => {
        if (inputNumber.value > 0) {
          inputNumber.value--;
          carrito.actualizarUnidades(product.SKU, -1);
          actualizarTotalProducto(product.SKU, product.price, currency);
          actualizarTotalCarrito(producto, currency);
          actualizarCarritoListado(
            product.SKU,
            product.title,
            product.price,
            currency
          );
        }
      });

      // evento change para ingresar al input un numero sin utilizar los botones de mas y menos
      inputNumber.addEventListener("change", () => {
        const nuevaCantidad = parseInt(inputNumber.value) || 0;

        // comprueba que el valor sea mayor a  y la actualiza
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
          nuevaCantidad = 0;
          inputNumber.value = nuevaCantidad; 
        }
        const cantidadActual = carrito.obtenerInformacionProducto(
          product.SKU
        ).quantity;

        
        const diferencia = nuevaCantidad - cantidadActual;

        // actualiza el carrito
        carrito.actualizarUnidades(product.SKU, diferencia);

       
        actualizarTotalProducto(product.SKU, product.price, currency);
        actualizarTotalCarrito(producto, currency);
        actualizarCarritoListado(
          product.SKU,
          product.title,
          product.price,
          currency
        );
      });
    });
  }

  function actualizarTotalProducto(sku, precio, currency) {
    const cantidadInput = document.querySelector(`input[data-sku="${sku}"]`);
    const nuevaCantidad = parseInt(cantidadInput.value) || 0; 
    const total = (nuevaCantidad * precio).toFixed(2);

    document.getElementById(`total-${sku}`).innerText = `${total} ${currency}`;

    carrito.actualizarUnidades(
      sku,
      nuevaCantidad - carrito.obtenerInformacionProducto(sku).quantity
    );
  
  }

  function actualizarTotalCarrito(productos, currency) {
    const totalCarrito = carrito.calcularTotal(productos, currency);
    document.getElementById("carrito-total").innerText = totalCarrito;
  }



  function actualizarCarritoListado(sku, title, price, currency) {
    const carritoListado = document.getElementById("carrito-listado");
    const productoEnCarrito = carrito.obtenerInformacionProducto(sku);

    let productoElemento = document.querySelector(`#producto-carrito-${sku}`);

    if (productoElemento) {
        if (productoEnCarrito.quantity > 0) {
            productoElemento.querySelector(
                ".carrito-cantidad"
            ).innerText = `${productoEnCarrito.quantity} x `;
            productoElemento.querySelector(".carrito-total").innerText = ` ${(
                productoEnCarrito.quantity * price
            ).toFixed(2)} ${currency}`;
        } else {
            productoElemento.remove();
        }
    } else {
        if (productoEnCarrito.quantity > 0) {
            const filaCarrito = document.createElement("div");
            filaCarrito.setAttribute("class", "carrito-item");
            filaCarrito.setAttribute("id", `producto-carrito-${sku}`);

            const cantidadProducto = document.createElement("span");
            cantidadProducto.setAttribute("class", "carrito-cantidad");
            cantidadProducto.innerText = `${productoEnCarrito.quantity} x `;

            const nombreProducto = document.createElement("span");
            nombreProducto.setAttribute("class", "carrito-nombre");
            nombreProducto.innerText = title;

            const totalProducto = document.createElement("span");
            totalProducto.setAttribute("class", "carrito-total");
            totalProducto.innerText = ` ${(
                productoEnCarrito.quantity * price
            ).toFixed(2)} ${currency}`;

            filaCarrito.append(cantidadProducto, nombreProducto, totalProducto);
            carritoListado.appendChild(filaCarrito);
        }
    }
    carrito.guardarEnLocalStorage();
}


  // Inicializa la tabla de productos
  async function inicializarProductos() {
    const data = await obtenerProductosDeApi();
    const productos = data.products;
    const currency = data.currency;

    if (productos && productos.length > 0) {
      cargarTabla(productos, currency);
      actualizarTotalCarrito(productos, currency);
    } else {
      console.error("No se pudieron cargar los productos.");
    }
  }

  inicializarProductos();
});
