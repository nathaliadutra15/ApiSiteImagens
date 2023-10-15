import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBConnection } from './repository/database.connection';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './configs/read.config'
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { PostsController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './service/comment.service';
import { FollowerController } from './controller/follower.controller';
import { FollowerService } from './service/follower.service';

@Module({
  imports: [ConfigModule.forRoot({
    load: [mongoConfig]
  })],
  controllers: [AppController, UserController, PostsController, CommentController, FollowerController],
  providers: [AppService, DBConnection, UserService, PostService, CommentService, FollowerService],
})
export class AppModule {}
