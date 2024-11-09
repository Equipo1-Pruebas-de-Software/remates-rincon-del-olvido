import cron from 'node-cron';
import ProductController from '../controllers/productsController';
import BidController from '../controllers/bidsController';
import { enviarCorreo } from '../controllers/notificationController';
import initCronJobs from '../utils/cronjobs';
import fs from 'fs';
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

jest.mock('node-cron');
jest.mock('../controllers/productsController');
jest.mock('../controllers/bidsController');
jest.mock('../controllers/notificationController');
jest.mock('fs');

cron.schedule.mockImplementation((_, func) => func());

const correo_test = 'magomap146@inikale.com';


describe('Cron Job Testing', () => {

    beforeAll(async () => {
        await sequelizeTest.authenticate();
        console.log('Test database connection has been established successfully.');
        await sequelizeTest.sync({ alter: true, force: false });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await sequelizeTest.close();
    });

    it('Debe enviar un correo y eliminar el producto cuando hay pujas expiradas', async () => {
        ProductController.expiredProducts.mockResolvedValue([
            { id: 1, name: 'Producto Expirado', price: 100, end_date: '2024-10-21', description: 'Descripción de producto' },
        ]);

        BidController.getBidsForProduct.mockResolvedValue([
            { userId: 1, userEmail: correo_test },
        ]);

        fs.appendFileSync = jest.fn();

        await initCronJobs();

        // Verificar que se envio el correo al ganador
        expect(enviarCorreo).toHaveBeenCalledWith(
            correo_test,
            '¡Felicidades! Has ganado la subasta',
            expect.stringContaining('Producto Expirado')
        );

        // Verificar que se escribió la información del producto en el archivo
        expect(fs.appendFileSync).toHaveBeenCalledWith(
            'expired_products.txt',
            expect.stringContaining('Producto Expirado')
        );

        // Verificar que el producto fue eliminado de la base de datos
        expect(deleteProductById).toHaveBeenCalledWith(1);
    });

    it('No debe enviar correo ni eliminar producto cuando no hay pujas', async () => {
        // Simular productos expirados
        ProductController.expiredProducts.mockResolvedValue([
            { id: 2, name: 'Producto Expirado Sin Pujas', price: 200, end_date: '2024-10-21', image_url: '', description: 'Descripción de producto' },
        ]);

        // Simular que no hay pujas para el producto
        BidController.getBidsForProduct.mockResolvedValue([]);

        // Ejecutar la funcion de cron
        await initCronJobs();

        // Verificar que no se envio el correo
        expect(enviarCorreo).not.toHaveBeenCalled();

        // Verificar que no se escribio en el archivo
        expect(fs.appendFileSync).not.toHaveBeenCalled();

        // Verificar que no se elimino el producto
        expect(deleteProductById).toHaveBeenCalledWith(2);
    });
});
