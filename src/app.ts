import express, { Application } from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import routes from './routes';

dotenv.config();

const createApp = (): Application => {
  const app = express();

  app.use(express.json()); // Parsing JSON

  app.use('/', routes);

  return app;
};

// Conectar ao banco de dados
const connectDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Conectado ao banco de dados e sincronizado');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

export { createApp, connectDatabase };
