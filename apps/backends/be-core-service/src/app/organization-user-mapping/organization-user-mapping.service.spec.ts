import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationUserMappingService } from './organization-user-mapping.service';

describe('OrganizationUserMappingService', () => {
  let service: OrganizationUserMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationUserMappingService],
    }).compile();

    service = module.get<OrganizationUserMappingService>(OrganizationUserMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
