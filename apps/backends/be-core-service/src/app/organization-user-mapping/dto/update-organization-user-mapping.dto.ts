import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationUserMappingDto } from './create-organization-user-mapping.dto';

export class UpdateOrganizationUserMappingDto extends PartialType(
  CreateOrganizationUserMappingDto,
) {}
