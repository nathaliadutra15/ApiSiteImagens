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
import { S3Service } from './service/s3.service';
import { AuthModule } from './module/auth.module';
import { JwtAuthGuard } from './utils/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfigs]
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    HttpModule,
    AuthModule
  ],
  controllers: [AppController, UserController, PostsController, CommentController, FollowerController],
  providers: [AppService, DBConnection, UserService, PostService, CommentService, FollowerService, S3Service, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule { }
