import express, { json } from 'express';
import cors from 'cors';
import routes from './controllers/routes.js';
import initModels from './models/model.js';
import "dotenv/config.js";

const app = express();

app.use(json());
app.use(cors());
routes(app);

initModels();

export default app;