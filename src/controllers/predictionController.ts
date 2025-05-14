import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI('AIzaSyDALn8Bph_1vCvF7ut8MkR1cAg2hguFrQ4');

export async function predictPollOutcome(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const pollId = parseInt(req.params.id);
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { votes: true },
    });
  
    if (!poll) return reply.status(404).send({ message: 'Poll not found.' });
  
    const options = JSON.parse(poll.options);
    const votes = poll.votes;
  
    // Calculate votes per option and voting speed
    const now = new Date().getTime();
    const voteSpeeds: Record<string, number> = {};
  
    options.forEach((opt: string) => {
      const optVotes = votes.filter(v => v.option === opt);
      if (optVotes.length === 0) {
        voteSpeeds[opt] = 0;
      } else {
        const firstVoteTime = new Date(optVotes[0].createdAt).getTime();
        const timeDiffSeconds = (now - firstVoteTime) / 1000;
        voteSpeeds[opt] = optVotes.length / timeDiffSeconds; // Votes per second
      }
    });
  
    const prompt = `
Poll Question: ${poll.question}
Options: ${options.join(', ')}
Votes: ${votes.map(v => v.option).join(', ')}
Vote Speeds (votes per second): ${JSON.stringify(voteSpeeds)}

Predict which option is most likely to win based only on the current votes and vote speeds. 
Only return the name of the predicted winning option. Do not include explanations or additional formatting.

If possible, also provide a very brief reason (two sentence).


  `;
  
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const prediction = result.response.text().trim();
  
    return reply.send({ prediction });
  }
  