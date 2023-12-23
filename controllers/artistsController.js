const asyncHandler = require('express-async-handler')
const Artist = require('../models/artistModels')
// llamamos a cloudinary para guardar las imagenes en mi cuenta de cloudinary
const cloudinary = require ('cloudinary').v2
// Para poder usar las variables de entorno
require('dotenv').config()

const isValidImageURL= (url) => {
  // Obtener la extensión del archivo desde la URL
  const fileExtension = url.split('.').pop().toLowerCase();

  // Lista de extensiones de imágenes comunes
  const allowedExtensions = ['jpg', 'jpeg', 'png'];

  // Verificar si la extensión está en la lista de extensiones permitidas
  return allowedExtensions.includes(fileExtension);
}

const formatImagen = asyncHandler(async(name, image)=>{
    // Se agregó una imagen al artista
    // Damos credenciales de mi cuenta de cloudinary para poder insertar imagenes en mi cuenta
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    // Configuración de multer para manejar la carga de archivos
    const timestamp = Date.now(); // Elimina caracteres no numéricos
    const cloudinaryResponse = await cloudinary.uploader.upload(image,
        {
            folder: 'Artists',
            use_filename: true,
            public_id: `${name}_${timestamp}`
        })
    if(cloudinaryResponse.secure_url){
        // Obtener la URL de la imagen de Cloudinary y asignarla a image
        return (cloudinaryResponse.secure_url)
    }
})

const newArtist = asyncHandler(async(req,res) => {
    const { name, image } = req.body
    let imageToPost = image
    if(!name){
        res.status(400)
        throw new Error('You dont sent name. Please check your data')
    }

    if(image){
        if(!isValidImageURL(image)){
            res.status(400)
            throw new Error('You sent a URL that is not an image')
        }
        imageToPost = await formatImagen(name, image)
    }
    const artist = await Artist.create({
        name,
        image: imageToPost
    })

    if(!artist){
        res.status(400)
        throw new Error('The artist could not be created. Please check the data')
    }
    res.status(201).json(artist)
})

const artistById = asyncHandler(async(req,res) => {
    const {id} = req.params
    if(!id){
        res.status(400)
        throw new Error('You dont sent artist. Please check your data')
    }
    const artist = await Artist.findById(id)
    if(!artist){
        res.status(404)
        throw new Error('Not found artist')
    }
    res.status(200).json(artist)
})

const updateArtist = asyncHandler(async(req, res)=>{
    let {name, image} = req.body
    const {id} = req.params
    if(!id){
        res.status(400)
        throw new Error('You dont sent artist. Please check your data')
    }
    if(image){
        if(!isValidImageURL(image)){
            res.status(400)
            throw new Error('You sent a URL that is not an image')
        }
    }
    const artist = await Artist.findById(id)
    if(!artist){
        res.status(404)
        throw new Error('Not found artist')
    }

    const artistUpdated = await Artist.findByIdAndUpdate(id, req.body, {new: true})
    res.status(201).json(artistUpdated)

})

module.exports = {
    newArtist,
    artistById,
    updateArtist
}