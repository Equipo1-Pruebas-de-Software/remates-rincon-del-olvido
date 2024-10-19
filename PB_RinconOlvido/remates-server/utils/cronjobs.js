import cron from 'node-cron';
import ProductController from '../controllers/ProductsController';
import BidController from '../controllers/bidsController';

const initCronJobs = () => {
    cron.schedule('*/5 * * * * *', async () => {
        console.log('Running cron job to update product status');
        try {
            const expiredProducts = await ProductController.expiredProducts();
            for (const product of expiredProducts) {
                const bids = await BidController.getBidsForProduct(product.id);
                if (bids.length > 0 ){
                    const winner = bids[0].userId;
                    // Aqui falta implementar el envio de correo al ganador y movilizar el producto a otro lado
                    console.log('The winner is: ', winner);
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