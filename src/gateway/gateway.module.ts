import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../module/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageModule } from '../module/message/message.module';
import { ConversationModule } from 'src/module/conversation/conversation.module';

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
    MessageModule,
    ConversationModule,
  ],
  providers: [AppGateway],
})
export class EventsModule {}
