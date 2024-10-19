import Product from '../models/Products.js';
import Bid from '../models/Bids.js';

export default class ProductController{
    async getProducts(req, res) {
        try {
            const products = await Product.findAll({
                include: [{
                    model: Bid,
                    attributes: ['bid']
                }]
            });

            const productsWithStatus = products.map(product => {
                const status = product.Bids.length === 0 ? 'started-nobids' : 'started-bidded';
                return {
                    ...product.toJSON(),
                    auctionStatus: status
                };
            });

            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Products retrieved successfully',
                data: productsWithStatus
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to retrieve products',
            });
        }
    }

    async getProductbyId(req, res){
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    status_code: 404,
                    message: 'Product not found',
                });
            }
            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Product retrieved successfully',
                data: product
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to retrieve product',
            });
        }
    }

    async createProduct(req, res){
        try {
            await Product.create(req.body);
            res.status(201).json({
                status: 'success',
                status_code: 201,
                message: 'Product created successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to create product',
            });
        }
    }

    async updateProduct(req, res){
        try {
            const query = await Product.update(req.body, {
                where: {
                    id: req.params.id
                }
            });

            if (!query[0]) {
                return res.status(404).json({
                    status: 'error',
                    status_code: 404,
                    message: 'Product not found',
                });
            }

            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Product updated successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to update product',
            });
        }
    }

    async deleteProduct(req, res){
        try {
            const query = await Product.destroy({
                where: {
                    id: req.params.id
                }
            });
            if (!query) {
                return res.status(404).json({
                    status: 'error',
                    status_code: 404,
                    message: 'Product not found',
                });
            }
            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Product deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to delete product',
            });
        }
    }
}