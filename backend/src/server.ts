import Fastify from "fastify";
import cors from '@fastify/cors';
import { routes } from "./routes";

const app = Fastify({ logger: true })

app.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: error.message });
});

const start = async () => {
    // Configuração de CORS ajustada para aceitar requisições do frontend
    await app.register(cors, {
        origin: ['http://localhost:5173', 'https://controle-financasrm.vercel.app/'], // Substitua pelo URL do seu frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    })
    
    await app.register(routes);
    
    try {
        // Convertendo para número para garantir o tipo correto
        const PORT = Number(process.env.PORT) || 3000;
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running on port ${PORT}`);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

start();