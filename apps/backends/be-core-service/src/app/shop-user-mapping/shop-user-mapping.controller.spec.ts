import { Test, TestingModule } from '@nestjs/testing';
import { ShopUserMappingController } from './shop-user-mapping.controller';
import { ShopUserMappingService } from './shop-user-mapping.service';

describe('ShopUserMappingController', () => {
  let controller: ShopUserMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopUserMappingController],
      providers: [ShopUserMappingService],
    }).compile();

    controller = module.get<ShopUserMappingController>(ShopUserMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
