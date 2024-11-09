import cron from 'node-cron';
import fs from 'fs';
import ProductController from '../controllers/productsController';
import BidController from '../controllers/bidsController';
import { enviarCorreo } from '../controllers/notificationController';
import Product from '../models/Products';


const initCronJobs = () => {
    cron.schedule('*/5 * * * * *', async () => {
        console.log('Running cron job to update product status');
        try {
            const expiredProducts = await ProductController.expiredProducts();
            for (const product of expiredProducts) {
                const bids = await BidController.getBidsForProduct(product.id);
                if (bids.length > 0 ){
                    const winner = bids[0].userId;
                    const winnerEmail = bids[0].userEmail;

                    const subject = '¡Felicidades! Has ganado la subasta';
                    const message = `Hola, has ganado la subasta para el producto "${product.name}". Se realizara un cargo en tu tarjeta de "${product.price}." Ante cualquier duda puedes escribirnos!.`;
                    
                    // Enviar el correo al ganador
                    enviarCorreo(winnerEmail, subject, message);
                    console.log(`Correo enviado al ganador: ${winnerEmail}`);
                    console.log(`El ganador es: ${winner}`);
                    
                    console.log('The winner is: ', winner);

                    // Guardar la informacion del producto en un archivo txt antes de borrarlo
                    const productData = `ID: ${product.id}\nNombre: ${product.name}\nPrecio: ${product.price}\nDescripción: ${product.description}\nFecha de Expiración: ${product.end_date}\n\n`;
                    fs.appendFileSync('expired_products.txt', productData, (err) => {
                        if (err) {
                            console.error('Error al escribir en el archivo:', err);
                            return;
                        }
                        console.log('Información del producto guardada en expired_products.txt');
                    });

                    // Eliminar el producto despues de guardar la info
                    await Product.destroy({ where: { id: product.id } });
                    await deletePro
                    console.log(`Producto con ID ${product.id} eliminado de la base de datos`);

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