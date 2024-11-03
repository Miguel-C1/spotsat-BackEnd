import { createApp, connectDatabase } from './app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDatabase();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();
