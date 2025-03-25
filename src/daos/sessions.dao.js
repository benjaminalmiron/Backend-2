import User from "../models/users.model.js";

class SessionsDAO {
    constructor() {
        this.User = User;
    }

    getUser = async (email) => {
        return await this.User.findOne({email: email});
    }

    createUser = async newUser => await 
         this.User.create(newUser);
    
         getUserByUsername = async (username) => {
            return await this.User.findOne({username: username});
        }
        }


export default  SessionsDAO;

