import express, { Application } from 'express';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/database';
import routes from './routes';
import User from './models/User'; // Import the User model

dotenv.config();

const createApp = (): Application => {
  const app = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true, 
  }));

  app.use(express.json());
  app.use('/', routes);

  return app;
};

const initializeUser = async () => {
  const defaultUsername = process.env.DEFAULT_USERNAME || 'admin';
  const defaultPassword = process.env.DEFAULT_PASSWORD || 'password123';

  try {
    const existingUser = await User.findOne({ where: { username: defaultUsername } });

    if (!existingUser) {
      // Criptografa a senha antes de salvar
      const hashedPassword = await bcryptjs.hash(defaultPassword, 10);
      await User.create({ username: defaultUsername, password: hashedPassword });

    } 
  } catch (error) {
    console.error('Erro ao inicializar usuário padrão:', error);
  }
};

// Conectar ao banco de dados
const connectDatabase = async () => {
  try {
    await sequelize.sync();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

export { createApp, connectDatabase,  initializeUser};
