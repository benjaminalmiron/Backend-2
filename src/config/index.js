import mongoose from "mongoose"
/// 

export const configObject = {
    port: process.env.PORT || 8080
}

export const conectDB = () => {
    console.log('base de datos conectada')    
    mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', )
}

// s