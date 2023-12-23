const mongoose = require('mongoose')

// Función para conectarnos a la base de datos
const connectDB = async()=> {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Conectado a la base de datos: ${conn.connection.host}`)
    }
    catch( error) {
        console.log(error)

        // Se detiene la ejecución del programa
        process.exit(1)
    }
}

module.exports = connectDB