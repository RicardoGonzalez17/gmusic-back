// Llamamos a Express con todas sus funciones y lo asignamos a una constante
const express = require('express');

// Llamamos al archivo .env para poder utilizar las variables de entorno y lo asignamos a la constante
const dotenv = require('dotenv').config()

// Llamamos al CORS para poder recibir peticiones desde el frontend
const cors = require('cors')

// Llamamos a la variable de entorno PORT y lo asignamos a la constante port
const port = process.env.PORT || 3001

// Asignamos express a una constante para poder utilizar express
const app = express()

// Usamos el cors
app.use(cors())

// Mandamos a llamar el manejador de error que creamos
const { errorHandler} = require('./middlewares/errorMiddleware')

// Importamos el archivo db.js
const connectDB = require('./config/db')

// Ejecutamos método para conectarnos a la base de datos
connectDB()

// Para que nuestra API pueda recibir datos por el body y porder trabajar con JSON
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/users', require('./routes/users.routes'))
app.use('/api/songs', require('./routes/songs.routes'))
app.use('/api/artists', require('./routes/artists.routes'))
// Agregamos el manejador de errores que creamos para que se puede utilizar en la app
app.use(errorHandler)
app.listen(port, ()=> {
    console.log(`El server esta ON en el puerto: ${port}`)
})
