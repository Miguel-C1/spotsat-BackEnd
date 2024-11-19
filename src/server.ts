import { createApp, connectDatabase, initializeUser } from './app';

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDatabase();
    await initializeUser();

    // Cria e inicia o servidor
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    return app;
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

const app = startServer();

export default app;
