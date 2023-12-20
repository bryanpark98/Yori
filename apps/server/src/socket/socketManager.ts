import { Http2SecureServer } from 'http2';
import { Server as SocketIOServer } from 'socket.io';
import { initOrderNamespace } from './namespaces/orderNamespace';
import { Server } from 'http';

let io: SocketIOServer;

export const initSocketIo = (httpServer: Server) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
    },
  });

  initOrderNamespace(io);
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
