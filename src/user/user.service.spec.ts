import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service.ts';
import { beforeEach, describe, expect, it } from "@jest/globals";

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
