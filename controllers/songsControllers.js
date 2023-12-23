const asyncHandler = require('express-async-handler')
const Song = require('../models/songModels');
const Artist = require('../models/artistModels')

const allSongs = asyncHandler(async(req, res)=>{
    const songs = await Song.find();

    if(!songs|| songs.length > 0 ){
        res.status(200).json(songs)
    }
    else {
        res.status(404)
        throw new Error('Not found songs')
    }
})

const getSongByName = asyncHandler(async(req,res)=>{
    // Obtenemos el nombre de la canción, debe venir el valor de name del query params
    const songName = req.query.name
    
    // Revisamos que se haya enviado el nombre de la canción a buscar
    if(!songName){
        res.status(400)
        throw new Error('You need to send a name song')
    }

    // Buscamos la canción por el titulo
    const song = await Song.findOne({title: songName})

    // Revisamos que haya encontrado alguna canción con ese nombre
    if(!song){
        res.status(404)
        throw new Error('Not found song')
    }

    // Se responde con la canción encontrada
    res.status(200).json(song)
})

const newSong = asyncHandler (async(req, res)=>{
    const {artistId, title} = req.body
    
    if(!artistId || !title){
        res.status(400)
        throw new Error('You dont sent to title or artist. Please check your data')
    }

    // Buscar el artista mediante el artistId
    const artist = Artist.findOne({_id: artistId})
    if(!artist){
        res.status(404)
        throw new Error('No artist was found with that ID')
    }

    const songCreate = await Song.create({
        title,
        artist: artistId
    })

    if(songCreate){
        res.status(201).json(songCreate)
    }
    else {
        res.status(400)
        throw new Error ('The song could not be created. Check the data')
    }
})

const updateSong = asyncHandler(async(req,res)=>{
    const {title} = req.body
    const {id} = req.params

    if(!title){
        res.status(400)
        throw new Error('You dont sent name. Please check your data')
    }

    const song = await Song.findByIdAndUpdate(id, req.body, {new:true})
    res.status(200).json(song)
})

module.exports = {
    allSongs,
    getSongByName,
    newSong,
    updateSong
}