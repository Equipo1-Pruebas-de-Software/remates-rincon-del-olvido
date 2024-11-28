import cron from 'node-cron';
import fs from 'fs';
import ProductController from '../controllers/productsController.js';
import BidController from '../controllers/bidsController.js';
import { enviarCorreo } from '../controllers/notificationController.js';
import Product from '../models/Products.js';
import Bid from '../models/Bids.js';
import UserController from '../controllers/usersController.js';

const initCronJobs = () => {
    cron.schedule('*/5 * * * * *', async () => {
        console.log('Running cron job to update product status');
        try {
            const productController = new ProductController();
            const expiredProducts = await productController.getExpiredProducts();
            for (const product of expiredProducts) {
                const bidController = new BidController()
                const bids = await bidController.getBidsForProduct(product.id);
                if (bids.length > 0 ){
                    const winner = bids[0].userId;
                    const userController = new UserController();
                    const winnerEmail = await userController.getEmailFromId(winner);

                    const subject = '¡Felicidades! Has ganado la subasta';
                    const message = `Hola, has ganado la subasta para el producto "${product.name}". Se realizara un cargo en tu tarjeta de "$${bids[0].bid}." Ante cualquier duda puedes escribirnos!.`;
                    
                    // Enviar el correo al ganador
                    enviarCorreo(winnerEmail, subject, message);
                    console.log(`Correo enviado al ganador: ${winnerEmail}`);
                    console.log(`El ganador es: ${winner}`);
                    
                    console.log('The winner is: ', winner);

                    // Guardar la informacion del producto en un archivo txt antes de borrarlo
                    const productData = `ID: ${product.id}\nNombre: ${product.name}\nPrecio: ${product.price}\nDescripción: ${product.description}\nFecha de Expiración: ${product.end_date}\nPuja: ${bids[0].bid}\nGanador: ${winnerEmail}\n\n`;
                    fs.appendFileSync('expired_products.txt', productData, (err) => {
                        if (err) {
                            console.error('Error al escribir en el archivo:', err);
                            return;
                        }
                        console.log('Información del producto guardada en expired_products.txt');
                    });

                    // Eliminar el producto despues de guardar la info
                    await Product.destroy({ where: { id: product.id } });
                    await Bid.destroy({ where: { productId: product.id } });
                    console.log(`Producto con ID ${product.id} eliminado de la base de datos`);
                    console.log(`Puja con ID de producto ${product.id} eliminado de la base de datos`);

                } else{
                    console.log('There are no bids for this product');
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
}

export default initCronJobs;