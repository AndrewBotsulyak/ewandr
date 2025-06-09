import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PRODUCT_TABLE_NAME } from '../../common/models/table-names.const';
import { ProductStatusEnum } from '../models/product-status.enum';
import { ShopEntity } from '../../shop/entities/shop.entity';
import { Exclude, Expose } from 'class-transformer';
import { ProductCategoryEntity } from '../../product-categories/entities/product-category.entity';

@Entity({ name: PRODUCT_TABLE_NAME })
@Exclude()
export class ProductEntity {
  @ManyToOne(() => ShopEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: ShopEntity;

  @ManyToOne(() => ProductCategoryEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategoryEntity;

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ name: 'shop_id' })
  shopId: number;

  @Expose()
  @Column({
    name: 'category_id',
    nullable: true,
  })
  categoryId: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
  })
  title: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 2000,
  })
  description: string;

  @Expose()
  @Column({
    type: 'numeric',
    precision: 10,
  })
  price: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: ProductStatusEnum,
    default: ProductStatusEnum.NOT_AVAILABLE,
  })
  status: ProductStatusEnum;

  @Expose()
  @Column({
    type: 'numeric',
    precision: 10,
    nullable: true,
  })
  count: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  brand: string;
}
