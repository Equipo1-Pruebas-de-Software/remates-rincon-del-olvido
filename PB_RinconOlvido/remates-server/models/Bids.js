import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/database.js";

class Bid extends Sequelize.Model {}

Bid.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    bid: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Bid',
    tablename: 'bids',
    timestamps: false
});

export default Bid;