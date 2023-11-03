import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../module/user/user.service";
import { User } from "../schema";
import { IUser } from "./interface/user.interface";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("MessageGateway");

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {
  }

  afterInit(server: any): any {
    this.logger.log(server, "Init");
  }

  async handleConnection(client: Socket) {
    this.logger.log(client.id, "Connected..............................");
    console.log(client.id);
    const user: IUser = await this.getDataUserFromToken(client);
    console.log(user.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(client.id, "Disconnect");
  }

  @SubscribeMessage("message")
  async onChat1(@MessageBody() data: string): Promise<void> {
    console.log(data);
  }

  async getDataUserFromToken(client: Socket): Promise<IUser> {
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);
      return await this.userService.getByEmail(decoded.email);
    } catch (ex) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }
  }
}