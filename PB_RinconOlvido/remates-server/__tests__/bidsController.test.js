import BidsController from '../controllers/bidsController';
import Bid from '../models/Bids';
import Product from '../models/Products';
import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const sequelizeTest = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
});

jest.mock('../models/Bids');
jest.mock('../models/Products');

describe('BidController', () => {
    let bidController;
    let req;
    let res;

    beforeAll(async () => {
        await sequelizeTest.authenticate();
        console.log('Test database connection has been established successfully.');
        await sequelizeTest.sync({ alter: true, force: false });
    });

    beforeEach(() => {
        bidController = new BidsController();
        req = {
            body: {
                userId: 1,
                productId: 1,
                bid: 150
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await sequelizeTest.close();
    });

    test('should return an error if the bid is less than the product price', async () => {
        req.body.bid = 50;
        Product.findByPk.mockResolvedValue({ start_price: 100 });
        await bidController.createBid(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 400,
            message: 'The bid must be at least equal to the product price.',
        });
    });

    test('should create a new bid if no previous bid exists and the bid is valid', async () => {
        Product.findByPk.mockResolvedValue({ start_price: 100 });
        Bid.findOne.mockResolvedValue(null);

        await bidController.createBid(req, res);

        expect(Bid.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 201,
            message: 'Bid created successfully',
        });
    });

    test('should update the existing bid if the new bid is higher', async () => {
        Product.findByPk.mockResolvedValue({ start_price: 100 });
        Bid.findOne.mockResolvedValue({ bid: 120, update: jest.fn() });

        await bidController.createBid(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 200,
            message: 'Bid updated successfully',
        });
    });

    test('should return an error if the new bid is not higher than the existing bid', async () => {
        Product.findByPk.mockResolvedValue({ start_price: 100 });
        Bid.findOne.mockResolvedValue({ bid: 160 });

        await bidController.createBid(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 400,
            message: 'The new bid must be higher than the current bid.',
        });
    });
});