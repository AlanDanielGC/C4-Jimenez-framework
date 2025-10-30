// 1. Introducción al lenguaje JavaScript
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

/**
 * Guarda el carrito actualizado en localStorage.
 * @param {Array} carrito - El array del carrito a guardar.
 */
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}




// 2. Manejo del framework (Sin cambios)
function actualizarInterfaz() {
    // Esta función ahora es reemplazada por actualizarBadgeCarrito
    actualizarBadgeCarrito();
}
// 3. Estructuras de control
function filtrarJuegosPorPrecio(juegos, precioMaximo) {
    return juegos.filter(juego => juego.precio <= precioMaximo);
}

// 4. Manipulación de objetos
class Juego {
    constructor(idJuego, titulo, precio, genero, imagen,descripcion) {
        this.idJuego = idJuego;
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
                    <button onclick="agregarAlCarrito(${this.idJuego})" class="btn btn-primary">
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
    new Juego(6, "Fantasy Quest", 44.99, "RPG", "assets/game6.jpg"),
    new Juego(7, "God of War Ragnarök", 55.99, "Acción, Aventura", "https://gmedia.playstation.com/is/image/SIEPDC/god-of-war-ragnarok-store-art-01-10sep21$ru?$800px--t$"),
    new Juego(8, "Marvel's Spider-Man 2", 59.49, "Acción, Aventura", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSgkrYsVQkBwTJ6YQ8JtkT-VwyvKnd9xjyeQ&s"),
    new Juego(9, "Horizon Forbidden West", 38.99, "Aventura, RPG", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJqEiv_2sYIxqGCeh14q42rN9nK68ewII8fg&s"),
    new Juego(10, "Uncharted 4: El Desenlace del Ladrón", 9.99, "Aventura", "https://i.imgur.com/f7jYyJv.jpeg"),
    new Juego(11, "Ghost of Tsushima Director's Cut", 41.99, "Acción, Aventura", "https://i.imgur.com/N4qgQ9a.jpeg"),
    new Juego(12, "The Last of Us Part I", 52.49, "Aventura, Terror", "https://i.imgur.com/T0bX6w2.jpeg"),
    new Juego(13, "Ratchet & Clank: Una Dimensión Aparte", 38.49, "Acción, Plataformas", "https://i.imgur.com/Q9mS2Z1.jpeg"),
    new Juego(14, "Assasin's Creed Valhalla", 23.99, "Acción, RPG", "https://i.imgur.com/L1d4gWv.jpeg"),
    new Juego(15, "Final Fantasy XVI", 62.99, "RPG de Acción", "https://i.imgur.com/rM1VfR9.jpeg"),
    new Juego(16, "Cyberpunk 2077", 29.99, "RPG", "https://i.imgur.com/s4G5K7B.jpeg"),
    new Juego(17, "The Witcher 3: Wild Hunt", 14.99, "RPG", "https://i.imgur.com/X0kZtJj.jpeg"),
    new Juego(18, "Persona 5 Royal", 32.99, "JRPG", "https://i.imgur.com/yFv6lE7.jpeg"),
    new Juego(19, "Diablo IV", 55.99, "RPG de Acción", "https://i.imgur.com/Hn2yE3j.jpeg"),
    new Juego(20, "Dragon Quest XI S", 17.49, "JRPG", "https://i.imgur.com/Q7J9vD6.jpeg"),
    new Juego(21, "Genshin Impact (Paquete de Resina)", 19.99, "Complemento, RPG", "https://i.imgur.com/jD1z7s2.jpeg"),
    new Juego(22, "Nier: Automata", 19.99, "RPG de Acción", "https://i.imgur.com/4aK5nZp.jpeg"),
    new Juego(23, "Mass Effect Legendary Edition", 26.99, "RPG, Ciencia Ficción", "https://i.imgur.com/dK5w8w3.jpeg"),
    new Juego(24, "Resident Evil 4 Remake", 41.99, "Terror, Acción", "https://i.imgur.com/p9vN4kY.jpeg"),
    new Juego(25, "Silent Hill 2 Remake", 62.99, "Terror Psicológico", "https://i.imgur.com/8mR9x0j.jpeg"),
    new Juego(26, "Dead Space Remake", 41.99, "Terror, Ciencia Ficción", "https://i.imgur.com/z4X5GvT.jpeg"),
    new Juego(27, "Alien: Isolation", 9.99, "Terror, Sigilo", "https://i.imgur.com/Q2hD0xK.jpeg"),
    new Juego(28, "Outlast Trinity", 19.99, "Terror de Supervivencia", "https://i.imgur.com/J3c0QpP.jpeg"),
    new Juego(29, "Amnesia: Rebirth", 14.99, "Terror Psicológico", "https://i.imgur.com/D8r1e2Q.jpeg"),
    new Juego(30, "Until Dawn", 7.99, "Terror Interactivo", "https://i.imgur.com/gK9J6rI.png"),
    new Juego(31, "EA Sports FC 25 (Pre-Order)", 66.49, "Deportes, FIFA", "https://i.imgur.com/a9JkR3L.png"),
    new Juego(32, "FIFA 23 Ultimate Edition", 13.99, "Deportes, FIFA", "https://i.imgur.com/b5U0h9j.jpeg"),
    new Juego(33, "FIFA 22 Standard Edition", 6.99, "Deportes, FIFA", "https://i.imgur.com/zX1N2vM.jpeg"),
    new Juego(34, "EA Sports FC Points Pack 5000", 44.99, "Complemento, FIFA", "https://i.imgur.com/uC7s2Pj.jpeg"),
    new Juego(35, "EA Sports FC 24", 48.99, "Deportes, FIFA", "https://i.imgur.com/rM1VfR9.jpeg"),
    new Juego(36, "FIFA 21 Edición Héroe", 3.49, "Deportes, FIFA", "https://i.imgur.com/w2Q4d3s.jpeg"),
    new Juego(37, "FIFA 20 Legacy Edition", 1.99, "Deportes, FIFA", "https://i.imgur.com/Z8N4j6q.jpeg"),
    new Juego(38, "EA Sports FC 24 Ultimate Points Pack 1000", 8.99, "Complemento, FIFA", "https://i.imgur.com/Q9mS2Z1.jpeg"),
    new Juego(39, "eFootball 2024 Premium Pass", 15.99, "Deportes, PES", "https://i.imgur.com/yFv6lE7.jpeg"),
    new Juego(40, "eFootball 2024 Starter Kit", 14.99, "Deportes, PES", "https://i.imgur.com/p9vN4kY.jpeg"),
    new Juego(41, "eFootball 2023 Club Edition: AC Milan", 8.99, "Deportes, PES", "https://i.imgur.com/w2Q4d3s.jpeg"),
    new Juego(42, "eFootball 2024 Monedas 1000", 8.99, "Complemento, PES", "https://i.imgur.com/D8r1e2Q.jpeg")
];

// Funciones de manipulación del DOM
function cargarJuegos() {
    const contenedor = document.getElementById('juegos-container');
    const juegosHTML = catalogoJuegos.map(juego => juego.crearElementoJuego()).join('');
    contenedor.innerHTML = juegosHTML;
}

function agregarAlCarrito(idJuego) {
    const idJuegoNum = parseInt(idJuego, 10);
    
    // Busca por 'idJuego' (como se define en tu clase)
    const juego = catalogoJuegos.find(j => j.idJuego === idJuegoNum);
    
    if (juego) {
        // Usa las funciones de localStorage
        const carrito = obtenerCarrito();
        carrito.push(juego); // Añadimos el objeto JUEGO completo
        guardarCarrito(carrito);
        
        actualizarBadgeCarrito(); // Actualiza el número
        
        mostrarNotificacion(`${juego.titulo} añadido al carrito`);
    } else {
        console.error(`No se encontró el juego con ID: ${idJuegoNum}`);
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
    actualizarBadgeCarrito();
agregarAlCarrito();
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

// Renderización de CATALOGO DE JUEGOS ////////////////////////////

/**
 * Función para generar el HTML de una tarjeta de juego (Ajustada para usar la clase Juego)
 * * FIX: Se ha modificado esta función para usar las propiedades correctas de la clase 'Juego'
 * (ej. 'titulo' en lugar de 'nombre', 'precio' en lugar de 'precioActual').
 * Esto corrige los 'undefined' y el desorden visual.
 */
function crearTarjetaJuego(juego) {
    // Esta función ahora renderiza usando las propiedades de la CLASE 'Juego'
    return `
        <div class="game-card card bg-base-300 shadow-xl overflow-hidden relative group cursor-pointer" id="juego-${juego.idJuego}">
            
            <div class="default-view transition-opacity duration-300">
                <figure><img src="${juego.imagen}" alt="${juego.titulo}" class="w-full h-48 object-cover"/></figure>
                
                <div class="card-body p-4">
                    <h2 class="card-title text-sm font-semibold truncate">${juego.titulo}</h2>
                    <p class="text-xs text-gray-400">${juego.genero}</p>
                    <div class="flex justify-between items-center pt-1">
                        <p class="new-price text-sm font-bold text-white">US$${juego.precio}</p>
                        </div>
                </div>
            </div>
            
            <div class="hover-details absolute inset-0 bg-black bg-opacity-95 p-4 opacity-0 transition-all duration-300 flex flex-col justify-between">
                <h3 class="text-lg font-bold text-white mb-2">${juego.titulo}</h3>
                <div>
                    <div class="space-y-1">
                        <div class="badge badge-outline text-xs">Género: ${juego.genero}</div>
                        </div>
                </div>
            </div>
            <button onclick="agregarAlCarrito(${juego.idJuego})" class="btn btn-primary btn-sm w-full mt-4">
                    Añadir al carrito
                </button>
        </div>
    `;
}
/**
 * APLICA FILTRADO Y ORDENAMIENTO (MODIFICADA)
 * Integra toda la lógica de filtrado y ordenamiento.
 */
function filtrarJuegos() {
    // 1. Obtener todos los valores seleccionados
    const filtrosGenero = Array.from(document.querySelectorAll('.filtro-genero:checked')).map(cb => cb.value.toLowerCase());
    const filtrosContenido = Array.from(document.querySelectorAll('.filtro-contenido:checked')).map(cb => cb.value.toLowerCase());

    let juegosFiltrados = catalogoJuegos; // Usamos catalogoJuegos como fuente
    
    // 2. Aplicar el Filtro de Contenido (Lógica OR)
    if (filtrosContenido.length > 0) {
        juegosFiltrados = juegosFiltrados.filter(juego => {
            /**
             * FIX: Lógica de filtrado de contenido mejorada.
             * Esto corrige el filtro de "Juegos" que no funcionaba.
             */
            return filtrosContenido.some(filtro => {
                const generoJuego = juego.genero.toLowerCase();
                if (filtro === 'juego') {
                    // Asume que es "Juego" si NO es "Complemento" o "Lote"
                    return !generoJuego.includes('complemento') && !generoJuego.includes('lote');
                }
                // Filtra por "Complemento" o "Lote" si existen
                return generoJuego.includes(filtro);
            });
        });
    }
    
    // 3. Aplicar el Filtro de Género (Lógica OR)
    if (filtrosGenero.length > 0) {
        // FIX: Se usa 'juego' (lowercase) como argumento
        juegosFiltrados = juegosFiltrados.filter(juego => {
            // El juego pasa si su campo 'genero' incluye CUALQUIERA de los géneros
            return filtrosGenero.some(filtro => juego.genero.toLowerCase().includes(filtro));
        });
    }

    // 4. APLICAR ORDENAMIENTO AL FINAL
    const juegosOrdenados = ordenarJuegos(juegosFiltrados);

    // 5. Actualizar el conteo de coincidencias
    const conteoElement = document.querySelector('p.text-sm.text-gray-400.mb-6');
    if (conteoElement) {
        conteoElement.textContent = `1-${juegosOrdenados.length} de ${catalogoJuegos.length} coincidencias`;
    }

    // 6. Renderizar los resultados ORDENADOS
    renderizarCatalogo(juegosOrdenados);
}

/** * 2. FUNCIÓN DE RENDERIZADO (MANTENIDA)
 * Renderiza la lista de juegos proporcionada en el contenedor.
 */
function renderizarCatalogo(juegosParaMostrar) {
    // Buscamos el contenedor específico del catálogo
    const contenedor = document.getElementById('catalogo-juegos-container'); // Asegúrate que tu HTML tenga este ID
    
    // Fallback al contenedor genérico si el específico no existe
    const contenedorGenerico = document.getElementById('juegos-container');
    const contenedorFinal = contenedor || contenedorGenerico;

    if (contenedorFinal) {
        let htmlJuegos = '';
        if (juegosParaMostrar.length === 0) {
            htmlJuegos = '<p class="text-xl text-gray-500 col-span-full py-10 text-center">No se encontraron juegos que coincidan con los filtros.</p>';
        } else {
            juegosParaMostrar.forEach(juego => {
                htmlJuegos += crearTarjetaJuego(juego);
            });
        }
        contenedorFinal.innerHTML = htmlJuegos;
    } else {
        console.error('El contenedor #catalogo-juegos-container o #juegos-container no se encontró.');
    }
}

/**
 * 3. INICIALIZACIÓN Y EVENT LISTENERS (MODIFICADA)
 * Configura los eventos al cargar la página.
 */
function inicializarCatalogo() {
    // Inicialmente se llama a filtrarJuegos, que a su vez llama a ordenarJuegos(catalogoJuegos)
    filtrarJuegos(); 

    // Adjunta el event listener a todos los checkboxes de filtro
    const checkboxes = document.querySelectorAll('.filtro-control input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filtrarJuegos); // Llama a filtrarJuegos en cada cambio
    });

    // CONFIGURAR EVENTOS DEL MENÚ DE ORDENAMIENTO
    const menuItems = document.querySelectorAll('#ordenar-menu a');
    const ordenTexto = document.getElementById('orden-actual-texto');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // 1. Actualiza el estado global de ordenamiento
            ordenActual = e.target.dataset.orden;
            
            // 2. Actualiza el texto del botón (si existe)
            if (ordenTexto) {
                ordenTexto.textContent = `Ordenar por: ${e.target.textContent.trim()}`;
            }
            
            // 3. Vuelve a filtrar y ordenar la lista completa
            filtrarJuegos(); // Llama a filtrarJuegos para reordenar la lista actual
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Siempre actualizar el badge al cargar cualquier página
    actualizarBadgeCarrito();

    // 2. Lógica Específica del INDEX
    if (document.getElementById('games-carousel')) {
        cargarJuegos(); 
        iniciarCarrusel();
        const initialIdx = getSlideIndexFromHash() || 1;
        setHeroToSlideIndex(initialIdx);

        window.addEventListener('hashchange', () => {
            const idx = getSlideIndexFromHash();
            if (idx) setHeroToSlideIndex(idx);
        });

        window.addEventListener('resize', () => {
            const carousel = document.getElementById('games-carousel');
            if (!carousel) return;
            const slideWidth = carousel.offsetWidth || 1;
            const index = Math.round(carousel.scrollLeft / slideWidth) + 1;
            setHeroToSlideIndex(index);
        });
    }

    // 3. Lógica Específica del CATÁLOGO
    if (document.querySelector('.filtro-control')) {
        inicializarCatalogo();
    }
    
    // 4. Lógica Específica del CARRITO
    if (document.getElementById('carrito-container')) {
        cargarPaginaCarrito();
    }
});
/**
 * FIX: Se modifica el DOMContentLoaded listener principal para que
 * llame a inicializarCatalogo() SÓLO si detecta que estamos en la página del catálogo
 * (buscando el contenedor de filtros).
 */
document.addEventListener('DOMContentLoaded', () => {
    // Código original para el index (carousel, etc.)
    if (document.getElementById('games-carousel')) {
        cargarJuegos(); // Carga los juegos del index
        iniciarCarrusel();
        const initialIdx = getSlideIndexFromHash() || 1;
        setHeroToSlideIndex(initialIdx);

        window.addEventListener('hashchange', () => {
            const idx = getSlideIndexFromHash();
            if (idx) setHeroToSlideIndex(idx);
        });

        window.addEventListener('resize', () => {
            const carousel = document.getElementById('games-carousel');
            if (!carousel) return;
            const slideWidth = carousel.offsetWidth || 1;
            const index = Math.round(carousel.scrollLeft / slideWidth) + 1;
            setHeroToSlideIndex(index);
        });
    }

    // Código para la página de Catálogo
    // Si encuentra los controles de filtro, inicializa el catálogo.
    if (document.querySelector('.filtro-control')) {
        inicializarCatalogo();
    }
});


///ORDENAR DE MAYOR A MENOR LOS JUEGOS ///


// Variable para rastrear el estado actual del ordenamiento
let ordenActual = 'precio_desc'; 

// Función auxiliar para obtener el precio como número
function getPrecioNumero(juego) {
    // FIX: Usa la propiedad 'precio' (que es un número) de la clase
    return juego.precio;
}

/**
 * Función que realiza la ordenación de la lista de juegos.
 */
function ordenarJuegos(juegos) {
    const juegosOrdenados = [...juegos];

    juegosOrdenados.sort((a, b) => {
        switch (ordenActual) {
            case 'precio_desc':
                // Precio (Mayor a Menor)
                return getPrecioNumero(b) - getPrecioNumero(a);
            case 'precio_asc':
                // Precio (Menor a Mayor)
                return getPrecioNumero(a) - getPrecioNumero(b);
            case 'nombre_asc':
                // FIX: Usar 'titulo' en lugar de 'nombre'
                return a.titulo.localeCompare(b.titulo);
            case 'descuento_desc':
                // FIX: 'descuento' no existe en la clase, este orden
                // no funcionará. Se deja un fallback a 0.
                const descA = parseFloat(a.descuento || '0');
                const descB = parseFloat(b.descuento || '0');
                return descB - descA;
            default:
                return 0;
        }
    });
    return juegosOrdenados;
}
/**
         * Función para remover un item del carrito.
         * Es llamada por el botón 'Quitar'
         */
        function removerItemDelCarrito(idJuego) {
            const idJuegoNum = parseInt(idJuego, 10);
            let carrito = obtenerCarrito(); // Función de logica.js
            
            // Filtramos el carrito para quitar el juego con el id
            const nuevoCarrito = carrito.filter(juego => juego.id !== idJuegoNum);
            
            guardarCarrito(nuevoCarrito); // Función de logica.js
            
            // Volvemos a cargar la vista del carrito
            cargarPaginaCarrito();
            actualizarBadgeCarrito(); // Función de logica.js
        }

        /**
         * Carga los items del carrito y calcula el total.
         */
        function cargarPaginaCarrito() {
            const carrito = obtenerCarrito(); // Función de logica.js
            const container = document.getElementById('carrito-container');
            const totalContainer = document.getElementById('total-container');

            container.innerHTML = ''; // Limpiamos el contenedor
            totalContainer.innerHTML = ''; // Limpiamos el total

            if (carrito.length === 0) {
                container.innerHTML = '<p class="text-2xl text-gray-500">Tu carrito está vacío.</p>';
                return;
            }

            let totalPagar = 0;

            // Iteramos sobre los juegos en el carrito
            carrito.forEach(juego => {
                // Acumulamos el precio total
                // 'juego.precio' ya es un número gracias a la Clase 'Juego'
                totalPagar += juego.precio;

                // Creamos el HTML para cada item
                const itemHTML = `
                    <div class="card card-side bg-base-300 shadow-xl flex items-center">
                        <figure class="w-32 h-32 flex-shrink-0">
                            <img src="${juego.imagen}" alt="${juego.titulo}" class="w-full h-full object-cover"/>
                        </figure>
                        <div class="card-body p-4">
                            <h2 class="card-title">${juego.titulo}</h2>
                            <p class="text-gray-400">${juego.genero}</p>
                            <div class="card-actions justify-between items-center">
                                <span class="text-xl font-bold">US$${juego.precio.toFixed(2)}</span>
                                <button onclick="removerItemDelCarrito(${juego.id})" class="btn btn-error btn-sm">
                                    Quitar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += itemHTML;
            });

            // Creamos el HTML para el total
            const totalHTML = `
                <div class="divider"></div>
                <h2 class="text-3xl font-bold">Total: US$ ${totalPagar.toFixed(2)}</h2>
                <button class="btn btn-primary btn-lg mt-4">Proceder al Pago</button>
            `;
            totalContainer.innerHTML = totalHTML;
        }

        // Event listener para cuando la página 'carrito.html' cargue
        document.addEventListener('DOMContentLoaded', () => {
            // No llamamos a 'inicializarCatalogo' ni 'iniciarCarrusel' aquí
            // Solo cargamos el carrito.
            cargarPaginaCarrito();
            
            // 'actualizarBadgeCarrito' ya se llama en el DOMContentLoaded de logica.js
            // pero lo llamamos de nuevo por si acaso.
            actualizarBadgeCarrito(); 
        });