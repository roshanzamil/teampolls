import { FastifyInstance } from 'fastify';
import { createPollHandler, getPollTallyHandler, getAllPollsHandler } from '../controllers/pollController';
import { votePollHandler } from '../controllers/voteController';
import { predictPollOutcome } from '../controllers/predictionController';



export async function pollRoutes(app: FastifyInstance) {
  app.post('/poll', createPollHandler);
  app.post('/poll/:id/vote', votePollHandler);
  app.get('/poll/:id', getPollTallyHandler);
  app.get('/polls', getAllPollsHandler); 
  app.get('/poll/:id/predict', predictPollOutcome);

}
