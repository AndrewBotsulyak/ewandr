import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationQueryService } from './organization-query.service';

describe('OrganizationQueryService', () => {
  let service: OrganizationQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationQueryService],
    }).compile();

    service = module.get<OrganizationQueryService>(OrganizationQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
