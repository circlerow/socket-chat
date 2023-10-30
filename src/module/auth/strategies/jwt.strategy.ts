import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthPayload } from "../interface/auth.interface";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JsonWebTokenStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwt.secret")
    });
  }

  async validate(payload: AuthPayload) {
    return { id: payload.id, name: payload.name, email: payload.email };
  }
}
