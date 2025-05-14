import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function pollRoutes(app: FastifyInstance) {
  app.get('/polls', async (req, reply) => {
    const polls = await prisma.poll.findMany({
      select: {
        id: true,
        question: true,
        options: true,
      },
    });

    const formattedPolls = polls.map((poll: { id: number; question: string; options: string }) => ({
        pollId: poll.id,
        question: poll.question,
        options: JSON.parse(poll.options),
      }));
      

    reply.send(formattedPolls);
  });
}
