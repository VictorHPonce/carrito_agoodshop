export class Carrito {
    constructor() {
        // this.productosEnCarrito = this.cargarDesdeLocalStorage() || [];
        this.productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        this.total = this.cargarTotalDesdeLocalStorage() || 0;
    }

    // Método para guardar el estado del carrito en local storage
    guardarEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.productosEnCarrito));
        localStorage.setItem('carritoTotal', this.total);
    }

    // Método para cargar el estado del carrito desde local storage
    cargarDesdeLocalStorage() {
        // return JSON.parse(localStorage.getItem('carrito'));
        const data = localStorage.getItem('carrito');
        return data ? JSON.parse(data) : [];
    }

    cargarTotalDesdeLocalStorage() {
        return parseFloat(localStorage.getItem('carritoTotal')) || 0;
    }

      
    // Actualiza las unidades del producto en el carrito
    actualizarUnidades(sku, unidades) {
        const producto = this.productosEnCarrito.find(p => p.sku === sku);
        if (producto) {
            producto.quantity += unidades;
            if (producto.quantity <= 0) {
                this.eliminarProducto(sku);
            }
        } else {
            this.productosEnCarrito.push({ sku, quantity: unidades });
        }

        // Guardar el carrito actualizado en local storage
        this.guardarEnLocalStorage();
    }

    // Obtiene la información de un producto en el carrito
    obtenerInformacionProducto(sku) {
        return this.productosEnCarrito.find(p => p.sku === sku) || { sku, quantity: 0 };
    }

    // Calcula el total del carrito
    calcularTotal(products, currency) {
        let total = 0;
        products.forEach(product => {
            const itemEnCarrito = this.obtenerInformacionProducto(product.SKU);
            total += itemEnCarrito.quantity * product.price;
        });
        this.total = total.toFixed(2);
        this.guardarEnLocalStorage();
        return ` ${this.total} ${currency}`;
    }

    // Elimina un producto del carrito
    eliminarProducto(sku) {
        this.productosEnCarrito = this.productosEnCarrito.filter(p => p.sku !== sku);
        this.guardarEnLocalStorage();
    }

    // Devuelve el estado del carrito (productos y total)
    obtenerCarrito() {
        return {
            total: this.total,
            products: this.productosEnCarrito
        };
    }
}
