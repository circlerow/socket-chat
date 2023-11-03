import { Module } from "@nestjs/common";
import { AppGateway } from "./app.gateway";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../module/user/user.module";
import { UserService } from "../module/user/user.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>("jwt.secret"),
          signOptions: {
            expiresIn: configService.get<string>("jwt.expiresIn")
          }
        };
      }
    }), UserModule],
  providers: [AppGateway, UserService]
})
export class EventsModule {
}
