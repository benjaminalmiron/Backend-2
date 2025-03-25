import mongoose, { connect } from "mongoose";

class MongoSingleton {
    static #instance;
  constructor(uri) {
    connect(uri)
  }

  static getInstance(uri) {
        if (this.#instance) {
            console.log("MongoSingleton instance already created");
            return this.#instance;
        }
      this.#instance = new MongoSingleton(uri);
      console.log("MongoSingleton instance created");
        return this.#instance;
    }
    
  }


export default MongoSingleton;