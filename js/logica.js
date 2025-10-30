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

//CATALOGO DE JUEGOS ////////////////////////7
const JUEGOS_CATALOGO = [
    // --- JUEGOS ORIGINALES (3) ---
    {
        id: 1,
        nombre: "LEGO Star Wars: The Force Awakens",
        imagen: "https://i.imgur.com/r6V8q0T.png",
        descuento: "25%",
        precioActual: "52.49",
        precioAnterior: "69.99",
        plataforma: "PS4",
        descripcion: "Revive la épica saga de Star Wars con el humor único de LEGO. Nuevas historias exclusivas del universo.",
        genero: "Aventura, Acción",
        calificacion: "4.5/5",
        claseDescuento: "bg-blue-600",
        claseGenero: "badge-primary"
    },
    {
        id: 2,
        nombre: "ELDEN RING",
        imagen: "https://i.imgur.com/y1Xw6gB.jpeg",
        descuento: "30%",
        precioActual: "41.99",
        precioAnterior: "59.99",
        plataforma: "PS5",
        descripcion: "Un vasto mundo de fantasía oscura lleno de misterios y peligros, creado por Hidetaka Miyazaki y George R. R. Martin.",
        genero: "RPG, Acción",
        calificacion: "4.8/5",
        claseDescuento: "bg-red-600",
        claseGenero: "badge-error"
    },
    {
        id: 3,
        nombre: "Warframe: 3210 Platinum + Mods",
        imagen: "https://i.imgur.com/gK9J6rI.png",
        descuento: "40%",
        precioActual: "89.99",
        precioAnterior: "149.99",
        plataforma: "PS4/PS5",
        descripcion: "Paquete de platinos y mods raros para acelerar tu progreso en el universo ninja espacial de Warframe.",
        genero: "Complemento",
        calificacion: "4.2/5",
        claseDescuento: "bg-indigo-600",
        claseGenero: "badge-info"
    },
    
    // --- NUEVOS JUEGOS (37) ---

    // ➡️ ACCIÓN/AVENTURA (8)
    { id: 4, nombre: "God of War Ragnarök", imagen: "https://i.imgur.com/Z8N4j6q.jpeg", descuento: "20%", precioActual: "55.99", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Kratos y Atreus deben aventurarse en los Nueve Reinos buscando respuestas.", genero: "Acción, Aventura", calificacion: "4.9/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 5, nombre: "Marvel's Spider-Man 2", imagen: "https://i.imgur.com/w2Q4d3s.jpeg", descuento: "15%", precioActual: "59.49", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Peter Parker y Miles Morales enfrentan a Venom en la ciudad de Nueva York.", genero: "Acción, Aventura", calificacion: "4.7/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 6, nombre: "Horizon Forbidden West", imagen: "https://i.imgur.com/yY0H8k2.jpeg", descuento: "35%", precioActual: "38.99", precioAnterior: "59.99", plataforma: "PS4/PS5", descripcion: "Aloy viaja a un Oeste americano postapocalíptico para detener una plaga misteriosa.", genero: "Aventura, RPG", calificacion: "4.6/5", claseDescuento: "bg-yellow-600", claseGenero: "badge-info" },
    { id: 7, nombre: "Uncharted 4: El Desenlace del Ladrón", imagen: "https://i.imgur.com/f7jYyJv.jpeg", descuento: "50%", precioActual: "9.99", precioAnterior: "19.99", plataforma: "PS4", descripcion: "Nathan Drake sale del retiro forzado para buscar el tesoro de Henry Avery.", genero: "Aventura", calificacion: "4.8/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },
    { id: 8, nombre: "Ghost of Tsushima Director's Cut", imagen: "https://i.imgur.com/N4qgQ9a.jpeg", descuento: "40%", precioActual: "41.99", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Encarna a Jin Sakai y libra una guerra por la libertad de Tsushima.", genero: "Acción, Aventura", calificacion: "4.7/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 9, nombre: "The Last of Us Part I", imagen: "https://i.imgur.com/T0bX6w2.jpeg", descuento: "25%", precioActual: "52.49", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Remake completo de la historia que definió el género de supervivencia.", genero: "Aventura, Terror", calificacion: "4.9/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 10, nombre: "Ratchet & Clank: Una Dimensión Aparte", imagen: "https://i.imgur.com/Q9mS2Z1.jpeg", descuento: "45%", precioActual: "38.49", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Salva el multiverso con Ratchet y su nuevo arsenal interdimensional.", genero: "Acción, Plataformas", calificacion: "4.6/5", claseDescuento: "bg-blue-600", claseGenero: "badge-primary" },
    { id: 11, nombre: "Assasin's Creed Valhalla", imagen: "https://i.imgur.com/L1d4gWv.jpeg", descuento: "60%", precioActual: "23.99", precioAnterior: "59.99", plataforma: "PS4/PS5", descripcion: "Lidera un clan vikingo a través de los brutales reinos de Inglaterra.", genero: "Acción, RPG", calificacion: "4.1/5", claseDescuento: "bg-indigo-600", claseGenero: "badge-info" },

    // ➡️ RPG (9)
    { id: 12, nombre: "Final Fantasy XVI", imagen: "https://i.imgur.com/rM1VfR9.jpeg", descuento: "10%", precioActual: "62.99", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Una oscura fantasía épica con acción trepidante y Eikons masivos.", genero: "RPG de Acción", calificacion: "4.6/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 13, nombre: "Cyberpunk 2077", imagen: "https://i.imgur.com/s4G5K7B.jpeg", descuento: "50%", precioActual: "29.99", precioAnterior: "59.99", plataforma: "PS5", descripcion: "Adéntrate en Night City, una megalópolis obsesionada con el poder y el ciber-implante.", genero: "RPG", calificacion: "4.0/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },
    { id: 14, nombre: "The Witcher 3: Wild Hunt (Complete Edition)", imagen: "https://i.imgur.com/X0kZtJj.jpeg", descuento: "70%", precioActual: "14.99", precioAnterior: "49.99", plataforma: "PS5", descripcion: "Caza monstruos en un vasto mundo abierto como Geralt de Rivia.", genero: "RPG", calificacion: "4.9/5", claseDescuento: "bg-yellow-600", claseGenero: "badge-info" },
    { id: 15, nombre: "Persona 5 Royal", imagen: "https://i.imgur.com/yFv6lE7.jpeg", descuento: "45%", precioActual: "32.99", precioAnterior: "59.99", plataforma: "PS5", descripcion: "Únete a los Phantom Thieves para cambiar el corazón de los corruptos.", genero: "JRPG", calificacion: "4.8/5", claseDescuento: "bg-blue-600", claseGenero: "badge-primary" },
    { id: 16, nombre: "Diablo IV", imagen: "https://i.imgur.com/Hn2yE3j.jpeg", descuento: "20%", precioActual: "55.99", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Lucha contra hordas de demonios y la llegada de Lilith.", genero: "RPG de Acción", calificacion: "4.3/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 17, nombre: "Dragon Quest XI S", imagen: "https://i.imgur.com/Q7J9vD6.jpeg", descuento: "65%", precioActual: "17.49", precioAnterior: "49.99", plataforma: "PS4", descripcion: "Una épica aventura JRPG con un elenco encantador y un mundo vibrante.", genero: "JRPG", calificacion: "4.7/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },
    { id: 18, nombre: "Genshin Impact (Paquete de Resina)", imagen: "https://i.imgur.com/jD1z7s2.jpeg", descuento: "20%", precioActual: "19.99", precioAnterior: "24.99", plataforma: "PS4/PS5", descripcion: "Recursos para acelerar el progreso en el mundo de Teyvat.", genero: "Complemento, RPG", calificacion: "4.5/5", claseDescuento: "bg-indigo-600", claseGenero: "badge-info" },
    { id: 19, nombre: "Nier: Automata", imagen: "https://i.imgur.com/4aK5nZp.jpeg", descuento: "50%", precioActual: "19.99", precioAnterior: "39.99", plataforma: "PS4", descripcion: "Un RPG postapocalíptico con combate rápido y una narrativa profunda.", genero: "RPG de Acción", calificacion: "4.6/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },
    { id: 20, nombre: "Mass Effect Legendary Edition", imagen: "https://i.imgur.com/dK5w8w3.jpeg", descuento: "55%", precioActual: "26.99", precioAnterior: "59.99", plataforma: "PS4", descripcion: "Trilogía completa de Commander Shepard, remasterizada para una nueva generación.", genero: "RPG, Ciencia Ficción", calificacion: "4.7/5", claseDescuento: "bg-blue-600", claseGenero: "badge-primary" },

    // ➡️ TERROR/HORROR (7)
    { id: 21, nombre: "Resident Evil 4 Remake", imagen: "https://i.imgur.com/p9vN4kY.jpeg", descuento: "30%", precioActual: "41.99", precioAnterior: "59.99", plataforma: "PS5", descripcion: "Leon Kennedy debe rescatar a la hija del presidente en una aldea infestada.", genero: "Terror, Acción", calificacion: "4.8/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 22, nombre: "Silent Hill 2 Remake", imagen: "https://i.imgur.com/8mR9x0j.jpeg", descuento: "10%", precioActual: "62.99", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Una carta misteriosa atrae a James Sunderland de vuelta a Silent Hill.", genero: "Terror Psicológico", calificacion: "Próximamente", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 23, nombre: "Dead Space Remake", imagen: "https://i.imgur.com/z4X5GvT.jpeg", descuento: "40%", precioActual: "41.99", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Isaac Clarke lucha por sobrevivir a bordo de la USG Ishimura.", genero: "Terror, Ciencia Ficción", calificacion: "4.6/5", claseDescuento: "bg-indigo-600", claseGenero: "badge-info" },
    { id: 24, nombre: "Alien: Isolation", imagen: "https://i.imgur.com/Q2hD0xK.jpeg", descuento: "75%", precioActual: "9.99", precioAnterior: "39.99", plataforma: "PS4", descripcion: "Amanda Ripley busca a su madre en una estación espacial acechada por el Xenomorfo.", genero: "Terror, Sigilo", calificacion: "4.5/5", claseDescuento: "bg-yellow-600", claseGenero: "badge-info" },
    { id: 25, nombre: "Outlast Trinity", imagen: "https://i.imgur.com/J3c0QpP.jpeg", descuento: "60%", precioActual: "19.99", precioAnterior: "49.99", plataforma: "PS4", descripcion: "Colección de terror en primera persona sin posibilidad de luchar.", genero: "Terror de Supervivencia", calificacion: "4.2/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },
    { id: 26, nombre: "Amnesia: Rebirth", imagen: "https://i.imgur.com/D8r1e2Q.jpeg", descuento: "50%", precioActual: "14.99", precioAnterior: "29.99", plataforma: "PS4", descripcion: "Una expedición a Argelia se convierte en una pesadilla de terror.", genero: "Terror Psicológico", calificacion: "4.1/5", claseDescuento: "bg-blue-600", claseGenero: "badge-primary" },
    { id: 27, nombre: "Until Dawn", imagen: "https://i.imgur.com/gK9J6rI.png", descuento: "60%", precioActual: "7.99", precioAnterior: "19.99", plataforma: "PS4", descripcion: "Ocho amigos atrapados en una cabaña deben sobrevivir una noche de terror.", genero: "Terror Interactivo", calificacion: "4.3/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },

    // ⚽ FIFA / EA Sports FC (8)
    { id: 28, nombre: "EA Sports FC 25 (Pre-Order)", imagen: "https://i.imgur.com/a9JkR3L.png", descuento: "5%", precioActual: "66.49", precioAnterior: "69.99", plataforma: "PS5", descripcion: "Pre-orden del simulador de fútbol más realista.", genero: "Deportes, FIFA", calificacion: "N/A", claseDescuento: "bg-blue-600", claseGenero: "badge-primary" },
    { id: 29, nombre: "FIFA 23 Ultimate Edition", imagen: "https://i.imgur.com/b5U0h9j.jpeg", descuento: "80%", precioActual: "13.99", precioAnterior: "69.99", plataforma: "PS4/PS5", descripcion: "El juego de fútbol de la temporada pasada, con contenido Ultimate Team.", genero: "Deportes, FIFA", calificacion: "3.5/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 30, nombre: "FIFA 22 Standard Edition", imagen: "https://i.imgur.com/zX1N2vM.jpeg", descuento: "90%", precioActual: "6.99", precioAnterior: "69.99", plataforma: "PS4", descripcion: "Fútbol con tecnología HyperMotion, ideal para coleccionistas.", genero: "Deportes, FIFA", calificacion: "3.2/5", claseDescuento: "bg-yellow-600", claseGenero: "badge-info" },
    { id: 31, nombre: "EA Sports FC Points Pack 5000", imagen: "https://i.imgur.com/uC7s2Pj.jpeg", descuento: "10%", precioActual: "44.99", precioAnterior: "49.99", plataforma: "PS5", descripcion: "Moneda virtual para el modo Ultimate Team.", genero: "Complemento, FIFA", calificacion: "4.0/5", claseDescuento: "bg-indigo-600", claseGenero: "badge-info" },
    { id: 32, nombre: "EA Sports FC 24", imagen: "https://i.imgur.com/rM1VfR9.jpeg", descuento: "30%", precioActual: "48.99", precioAnterior: "69.99", plataforma: "PS5", descripcion: "La última entrega que reemplazó a FIFA, con nuevas animaciones.", genero: "Deportes, FIFA", calificacion: "4.0/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 33, nombre: "FIFA 21 Edición Héroe", imagen: "https://i.imgur.com/w2Q4d3s.jpeg", descuento: "95%", precioActual: "3.49", precioAnterior: "69.99", plataforma: "PS4", descripcion: "Edición especial con cartas Héroe para Ultimate Team.", genero: "Deportes, FIFA", calificacion: "3.0/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },
    { id: 34, nombre: "FIFA 20 Legacy Edition", imagen: "https://i.imgur.com/Z8N4j6q.jpeg", descuento: "97%", precioActual: "1.99", precioAnterior: "69.99", plataforma: "PS4", descripcion: "Edición con equipos y equipaciones actualizadas de 2020.", genero: "Deportes, FIFA", calificacion: "2.5/5", claseDescuento: "bg-yellow-600", claseGenero: "badge-info" },
    { id: 35, nombre: "EA Sports FC 24 Ultimate Points Pack 1000", imagen: "https://i.imgur.com/Q9mS2Z1.jpeg", descuento: "10%", precioActual: "8.99", precioAnterior: "9.99", plataforma: "PS5", descripcion: "Paquete de moneda virtual para Ultimate Team.", genero: "Complemento, FIFA", calificacion: "3.8/5", claseDescuento: "bg-blue-600", claseGenero: "badge-primary" },

    // ⚽ PES / eFootball (5)
    { id: 36, nombre: "eFootball 2024 Premium Pass", imagen: "https://i.imgur.com/yFv6lE7.jpeg", descuento: "20%", precioActual: "15.99", precioAnterior: "19.99", plataforma: "PS4/PS5", descripcion: "Pase de temporada para desbloquear recompensas y jugadores.", genero: "Deportes, PES", calificacion: "4.1/5", claseDescuento: "bg-red-700", claseGenero: "badge-error" },
    { id: 37, nombre: "eFootball 2024 Starter Kit", imagen: "https://i.imgur.com/p9vN4kY.jpeg", descuento: "50%", precioActual: "14.99", precioAnterior: "29.99", plataforma: "PS5", descripcion: "Kit de inicio con monedas y jugadores legendarios.", genero: "Deportes, PES", calificacion: "4.0/5", claseDescuento: "bg-green-600", claseGenero: "badge-primary" },
    { id: 38, nombre: "Pro Evolution Soccer 2018", imagen: "https://i.imgur.com/Hn2yE3j.jpeg", descuento: "95%", precioActual: "2.99", precioAnterior: "59.99", plataforma: "PS4", descripcion: "Una de las últimas versiones clásicas de PES.", genero: "Deportes, PES", calificacion: "4.2/5", claseDescuento: "bg-yellow-600", claseGenero: "badge-info" },
    { id: 39, nombre: "eFootball 2023 Club Edition: AC Milan", imagen: "https://i.imgur.com/w2Q4d3s.jpeg", descuento: "70%", precioActual: "8.99", precioAnterior: "29.99", plataforma: "PS5", descripcion: "Edición especial enfocada en el club AC Milan.", genero: "Deportes, PES", calificacion: "3.9/5", claseDescuento: "bg-blue-600", claseGenero: "badge-primary" },
    { id: 40, nombre: "eFootball 2024 Monedas 1000", imagen: "https://i.imgur.com/D8r1e2Q.jpeg", descuento: "10%", precioActual: "8.99", precioAnterior: "9.99", plataforma: "PS4/PS5", descripcion: "Paquete pequeño de moneda del juego.", genero: "Complemento, PES", calificacion: "3.5/5", claseDescuento: "bg-indigo-600", claseGenero: "badge-info" }
];

// Renderización de CATALOGO DE JUEGOS ////////////////////////////
// const JUEGOS_CATALOGO = [ ... ];

// Función para generar el HTML de una tarjeta de juego (sin cambios, solo se usa)
function crearTarjetaJuego(juego) {
    // ... (El mismo código que ya tenías para crear la tarjeta) ...
    return `
        <div class="game-card card bg-base-300 shadow-xl overflow-hidden relative group cursor-pointer" id="juego-${juego.id}">
            <div class="default-view transition-opacity duration-300">
                <figure><img src="${juego.imagen}" alt="${juego.nombre}" class="w-full h-48 object-cover"/></figure>
                <div class="discount-tag ${juego.claseDescuento} text-white text-xs font-bold px-2 py-1 absolute top-0 left-0">
                    AHORRA UN ${juego.descuento}
                </div>
                <div class="card-body p-4">
                    <h2 class="card-title text-sm font-semibold truncate">${juego.nombre}</h2>
                    <p class="text-xs text-gray-400">${juego.plataforma}</p>
                    <div class="flex justify-between items-center pt-1">
                        <p class="new-price text-sm font-bold text-white">US$${juego.precioActual}</p>
                        <p class="old-price text-xs text-gray-500 line-through">US$${juego.precioAnterior}</p>
                    </div>
                </div>
            </div>
            
            <div class="hover-details absolute inset-0 bg-black bg-opacity-95 p-4 opacity-0 transition-all duration-300 flex flex-col justify-between">
                <h3 class="text-lg font-bold text-white mb-2">${juego.nombre}</h3>
                <div>
                    <p class="text-xs text-gray-300 mb-3">${juego.descripcion}</p>
                    <div class="space-y-1">
                        <div class="badge badge-outline ${juego.claseGenero} text-xs">Género: ${juego.genero}</div>
                        <div class="flex items-center text-sm font-bold text-warning">
                            ⭐ Calificación: <span class="ml-1">${juego.calificacion}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Aplica los filtros seleccionados a la lista de juegos.
 */
function filtrarJuegos() {
    // 1. Obtener todos los valores seleccionados
    const filtrosGenero = Array.from(document.querySelectorAll('.filtro-genero:checked')).map(cb => cb.value.toLowerCase());
    const filtrosContenido = Array.from(document.querySelectorAll('.filtro-contenido:checked')).map(cb => cb.value.toLowerCase());

    let juegosFiltrados = JUEGOS_CATALOGO;
    
    // 2. Aplicar el Filtro de Contenido
    // Si hay filtros de contenido seleccionados, el juego debe coincidir con alguno de ellos (Lógica OR)
    if (filtrosContenido.length > 0) {
        juegosFiltrados = juegosFiltrados.filter(juego => {
            // Un juego pasa si su campo 'genero' incluye el tipo de contenido seleccionado (Juego, Complemento, etc.)
            return filtrosContenido.some(filtro => juego.genero.toLowerCase().includes(filtro));
        });
    }
    
    // 3. Aplicar el Filtro de Género
    // Si hay filtros de género seleccionados, el juego debe coincidir con alguno de ellos (Lógica OR)
    if (filtrosGenero.length > 0) {
        juegosFiltrados = juegosFiltrados.filter(juego => {
            // Un juego pasa si su campo 'genero' incluye CUALQUIERA de los géneros seleccionados (Acción, RPG, etc.)
            return filtrosGenero.some(filtro => juego.genero.toLowerCase().includes(filtro));
        });
    }

    // 4. Actualizar el conteo de coincidencias (Opcional pero útil)
    const conteoElement = document.querySelector('p.text-sm.text-gray-400.mb-6');
    if (conteoElement) {
        conteoElement.textContent = `1-${juegosFiltrados.length} de 40 coincidencias`;
    }

    // 5. Renderizar los resultados
    renderizarCatalogo(juegosFiltrados);
}

/** * 2. FUNCIÓN DE RENDERIZADO
 * Renderiza la lista de juegos proporcionada en el contenedor.
 */
function renderizarCatalogo(juegosParaMostrar) {
    const contenedor = document.getElementById('juegos-container');
    
    if (contenedor) {
        let htmlJuegos = '';
        if (juegosParaMostrar.length === 0) {
            htmlJuegos = '<p class="text-xl text-gray-500 col-span-full py-10 text-center">No se encontraron juegos que coincidan con los filtros.</p>';
        } else {
            juegosParaMostrar.forEach(juego => {
                htmlJuegos += crearTarjetaJuego(juego);
            });
        }
        contenedor.innerHTML = htmlJuegos;
    } else {
        console.error('El contenedor #juegos-container no se encontró.');
    }
}

/**
 * 3. INICIALIZACIÓN Y EVENT LISTENERS
 * Configura los eventos al cargar la página.
 */
function inicializarCatalogo() {
    // 1. Renderiza todo el catálogo inicialmente
    renderizarCatalogo(JUEGOS_CATALOGO);

    // 2. Adjunta el event listener a todos los checkboxes de filtro
    const checkboxes = document.querySelectorAll('.filtro-control input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filtrarJuegos);
    });
}

// Ejecutar la función de inicialización al cargar el contenido
document.addEventListener('DOMContentLoaded', inicializarCatalogo);