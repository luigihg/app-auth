const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); // Import for JWTs
const app = express();
const port = 3001;// El puerto que definiste en docker-compose.yml

// Configuración de la conexión a PostgreSQL (usa las variables de entorno de Docker)
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'mytest',
    password: process.env.POSTGRES_PASSWORD || 'mytest',
    host: process.env.POSTGRES_HOST || 'localhost', // El nombre del servicio en docker-compose
    database: process.env.POSTGRES_DB || 'authdb',
    port: process.env.POSTGRES_PORT || 5432,
});

app.use(cors()); 
app.use(express.json());

app.post('/registro', [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('email').notEmpty().withMessage('El email es requerido').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, password } = req.body;

    try {
        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de hashing

        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *',
            [nombre, email, hashedPassword] // Usa la contraseña encriptada
        );

        res.status(201).json(result.rows);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'El email ya existe' });
        } else {
            res.status(500).json({ error: 'Error en el registro' });
        }
    }
});

// Ruta para el inicio de sesión
app.post('/login', [
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' }); // Usuario no encontrado
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' }); // Contraseña incorrecta
        }

        // Generar un JWT
        const token = jwt.sign({ userId: user.id }, 'tu_secreto', { expiresIn: '1h' }); // Reemplaza 'tu_secreto' con una clave secreta segura

        res.json({ token }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});


// Ruta para obtener el perfil del usuario
app.get('/profile', authenticateToken, async (req, res) => {  // Use the middleware
    try {
        // req.user.userId will be set by the middleware
        const result = await pool.query('SELECT id, nombre, email FROM usuarios WHERE id = $1', [req.user.userId]); 
        const user = result.rows;

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
});

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' '); // Obtener el token del header

    if (token == null) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, 'tu_secreto', (err, user) => { // Verificar el token
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }

        req.user = user; // Asignar el usuario al objeto de solicitud
        next(); // Continuar con la siguiente función
    });
}

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});