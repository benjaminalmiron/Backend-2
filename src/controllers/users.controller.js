import userDAO from "../daos/users.dao.js";

class userController {
    constructor() {
        this.service = new userDAO();
    }

    createUser(req, res) {
        res.send("User created");
    }
    getUsers = async (req, res) =>{
        const users = await this.service.getUsers();
        res.send({status: "ok", payload: users});
    }
    getUser(req, res) {
        res.send("get user");
    }
    updateUser(req, res) {
        res.send("User updated");
    }
    deleteUser(req, res) {
        res.send("User deleted");
    }
}

export default  userController;
    
