import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';

@Module({
  imports: [],
  controllers: [AppController, PostController],
  providers: [AppService, PrismaService, UserService, PostService],
})
export class AppModule {}
