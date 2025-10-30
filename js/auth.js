(function () {
    const USERS_XML_PATH = "xml/datos.xml";
    const STORAGE_KEY = "c4games:session";

    const state = {
        users: null,
        loadPromise: null
    };

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function toggleProcessing(form, show, message = "Procesando...") {
        if (!form) {
            return;
        }
        const card = form.closest('.card');
        if (!card) {
            return;
        }
        let overlay = card.querySelector('[data-auth-processing]');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.dataset.authProcessing = "true";
                overlay.className = "absolute inset-0 bg-base-200 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-base-content";
                overlay.innerHTML = `
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                    <p class="text-sm font-semibold" data-auth-processing-text></p>
                `;
                overlay.setAttribute("role", "status");
                overlay.setAttribute("aria-live", "polite");
                card.appendChild(overlay);
            }
            const textNode = overlay.querySelector('[data-auth-processing-text]');
            if (textNode) {
                textNode.textContent = message;
            }
        } else if (overlay) {
            overlay.remove();
        }
    }

    async function loadUsersFromXml() {
        try {
            const response = await fetch(USERS_XML_PATH, { cache: "no-cache" });
            if (!response.ok) {
                throw new Error("No se pudo cargar el catálogo de usuarios.");
            }
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");
            if (xmlDoc.querySelector("parsererror")) {
                throw new Error("El archivo de usuarios contiene errores de formato.");
            }
            const usuarios = Array.from(xmlDoc.querySelectorAll("usuario"));
            return usuarios.map((node) => ({
                id: (node.getAttribute("id") || "").trim(),
                nombre: (node.querySelector("nombre")?.textContent || "").trim(),
                email: (node.querySelector("email")?.textContent || "").trim().toLowerCase(),
                password: (node.querySelector("password")?.textContent || "").trim()
            }));
        } catch (error) {
            console.error("C4Auth: error al cargar usuarios", error);
            throw error;
        }
    }

    async function ensureUsers() {
        if (Array.isArray(state.users) && state.users.length) {
            return state.users;
        }
        if (state.loadPromise) {
            return state.loadPromise;
        }
        state.loadPromise = loadUsersFromXml()
            .then((users) => {
                state.users = users;
                return users;
            })
            .catch((error) => {
                state.loadPromise = null;
                throw error;
            });
        return state.loadPromise;
    }

    async function login(email, password) {
        const normalizedEmail = (email || "").trim().toLowerCase();
        const normalizedPassword = (password || "").trim();
        if (!normalizedEmail || !normalizedPassword) {
            throw new Error("Debes completar ambos campos.");
        }
        const users = await ensureUsers();
        const matchedUser = users.find((user) => user.email === normalizedEmail);
        if (!matchedUser || matchedUser.password !== normalizedPassword) {
            throw new Error("Credenciales incorrectas. Intenta nuevamente.");
        }
        setSession(matchedUser);
        return matchedUser;
    }

    function setSession(user) {
        const sessionPayload = {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionPayload));
        } catch (error) {
            console.warn("C4Auth: no se pudo guardar la sesión", error);
        }
    }

    function getSession() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (error) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }

    function clearSession() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function getFirstName(nombre) {
        if (!nombre) {
            return "Usuario";
        }
        const parts = nombre.trim().split(/\s+/);
        return parts.length ? parts[0] : nombre;
    }

    function refreshLoginLinks() {
        const links = document.querySelectorAll("[data-auth-login-link]");
        const session = getSession();
        links.forEach((link) => {
            if (!link.dataset.authClickBound) {
                link.addEventListener("click", handleLoginLinkClick);
                link.dataset.authClickBound = "true";
            }
            if (session) {
                link.textContent = `Hola, ${getFirstName(session.nombre)}`;
                link.href = "#";
                link.classList.remove("btn-ghost");
                link.classList.add("btn-secondary");
                link.dataset.authState = "logged-in";
                link.setAttribute("aria-label", `Sesión iniciada como ${session.nombre}. Clic para cerrar sesión.`);
            } else {
                link.textContent = "Iniciar Sesión";
                link.href = "login.html";
                link.classList.remove("btn-secondary");
                link.classList.add("btn-ghost");
                link.dataset.authState = "logged-out";
                link.setAttribute("aria-label", "Ir a la página de inicio de sesión");
            }
        });
    }

    function handleLoginLinkClick(event) {
        const session = getSession();
        if (!session) {
            return;
        }
        event.preventDefault();
        clearSession();
        refreshLoginLinks();
        showToast("Sesión cerrada correctamente.");
    }

    function bindLoginForm() {
        const form = document.getElementById("login-form");
        if (!form) {
            return;
        }
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const submitButton = form.querySelector("[data-auth-submit]");
        const feedback = document.getElementById("login-feedback");

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (feedback) {
                feedback.classList.add("hidden");
                feedback.classList.remove("text-error", "text-success");
                feedback.textContent = "";
            }
            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add("loading");
                }
                toggleProcessing(form, true, "Comprobando datos...");
                await sleep(950);
                const user = await login(emailInput?.value, passwordInput?.value);
                if (feedback) {
                    feedback.textContent = `¡Bienvenido, ${getFirstName(user.nombre)}! Redirigiendo...`;
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-success");
                }
                refreshLoginLinks();
                const redirectTo = form.dataset.redirect || "index.html";
                setTimeout(() => {
                    window.location.href = redirectTo;
                }, 900);
            } catch (error) {
                const message = error?.message || "Ocurrió un error al iniciar sesión.";
                if (feedback) {
                    feedback.textContent = message;
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                } else {
                    showToast(message, true);
                }
            } finally {
                toggleProcessing(form, false);
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove("loading");
                }
            }
        });
    }

    function showToast(message, isError = false) {
        const existing = document.querySelector('.toast[data-auth-toast]');
        const toast = existing || document.createElement('div');
        toast.dataset.authToast = "true";
        toast.className = "toast toast-end z-50";
        toast.innerHTML = `
            <div class="alert ${isError ? "alert-error" : "alert-success"}">
                <span>${message}</span>
            </div>
        `;
        if (!existing) {
            document.body.appendChild(toast);
        }
        setTimeout(() => {
            toast.remove();
        }, 2500);
    }

    document.addEventListener("DOMContentLoaded", () => {
        refreshLoginLinks();
        bindLoginForm();
        ensureUsers().catch(() => {
            console.warn("No se pudieron precargar los usuarios. Se intentará al iniciar sesión.");
        });
    });

    window.C4Auth = {
        login,
        logout: clearSession,
        getCurrentUser: getSession,
        refreshLoginLinks
    };
})();
