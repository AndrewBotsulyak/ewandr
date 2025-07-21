import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import {
  DataSource,
  EntityManager,
  QueryFailedError,
  Repository,
  Transaction,
} from 'typeorm';
import { CreateProductQueryDto } from './dto/create-product-query.dto';
import {
  ORG_ID_CONTEXT,
  SHOP_ID_CONTEXT,
} from '../common/models/test-values.temporary';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { ShopService } from '../shop/shop.service';
import { UpdateProductsCategoryDto } from './dto/update-products-category.dto';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

@Injectable()
export class ProductService {
  // TODO organization context
  private organizationId = ORG_ID_CONTEXT;
  private shopId = SHOP_ID_CONTEXT;

  constructor(
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>,
    private shopService: ShopService,
    private dataSource: DataSource,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    query: CreateProductQueryDto,
  ) {
    const { shopId } = query;

    const shop = await this.shopService.findOne(shopId);

    if (shop == null || shop.organizationId !== this.organizationId) {
      throw new ForbiddenException(
        `Shop not found or does not belong to this organization`,
      );
    }

    const productEntity = this.repository.create({
      ...createProductDto,
      shopId,
    });

    await this.repository.insert(productEntity);

    return await this.repository.findBy({ id: productEntity.id });
  }

  async findAll(query?: GetProductsQueryDto) {
    const {
      shopId = this.shopId,
      isOrganizationContext = false,
      categoryId,
      search,
    } = query ?? {};

    const queryBuilder = this.repository
      .createQueryBuilder('p')
      .innerJoin('p.shop', 's')
      .innerJoin('s.organization', 'o');

    console.log('query = ', query);

    if (isOrganizationContext === true) {
      queryBuilder.andWhere('o.id = :orgId', { orgId: this.organizationId });
    } else if (isOrganizationContext === false) {
      queryBuilder.andWhere('s.id = :shopId', { shopId });
      queryBuilder.andWhere('o.id = :orgId', { orgId: this.organizationId });
    }

    if (categoryId != null) {
      queryBuilder.innerJoin('p.category', 'c');
      queryBuilder.andWhere('c.id = :categoryId', { categoryId });
    }

    if (search != null) {
      queryBuilder.andWhere(
        '(p.title ILIKE :search OR p.description ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    return await queryBuilder.getMany();
  }

  async findAllS(query: GetProductsQueryDto) {
    const { shopId, isOrganizationContext } = query;
    const queryBuilder = this.repository
      .createQueryBuilder('p')
      .innerJoin('p.shop', 's');

    if (isOrganizationContext === true) {
      // this.repository.query(`
      //   SELECT p.title
      //   JOIN ${SHOP_TABLE_NAME} AS s ON p.shop_id = s.id
      //   JOIN ${ORGANIZATION_TABLE_NAME} AS o ON s.organization_id = o.id
      //   WHERE o.id = $1
      // `,
      //   [this.organizationId],
      // );

      queryBuilder.innerJoin('s.organization', 'o');

      return await this.repository
        .createQueryBuilder('p')
        .innerJoin('p.shop', 's')
        .innerJoin('s.organization', 'o')
        .where('o.id = :orgId', { orgId: this.organizationId })
        .getMany();
    } else {
      return await this.repository
        .createQueryBuilder('p')
        .innerJoin('p.shop', 's')
        .innerJoin('s.organization', 'o')
        .where('s.id = :shopId AND o.id = :orgId', {
          shopId,
          orgId: this.organizationId,
        })
        .getMany();
    }
  }

  async findOne(id: number) {
    const product = await this.getProduct(id);

    this.handleExceptions(product);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.getProduct(id);

    this.handleExceptions(product);

    await this.repository.update(id, updateProductDto);

    const updatedProduct = await this.getProduct(id);

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.getProduct(id);

    this.handleExceptions(product);

    const result = await this.repository.delete(id);

    return;
  }

  async updateCategory(body: UpdateProductsCategoryDto) {
    const { productIds, categoryId } = body;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const products = await this.getProducts(queryRunner, productIds);
      const foundIds = products.map((item) => item.id);
      const missingIds =
        products.length !== productIds.length
          ? productIds.filter((id) => foundIds.includes(id) === false)
          : [];

      if (missingIds.length > 0) {
        throw new NotFoundException(
          `Some product IDs not found ${missingIds.join(', ')}`,
        );
      }

      await queryRunner.manager
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ category: { id: categoryId } })
        .whereInIds(productIds)
        .execute();

      const updatedProducts = await this.getProducts(queryRunner, productIds);

      await queryRunner.commitTransaction();

      return updatedProducts;
    } catch (error) {
      console.log('error = ', error);

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    // await this.repository.query(`
    //   UPDATE product
    //   SET category_id = $1
    //   WHERE id ANY ($2)
    // `,
    //   [categoryId, productIds],
    // );
  }

  private async getProduct(id: number) {
    const product = await this.repository
      .createQueryBuilder('p')
      .innerJoin('p.shop', 's')
      .innerJoin('s.organization', 'o')
      .where('p.id = :productId AND o.id = :orgId', {
        productId: id,
        orgId: this.organizationId,
      })
      .getOne();

    return product;
  }

  private async getProducts(queryRunner: QueryRunner, ids: number[]) {
    const products = await queryRunner.manager
      .createQueryBuilder(ProductEntity, 'p')
      .innerJoin('p.shop', 's')
      .innerJoin('s.organization', 'o')
      .where('p.id IN (:...productIds) AND o.id = :orgId', {
        productIds: ids,
        orgId: this.organizationId,
      })
      .getMany();

    return products;
  }

  private handleExceptions(product: ProductEntity | null) {
    if (product == null) {
      throw new ForbiddenException(
        `Product not found or does not belong to this organization`,
      );
    }
  }
}
