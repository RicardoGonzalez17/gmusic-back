const jwt = require('jsonwebtoken')
const asyncHandler  = require('express-async-handler')
const User = require('../models/userModels')

const protect = asyncHandler(async(req, res, next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Obtener token del header del request
            token = req.headers.authorization.split(' ')[1]
            // Verificar firma del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // Obtener los datos del usuarios menos el password y los guardamos en req.user.
            req.user = await User.findById(decoded.idUser).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Unauthorized access')
        }
    }
    if (!token){
        res.status(401)
        throw new Error('Unauthorized access, Token missing')
    }
})

module.exports = {protect}