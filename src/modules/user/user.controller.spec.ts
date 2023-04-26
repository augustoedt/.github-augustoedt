import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { userFactory } from '../../database/factories';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [PrismaService, UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('create user', () => {
    it('should create a new user', async () => {
      const userData = userFactory();
      const createdUser: User = await userController.createUser(userData);

      expect(createdUser).toHaveProperty('id');
      expect(createdUser.email).toEqual(userData.email);
      expect(createdUser.name).toEqual(userData.name);
    });
  });

  describe('delete user by id', () => {
    it('should delete the correct user', async () => {
      const userData = userFactory();
      const createdUser: User = await userController.createUser(userData);

      await userController.deleteUser(createdUser.id);

      const fetchedUser: User | null = await prismaService.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(fetchedUser).toBeNull();
    });
  });
});
