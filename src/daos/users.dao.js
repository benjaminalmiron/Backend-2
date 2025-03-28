import User from "../models/users.model.js";

class userDAO {
    constructor() {
        this.User = User;
    }

    get = async _ => await this.User.find({})

    create = async newUser => await 
         this.User.create(newUser);
    
         getBy = async  (filter ) => {
            return await this.User.findOne(filter);
        }
        update = async (filter, update) => {
            return await this.User.findOneAndUpdate(filter, update, {new: true});
        }
        delete = async filter => {
            return await this.User.findOneAndDelete(filter);
        }

    }

        

export default  userDAO;