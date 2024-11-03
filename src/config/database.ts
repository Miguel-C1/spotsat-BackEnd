import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB,
  dialect: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'db', // Serviço do banco no Docker
  port: 5432,
  models: [__dirname + '/../models'], // Caminho para os modelos
  logging: false,
});

export default sequelize;
