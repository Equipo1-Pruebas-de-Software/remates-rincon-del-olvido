import AuthController from '../controllers/authController.js';
import User from '../models/User.js';
import Admin from '../models/Admins.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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

jest.mock('../models/User.js');
jest.mock('../models/Admins.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('AuthController', () => {
    let authController;
    let req;
    let res;

    beforeAll(async () => {
        await sequelizeTest.authenticate();
        console.log('Test database connection has been established successfully.');
        await sequelizeTest.sync({ alter: true, force: false });
    });

    beforeEach(() => {
        authController = new AuthController();
        req = {
            body: {},
            cookies: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await sequelizeTest.close();
    });

    // User login
    test('should authenticate a user successfully', async () => {
        req.body = { email: 'test@example.com', password: 'password123' };
        const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compareSync.mockReturnValue(true);
        jwt.sign.mockReturnValue('fakeToken');

        await authController.userLogin(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { type: 'auth', role: 'user', userId: 1 },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );
        expect(res.cookie).toHaveBeenCalledWith('auth', 'fakeToken', { httpOnly: true, secure: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 200,
            message: 'User logged in successfully',
            data: Object({
                user_role: 'user'
            })
        });
    });

    test('should return 401 if email is not found', async () => {
        req.body = { email: 'nonexistent@example.com', password: 'password123' };
        User.findOne.mockResolvedValue(null);

        await authController.userLogin(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 401,
            message: 'Invalid email or password',
        });
    });

    test('should return 401 if password is incorrect', async () => {
        req.body = { email: 'test@example.com', password: 'wrongpassword' };
        const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compareSync.mockReturnValue(false);

        await authController.userLogin(req, res);

        expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 401,
            message: 'Invalid email or password',
        });
    });

    test('should return 500 if an error occurs', async () => {
        req.body = { email: 'test@example.com', password: 'password123' };
        User.findOne.mockRejectedValue(new Error('Database error'));

        await authController.userLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 500,
            message: 'Unable to login user',
        });
    });

    // Admin login
    test('should authenticate an admin successfully', async () => {
        req.body = { email: 'admin@example.com', password: 'adminpassword' };
        const mockAdmin = { id: 1, email: 'admin@example.com', password: 'hashedPassword' };

        Admin.findOne.mockResolvedValue(mockAdmin);
        bcrypt.compareSync.mockReturnValue(true);
        jwt.sign.mockReturnValue('adminToken');

        await authController.adminLogin(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({ where: { email: 'admin@example.com' } });
        expect(bcrypt.compareSync).toHaveBeenCalledWith('adminpassword', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { type: 'auth', role: 'admin', userId: 1 },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );
        expect(res.cookie).toHaveBeenCalledWith('auth', 'adminToken', { httpOnly: true, secure: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 200,
            message: 'Admin logged in successfully',
            data: Object({
                user_role: 'admin'
            })
        });
    });

    test('should return 401 if admin email is not found', async () => {
        req.body = { email: 'nonexistentadmin@example.com', password: 'adminpassword' };
        Admin.findOne.mockResolvedValue(null);

        await authController.adminLogin(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistentadmin@example.com' } });
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 401,
            message: 'Invalid email or password',
        });
    });

    // User register
    test('should register a new user successfully', async () => {
        req.body = { email: 'newuser@example.com', password: 'newpassword' };
        bcrypt.hashSync.mockReturnValue('hashedPassword');

        User.create.mockResolvedValue({});

        await authController.userRegister(req, res);

        expect(bcrypt.hashSync).toHaveBeenCalledWith('newpassword', 10);
        expect(User.create).toHaveBeenCalledWith({
            email: 'newuser@example.com',
            password: 'hashedPassword',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 201,
            message: 'User registered successfully',
        });
    });

    test('should return 500 if an error occurs during user registration', async () => {
        req.body = { email: 'newuser@example.com', password: 'newpassword' };
        User.create.mockRejectedValue(new Error('Database error'));

        await authController.userRegister(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 500,
            message: 'Unable to register user',
        });
    });

    // Admin register
    test('should register a new admin successfully', async () => {
        req.body = { email: 'newadmin@example.com', password: 'adminpassword' };
        bcrypt.hashSync.mockReturnValue('hashedAdminPassword');

        Admin.create.mockResolvedValue({});

        await authController.adminRegister(req, res);

        expect(bcrypt.hashSync).toHaveBeenCalledWith('adminpassword', 10);
        expect(Admin.create).toHaveBeenCalledWith({
            email: 'newadmin@example.com',
            password: 'hashedAdminPassword',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 201,
            message: 'Admin registered successfully',
        });
    });

    test('should return 500 if an error occurs during admin registration', async () => {
        req.body = { email: 'newadmin@example.com', password: 'adminpassword' };
        Admin.create.mockRejectedValue(new Error('Database error'));

        await authController.adminRegister(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 500,
            message: 'Unable to register admin',
        });
    });

    // Auth
    test('should authenticate a user successfully if the token is valid', async () => {
        req.cookies.auth = 'validToken';
        const decodedToken = { userId: 1, role: 'user' };
        
        jwt.verify.mockReturnValue(decodedToken);

        await authController.auth(req, res);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET_KEY);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 200,
            message: 'User authenticated',
            data: Object({
                user_role: 'user'
            }),
        });
    });

    test('should authenticate an admin successfully if the token is valid', async () => {
        req.cookies.auth = 'validToken';
        const decodedToken = { adminId: 1, role: 'admin' };
        
        jwt.verify.mockReturnValue(decodedToken);

        await authController.auth(req, res);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET_KEY);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            status_code: 200,
            message: 'User authenticated',
            data: Object({
                user_role: 'admin'
            }),
        });
    });

    test('should return 409 if the token is invalid', async () => {
        req.cookies.auth = 'invalidToken';
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await authController.auth(req, res);

        expect(jwt.verify).toHaveBeenCalledWith('invalidToken', process.env.JWT_SECRET_KEY);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            status_code: 409,
            message: 'Unauthorized',
        });
    });
});