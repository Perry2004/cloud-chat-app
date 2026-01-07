import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  transports: ['polling', 'websocket', 'webtransport'],
})
export class MessageGateway {
  private readonly logger = new Logger(MessageGateway.name);

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(`Received message: ${data}`);
    client.emit('message', `echo: ${data}`);
    return `acknowledge: ${data}`;
  }
}
