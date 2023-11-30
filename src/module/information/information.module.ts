import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InformationService } from './information.service';
import { InformationSchema } from '../../schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Information',
        schema: InformationSchema,
        collection: 'Information',
      },
    ]),
  ],
  exports: [MongooseModule, InformationService],
  providers: [InformationService],
})
export class InformationModule {}
