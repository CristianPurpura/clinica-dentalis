const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos del frontend (carpeta public)
app.use(express.static('public'));

// Configuración de Nodemailer para enviar correos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Configuración de Google Calendar API usando Service Account
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/calendar']
});

const calendar = google.calendar({ version: 'v3', auth });

// Endpoint para recibir el turno del formulario
app.post('/api/agendar', async (req, res) => {
    const { nombre, email, telefono, servicio, fecha, hora } = req.body;

    if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    try {
        // 1. Agendar en Google Calendar del Dentista
        const startDateTime = new Date(`${fecha}T${hora}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Duración estimada: 30 mins

        const event = {
            summary: `Cita Odontológica: ${servicio} - ${nombre}`,
            description: `Paciente: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nServicio: ${servicio}`,
            start: { dateTime: startDateTime.toISOString() },
            end: { dateTime: endDateTime.toISOString() }
        };

        const calendarResponse = await calendar.events.insert({
            calendarId: process.env.CALENDAR_ID,
            resource: event
        });

        console.log('Evento creado en Google Calendar:', calendarResponse.data.htmlLink);

        // 2. Enviar Correo de Confirmación al Paciente con Nodemailer
        const mailOptions = {
            from: `"Clínica Dentalis" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Confirmación de Turno - Clínica Dentalis',
            html: `
                <div style="font-family: Arial, sans-serif; color: #0F172A; padding: 20px;">
                    <h2 style="color: #0EA5E9;">¡Hola, ${nombre}!</h2>
                    <p>Tu turno en <strong>Clínica Dentalis</strong> ha sido agendado exitosamente.</p>
                    <hr style="border: 1px solid #E2E8F0;"/>
                    <p><strong>Detalles de tu cita:</strong></p>
                    <ul>
                        <li><strong>Servicio:</strong> ${servicio}</li>
                        <li><strong>Fecha:</strong> ${fecha}</li>
                        <li><strong>Hora:</strong> ${hora}</li>
                    </ul>
                    <p>Te esperamos en Av. Libertador 1420, Piso 3, Oficina 302.</p>
                    <p style="color: #64748B; font-size: 0.9rem;">Si necesitas reprogramar, contáctanos con al menos 24 horas de anticipación.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Turno agendado y notificaciones enviadas con éxito.' });

    } catch (error) {
        console.error('Error al procesar el turno:', error);
        res.status(500).json({ success: false, message: 'Hubo un error al procesar el turno en el servidor.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
