const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const router = express.Router()
const {allSongs, getSongByName, newSong, updateSong} = require ('../controllers/songsControllers')

// Get all songs
router.get('/', protect, allSongs)

// Get song by name
router.get('/song', protect, getSongByName)

// Add song
router.post('/', protect, newSong)

// Update song
router.put('/:id', protect, updateSong)


module.exports = router