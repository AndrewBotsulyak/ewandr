import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { In, Repository } from 'typeorm';
import { ShopEntity } from './entities/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UniqShopConstraintsNameEnum } from './models/uniq-shop-constraints-name.enum';
import { ConstraintShopError } from './models/constraint-shop-error.model';
import { PgCodesEnum } from '../common/models/pg-codes.enum';
import { ShopsByQueryModel } from './models/shops-by-query.model';
import { ORG_ID_CONTEXT } from '../common/models/test-values.temporary';
import { ShopUserMappingService } from '../shop-user-mapping/shop-user-mapping.service';
import { IShopItemModel } from './models/shop-item.model';
import { SHOP_TABLE_NAME } from '../common/models/table-names.const';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private repository: Repository<ShopEntity>,
    @Inject(forwardRef(() => ShopUserMappingService))
    private shopUserMappingService: ShopUserMappingService,
  ) {}

  async create(createShopDto: CreateShopDto) {
    try {
      // TODO organization context
      const organizationId = ORG_ID_CONTEXT;

      const newShop = this.repository.create({
        ...createShopDto,
        organizationId,
      });

      return await this.repository.save(newShop);
    } catch (error) {
      const err = error as ConstraintShopError;
      if (
        err?.code === PgCodesEnum.UNIQUE_VIOLATION &&
        (err?.constraint === UniqShopConstraintsNameEnum.EMAIL ||
          err.constraint === UniqShopConstraintsNameEnum.PHONE)
      ) {
        throw new ConflictException('Email or phone number already exists');
      }

      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async findAll(query: ShopsByQueryModel) {
    const { includeUsers } = query;

    // TODO organization context
    const organizationId = ORG_ID_CONTEXT;

    let shopEntities: IShopItemModel[];

    console.log('includeUsers = ', includeUsers);

    if (includeUsers === true) {
      // users aggregation for each shop
      shopEntities = (await this.repository.query(
        `
        SELECT s.id, s.title, s.phone, s.email, s.organization_id, json_agg(
          json_build_object(
            'id', u.id,
            'email', u."email",
            'name', u."name",
            'surname', u."surname",
            'patronymic', u."patronymic",
            'phone', u."phone",
            'role', m.role
          )
        ) AS users FROM "${SHOP_TABLE_NAME}" s
        LEFT JOIN "shop-user-mapping" m ON s.id = m.shop_id
        LEFT JOIN "users" u ON m.user_id = u.id
          WHERE s.organization_id = $1
        GROUP BY s.id
      `,
        [organizationId],
      )) as IShopItemModel[];

      // shopEntities = await this.repository
      //   .createQueryBuilder('shop')
      //   .leftJoin('shop-user-mapping', 'm', 'shop.id = m.shop_id')
      //   .leftJoin('users', 'u', 'm.user_id = u.id')
      //   // .select('shop') // выбираем все поля магазина
      //   .addSelect(
      //     `json_agg(json_build_object(
      //               'id', u.id,
      //               'email', u."email",
      //               'name', u."name",
      //               'surname', u."surname",
      //               'patronymic', u."patronymic",
      //               'phone', u."phone",
      //               'role', m.role
      //             ))`,
      //     'users',
      //   )
      //   .where('shop.organization_id = :orgId', { orgId: organizationId })
      //   .groupBy('shop.id')
      //   .getRawMany();
    } else {
      shopEntities = await this.repository.find({
        where: { organizationId },
      });
    }

    return shopEntities;
  }

  async findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, updateShopDto: UpdateShopDto) {
    const result = await this.repository.update(id, updateShopDto);

    if (result.affected == 0) {
      throw new NotFoundException('Wrong shop id');
    }

    const shop = await this.repository.findOne({
      where: { id },
      // relations: ['organization'], // connect organization if need it here, is optional now
    });

    return shop;
  }

  async remove(id: number) {
    const result = await this.repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Wrong shop id');
    }

    return;
  }

  public async findByIds(shopIds: number[]) {
    const result = await this.repository.findBy({
      id: In(shopIds),
    });

    if (result.length !== shopIds.length) {
      throw new NotFoundException(`some of rhe shops doesn't exist`);
    }

    return result;
  }
}
