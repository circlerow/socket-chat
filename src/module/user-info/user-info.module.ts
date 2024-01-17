import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfoSchema } from 'src/schema/user-info.schema';
import { UserInfoController } from './user-info.controller';
import { UserInfoService } from './user-info.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserInfo',
        schema: UserInfoSchema,
        collection: 'UserInfo',
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
    UserModule,
  ],
  exports: [MongooseModule],
  controllers: [UserInfoController],
  providers: [UserInfoService],
})
export class UserInfoModule {}
