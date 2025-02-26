import Fastify from "fastify";
import cors from '@fastify/cors';
import { routes } from "./routes";

const app = Fastify({ logger: true })

app.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: error.message });
});

const start = async () => {
   
    await app.register(cors)
    
    await app.register(routes);
    
    try {
       
        const PORT = Number(process.env.PORT) || 3000;
        
       
        await app.listen({ port: PORT, host: '0.0.0.0' });
        
        console.log(`Server running on port ${PORT}`);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

start();