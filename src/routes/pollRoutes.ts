import { FastifyInstance } from 'fastify';
import { createPollHandler, getPollTallyHandler, getAllPollsHandler } from '../controllers/pollController';
import { votePollHandler } from '../controllers/voteController';
import { predictPollOutcome } from '../controllers/predictionController';
import { webSocketConnections, webSocketDisconnections } from '../utils/metrics';
import client from 'prom-client';




export async function pollRoutes(app: FastifyInstance) {
  app.post('/poll', createPollHandler);
  app.post('/poll/:id/vote', votePollHandler);
  app.get('/poll/:id', getPollTallyHandler);
  app.get('/polls', getAllPollsHandler); 
  app.get('/poll/:id/predict', predictPollOutcome);

  // Metrics Endpoint for Prometheus
  app.get('/metrics', async (req, reply) => {
    reply.header('Content-Type', client.register.contentType);
    return client.register.metrics();
  });
  
}
