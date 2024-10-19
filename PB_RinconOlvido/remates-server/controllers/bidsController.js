import Bid from '../models/Bids.js';
import Product from '../models/Products.js';

export default class BidController{
    async getBids(req, res){
        try {
            const bids = await Bid.findAll();
            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Bids retrieved successfully',
                data: bids
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to retrieve bids',
            })
        }
    }

    async getBidbyId(req, res){
        try {
            const bid = await Bid.findByPk(req.params.id);
            if (!bid) {
                return res.status(404).json({
                    status: 'error',
                    status_code: 404,
                    message: 'Bid not found',
                });
            }
            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Bid retrieved successfully',
                data: bid
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to retrieve bid',
            });
        }
    }

    async getBidbyProductId(req,res){
        try {
            const bids = await Bid.findAll({
                where:{
                    productId: req.params.productid
                }
            });
            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Bids retrieved successfully',
                data: bids
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to retrieve bids',
            })
        }
    }

    async createBid(req, res){
        const productId = req.body.productId;
        const userId = req.userid;
        const bid = req.body.bid;
        try {
            const product = await Product.findByPk(productId);
            if(!product){
                return res.status(404).json({
                    status: 'error',
                    status_code: 404,
                    message: 'Product not found',
                })
            }
            const existingUserBid = await Bid.findOne({
                where: {
                    userId: userId,
                    productId: productId
                }
            })
            if (existingUserBid) {
                if (bid > existingUserBid.bid){
                    await existingUserBid.update({bid});
                    return res.status(200).json({
                        status: 'success',
                        status_code: 200,
                        message: 'Bid updated successfully',
                    });
                }
                else {
                    return res.status(400).json({
                        status: 'error',
                        status_code: 400,
                        message: 'The new bid must be higher than the current bid.',
                    });
                }
            }
            else{
                if (bid < product.price) {
                    return res.status(400).json({
                        status: 'error',
                        status_code: 400,
                        message: 'The bid must be at least equal to the product price.',
                    });
                }
                await Bid.create({...req.body, userId: userId});
                res.status(201).json({
                    status: 'success',
                    status_code: 201,
                    message: 'Bid created successfully',
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to create bid',
            });
        }
    }

    async updateBid(req, res){
        try {
            const query = await Bid.update(req.body, {
                where: {
                    id: req.params.id
                }
            });

            if (!query[0]) {
                return res.status(404).json({
                    status: 'error',
                    status_code: 404,
                    message: 'Bid not found',
                });
            }

            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Bid updated successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to update bid',
            });
        }
    }

    async deleteBid(req, res){
        try {
            const query = await Bid.destroy({
                where: {
                    id: req.params.id
                }
            });
            if (!query) {
                return res.status(404).json({
                    status: 'error',
                    status_code: 404,
                    message: 'Bid not found',
                });
            }
            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Bid deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to delete Bid',
            });
        }
    }

    async getBidsForProduct(productId){
        try {
            const bids = await Bid.findAll({
                where: {
                    productId: productId
                },
                order: [
                    ['bid', 'DESC']
                ]
            });
            return bids;
        } catch (error) {
            console.error('Unable to retrieve bids for product', error);
        }
    }
}