import ProductController from "./ProductsController.js";
import BidController from "./bidsController.js";
import AuthController from "./authController.js";
import authMiddleware from "../utils/authMiddleware.js";

export default (app) => {
    const productInstance = new ProductController();

    app.get('/products', authMiddleware('any'),productInstance.getProducts);
    app.get('/products/:id', authMiddleware('any'), productInstance.getProductbyId);
    app.post('/products', authMiddleware('admin'), productInstance.createProduct);
    app.put('/products/:id', authMiddleware('admin'), productInstance.updateProduct);
    app.delete('/products/:id', authMiddleware('admin'), productInstance.deleteProduct);

    const bidInstance = new BidController();
    app.get('/bids', authMiddleware('any'), bidInstance.getBids);
    app.get('/bids/:id', authMiddleware('any'), bidInstance.getBidbyId);
    app.get('/bids/product/:productid', authMiddleware('any'), bidInstance.getBidbyProductId);
    app.post('/bids', authMiddleware('user'), bidInstance.createBid)
    app.put('/bids/:id', authMiddleware('any'), bidInstance.updateBid);
    app.delete('/bids/:id', authMiddleware('any'), bidInstance.deleteBid);

    const authInstance = new AuthController();
    app.post('/login/user', authInstance.userLogin);
    app.post('/login/admin', authInstance.adminLogin);
    app.post('/register/admin', authInstance.adminRegister);
    app.post('/register/user', authMiddleware('admin') ,authInstance.userRegister);
}