import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { globalConnections } from '../index';
import { WebSocket } from 'ws';

const prisma = new PrismaClient();

interface CreatePollBody {
  question: string;
  options: string[];
  expiresAt: string;
}

export async function createPollHandler(
  req: FastifyRequest<{ Body: CreatePollBody }>,
  reply: FastifyReply
) {
  const { question, options, expiresAt } = req.body;

  // Validation
  if (!question || question.trim() === '') {
    return reply.status(400).send({ message: 'Question is required.' });
  }

  if (!options || !Array.isArray(options) || options.length < 2) {
    return reply.status(400).send({ message: 'At least two options are required.' });
  }

  if (!expiresAt || isNaN(Date.parse(expiresAt))) {
    return reply.status(400).send({ message: 'Valid expiresAt date is required.' });
  }

  const poll = await prisma.poll.create({
    data: {
      question,
      options: JSON.stringify(options),
      expiresAt: new Date(expiresAt),
    },
  });

  const payload = JSON.stringify({
    newPoll: {
      pollId: poll.id,
      question,
      options,
    },
  });

  globalConnections.forEach(socket => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
    }
  });

  

  return reply.send({ pollId: poll.id });
}

export async function getPollTallyHandler(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const pollId = parseInt(req.params.id);
  
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { votes: true },
    });
  
    if (!poll) return reply.status(404).send({ message: 'Poll not found.' });
  
    const votes: { option: string }[] = poll.votes;
  
    const tally = votes.reduce((acc: any, vote) => {
      acc[vote.option] = (acc[vote.option] || 0) + 1;
      return acc;
    }, {});
  
    return reply.send({
      question: poll.question,
      options: JSON.parse(poll.options),
      tally,
      expiresAt: poll.expiresAt,
    });
  }
  

export async function getAllPollsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const polls = await prisma.poll.findMany();
    return reply.send(polls);
  } catch (err) {
    console.error('Error fetching polls:', err);
    return reply.status(500).send({ message: 'Failed to fetch polls.' });
  }
}