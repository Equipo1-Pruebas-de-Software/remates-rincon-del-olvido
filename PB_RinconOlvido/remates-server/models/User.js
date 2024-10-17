import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/database.js";

class User extends Sequelize.Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tablename: 'users',
    timestamps: true
});

export default User;