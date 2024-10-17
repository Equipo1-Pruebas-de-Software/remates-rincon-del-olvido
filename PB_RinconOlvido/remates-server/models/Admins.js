import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/database.js";

class Admin extends Sequelize.Model {}

Admin.init({
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
    modelName: 'Admin',
    tablename: 'admins',
    timestamps: true
});

export default Admin;