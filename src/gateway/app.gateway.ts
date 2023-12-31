import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../module/user/user.service';
import { Message } from '../schema';
import { IUser } from '../share/interface/user.interface';
import { UserConversationService } from '../module/user-conversation/user-conversation.service';
import { MessageService } from '../module/message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userConversationService: UserConversationService,
    private readonly messageService: MessageService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(server, 'Init');
  }

  async handleConnection(client: Socket) {
    this.logger.log(client.id, 'Connected..............................');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(client.id, 'Disconnect');
  }

  @SubscribeMessage('message')
  async messages(client: Socket, payload: Message): Promise<void> {
    const message = await this.messageService.createMessage(payload);
    await this.userConversationService.updateLastMessageId(
      payload.userConversationId,
      message.id,
    );

    this.server.emit('message-received', message);
  }

  async getDataUserFromToken(client: Socket): Promise<IUser> {
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);
      return await this.userService.getByEmail(decoded.email);
    } catch (ex) {
      this.logger.error(new HttpException('Not found', HttpStatus.NOT_FOUND));
    }
  }
}
