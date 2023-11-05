import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InformationService } from "./information.service";
import { InformationSchema } from "../../schema";
import { InformationController } from "./information.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Information",
        schema: InformationSchema,
        collection: "Information"
      }
    ])
  ],
  exports: [MongooseModule, InformationService],
  controllers: [InformationController],
  providers: [InformationService]
})
export class InformationModule {
}