import { Router } from "express";
import authorization from "../middlewares/authorization.middleware.js";
import passportAuth from "../middlewares/passport.auth.js";
import ProductController from "../controllers/products.controller.js";

const {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = new ProductController()

const productsRouter = Router();

productsRouter.get("/",  getProducts);
productsRouter.get("/:pid", getProduct);
productsRouter.post("/",  passportAuth("jwt"),  // Primero autentica al usuario
authorization("admin"),createProduct);
productsRouter.delete("/:pid",  passportAuth("jwt"),  // Primero autentica al usuario
authorization("admin"),deleteProduct);
productsRouter.put("/:pid",  passportAuth("jwt"),  // Primero autentica al usuario
authorization("admin"),updateProduct);

export default productsRouter;
