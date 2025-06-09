import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { ShopModule } from './shop/shop.module';
import { OrganizationUserMappingModule } from './organization-user-mapping/organization-user-mapping.module';
import { ShopUserMappingModule } from './shop-user-mapping/shop-user-mapping.module';
import { ProductModule } from './product/product.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';

const routes: Routes = [
  {
    path: 'ums',
    module: AppModule,
    children: [
      {
        path: 'user',
        module: UserModule,
      },
      {
        path: 'organization',
        module: OrganizationModule,
      },
      {
        path: 'shop',
        module: ShopModule,
      },
      {
        path: 'organizationUserMapping',
        module: OrganizationUserMappingModule,
      },
      {
        path: 'shopUserMapping',
        module: ShopUserMappingModule,
      },
      {
        path: 'product',
        module: ProductModule,
      },
      {
        path: 'category',
        module: ProductCategoriesModule,
      },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes)],
})
export class AppRoutingModule {}
