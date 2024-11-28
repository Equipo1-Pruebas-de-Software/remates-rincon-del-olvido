import cron from 'node-cron';
import fs from 'fs';
import ProductController from '../controllers/productsController.js';
import BidController from '../controllers/bidsController.js';
import { enviarCorreo } from '../controllers/notificationController.js';
import Product from '../models/Products.js';
import Bid from '../models/Bids.js';
import UserController from '../controllers/usersController.js';

const initCronJobs = () => {
}

export default initCronJobs;