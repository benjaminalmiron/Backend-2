import e, { Router } from "express";
import userController from "../../controllers/users.controller.js";

const router = Router(); 
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = new userController();



router.get("/", getUsers);

router.post("/", createUser);


router.get("/:uid",  getUser);

router.put("/:uid", updateUser );

router.delete("/:uid",  deleteUser);


export default router;