(function () {
    const USERS_XML_PATH = "xml/datos.xml";
    const STORAGE_KEY = "c4games:session";
    const EXTRA_USERS_KEY = "c4games:users-extra";
    const PASSWORD_OVERRIDES_KEY = "c4games:password-overrides";
    const RESET_PENDING_KEY = "c4games:reset-pending";

    const state = {
        baseUsers: null,
        loadPromise: null
    };

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function normalizeEmail(value) {
        return (value || "").trim().toLowerCase();
    }

    function normalizePassword(value) {
        return (value || "").trim();
    }

    function isValidEmail(value) {
        const email = normalizeEmail(value);
        if (!email) {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    }

    function getExtraUsers() {
        const raw = localStorage.getItem(EXTRA_USERS_KEY);
        if (!raw) {
            return [];
        }
        try {
            const data = JSON.parse(raw);
            if (!Array.isArray(data)) {
                return [];
            }
            return data
                .map((user) => ({
                    id: (user.id || "").toString(),
                    nombre: (user.nombre || "").toString().trim(),
                    email: normalizeEmail(user.email),
                    password: normalizePassword(user.password)
                }))
                .filter((user) => user.email && user.password);
        } catch (error) {
            console.warn("C4Auth: extra users corrupt, resetting", error);
            localStorage.removeItem(EXTRA_USERS_KEY);
            return [];
        }
    }

    function saveExtraUsers(users) {
        try {
            localStorage.setItem(EXTRA_USERS_KEY, JSON.stringify(users));
        } catch (error) {
            console.warn("C4Auth: no se pudieron guardar usuarios locales", error);
        }
    }

    function getPasswordOverrides() {
        const raw = localStorage.getItem(PASSWORD_OVERRIDES_KEY);
        if (!raw) {
            return {};
        }
        try {
            const data = JSON.parse(raw);
            if (typeof data !== "object" || data === null) {
                return {};
            }
            const normalized = {};
            Object.keys(data).forEach((key) => {
                const email = normalizeEmail(key);
                const password = normalizePassword(data[key]);
                if (email && password) {
                    normalized[email] = password;
                }
            });
            return normalized;
        } catch (error) {
            console.warn("C4Auth: overrides corrupt, resetting", error);
            localStorage.removeItem(PASSWORD_OVERRIDES_KEY);
            return {};
        }
    }

    function savePasswordOverrides(overrides) {
        try {
            localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides));
        } catch (error) {
            console.warn("C4Auth: no se pudieron guardar overrides", error);
        }
    }

    function markResetEmail(email) {
        try {
            sessionStorage.setItem(RESET_PENDING_KEY, normalizeEmail(email));
        } catch (error) {
            console.warn("C4Auth: no se pudo marcar reset", error);
        }
    }

    function hasResetEmail(email) {
        const normalizedEmail = normalizeEmail(email);
        const stored = sessionStorage.getItem(RESET_PENDING_KEY);
        return stored === normalizedEmail;
    }

    function consumeResetEmail(email) {
        const normalizedEmail = normalizeEmail(email);
        const stored = sessionStorage.getItem(RESET_PENDING_KEY);
        if (stored && stored === normalizedEmail) {
            sessionStorage.removeItem(RESET_PENDING_KEY);
            return true;
        }
        return false;
    }

    function mergeWithExtras(baseUsers) {
        return [...baseUsers, ...getExtraUsers()];
    }

    function generateExtraUserId() {
        return `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    function toggleProcessing(form, show, message = "Procesando...") {
        if (!form) {
            return;
        }
        const container = form.closest('.card, .modal-box');
        if (!container) {
            return;
        }
        container.classList.add('relative');
        let overlay = container.querySelector('[data-auth-processing]');
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
                container.appendChild(overlay);
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

    async function ensureBaseUsers() {
        if (Array.isArray(state.baseUsers) && state.baseUsers.length) {
            return state.baseUsers;
        }
        if (state.loadPromise) {
            return state.loadPromise;
        }
        state.loadPromise = loadUsersFromXml()
            .then((users) => {
                state.baseUsers = users;
                return users;
            })
            .catch((error) => {
                state.loadPromise = null;
                throw error;
            });
        return state.loadPromise;
    }

    async function ensureUsers() {
        const base = await ensureBaseUsers();
        return mergeWithExtras(base);
    }

    async function login(email, password) {
        const normalizedEmail = normalizeEmail(email);
        const normalizedPassword = normalizePassword(password);
        if (!normalizedEmail || !normalizedPassword) {
            throw new Error("Debes completar ambos campos.");
        }
        if (!isValidEmail(normalizedEmail)) {
            throw new Error("Ingresa un email válido.");
        }
        const users = await ensureUsers();
        const matchedUser = users.find((user) => user.email === normalizedEmail);
        if (!matchedUser) {
            throw new Error("Credenciales incorrectas. Intenta nuevamente.");
        }
        const overrides = getPasswordOverrides();
        const expectedPassword = overrides[normalizedEmail] || matchedUser.password;
        if (expectedPassword !== normalizedPassword) {
            throw new Error("Credenciales incorrectas. Intenta nuevamente.");
        }
        setSession(matchedUser);
        return matchedUser;
    }

    async function registerUser({ nombre, email, password }) {
        const trimmedName = (nombre || "").toString().trim();
        const normalizedEmail = normalizeEmail(email);
        const normalizedPassword = normalizePassword(password);
        if (!trimmedName || trimmedName.length < 3) {
            throw new Error("Ingresa tu nombre completo.");
        }
        if (!isValidEmail(normalizedEmail)) {
            throw new Error("Ingresa un email válido.");
        }
        if (!normalizedPassword || normalizedPassword.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        const currentUsers = await ensureUsers();
        const emailTaken = currentUsers.some((user) => user.email === normalizedEmail);
        if (emailTaken) {
            throw new Error("Ya existe una cuenta registrada con ese correo.");
        }
        const extras = getExtraUsers();
        const newUser = {
            id: generateExtraUserId(),
            nombre: trimmedName,
            email: normalizedEmail,
            password: normalizedPassword
        };
        extras.push(newUser);
        saveExtraUsers(extras);
        return newUser;
    }

    async function recoverPassword(email) {
        const normalizedEmail = normalizeEmail(email);
        if (!isValidEmail(normalizedEmail)) {
            throw new Error("Ingresa un email válido.");
        }
        const users = await ensureUsers();
        const foundUser = users.find((user) => user.email === normalizedEmail);
        if (!foundUser) {
            throw new Error("No encontramos una cuenta con ese correo.");
        }
        await sleep(850);
        return foundUser;
    }

    async function updatePasswordForEmail(email, newPassword) {
        const normalizedEmail = normalizeEmail(email);
        if (!isValidEmail(normalizedEmail)) {
            throw new Error("Ingresa un email válido.");
        }
        const normalizedPassword = normalizePassword(newPassword);
        if (!normalizedPassword || normalizedPassword.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        const users = await ensureUsers();
        const target = users.find((user) => user.email === normalizedEmail);
        if (!target) {
            throw new Error("No encontramos una cuenta vinculada a ese correo.");
        }
        const extras = getExtraUsers();
        const extraIndex = extras.findIndex((user) => user.email === normalizedEmail);
        if (extraIndex >= 0) {
            extras[extraIndex].password = normalizedPassword;
            saveExtraUsers(extras);
        } else {
            const overrides = getPasswordOverrides();
            overrides[normalizedEmail] = normalizedPassword;
            savePasswordOverrides(overrides);
        }
        return {
            email: normalizedEmail,
            nombre: target.nombre
        };
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

    function performLogout({ redirect = true, onCloseMenu } = {}) {
        clearSession();
        refreshLoginLinks();
        if (typeof onCloseMenu === 'function') {
            onCloseMenu();
        }
        showToast('Sesión cerrada correctamente.');
        if (redirect && !window.location.pathname.toLowerCase().endsWith('login.html')) {
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 600);
        }
    }

    function getDisplayName(nombre) {
        if (!nombre) {
            return "Usuario";
        }
        const parts = nombre.trim().split(/\s+/);
        return parts.length ? parts[0] : nombre;
    }

    function refreshLoginLinks() {
        const session = getSession();
        const loginButtons = document.querySelectorAll('[data-auth-login-link]');
        const greetings = document.querySelectorAll('[data-auth-greeting]');
        const logoutButtons = document.querySelectorAll('[data-auth-logout]');

        loginButtons.forEach((button) => {
            if (!button.dataset.authLoginBound) {
                button.addEventListener('click', (event) => {
                    const activeSession = getSession();
                    if (activeSession) {
                        return;
                    }
                    event.preventDefault();
                    window.location.href = 'login.html';
                });
                button.dataset.authLoginBound = 'true';
            }

            if (session) {
                button.classList.add('hidden');
            } else {
                button.classList.remove('hidden');
                button.textContent = 'Iniciar Sesión';
                button.setAttribute('aria-label', 'Ir a la página de inicio de sesión');
            }
        });

        greetings.forEach((node) => {
            if (session) {
                node.textContent = `Hola, ${getDisplayName(session.nombre)}`;
                node.classList.remove('hidden');
                node.setAttribute('aria-label', `Sesión iniciada como ${session.nombre}`);
            } else {
                node.textContent = '';
                node.classList.add('hidden');
                node.removeAttribute('aria-label');
            }
        });

        logoutButtons.forEach((button) => {
            if (!button.dataset.authLogoutBound) {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const confirmLogout = window.confirm('¿Seguro que deseas cerrar sesión?');
                    if (!confirmLogout) {
                        return;
                    }
                    performLogout();
                });
                button.dataset.authLogoutBound = 'true';
            }

            if (session) {
                button.classList.remove('hidden');
                button.setAttribute('aria-label', 'Cerrar sesión');
            } else {
                button.classList.add('hidden');
                button.removeAttribute('aria-label');
            }
        });
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
                const emailValue = emailInput?.value || "";
                if (!isValidEmail(emailValue)) {
                    throw new Error("Ingresa un email válido.");
                }
                const user = await login(emailValue, passwordInput?.value);
                if (feedback) {
                    feedback.textContent = `¡Bienvenido, ${getDisplayName(user.nombre)}! Redirigiendo...`;
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

    function bindRegisterForm() {
        const modal = document.getElementById("register-modal");
        const form = document.getElementById("register-form");
        const feedback = document.getElementById("register-feedback");
        if (!modal || !form) {
            return;
        }
        const nameInput = form.querySelector('input[name="nombre"]');
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const confirmInput = form.querySelector('input[name="passwordConfirm"]');
        const submitButton = form.querySelector('[data-auth-register-submit]');
        const cancelButtons = modal.querySelectorAll('[data-auth-register-cancel]');

        function openModal(prefillEmail = "") {
            form.reset();
            toggleProcessing(form, false);
            if (feedback) {
                feedback.classList.add("hidden");
                feedback.classList.remove("text-error", "text-success");
                feedback.textContent = "";
            }
            if (prefillEmail && emailInput) {
                emailInput.value = prefillEmail;
            }
            if (typeof modal.showModal === "function") {
                modal.showModal();
            } else {
                modal.setAttribute("open", "true");
            }
            setTimeout(() => {
                (nameInput || emailInput)?.focus();
            }, 75);
        }

        function closeModal() {
            toggleProcessing(form, false);
            if (typeof modal.close === "function") {
                modal.close();
            } else {
                modal.removeAttribute("open");
            }
        }

        const triggers = document.querySelectorAll('[data-auth-register]');
        triggers.forEach((trigger) => {
            if (trigger.dataset.authRegisterBound) {
                return;
            }
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                const loginEmail = document.getElementById("login-email");
                const prefill = loginEmail?.value || "";
                openModal(prefill);
            });
            trigger.dataset.authRegisterBound = "true";
        });

        cancelButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                closeModal();
            });
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (feedback) {
                feedback.classList.add("hidden");
                feedback.classList.remove("text-error", "text-success");
                feedback.textContent = "";
            }
            const nameValue = nameInput?.value || "";
            const emailValue = emailInput?.value || "";
            const passwordValue = passwordInput?.value || "";
            const confirmValue = confirmInput?.value || "";

            if (!nameValue.trim()) {
                if (feedback) {
                    feedback.textContent = "Ingresa tu nombre completo.";
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                }
                (nameInput || emailInput)?.focus();
                return;
            }
            if (!isValidEmail(emailValue)) {
                if (feedback) {
                    feedback.textContent = "Ingresa un email válido.";
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                }
                emailInput?.focus();
                return;
            }
            if (passwordValue.length < 6) {
                if (feedback) {
                    feedback.textContent = "La contraseña debe tener al menos 6 caracteres.";
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                }
                passwordInput?.focus();
                return;
            }
            if (passwordValue !== confirmValue) {
                if (feedback) {
                    feedback.textContent = "Las contraseñas no coinciden.";
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                }
                confirmInput?.focus();
                return;
            }

            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add("loading");
                }
                toggleProcessing(form, true, "Creando cuenta...");
                await sleep(950);
                const newUser = await registerUser({
                    nombre: nameValue,
                    email: emailValue,
                    password: passwordValue
                });
                const autoLogin = form.dataset.autologin !== "false";
                if (autoLogin) {
                    await login(emailValue, passwordValue);
                    refreshLoginLinks();
                }
                if (feedback) {
                    feedback.textContent = autoLogin ? `¡Cuenta creada! Bienvenido, ${getDisplayName(newUser.nombre)}.` : "Cuenta creada. Ya puedes iniciar sesión.";
                    feedback.classList.remove("hidden");
                    feedback.classList.remove("text-error");
                    feedback.classList.add("text-success");
                }
                showToast(autoLogin ? "Sesión iniciada correctamente." : "Cuenta creada correctamente.");
                form.reset();
                const redirectTo = form.dataset.redirect || "index.html";
                setTimeout(() => {
                    closeModal();
                    if (autoLogin) {
                        window.location.href = redirectTo;
                    }
                }, 900);
            } catch (error) {
                const message = error?.message || "No se pudo crear la cuenta.";
                if (feedback) {
                    feedback.textContent = message;
                    feedback.classList.remove("hidden");
                    feedback.classList.remove("text-success");
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

    function bindForgotPasswordForm() {
        const modal = document.getElementById("forgot-modal");
        const form = document.getElementById("forgot-form");
        const feedback = document.getElementById("forgot-feedback");
        if (!modal || !form) {
            return;
        }
        const emailInput = form.querySelector('input[name="email"]');
        const submitButton = form.querySelector('[data-auth-forgot-submit]');
        const cancelButtons = modal.querySelectorAll('[data-auth-forgot-cancel]');

        function openModal(prefillEmail = "") {
            form.reset();
            toggleProcessing(form, false);
            if (feedback) {
                feedback.classList.add("hidden");
                feedback.classList.remove("text-error", "text-success");
                feedback.textContent = "";
            }
            if (prefillEmail && emailInput) {
                emailInput.value = prefillEmail;
            }
            if (typeof modal.showModal === "function") {
                modal.showModal();
            } else {
                modal.setAttribute("open", "true");
            }
            setTimeout(() => emailInput?.focus(), 75);
        }

        function closeModal() {
            toggleProcessing(form, false);
            if (typeof modal.close === "function") {
                modal.close();
            } else {
                modal.removeAttribute("open");
            }
        }

        const triggers = document.querySelectorAll('[data-auth-forgot]');
        triggers.forEach((trigger) => {
            if (trigger.dataset.authForgotBound) {
                return;
            }
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                const loginEmail = document.getElementById("login-email");
                const prefill = loginEmail?.value || "";
                openModal(prefill);
            });
            trigger.dataset.authForgotBound = "true";
        });

        cancelButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                closeModal();
            });
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (feedback) {
                feedback.classList.add("hidden");
                feedback.classList.remove("text-error", "text-success");
                feedback.textContent = "";
            }
            const emailValue = emailInput?.value || "";
            if (!isValidEmail(emailValue)) {
                if (feedback) {
                    feedback.textContent = "Ingresa un email válido.";
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                }
                emailInput?.focus();
                return;
            }
            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add("loading");
                }
                toggleProcessing(form, true, "Enviando instrucciones...");
                const user = await recoverPassword(emailValue);
                markResetEmail(emailValue);
                if (feedback) {
                    feedback.textContent = `Listo, ${getDisplayName(user.nombre)}. Revisa tu bandeja de entrada (simulación).`;
                    feedback.classList.remove("hidden");
                    feedback.classList.remove("text-error");
                    feedback.classList.add("text-success");
                }
                showToast("Enviamos las instrucciones a tu correo.");
                setTimeout(() => {
                    toggleProcessing(form, false);
                    closeModal();
                    window.location.href = `reset.html?email=${encodeURIComponent(emailValue)}`;
                }, 900);
            } catch (error) {
                const message = error?.message || "No se pudo procesar la solicitud.";
                if (feedback) {
                    feedback.textContent = message;
                    feedback.classList.remove("hidden");
                    feedback.classList.remove("text-success");
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

    function bindResetForm() {
        const form = document.getElementById("reset-form");
        if (!form) {
            return;
        }
        const passwordInput = form.querySelector('input[name="password"]');
        const confirmInput = form.querySelector('input[name="passwordConfirm"]');
        const submitButton = form.querySelector('[data-auth-reset-submit]');
        const feedback = document.getElementById("reset-feedback");
        const emailTargets = document.querySelectorAll('[data-auth-reset-email]');

        const params = new URLSearchParams(window.location.search || "");
        const emailParam = params.get("email") || "";
        const normalizedEmail = normalizeEmail(emailParam);
        form.dataset.email = normalizedEmail;

        const displayEmail = normalizedEmail || "correo desconocido";
        emailTargets.forEach((node) => {
            node.textContent = displayEmail;
        });

        function disableForm(message) {
            if (feedback) {
                feedback.textContent = message;
                feedback.classList.remove("hidden");
                feedback.classList.remove("text-success");
                feedback.classList.add("text-error");
            }
            [passwordInput, confirmInput, submitButton].forEach((el) => {
                if (el) {
                    el.disabled = true;
                }
            });
        }

        if (!isValidEmail(normalizedEmail)) {
            disableForm("El enlace de recuperación no es válido.");
            return;
        }

        ensureUsers()
            .then((users) => {
                const exists = users.some((user) => user.email === normalizedEmail);
                if (!exists) {
                    disableForm("No encontramos una cuenta asociada a este enlace.");
                } else if (!hasResetEmail(normalizedEmail)) {
                    disableForm("El enlace venció o ya fue utilizado. Solicítalo nuevamente.");
                }
            })
            .catch(() => {
                disableForm("No se pudo verificar el enlace en este momento.");
            });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (feedback) {
                feedback.classList.add("hidden");
                feedback.classList.remove("text-error", "text-success");
                feedback.textContent = "";
            }
            const passwordValue = passwordInput?.value || "";
            const confirmValue = confirmInput?.value || "";
            if (passwordValue.length < 6) {
                if (feedback) {
                    feedback.textContent = "La contraseña debe tener al menos 6 caracteres.";
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                }
                passwordInput?.focus();
                return;
            }
            if (passwordValue !== confirmValue) {
                if (feedback) {
                    feedback.textContent = "Las contraseñas no coinciden.";
                    feedback.classList.remove("hidden");
                    feedback.classList.add("text-error");
                }
                confirmInput?.focus();
                return;
            }
            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add("loading");
                }
                toggleProcessing(form, true, "Actualizando contraseña...");
                const result = await updatePasswordForEmail(normalizedEmail, passwordValue);
                consumeResetEmail(normalizedEmail);
                showToast("Contraseña restablecida con éxito.");
                if (feedback) {
                    feedback.textContent = `Contraseña actualizada para ${getDisplayName(result.nombre)}.`;
                    feedback.classList.remove("hidden");
                    feedback.classList.remove("text-error");
                    feedback.classList.add("text-success");
                }
                form.reset();
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            } catch (error) {
                const message = error?.message || "No se pudo restablecer la contraseña.";
                if (feedback) {
                    feedback.textContent = message;
                    feedback.classList.remove("hidden");
                    feedback.classList.remove("text-success");
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
        bindRegisterForm();
        bindForgotPasswordForm();
        bindResetForm();
        ensureUsers().catch(() => {
            console.warn("No se pudieron precargar los usuarios. Se intentará al iniciar sesión.");
        });
    });

    window.C4Auth = {
        login,
        register: registerUser,
        recover: recoverPassword,
        updatePassword: updatePasswordForEmail,
        logout: performLogout,
        getCurrentUser: getSession,
        refreshLoginLinks
    };
})();
