import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { USER_TABLE_NAME } from '../../common/models/table-names.const';

@Exclude()
@Entity({ name: USER_TABLE_NAME })
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  surname: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  patronymic: string; // отчество

  @Expose()
  @Column({
    nullable: false,
  })
  phone: string;

  @Expose()
  @Column({
    nullable: false,
  })
  @IsEmail()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
