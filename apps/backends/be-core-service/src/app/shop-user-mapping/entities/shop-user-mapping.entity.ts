import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn, Unique,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import { ShopEntity } from '../../shop/entities/shop.entity';
import { UserShopRoleEnum } from '../../common/models/user-shop-role.enum';
import { SHOP_USER_MAPPING_TABLE_NAME } from '../../common/models/table-names.const';

@Entity({ name: SHOP_USER_MAPPING_TABLE_NAME })
@Exclude()
@Unique(['userId', 'shopId'])
export class ShopUserMappingEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ShopEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: ShopEntity;

  @Expose()
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Expose()
  @PrimaryColumn({ name: 'shop_id' })
  shopId: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: UserShopRoleEnum,
    default: UserShopRoleEnum.READ_ONLY,
  })
  role: UserShopRoleEnum;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;
}
