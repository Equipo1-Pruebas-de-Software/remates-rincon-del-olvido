import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: process.env.NODE_ENV !== 'test',
    ssl: {
        require: true,
        rejectUnauthorized: false
    },
    timezone: 'America/Santiago'
});

(async () => { 
    try {
      await sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
      try {
        await sequelize.sync({ alter: true , force: false});
        console.log('All models were synchronized successfully.');
      } catch (error) {
        console.error('Unable to synchronize the models with the database:', error);
      }
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
})();

export default sequelize;