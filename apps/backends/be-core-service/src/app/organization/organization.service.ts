import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Repository } from 'typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ORG_ID_CONTEXT } from '../common/models/test-values.temporary';
import { ShopService } from '../shop/shop.service';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private orgRepository: Repository<OrganizationEntity>,
    private shopService: ShopService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const newOrg = this.orgRepository.create(createOrganizationDto);

    return await this.orgRepository.save(newOrg);
  }

  async findOne(id?: number) {
    // TODO org context
    const orgId = id ?? ORG_ID_CONTEXT;

    return await this.orgRepository.findOneBy({ id: orgId });
  }

  async getDetails(id?: number) {
    // TODO org context
    const orgId = id ?? ORG_ID_CONTEXT;

    return {
      organization: await this.orgRepository.findOneBy({ id: orgId }),
      shops: await this.shopService.findAll({ includeUsers: true }),
      users: await this.userService.findAll(),
      products: await this.productService.findAll(),
    };
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.orgRepository.update(id, updateOrganizationDto);

    const updatedOrg = await this.orgRepository.findOne({ where: { id } });

    if (updatedOrg == null) {
      throw new NotFoundException();
    }

    return updatedOrg;
  }

  async remove(id: number) {
    const result = await this.orgRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('Wrong id');
    }

    return;
  }
}
