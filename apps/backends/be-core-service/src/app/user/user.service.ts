import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { OrganizationUserMappingService } from '../organization-user-mapping/organization-user-mapping.service';
import {
  ORG_ID_CONTEXT,
  USER_ID_CONTEXT,
} from '../common/models/test-values.temporary';
import { IUsersByQuery } from './models/users-by-query.model';
import { IUserItem } from './models/user-item.model';
import { USER_TABLE_NAME } from '../common/models/table-names.const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,

    private orgUserMappingService: OrganizationUserMappingService,
  ) {}

  async getUserById(userId: number): Promise<UserEntity | null> {
    const user = await this.repository.findOne({
      where: { id: userId },
    });

    if (user == null) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(query?: IUsersByQuery) {
    const { includeShops = false } = query ?? {};

    // TODO context from Token
    const organizationId = ORG_ID_CONTEXT;
    const isOrgAdmin = true;

    let result: IUserItem[];

    if (includeShops === true) {
      result = (await this.repository.query(
        `
        SELECT u.id, u.name, u.surname, u.patronymic, u.phone, u.email, o.role,
        json_agg(
          json_build_object(
            'id', s."id",
            'title', s."title",
            'phone', s."phone",
            'email', s."email",
            'role', m."role"
          )
        ) AS shops
        FROM ${USER_TABLE_NAME} u
        LEFT JOIN "shop-user-mapping" m ON m.user_id = u.id
        LEFT JOIN "organization-user-mapping" o ON o.user_id = u.id
        LEFT JOIN "shop" s ON s.id = m.shop_id
        WHERE s.organization_id = $1
        GROUP BY u.id, o.role
      `,
        [organizationId],
      )) as IUserItem[];
    } else {
      result = (await this.repository.query(
        `
        SELECT u.id, u.name, u.surname, u.patronymic, u.phone, u.email, o.role
        FROM ${USER_TABLE_NAME} AS u
        LEFT JOIN "organization-user-mapping" AS o ON o.user_id = u.id
        WHERE o.organization_id = $1
      `,
        [organizationId],
      )) as IUserItem[];
      // result = await this.repository
      //   .createQueryBuilder('user')
      //   .leftJoinAndSelect('user.organizationMappings', 'mapping')
      //   .where('mapping.organization_id = :orgId', { orgId: organizationId })
      //   .getMany();
    }

    return result;
  }

  async getUser(): Promise<UserEntity | null> {
    // this value should be received from Token
    // this is request context
    const userId = USER_ID_CONTEXT;

    const user = await this.repository.findOne({
      where: { id: userId },
    });

    if (user == null) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const newUserEntity = this.repository.create(dto);

    const createdUser = await this.repository.save(newUserEntity);

    // TODO organization context detection
    // if e.g in Token we have organization context
    const orgContextId: number = ORG_ID_CONTEXT;

    if (orgContextId != null) {
      await this.addUserToOrganization(createdUser, orgContextId);
    }

    return createdUser;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    try {
      const result = await this.repository
        .createQueryBuilder()
        .update(UserEntity)
        .set(dto)
        .where('id = :id', { id })
        .execute();

      return result;
    } catch (error) {
      console.log('error = ', error);
    }
  }

  /**
   * @param user
   * @param organizationId
   * @private Adding user to organization-user-mapping table
   */
  private async addUserToOrganization(
    user: UserEntity,
    organizationId: number,
  ) {
    return await this.orgUserMappingService.create({
      userId: user.id,
      organizationId,
    });
  }
}
