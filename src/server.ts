import { createApp, connectDatabase, initializeUser } from './app';

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDatabase();
  await initializeUser();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();
