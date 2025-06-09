import { Test, TestingModule } from '@nestjs/testing';
import { ShopUserMappingService } from './shop-user-mapping.service';

describe('ShopUserMappingService', () => {
  let service: ShopUserMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopUserMappingService],
    }).compile();

    service = module.get<ShopUserMappingService>(ShopUserMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
