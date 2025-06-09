import { forwardRef, Global, Module } from '@nestjs/common';
import { OrganizationUserMappingService } from './organization-user-mapping.service';
import { OrganizationUserMappingController } from './organization-user-mapping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationUserMappingEntity } from './entities/organization-user-mapping.entity';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationUserMappingEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => OrganizationModule),
  ],
  controllers: [OrganizationUserMappingController],
  providers: [OrganizationUserMappingService],
  exports: [OrganizationUserMappingService],
})
export class OrganizationUserMappingModule {}
