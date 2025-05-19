import Fastify from 'fastify';
import cors from '@fastify/cors';

import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv';
import path from 'path';
import { pollRoutes } from './routes/pollRoutes';
import { WebSocket, WebSocketServer } from 'ws';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';
import { webSocketConnections, webSocketDisconnections } from './utils/metrics';

dotenv.config();

const wss = new WebSocketServer({ port: 4001 });
export const globalConnections: WebSocket[] = [];

wss.on('connection', (socket: WebSocket) => {
  console.log('📡 Native WebSocket Connection Established');
  globalConnections.push(socket);
  webSocketConnections.inc();  // Increment on new connection

  socket.send(JSON.stringify({ message: '👋 Hello from Native WebSocket Server!' }));

  socket.on('close', () => {
    console.log('📴 Native WebSocket Connection Closed');
    webSocketDisconnections.inc();  // Increment on close
    const index = globalConnections.indexOf(socket);
    if (index !== -1) globalConnections.splice(index, 1);
  });
});

const app = Fastify();
app.register(cors, { origin: '*' });
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



// JWT Configuration
app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });

// Runs every minute (you can adjust as needed)
cron.schedule('* * * * *', async () => {
    console.log('⏰ Checking for expired polls...');
  
    const expiredPolls = await prisma.poll.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        status: 'active',
      },
      data: { status: 'closed' },
    });
  
    if (expiredPolls.count > 0) {
      console.log(`🚫 Closed ${expiredPolls.count} expired polls.`);
    }
  });
// Serve Static Files
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
});

// Routes
app.register(pollRoutes);

// Favicon Handler
app.get('/favicon.ico', async (req, reply) => {
  return reply.code(204).send();
});

// Health Check
app.get('/health', async (req, reply) => {
  return { status: 'OK' };
});

// JWT Anonymous Auth Endpoint
app.post('/auth/anon', async (req, reply) => {
    const userId = uuidv4(); // ✅ Stable and unique user ID
    const token = app.jwt.sign(
      { userId },
      { expiresIn: '15m' }
    );
    reply.send({ token });
});



  
  const redisClient = new Redis();

  export const voteRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'vote_rate_limit',
    points: 5,        // 5 votes allowed
    duration: 5,      // Per second
    blockDuration: 10 // Block for 10 seconds after exceeding limit
  });
  


  if (process.env.NODE_ENV !== 'test') {
    app.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`🚀 Server listening at ${address}`);
    });
  }
  