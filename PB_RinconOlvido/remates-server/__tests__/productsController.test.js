import ProductController from '../controllers/ProductsController.js';
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

jest.mock('../models/Products');

describe('ProductController', () => {
    let productController;
    let req;
    let res;

    beforeAll(async () => {
        await sequelizeTest.authenticate();
        console.log('Test database connection has been established successfully.');
        await sequelizeTest.sync({ alter: true, force: false });
    });

    beforeEach(() => {
        productController = new ProductController();
        req = {
            params: { id: 1 },
            body: {
                name: 'Test Product',
                price: 100,
                end_date: '2023-12-31T23:59:59.000Z',
                image_url: 'http://example.com/image.jpg'
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

    it('should retrieve all products', async () => {
        const mockProducts = [
            {
                id: 1,
                name: 'Product 1',
                price: '100000',
                end_date: '2024-12-31T23:59:59.000Z',
                image_url: 'https://s3.aws.bucketname.com/asd123',
                Bids: [{ bid: '5000' }],
                toJSON: function() { return { ...this }; }
            },
            {
                id: 2,
                name: 'Product 2',
                price: '100000',
                end_date: '2024-12-31T23:59:59.000Z',
                image_url: 'https://s3.aws.bucketname.com/asd123',
                Bids: [],
                toJSON: function() { return { ...this }; }
            }
        ];

        Product.findAll.mockResolvedValue(mockProducts);

        await productController.getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'success',
            status_code: 200,
            message: 'Products retrieved successfully',
            data: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number),
                    end_date: expect.any(String),
                    image_url: expect.any(String),
                    Bids: expect.any(Array),
                    auctionStatus: expect.any(String)
                })
            ])
        }));
    });

    it('should retrieve a product by id', async () => {
        const mockProduct = { 
            id: 3, 
            name: 'Cocina 5000', 
            price: '100000', 
            end_date: "2024-12-31T23:59:59.000Z", 
            image_url: "https://s3.aws.bucketname.com/asd123" 
        };

        Product.findByPk.mockResolvedValue(mockProduct);
        await productController.getProductbyId(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'success',
            status_code: 200,
            message: 'Product retrieved successfully',
            data: expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number),
                end_date: expect.any(String),
                image_url: expect.any(String)
            })
        }));
    });

    it('should return an error if product not found by ID', async () => {
        Product.findByPk.mockResolvedValue(null);
        await productController.getProductbyId(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 404,
            message: 'Product not found',
        });
    });

    it('should create a new product', async () => {
        Product.create.mockResolvedValue(req.body);
        await productController.createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 201,
            message: 'Product created successfully',
        });
    });

    it('should update an existing product', async () => {
        Product.update.mockResolvedValue([1]);
        await productController.updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'success',
            status_code: 200,
            message: 'Product updated successfully'
        }));
    });

    it('should return an error if product to update not found', async () => {
        Product.update.mockResolvedValue([0]);
        await productController.updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 404,
            message: 'Product not found',
        });
    });

    it('should delete a product', async () => {
        Product.destroy.mockResolvedValue(1);
        await productController.deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'success',
            status_code: 200,
            message: 'Product deleted successfully'
        }));
    });

    it('should return an error if product to delete not found', async () => {
        Product.destroy.mockResolvedValue(0);
        await productController.deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 404,
            message: 'Product not found',
        });
    });
});