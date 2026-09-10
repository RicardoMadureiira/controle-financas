import { FastifyReply, FastifyRequest } from "fastify";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import prismaClient from "../prisma";
import { anonUserIdSchema } from "../schemas/transaction";
import { clearSessionCookie, createSession, getSessionUser, hashToken, SESSION_COOKIE } from "../auth/session";

const loginSchema = z.object({
  credential: z.string().min(1),
  anonUserId: anonUserIdSchema.optional(),
});

const publicUser = (user: { id: string; name: string; email: string; avatarUrl: string | null }) => ({
  id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl,
});

class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { credential, anonUserId } = loginSchema.parse(request.body);
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) return reply.status(503).send({ error: "Login Google não configurado" });
      const ticket = await new OAuth2Client().verifyIdToken({ idToken: credential, audience: clientId });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) return reply.status(401).send({ error: "Credencial Google inválida" });

      const user = await prismaClient.user.upsert({
        where: { googleSub: payload.sub },
        update: { email: payload.email, name: payload.name || payload.email, avatarUrl: payload.picture },
        create: { googleSub: payload.sub, email: payload.email, name: payload.name || payload.email, avatarUrl: payload.picture },
      });
      const migrated = anonUserId
        ? await prismaClient.customer.updateMany({ where: { anonUserId, userId: null }, data: { userId: user.id } })
        : { count: 0 };
      await createSession(user.id, reply);
      return reply.send({ user: publicUser(user), migratedCount: migrated.count });
    } catch (error) {
      if (error instanceof z.ZodError) return reply.status(400).send(error.flatten());
      request.log.warn(error);
      return reply.status(401).send({ error: "Não foi possível validar o login Google" });
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const user = await getSessionUser(request);
    if (!user) return reply.status(401).send({ error: "Não autenticado" });
    return reply.send({ user: publicUser(user) });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies[SESSION_COOKIE];
    if (token) await prismaClient.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    clearSessionCookie(reply);
    return reply.status(204).send();
  }

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.authUser!.id;
    await prismaClient.customer.deleteMany({ where: { userId } });
    await prismaClient.session.deleteMany({ where: { userId } });
    await prismaClient.user.delete({ where: { id: userId } });
    clearSessionCookie(reply);
    return reply.status(204).send();
  }
}

export { AuthController };
