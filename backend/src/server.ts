import Fastify from "fastify";
import cors from '@fastify/cors';
import { routes } from "./routes";

const app = Fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: error.message });
});

// Rota de fallback para a raiz
app.get('/', async (request, reply) => {
    return { message: 'API de Controle Financeiro está funcionando!' };
});

const start = async () => {
    // Registra o CORS - configuração permissiva para testes
    await app.register(cors, {
        origin: true, // permite todas as origens durante o desenvolvimento
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    });
    
    // Registra as rotas do seu arquivo routes.ts
    await app.register(routes);
    
    try {
        // Importante: o Render fornece a PORT como string
        const PORT = parseInt(process.env.PORT || '10000', 10);
        
        // Log para depuração
        console.log(`Tentando iniciar o servidor na porta ${PORT}`);
        
        // Inicia o servidor
        await app.listen({ port: PORT, host: '0.0.0.0' });
        
        console.log(`Server running on port ${PORT}`);
        console.log('Rotas registradas:', app.printRoutes());
    } catch(err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    }
}

start();