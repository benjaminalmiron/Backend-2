import mongoose from "mongoose"
import  MongoSingleton  from "../utils/MongoSingleton.js"
/// 

export const configObject = {
    port: process.env.PORT || 8080
}

export const conectDB = () => {
   return MongoSingleton.getInstance("mongodb+srv://benjamin:hola.123@clustercoderhouse.r19k5.mongodb.net/")
  
}

// s