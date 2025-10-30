// 1. Introducción al lenguaje JavaScript
// Definición de variables y constantes
const carritoTotal = document.querySelector('.badge');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let totalCarrito = 0;

// 2. Manejo del framework (DaisyUI/Tailwind a través de clases dinámicas)
function actualizarInterfaz() {
    carritoTotal.textContent = carrito.length;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularTotalCarrito();
}

function calcularTotalCarrito() {
    totalCarrito = carrito.reduce((total, item) => total + item.precio, 0);
    // Actualizar el total en el carrito si estamos en la página del carrito
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement && totalElement) {
        const subtotal = totalCarrito;
        const shipping = subtotal > 0 ? 10 : 0; // Costo de envío fijo de $10 si hay productos
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${(subtotal + shipping).toFixed(2)}`;
    }
}

// 3. Estructuras de control
function filtrarJuegosPorPrecio(juegos, precioMaximo) {
    return juegos.filter(juego => juego.precio <= precioMaximo);
}

// 4. Manipulación de objetos
class Juego {
    constructor(id, titulo, precio, genero, imagen,descripcion) {
        this.id = id;
        this.titulo = titulo;
        this.precio = precio;
        this.genero = genero;
        this.imagen = imagen;
        this.descripcion = descripcion;
    }

    crearElementoJuego() {
        return `
            <div class="card bg-base-100 shadow-xl">
                
                <figure class="h-60"> 
                    <img src="${this.imagen}" alt="${this.titulo}" class="object-cover w-full h-full" />
                </figure>

                <div class="card-body">
                    <h2 class="card-title">${this.titulo}</h2>
                    <p>Género: ${this.genero}</p>
                    
                    <p class="text-sm text-base-content/70 italic mt-2">${this.descripcion}</p> 
                    
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-2xl font-bold">${this.precio}</span>
                        <button onclick="agregarAlCarrito('${this.id}')" class="btn btn-primary">
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
    new Juego(1, "Celeste", 59.99, "Aventura", "assets/game1.jpg", "Ayuda a Madeline a sobrevivir a sus demonios internos en su viaje a la cima de la montaña Celeste, en este juego de plataformas súper ajustado."),
    new Juego(2, "Elden Ring", 49.99, "Acción", "assets/game2.jpg", "Levántate, Sinluz, y que la gracia te guíe para abrazar el poder del Círculo de Elden y convertirte en un Señor del Círculo."),
    new Juego(3, "Rayman Legends", 39.99, "Aventura", "assets/game3.jpg", "Rayman, Globox y los Diminutos deambulan por un bosque encantado cuando descubren una misteriosa tienda llena de pinturas."),
    new Juego(4, "Terraria", 29.99, "Aventura", "assets/game4.jpg", "¡Cava, lucha, explora, construye! Nada es imposible en este juego de aventuras lleno de acción. El mundo es tu lienzo."),
    new Juego(5, "Cyberpunk 2077", 54.99, "Acción", "assets/game5.jpg", "Una historia de acción y aventura en mundo abierto ambientada en Night City, una megalópolis obsesionada con el poder y el glamur."),
    new Juego(6, "Final Fantasy VII", 44.99, "RPG", "assets/game6.jpg", "El mundo ha caído bajo el control de Shinra Electric Power Company, una corporación siniestra que controla la fuerza vital del planeta.")
];

// Funciones de manipulación del DOM
function cargarJuegos() {
    const contenedor = document.getElementById('juegos-container');
    const juegosHTML = catalogoJuegos.map(juego => juego.crearElementoJuego()).join('');
    contenedor.innerHTML = juegosHTML;
}

function agregarAlCarrito(idJuego) {
    const juego = catalogoJuegos.find(j => j.id === parseInt(idJuego));
    if (juego) {
        // Agregar el juego al carrito
        carrito.push({
            id: juego.id,
            titulo: juego.titulo,
            precio: juego.precio,
            imagen: juego.imagen
        });
        actualizarInterfaz();
        // Mostrar notificación usando DaisyUI
        mostrarNotificacion(`${juego.titulo} añadido al carrito ($${juego.precio.toFixed(2)})`);
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
            // Actualizar el fondo del hero al cambiar el slide automáticamente
            try { setHeroToSlideIndex(currentSlide); } catch (e) { /* noop */ }
        }
    }, 5000); // Cambiar cada 5 segundos
}

// --- Funciones para actualizar el fondo del hero con blur ---
function updateHeroBackground(imageUrl) {
    const bg = document.querySelector('.hero-bg-image');
    if (!bg) return;
    // Evitar recargas innecesarias
    const current = bg.style.backgroundImage || '';
    const newVal = `url('${imageUrl}')`;
    if (current.indexOf(imageUrl) !== -1) return;
    bg.style.backgroundImage = newVal;
}

function getSlideIndexFromHash() {
    const h = (location.hash || '').replace('#', '');
    if (!h) return null;
    const match = h.match(/slide(\d+)/);
    if (match) return parseInt(match[1], 10);
    return null;
}

function setHeroToSlideIndex(index) {
    if (!index) return;
    const idx = Math.max(1, Math.min(4, index));
    const juego = catalogoJuegos[idx - 1];
    if (juego && juego.imagen) {
        updateHeroBackground(juego.imagen);
    } else {
        // Fallback: intentar leer la imagen del DOM
        const slide = document.querySelector(`#slide${idx}`);
        const img = slide ? slide.querySelector('img') : null;
        if (img && img.src) updateHeroBackground(img.src);
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarJuegos();
    iniciarCarrusel();

    // Inicializar el fondo del hero según el hash (o slide 1 por defecto)
    const initialIdx = getSlideIndexFromHash() || 1;
    setHeroToSlideIndex(initialIdx);

    // Actualizar fondo cuando cambia el hash (prev/next usando anchors)
    window.addEventListener('hashchange', () => {
        const idx = getSlideIndexFromHash();
        if (idx) setHeroToSlideIndex(idx);
    });

    // También actualizar fondo cuando la posición de scroll del carrusel cambie por resize
    window.addEventListener('resize', () => {
        const carousel = document.getElementById('games-carousel');
        if (!carousel) return;
        const slideWidth = carousel.offsetWidth || 1;
        const index = Math.round(carousel.scrollLeft / slideWidth) + 1;
        setHeroToSlideIndex(index);
    });
});
