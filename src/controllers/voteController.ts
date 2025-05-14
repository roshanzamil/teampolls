import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { globalConnections, voteRateLimiter } from '../index';
import { WebSocket } from 'ws';

const prisma = new PrismaClient();

interface VoteBody {
  option: string;
}

export async function votePollHandler(
  req: FastifyRequest<{ Params: { id: string }; Body: VoteBody }>,
  reply: FastifyReply
) {
  const pollId = parseInt(req.params.id);
  const { option } = req.body;

  const authHeader = req.headers['authorization'];
  if (!authHeader) return reply.status(401).send({ message: 'Authorization header missing.' });
  
  const token = authHeader.split(' ')[1];
  if (!token) return reply.status(401).send({ message: 'Invalid Authorization header.' });
  
  let userId = 'anonymous';
  try {
    const decoded: any = req.server.jwt.verify(token);
    userId = decoded.userId || 'anonymous';
  } catch (err) {
    return reply.status(401).send({ message: 'Invalid or expired token.' });
  }
  
  console.log('🧩 Rate Limit User ID:', userId); // ✅ Should stay same during testing
  
  try {
    await voteRateLimiter.consume(userId);
    console.log(`✅ Rate limit OK for user: ${userId}`);
  } catch (rateLimitError) {
    console.log(`🚫 Rate limit exceeded for user: ${userId}`);
    return reply.status(429).send({ message: 'Too many votes! Slow down.' });
  }
  

  // 🎯 Validate Poll & Options
  const poll = await prisma.poll.findUnique({ where: { id: pollId } });
  if (!poll) return reply.status(404).send({ message: 'Poll not found.' });

  if (poll.status === 'closed') {
    return reply.status(400).send({ message: 'Poll is closed and no longer accepting votes.' });
  }
  const options = JSON.parse(poll.options);
  if (!options.includes(option)) {
    return reply.status(400).send({ message: 'Invalid option selected.' });
  }

  // 📝 Store Vote
  await prisma.vote.create({
    data: { pollId, option },
  });

  // 📡 Broadcast Vote Update via WebSocket
  const payload = JSON.stringify({
    voteUpdate: {
      pollId,
      updatedAt: new Date().toISOString(),
    },
  });

  globalConnections.forEach(socket => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
    }
  });

  return reply.send({ message: 'Vote recorded.' });
}
