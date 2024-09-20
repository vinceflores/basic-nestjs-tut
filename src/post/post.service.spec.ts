import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post, PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';

describe('PostService', () => {
  let service: PostService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get post', () => {
    it('should return a post', async () => {
      const existingPost = {
        id: 1,
        title: 'title',
        content: 'content',
        published: false,
        authorId: 1,
      };
      prismaMock.post.findUnique.mockResolvedValue(existingPost);
      const result = await service.post({ id: existingPost.id });
      expect(result).toEqual(existingPost);
      expect(prismaMock.post.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.post.findUnique).toHaveBeenNthCalledWith(1, {
        where: { id: existingPost.id },
      });
    });
  });

  describe('get posts paginated', () => {
    describe('no filters', () => {
      it('should return all post', async () => {
        const existingPosts = [
          {
            id: 1,
            title: 'title',
            content: 'content',
            published: false,
            authorId: 1,
          },
          {
            id: 2,
            title: 'title',
            content: 'content',
            published: false,
            authorId: 1,
          },
        ];
        prismaMock.post.findMany.mockResolvedValue(existingPosts);
        const result = await service.posts({});
        expect(result).toHaveLength(2);
        expect(result).toEqual(existingPosts);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: undefined,
          take: undefined,
          where: undefined,
          orderBy: undefined,
        });
      });
    });

    describe('with filters', () => {
      let existingPosts: Post[];
      let sliced: Post[];
      beforeEach(() => {
        existingPosts = [
          {
            id: 1,
            title: 'title',
            content: 'content',
            published: false,
            authorId: 1,
          },
          {
            id: 2,
            title: 'title',
            content: 'content',
            published: false,
            authorId: 1,
          },
          {
            id: 3,
            title: 'title',
            content: 'content',
            published: false,
            authorId: 1,
          },
        ];
      });

      it('should skip 1', async () => {
        sliced = existingPosts.slice(1, existingPosts.length);
        prismaMock.post.findMany.mockResolvedValue(sliced);

        const result = await service.posts({ skip: 1 });

        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: 1,
          take: undefined,
          where: undefined,
          orderBy: undefined,
        });
      });
      it('should take 2', async () => {
        const take = 2;
        sliced = existingPosts.slice(0, take);
        prismaMock.post.findMany.mockResolvedValue(sliced);

        const result = await service.posts({ take });

        expect(result).toHaveLength(take);
        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: undefined,
          take,
          where: undefined,
          orderBy: undefined,
        });
      });
      it("should take all and order by 'id' asc", async () => {
        sliced = existingPosts.sort((a, b) => a.id - b.id); // sort by id asc
        prismaMock.post.findMany.mockResolvedValue(sliced);
        const callWith = {
          orderBy: { id: 'asc' as const },
        };

        const result = await service.posts(callWith);

        expect(result).toHaveLength(existingPosts.length);
        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: undefined,
          take: undefined,
          where: undefined,
          orderBy: callWith.orderBy,
        });
      });
      it('should take 2 and skip 1', async () => {
        const skip = 1;
        const take = 2;
        sliced = existingPosts.slice(skip, skip + take);
        prismaMock.post.findMany.mockResolvedValue(sliced);

        const result = await service.posts({ skip, take });

        expect(result).toHaveLength(take);
        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip,
          take,
          where: undefined,
          orderBy: undefined,
        });
      });
      it('return where published is true', async () => {
        const where = { published: true };
        sliced = existingPosts.filter((post) => post.published);
        prismaMock.post.findMany.mockResolvedValue(sliced);

        const result = await service.posts({ where });

        expect(result).toHaveLength(sliced.length);
        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: undefined,
          take: undefined,
          where,
          orderBy: undefined,
        });
      });
      it('return where authorId is 1', async () => {
        const where = { authorId: 1 };
        sliced = existingPosts.filter((post) => post.authorId === 1);
        prismaMock.post.findMany.mockResolvedValue(sliced);

        const result = await service.posts({ where });

        expect(result).toHaveLength(sliced.length);
        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: undefined,
          take: undefined,
          where,
          orderBy: undefined,
        });
      });

      it('return where id is 3', async () => {
        const where = { id: 3 };
        sliced = existingPosts.filter((post) => post.id === 3);
        prismaMock.post.findMany.mockResolvedValue(sliced);

        const result = await service.posts({ where });

        expect(result).toHaveLength(sliced.length);
        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: undefined,
          take: undefined,
          where,
          orderBy: undefined,
        });
      });

      it('return where authorId is 1 and published is true', async () => {
        const where = { authorId: 1, published: true };
        sliced = existingPosts.filter(
          (post) => post.authorId === 1 && post.published,
        );
        prismaMock.post.findMany.mockResolvedValue(sliced);

        const result = await service.posts({ where });

        expect(result).toHaveLength(sliced.length);
        expect(result).toEqual(sliced);
        expect(prismaMock.post.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
          cursor: undefined,
          skip: undefined,
          take: undefined,
          where,
          orderBy: undefined,
        });
      });
    });
  });

  describe('create post', () => {
    it('should create a post', async () => {
      const toPost = {
        id: 1,
        title: 'title',
        content: 'content',
        published: false,
        authorId: 1,
      };
      prismaMock.post.create.mockResolvedValue(toPost);

      const result = await service.createPost(toPost);
      expect(result).toEqual(toPost);
      expect(prismaMock.post.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.post.create).toHaveBeenCalledWith({
        data: toPost,
      });
    });
  });

  describe('update post', () => {
    it('should update title', async () => {
      const existingPost = {
        id: 1,
        title: 'title',
        content: 'content',
        published: false,
        authorId: 1,
      };
      prismaMock.post.update.mockResolvedValue({
        ...existingPost,
        title: 'new title',
      });
      const result = await service.updatePost({
        where: { id: existingPost.id },
        data: { title: 'new title' },
      });

      for (const key in result) {
        if (key === 'title') {
          expect(result[key]).not.toEqual(existingPost[key]);
          expect(result[key]).toEqual('new title');
        } else {
          expect(result[key]).toEqual(existingPost[key]);
        }
      }

      expect(prismaMock.post.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete post', () => {
    it('should delete a post', async () => {
      const existingPost = {
        id: 1,
        title: 'title',
        content: 'content',
        published: false,
        authorId: 1,
      };
      prismaMock.post.delete.mockResolvedValue(existingPost);
      const result = await service.deletePost({ id: existingPost.id });
      expect(result).toEqual(existingPost);
      expect(prismaMock.post.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.post.delete).toHaveBeenCalledWith({
        where: { id: existingPost.id },
      });
    });
  });
});
