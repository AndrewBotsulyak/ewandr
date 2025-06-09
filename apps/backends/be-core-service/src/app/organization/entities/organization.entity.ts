import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ORGANIZATION_TABLE_NAME } from '../../common/models/table-names.const';

@Entity({ name: ORGANIZATION_TABLE_NAME })
@Exclude()
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
  })
  title: string;
}
