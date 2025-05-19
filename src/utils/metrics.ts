import client from 'prom-client';

export const webSocketConnections = new client.Counter({
  name: 'websocket_connections_total',
  help: 'Total number of WebSocket connections established',
});

export const webSocketDisconnections = new client.Counter({
  name: 'websocket_disconnections_total',
  help: 'Total number of WebSocket connections closed',
});
