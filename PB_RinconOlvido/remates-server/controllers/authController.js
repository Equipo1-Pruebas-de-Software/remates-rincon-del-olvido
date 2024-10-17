import Admin from "../models/Admins.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class AuthController{
    async userLogin(req, res){
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                where:{
                    email: email,
                }
            });
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    status_code: 401,
                    message: 'Invalid email or password'
                });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    status_code: 401,
                    message: 'Invalid email or password'
                });
            }

            const token = jwt.sign(
                { type: 'auth', role: 'user', userId: user.id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '24h' }
            );

            res.cookie('auth', token, { httpOnly: true, secure: true });

            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'User logged in successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to login user'
            });
        }
    }

    async adminLogin(req, res){
        try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({
                where:{
                    email: email,
                }
            });

            if (!admin) {
                return res.status(401).json({
                    status: 'error',
                    status_code: 401,
                    message: 'Invalid email or password'
                });
            }

            const isPasswordValid = bcrypt.compareSync(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    status_code: 401,
                    message: 'Invalid email or password'
                });
            }

            const token = jwt.sign(
                { type: 'auth', role: 'admin', userId: admin.id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '24h' }
            );

            res.cookie('auth', token, { httpOnly: true, secure: true });

            res.status(200).json({
                status: 'success',
                status_code: 200,
                message: 'Admin logged in successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to login admin'
            });
        }
    }

    async userRegister(req, res){
        try {
            const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

            await User.create({
                email: req.body.email,
                password: encryptedPassword
            });
            res.status(201).json({
                status: 'success',
                status_code: 201,
                message: 'User registered successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to register user'
            });
        }
    }

    async adminRegister(req, res){
        try {
            const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

            await Admin.create({
                email: req.body.email,
                password: encryptedPassword
            });
            res.status(201).json({
                status: 'success',
                status_code: 201,
                message: 'Admin registered successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                status_code: 500,
                message: 'Unable to register admin'
            });
        }
    }
}