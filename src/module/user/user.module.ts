import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "User",
        schema: UserSchema,
        collection: "User"
      }
    ])
  ],
  exports: [MongooseModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
}