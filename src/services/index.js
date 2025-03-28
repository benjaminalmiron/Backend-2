import ProductsDAO from "../daos/MONGO/products.dao.js";
import UserRepository from "./user.repository.js";
import user from "../daos/factory.js";

 import productRepository from "../services/product.repository.js";

export const userService = new UserRepository(new user())

const productService = new productRepository(new ProductsDAO);

export default productService;