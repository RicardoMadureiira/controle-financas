import { createHash, randomBytes } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import prismaClient from "../prisma";

export const SESSION_COOKIE = "finance_session";
const SESSION_DAYS = 30;

declare module "fastify" {
  interface FastifyRequest {
    authUser?: { id: string; name: string; email: string; avatarUrl: string | null };
  }
}

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string, reply: FastifyReply) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prismaClient.session.create({ data: { userId, tokenHash: hashToken(token), expiresAt } });
  reply.setCookie(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || process.env.RENDER === "true",
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSessionUser(request: FastifyRequest) {
  const token = request.cookies[SESSION_COOKIE];
  if (!token) return null;
  const session = await prismaClient.session.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prismaClient.session.delete({ where: { id: session.id } });
    return null;
  }
  return prismaClient.user.findUnique({ where: { id: session.userId } });
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const user = await getSessionUser(request);
  if (!user) return reply.status(401).send({ error: "Sessão inválida ou expirada" });
  request.authUser = { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl };
}

export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(SESSION_COOKIE, { path: "/" });
}
