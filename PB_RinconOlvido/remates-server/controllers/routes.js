import ProductController from "./ProductsController.js";
import BidController from "./bidsController.js";

export default (app) => {
    const productInstance = new ProductController();

    app.get('/products', productInstance.getProducts);
    app.get('/products/:id', productInstance.getProductbyId);
    app.post('/products', productInstance.createProduct);
    app.put('/products/:id', productInstance.updateProduct);
    app.delete('/products/:id', productInstance.deleteProduct);

    const bidInstance = new BidController();
    app.get('/bids', bidInstance.getBids);
    app.get('/bids/:id', bidInstance.getBidbyId);
    app.get('/bids/product/:productid', bidInstance.getBidbyProductId);
    app.post('/bids', bidInstance.createBid)
    app.put('/bids/:id', bidInstance.updateBid);
    app.delete('/bids/:id', bidInstance.deleteBid);
}