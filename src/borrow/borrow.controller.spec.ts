import { Test, TestingModule } from '@nestjs/testing';
import { BorrowController } from './borrow.controller.ts';
import { beforeEach, describe, expect, it } from "@jest/globals";

describe('BorrowController', () => {
  let controller: BorrowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowController],
    }).compile();

    controller = module.get<BorrowController>(BorrowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
