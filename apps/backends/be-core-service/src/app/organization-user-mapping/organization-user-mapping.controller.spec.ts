import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationUserMappingController } from './organization-user-mapping.controller';
import { OrganizationUserMappingService } from './organization-user-mapping.service';

describe('OrganizationUserMappingController', () => {
  let controller: OrganizationUserMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationUserMappingController],
      providers: [OrganizationUserMappingService],
    }).compile();

    controller = module.get<OrganizationUserMappingController>(OrganizationUserMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
