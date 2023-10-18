import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBConnection } from './repository/database.connection';
import { ConfigModule } from '@nestjs/config';
import authConfigs from './configs/read.config'
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { PostsController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './service/comment.service';
import { FollowerController } from './controller/follower.controller';
import { FollowerService } from './service/follower.service';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { UploadS3Service } from './service/upload-s3.service';
import { S3 } from "aws-sdk";


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfigs]
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    HttpModule
  ],
  controllers: [AppController, UserController, PostsController, CommentController, FollowerController],
  providers: [AppService, DBConnection, UserService, PostService, CommentService, FollowerService, UploadS3Service, S3],
})
export class AppModule { }
