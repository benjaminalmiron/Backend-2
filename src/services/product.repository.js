class productRepository{
    constructor(dao){
        this.dao = dao
    }
    createProduct = async newProduct => 
     await    this.dao.create(newProduct)
    
    getProducts = async () =>
       await  this.dao.get()
    getProduct = async filter =>
       await  this.dao.getBy(filter)

    updateProduct = async (pid, productToUpdate) =>
        await this.dao.update(pid, productToUpdate)


    deleteProduct = async pid =>
        await this.dao.delete(pid)
}

export default productRepository;