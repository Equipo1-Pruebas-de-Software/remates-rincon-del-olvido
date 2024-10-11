import ProductController from "./ProductsController.js";

export default (app) => {
    const productInstance = new ProductController();

    app.get('/products', productInstance.getProducts);
    app.get('/products/:id', productInstance.getProductbyId);
    app.post('/products', productInstance.createProduct);
    app.put('/products/:id', productInstance.updateProduct);
    app.delete('/products/:id', productInstance.deleteProduct);
}