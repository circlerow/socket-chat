import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../module/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserConversationModule } from '../module/user-conversation/user-conversation.module';
import { MessageModule } from '../module/message/message.module';
import { InformationModule } from '../module/information/information.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn'),
          },
        };
      },
    }),
    UserModule,
    UserConversationModule,
    MessageModule,
    InformationModule,
  ],
  providers: [AppGateway],
})
export class EventsModule {}
