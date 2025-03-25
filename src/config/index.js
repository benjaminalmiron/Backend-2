import mongoose from "mongoose"
import  MongoSingleton  from "../utils/MongoSingleton.js"
/// 

export const configObject = {
    port: process.env.PORT || 8080
}

export const conectDB = () => {
   return MongoSingleton.getInstance("mongodb+srv://benjamin:bLhNNdOzELHL0OyX@clustercoderhouse.r19k5.mongodb.net/")
   /*  console.log('base de datos conectada')    
    mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', ) */
}

// s