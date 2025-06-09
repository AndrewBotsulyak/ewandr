import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity({ name: 'product-categories' })
@Tree('closure-table')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  crumb: string;

  @TreeChildren()
  children: ProductCategoryEntity[];

  @TreeParent()
  parent: ProductCategoryEntity;
}
