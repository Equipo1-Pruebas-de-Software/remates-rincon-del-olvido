import Product from './Products.js'
import Bid from './Bids.js'
import User from './User.js'
import Admin from './Admins.js';

const initModels = () => {
    Bid.belongsTo(Product, {
        foreignKey: 'productId'
    });
    Product.hasMany(Bid, {
        foreignKey: 'productId'
    });
};

export default initModels;