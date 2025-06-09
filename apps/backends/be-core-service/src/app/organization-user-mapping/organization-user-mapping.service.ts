import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationUserMappingDto } from './dto/create-organization-user-mapping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUserMappingEntity } from './entities/organization-user-mapping.entity';
import { Repository } from 'typeorm';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { queryFailedErrorHandler } from '../common/utils/query-failed-error.handler';

@Injectable()
export class OrganizationUserMappingService {
  constructor(
    @InjectRepository(OrganizationUserMappingEntity)
    public readonly repository: Repository<OrganizationUserMappingEntity>,
    private orgService: OrganizationService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async create(
    createOrganizationUserMappingDto: CreateOrganizationUserMappingDto,
  ) {
    try {
      const { organizationId, userId } = createOrganizationUserMappingDto;

      const organization = await this.orgService.findOne(organizationId);

      const user = await this.userService.getUserById(userId);

      if (organization == null || user == null) {
        throw new NotFoundException('Organization or User not found');
      }

      const mappingEntity = this.repository.create(
        createOrganizationUserMappingDto,
      );

      await this.repository.insert(mappingEntity);

      return this.repository.findOne({
        where: { userId, organizationId },
      });
    } catch (error) {
      queryFailedErrorHandler(error);

      throw error;
    }
  }

  async getUsersByOrg(orgId: number) {
    try {
      const users = await this.repository.find({
        where: { organizationId: orgId },
        relations: ['user'], // name from OrganizationUserMappingEntity
      });

      return users;
    } catch (error) {
      console.log('error = ', error);

      throw new NotFoundException(error);
    }
  }

  async getOrgsByUserId(userId: number) {
    try {
      const organizations = await this.repository.find({
        where: { userId },
        relations: ['organization'], // name from OrganizationUserMappingEntity
      });

      return organizations;
    } catch (error) {
      console.log('error = ', error);
    }
  }

  // findAll() {
  //   return `This action returns all organizationUserMapping`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} organizationUserMapping`;
  // }
  //
  // update(
  //   id: number,
  //   updateOrganizationUserMappingDto: UpdateOrganizationUserMappingDto,
  // ) {
  //   return `This action updates a #${id} organizationUserMapping`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} organizationUserMapping`;
  // }
}
