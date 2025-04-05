import productsModel from "./models/products.model.js";
import { Types } from 'mongoose';
class ProductsDAO {
  constructor() {
    this.model = new productsModel();
  }

    get = async () =>   await productsModel.find();
   


getBy = async filterobj => {
    
    if (filterobj._id && !Types.ObjectId.isValid(filterobj._id)) {
        throw new Error('ID no válido');
    }

    return await productsModel.findOne(filterobj);
};

    create = async newProduct  => await productsModel.create(newProduct);
    update = async (pid, productToUpdate) => await productsModel.findByIdAndUpdate({_id: uid}, productToUpdate, {new: true});
    delete = async pid => await productsModel.findByIdAndDelete({_id: uid});
  }

export default ProductsDAO;