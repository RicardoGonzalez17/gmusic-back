// Llamamos a Express con todas sus funciones y lo asignamos a una constante
const express = require('express');
// Llamamos a la función de Router de Express y lo asignamos a la constante router,
// con esto vamos a poder utilizar los verbos: GET, PUT, POST UPDATE, DETELE, ETC
const router = express.Router();

// Mandamos a llamar las funciones que vamos a utilizar en cada verbo. Se llama del controlador
const {getUser, newUser, login, addSongToLibrary, myLikedSongs, updateUser} = require('../controllers/usersControllers')

// Llamado al método para proteger las rutas
const {protect} = require('../middlewares/authMiddleware')


// Register user
router.post('/', protect, newUser)

// Get user
router.get('/:id', protect, getUser)

// Update user
router.put('/:id', protect, updateUser)

// Login
router.post('/login', login)

// Add song to user library
router.post('/library/:songId', protect, addSongToLibrary)

// View songs to user library
router.get('/:id/library/', protect, myLikedSongs)

module.exports = router