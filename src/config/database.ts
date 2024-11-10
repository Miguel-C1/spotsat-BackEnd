import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: 'meuBanco',
  username: 'meuUsuario',
  password: 'minhaSenha',
  host:  "localhost",
  port: 5432,
  dialect: 'postgres',
  models: [__dirname + '/../models'],
  logging: false,
});

export default sequelize;
