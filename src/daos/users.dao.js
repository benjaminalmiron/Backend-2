import User from "../models/users.model.js";

class userDAO {
    constructor() {
        this.User = User;
    }

    getUsers = async _ => await this.User.find({})

    createUser = async newUser => await 
         this.User.create(newUser);
    
         getUserByUsername = async (username) => {
            return await this.User.findOne({username: username});
        }
        }


export default  userDAO;