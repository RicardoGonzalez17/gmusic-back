const asyncHandler = require('express-async-handler')
const User = require('../models/userModels')
const Song = require('../models/songModels')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const getUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)
    if(!user){
        res.status(404)
        throw new Error('User not found')
    }
    res.status(202).json(user)
})

const newUser = asyncHandler (async(req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error ('Data is missing, please verify')
    }

    //Verificamos si el usuario existe
    const userExist = await User.findOne({email})

    // El usuario existe
    if(userExist){
        res.status(400)
        throw new Error('User already exists')
    }
    // El usuario no existe. Se va a crear
    else {
        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Preparamos usuario para insertar en la base de datos
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                active: user.active
            })
        }
        else {
            res.status(400)
            throw new Error('The user could not be created. Check the data')
        }
    }
})

const login = asyncHandler (async (req, res) => {
    const {email, password} = req.body
    
    if(!email || !password){
        res.status(400);
        throw new Error('Missing data. Please check')
    }

    const user = await User.findOne({email})
    const test = await bcrypt.compare(password,user.password)
    if(user && (await bcrypt.compare(password,user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            active: user.active,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401)
        throw new Error('Incorrect Credentials. Please check')
    }
})

// Generar JWT
const generateToken = (idUser) => {
    return jwt.sign({idUser}, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d'
    })
}

// Agrega una canción a la librería del usuario
const addSongToLibrary = asyncHandler (async(req,res)=>{

    // Buscamos el id de la canción a agregar, el cual viene como query params en el request
    const songId = req.params.songId
    const userId = req.user._id

    // No hay un user logueado
    if(!userId){
        res.status(401)
        throw new Error ('You need to login')
    }

    // No se mandó el id de la canción
    if(!songId){
        res.status(400)
        throw new Error('You dont sent song. Please check your data')
    }

    const user = await User.findById(userId)
    
    // No se encontró el usuario con el Id mandado
    if(!user){
        res.status(404)
        throw new Error('User not found')
    }

    user.library.push(songId)
    await user.save()
    // Modificar para que solo regrese la canción nueva, para que el front solo agregué esa nueva canción
    // al array que tiene de todas las canciones del usuario, así no enviamos de nuevo todas las canciones
    res.status(200).json(user)
})

// Agrega una canción a la librería del usuario
const myLikedSongs = asyncHandler (async(req,res)=>{
    const userId = req.user._id

    if (!userId){
        res.status(400)
        throw new Error('You need to sent user. Please check your data')
    }
    
    const user = await User.findById(userId).populate('library')

    if(!user){
        res.status(404)
        throw new Error('User not found')
    }

    // Se regresan los canciones likeadas por el usuario
    res.status(200).json({library: user.library})
})

const updateUser = asyncHandler(async(req,res)=>{
    const {id} = req.params

    if(!id){
        res.status(400)
        throw new Error('You dont sent user. Please check you data')
    }

    const user = await User.findById(id)
    // El usuario no existe
    if(!user){
        res.status(404)
        throw new Error('User not found. Please check your data')
    }
    // Verificar que el usuario a modificar es el mismo que esta logueado
    if(user.id.trim().toString() !== req.user.id.trim().toString()){
        res.status(401)
        throw new Error('Unauthorized access')
    }
    
    const updateUser = await User.findByIdAndUpdate(id, req.body, {new:true})
    res.status(201).json(updateUser)
})

module.exports = {
    getUser,
    newUser,
    login,
    addSongToLibrary,
    myLikedSongs,
    updateUser

}
