import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostController } from './post.controller';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}
