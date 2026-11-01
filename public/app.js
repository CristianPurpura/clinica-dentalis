document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const formMessage = document.getElementById('formMessage');

    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.min = today;
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const servicio = document.getElementById('servicio').value;
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;

            if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
                showFeedback('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            const submitButton = form.querySelector('[data-testid="btn-agendar"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Agendando...';
            }

            try {
                const response = await fetch('/api/agendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, telefono, servicio, fecha, hora })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showFeedback(`¡Turno confirmado con éxito, ${nombre}! Te hemos enviado los detalles a ${email}.`, 'success');
                    form.reset();
                } else {
                    showFeedback(result.message || 'Error al agendar el turno.', 'error');
                }
            } catch (error) {
                showFeedback('Error de conexión con el servidor.', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Confirmar Turno';
                }
            }
        });
    }

    function showFeedback(message, type) {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 6000);
        }
    }
    // Dark Mode Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            let theme = 'light';
            if (body.classList.contains('dark-mode')) {
                theme = 'dark';
                themeToggleBtn.textContent = '☀️';
            } else {
                themeToggleBtn.textContent = '🌙';
            }
            localStorage.setItem('theme', theme);
        });
    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        // Cerrar menú al hacer clic en un enlace
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
    }

    }

});

