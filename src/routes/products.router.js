import { Router } from "express";

import ProductController from "../controllers/products.controller.js";

const {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = new ProductController()

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProduct);
productsRouter.post("/", createProduct);
productsRouter.delete("/:pid", deleteProduct);
productsRouter.put("/:pid", updateProduct);

export default productsRouter;
