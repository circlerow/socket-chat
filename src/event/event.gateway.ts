import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("message1-2")
  async onChat1(@MessageBody() data: string): Promise<void> {
    this.server.emit("message2-1", data);
    console.log(data);
  }

  @SubscribeMessage("message2-1")
  async onChat2(@MessageBody() data: string): Promise<void> {
    this.server.emit("message1-2", data);
    console.log(data);
  }


}