import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UniqShopConstraintsNameEnum } from '../models/uniq-shop-constraints-name.enum';
import { OrganizationEntity } from '../../organization/entities/organization.entity';
import { Exclude, Expose } from 'class-transformer';
import { SHOP_TABLE_NAME } from '../../common/models/table-names.const';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: SHOP_TABLE_NAME })
@Exclude()
// This allows checking error.constraint === 'UQ_shop_email' if needed.
@Unique(UniqShopConstraintsNameEnum.EMAIL, ['email'])
@Unique(UniqShopConstraintsNameEnum.PHONE, ['phone'])
export class ShopEntity {
  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @OneToMany(() => ProductEntity, (product) => product.shop)
  products: ProductEntity[];

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 13,
  })
  phone: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Expose()
  @Column({ name: 'organization_id' })
  organizationId: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;
}
