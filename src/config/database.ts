import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: "localhost",
  port: 5432,
  dialect: 'postgres',
  models: [__dirname + '/../models'],
  logging: false,
});

export default sequelize;
