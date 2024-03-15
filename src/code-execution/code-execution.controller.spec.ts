import { Test, TestingModule } from '@nestjs/testing';
import { CodeExecutionController } from './code-execution.controller';

describe('CodeExecutionController', () => {
  let controller: CodeExecutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeExecutionController],
    }).compile();

    controller = module.get<CodeExecutionController>(CodeExecutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
