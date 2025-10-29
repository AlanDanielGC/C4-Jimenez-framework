// 1. Introducción al lenguaje JavaScript
// Definición de variables y constantes
const carritoTotal = document.querySelector('.badge');
let carrito = [];

// 2. Manejo del framework (DaisyUI/Tailwind a través de clases dinámicas)
function actualizarInterfaz() {
    carritoTotal.textContent = carrito.length;
}

// 3. Estructuras de control
function filtrarJuegosPorPrecio(juegos, precioMaximo) {
    return juegos.filter(juego => juego.precio <= precioMaximo);
}

// 4. Manipulación de objetos
class Juego {
    constructor(id, titulo, precio, genero, imagen) {
        this.id = id;
        this.titulo = titulo;
        this.precio = precio;
        this.genero = genero;
        this.imagen = imagen;
    }

    crearElementoJuego() {
        return `
            <div class="card bg-base-100 shadow-xl">
                <figure><img src="${this.imagen}" alt="${this.titulo}" /></figure>
                <div class="card-body">
                    <h2 class="card-title">${this.titulo}</h2>
                    <p>Género: ${this.genero}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold">$${this.precio}</span>
                        <button onclick="agregarAlCarrito(${this.id})" class="btn btn-primary">
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Datos de ejemplo
const catalogoJuegos = [
    new Juego(1, "The Last Adventure", 59.99, "Aventura", "assets/game1.jpg"),
    new Juego(2, "Space Warriors", 49.99, "Acción", "assets/game2.jpg"),
    new Juego(3, "Racing Pro", 39.99, "Deportes", "assets/game3.jpg"),
    new Juego(4, "Mystery Island", 29.99, "Aventura", "assets/game4.jpg"),
    new Juego(5, "Cyber Battle", 54.99, "Acción", "assets/game5.jpg"),
    new Juego(6, "Fantasy Quest", 44.99, "RPG", "assets/game6.jpg")
];

// Funciones de manipulación del DOM
function cargarJuegos() {
    const contenedor = document.getElementById('juegos-container');
    const juegosHTML = catalogoJuegos.map(juego => juego.crearElementoJuego()).join('');
    contenedor.innerHTML = juegosHTML;
}

function agregarAlCarrito(idJuego) {
    const juego = catalogoJuegos.find(j => j.id === idJuego);
    if (juego) {
        carrito.push(juego);
        actualizarInterfaz();
        // Mostrar notificación usando DaisyUI
        mostrarNotificacion(`${juego.titulo} añadido al carrito`);
    }
}

function mostrarNotificacion(mensaje) {
    // Crear y mostrar una notificación
    const toast = document.createElement('div');
    toast.className = 'toast toast-end';
    toast.innerHTML = `
        <div class="alert alert-success">
            <span>${mensaje}</span>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Función para controlar el carrusel
function iniciarCarrusel() {
    const slides = [1, 2, 3, 4];
    let currentSlide = 1;

    setInterval(() => {
        currentSlide = currentSlide % 4 + 1;
        const carousel = document.getElementById('games-carousel');
        if (carousel) {
            const slideWidth = carousel.offsetWidth;
            carousel.scrollTo({
                left: (currentSlide - 1) * slideWidth,
                behavior: 'smooth'
            });
        }
    }, 5000); // Cambiar cada 5 segundos
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarJuegos();
    iniciarCarrusel();
});
