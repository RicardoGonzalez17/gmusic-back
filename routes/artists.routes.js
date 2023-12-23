const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const router = express.Router()
const {newArtist, artistById, updateArtist} = require ('../controllers/artistsController')

// Add artist
router.post('/', protect, newArtist)

// Get artist
router.get('/:id', protect, artistById)

// Update artist
router.put('/:id', protect, updateArtist)

module.exports = router