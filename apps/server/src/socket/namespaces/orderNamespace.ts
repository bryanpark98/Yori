import { Server, Socket } from 'socket.io';
import logger from '../../utils/logger';
import { IOrder } from '@yori/types/src/core/order';

export function initOrderNamespace(io: Server) {
  const orderNamespace = io.of('/order');

  orderNamespace.on('connection', (socket: Socket) => {
    logger.log('info', 'New connection to order namespace');

    socket.on('newOrder', (orderData: IOrder) => {
      orderNamespace.emit('orderBroadcast', orderData);
      logger.log('info', 'New order received and broadcasted', {
        order: orderData,
      });
    });

    // socket.on('updateOrder', (updatedOrder: IOrder) => {
    //   orderNamespace.emit('orderUpdated', updatedOrder);
    //   logger.log('info', 'Order updated and broadcasted', {
    //     order: updatedOrder,
    //   });
    // });

    socket.on('disconnect', () => {
      logger.log('info', 'A user disconnected from the order namespace');
    });
  });
}
