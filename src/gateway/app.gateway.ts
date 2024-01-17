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
import { IUser } from '../share/interface/user.interface';
import { MessageService } from '../module/message/message.service';
import { ConversationService } from 'src/module/conversation/conversation.service';
import { nanoid } from 'nanoid';

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
    private readonly conversationService: ConversationService,
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
  async messages(client: Socket, payload: any): Promise<void> {
    const newMessage = {
      id: nanoid(10),
      ...payload,
    };

    const message = await this.messageService.createMessage(newMessage);
    const messageConversation = {
      messageId: message.id,
      createdAt: (message as any).createdAt,
      fromUserId: message.fromUserId,
    };
    await this.conversationService.updateMessage(
      message.conversationId,
      messageConversation,
    );
    await this.conversationService.updateLastMessage(
      message.conversationId,
      message.message,
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
