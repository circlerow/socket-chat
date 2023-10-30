import { Module } from "@nestjs/common";
import { EventsModule } from "./event/event.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "./config";
import { UserModule } from "./module/user/user.module";
import { AuthModule } from "./module/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { ConversationModule } from "./module/conversation/conversation.module";
import { MessageModule } from "./module/message/message.module";
import { UserConversationModule } from "./module/user-conversation/user-conversation.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("database.uri")
        };
      }
    }),
    ConfigModule.forRoot({
      load: config
    }),
    JwtModule,
    UserModule,
    AuthModule,
    EventsModule,
    ConversationModule,
    MessageModule,
    UserConversationModule
  ]
})
export class AppModule {
}
