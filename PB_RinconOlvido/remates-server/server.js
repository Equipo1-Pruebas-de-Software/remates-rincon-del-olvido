import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './controllers/routes.js';
import initModels from './models/model.js';
import "dotenv/config.js";
import { initializeDatabase } from './database/database.js';
import initCronJobs from './utils/cronjobs.js';

async function createApp() {
    const app = express();

    app.use(json());
    app.use(cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    }));
    app.use(cookieParser());
    routes(app);

    await initializeDatabase();
    initModels();
    if (process.env.NODE_ENV !== 'test') {
        initCronJobs();
    }

    return app;
}

export default createApp;