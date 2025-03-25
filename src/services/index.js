import ProductsDAO from "../daos/MONGO/products.dao.js";

 import productRepository from "../services/product.repository.js";


const productService = new productRepository(new ProductsDAO);

export default productService;