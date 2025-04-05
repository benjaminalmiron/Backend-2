import productService from "../services/index.js";
import { Types } from 'mongoose';
import authorization from "../middlewares/authorization.middleware.js";

class ProductController{
    constructor(){
        this.service = productService
    }

    createProduct =  async (req, res) => {
        try {
            const product = await this.service.createProduct(req.body);
            
            res.status(201).send(product);
        } catch (error) {
            res.status(500).send(error);
        }
    }
    getProduct = async (req, res) => {
        const { pid } = req.params;
    
        
        if (!Types.ObjectId.isValid(pid)) {
            console.log(`ID no válido: ${pid}`);
            return res.status(400).send({ message: "ID no válido" });
        }
    
        console.log(`Buscando producto con ID: ${pid}`);
        try {
            const product = await this.service.getProduct({ _id: pid });
            console.log('Producto encontrado:', product);
    
            if (!product) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }
            res.send({ status: "success", payload: product });
        } catch (error) {
            console.error('Error al buscar el producto:', error);
            res.status(500).send(error);
        }
    };
    
    getProducts = async  (req, res) => {
        try {
            const products = await this.service.getProducts(); 
            res.status(200).json({status : "success", data : products});
        } catch (error) {
            res.status(500).send(error);
        }
    }
    updateProduct = async (req, res) => {
        try {
            const product = await this.service.updateProduct(req.params.id, req.body); 
            if (!product) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }
            res.send(product);
        } catch (error) {
            res.status(500)
        }
    }
    deleteProduct = async (req, res) => {
        try {
            const product = await this.service.deleteProduct(req.params.id);
            if (!product) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }
            res.send(product);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default ProductController;