import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PostModule } from './post.module';
import { PostService } from './post.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';

describe('e2e Post', () => {
  let app: INestApplication;

  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    const moduleRef = Test.createTestingModule({
      imports: [PostModule],
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    });

    const module = await moduleRef.compile();
    app = module.createNestApplication();
    await app.init();
  });


  
});
