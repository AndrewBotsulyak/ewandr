import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Exclude, Expose } from 'class-transformer';
import { OrganizationEntity } from '../../organization/entities/organization.entity';
import { UserOrganizationRoleEnum } from '../../common/models/user-organization-role.enum';

@Entity({ name: 'organization-user-mapping' })
@Exclude()
@Unique(['userId', 'organizationId'])
export class OrganizationUserMappingEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' }) // set column name
  organization: OrganizationEntity;

  @PrimaryColumn({ name: 'organization_id' })
  organizationId: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: UserOrganizationRoleEnum,
    default: UserOrganizationRoleEnum.READ_ONLY,
  })
  role: UserOrganizationRoleEnum;

  @CreateDateColumn()
  createdAt: Date;
}
