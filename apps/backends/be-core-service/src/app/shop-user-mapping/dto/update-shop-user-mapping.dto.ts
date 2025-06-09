import { PartialType } from '@nestjs/mapped-types';
import { CreateShopUserMappingDto } from './create-shop-user-mapping.dto';

export class UpdateShopUserMappingDto extends PartialType(CreateShopUserMappingDto) {}
