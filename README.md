# 🦷 Clínica Dentalis - Landing Page & Sistema de Agendamiento de Turnos

Landing page minimalista, profesional y moderna desarrollada para una firma de odontólogos, construida con **HTML5, CSS3 y JavaScript puro** en el frontend, y un backend robusto en **Node.js (Express)** que integra **Nodemailer** para notificaciones por correo y la **API de Google Calendar** para la sincronización automática de citas médicas.

---

## 🚀 Características Principales

- **Diseño Minimalista y Responsive**: Interfaz elegante inspirada en las mejores prácticas de UI/UX, adaptada a dispositivos móviles, tablets y escritorios.
- **Secciones Clave**:
  - **Hero Section**: Propuesta de valor, llamadas a la acción (CTA) y métricas de confianza.
  - **Especialidades / Servicios**: Blanqueamiento LED, Ortodoncia Invisible, Implantes Dentales y Odontología Preventiva.
  - **Sobre Nosotros**: Filosofía de la clínica, tecnología digital 3D y protocolos de bioseguridad.
  - **Formulario de Turnos Online**: Interfaz rápida y validada en tiempo real.
- **Requisito Estricto de QA (Atributos `data-testid`)**:
  - Todos los campos de entrada, selects, botones interactivos y contenedores estructurales incluyen el atributo `data-testid` (ej. `data-testid="input-nombre"`, `data-testid="btn-agendar"`, `data-testid="select-servicio"`) para facilitar pruebas automatizadas (Cypress, Playwright, Selenium).
- **Backend Integrado**:
  - **Google Calendar API**: Crea automáticamente el evento en el calendario de la clínica al confirmar un turno.
  - **Nodemailer (SMTP Gmail)**: Envía un correo electrónico personalizado de confirmación al paciente con los detalles de su cita.

---

## 🛠️ Estructura del Proyecto

```text
Pagina dentista/
├── public/                <-- Archivos estáticos del frontend
│   ├── index.html         <-- Estructura principal y secciones
│   ├── style.css          <-- Estilos modernos y responsive
│   └── app.js             <-- Lógica del cliente y validación del formulario
├── .env                   <-- Variables de entorno y credenciales secretas
├── credentials.json       <-- Clave privada de Google Cloud (Service Account)
├── package.json           <-- Dependencias y scripts de Node.js
├── server.js              <-- Servidor backend en Express, Google Calendar y Nodemailer
└── README.md              <-- Documentación detallada del proyecto
```

---

- **Modo Oscuro (Dark Mode)**: Botón interactivo en la barra de navegación que permite alternar entre modo claro y oscuro, con persistencia automática de preferencia en `localStorage`.
## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu equipo:
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
- Una cuenta de correo Gmail (para el servicio de envío de correos).
- Acceso a [Google Cloud Console](https://console.cloud.google.com/) para generar las credenciales de Google Calendar.

---

## 📦 Instalación y Configuración Paso a Paso

### 1. Clonar o ubicar el proyecto
Abre una terminal en la carpeta raíz del proyecto:
```bash
cd "c:\Users\lenovo\OneDrive\Escritorio\Pagina dentista"
```

### 2. Instalar dependencias
Instala los paquetes necesarios definidos en el `package.json` (`express`, `cors`, `dotenv`, `nodemailer`, `googleapis`):
```bash
npm install
```

### 3. Configurar las Variables de Entorno (`.env`)
Crea o verifica que el archivo `.env` en la raíz contenga tus datos de configuración:
```env
PORT=3000
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_gmail
DENTIST_EMAIL=correo_del_dentista@gmail.com
CALENDAR_ID=correo_del_dentista@gmail.com
```
*(Nota: Para `EMAIL_PASS`, debes generar una "Contraseña de aplicación" desde la configuración de seguridad de tu cuenta de Google).*

### 4. Configurar Google Calendar API (Service Account)
1. Ve a [Google Cloud Console](https://console.cloud.google.com/) y crea un proyecto.
2. Habilita la **Google Calendar API**.
3. Crea una **Service Account (Cuenta de Servicio)** y descarga el archivo JSON de credenciales.
4. Renombra ese archivo como **`credentials.json`** y colócalo en la raíz del proyecto (`Pagina dentista/credentials.json`).
5. Comparte tu calendario de Google con el correo de la cuenta de servicio (ejemplo: `nombre-bot@proyecto.iam.gserviceaccount.com`) otorgándole permisos de **"Realizar cambios en los eventos"**.

---

## 🏃‍♂️ Ejecución del Proyecto

Para iniciar el servidor backend y servir la landing page, ejecuta:

```bash
npm start
```

O bien:
```bash
node server.js
```

El servidor se iniciará en:
👉 **`http://localhost:3000`**

---

## 🔄 Flujo de Funcionamiento al Agendar un Turno

1. **Interacción del Paciente**: El usuario ingresa a `http://localhost:3000`, completa sus datos en el formulario de la sección de agendamiento (`data-testid="form-agendar"`) y selecciona servicio, fecha y hora.
2. **Validación Frontend**: El script `app.js` valida que no queden campos vacíos y deshabilita el botón mostrando un estado `"Agendando..."`.
3. **Petición HTTP POST**: Se envía un objeto JSON mediante `fetch()` al endpoint del servidor `/api/agendar`.
4. **Sincronización con Google Calendar**: 
   - El servidor procesa la fecha y hora, calcula una duración estimada de 30 minutos y utiliza la API de Google Calendar para insertar el evento automáticamente en la agenda del dentista.
5. **Notificación por Correo**: 
   - **Nodemailer** genera y envía de forma inmediata un correo HTML personalizado al correo electrónico del paciente con los detalles de su cita.
6. **Respuesta Visual**: 
   - El servidor responde con éxito (`{ success: true }`). El frontend muestra un mensaje de confirmación en verde al paciente y limpia el formulario automáticamente.
