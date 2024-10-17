import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './controllers/routes.js';
import initModels from './models/model.js';
import "dotenv/config.js";

const app = express();

app.use(json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
routes(app);

initModels();

export default app;