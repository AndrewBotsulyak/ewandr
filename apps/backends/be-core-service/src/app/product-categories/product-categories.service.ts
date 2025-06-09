import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { TreeRepository } from 'typeorm';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private repository: TreeRepository<ProductCategoryEntity>,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const { parentId, ...createData } = createProductCategoryDto;
    const categoryEntity = this.repository.create(createData);

    if (parentId != null) {
      const parentEntity = await this.repository.findOneBy({ id: parentId });

      if (parentEntity == null) {
        throw new NotFoundException(`Parent categoryId wasn't found`);
      }

      categoryEntity.parent = parentEntity;
    }

    return await this.repository.save(categoryEntity);
  }

  async findAll() {
    return await this.repository.findTrees();
  }

  async findOne(id: number) {
    return await this.getAndCheckCategory(id);
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    await this.getAndCheckCategory(id);

    await this.repository.update(id, updateProductCategoryDto);

    return await this.getAndCheckCategory(id);
  }

  async remove(id: number) {
    const category = await this.getAndCheckCategory(id);

    const descendants = await this.repository.findDescendants(category);
    const ids = descendants.map((item) => item.id);

    await this.repository.delete(ids);

    return;
  }

  async findAncestors(id: number) {
    const category = await this.repository.findOneBy({ id });

    if (category == null) {
      throw new NotFoundException(`category id doesn't exist`);
    }

    return await this.repository.findAncestorsTree(category);
  }

  private async getAndCheckCategory(id: number) {
    const category = await this.repository.findOneBy({ id });

    if (category == null) {
      throw new NotFoundException(`Category doesn't exist`);
    }

    return category;
  }
}
