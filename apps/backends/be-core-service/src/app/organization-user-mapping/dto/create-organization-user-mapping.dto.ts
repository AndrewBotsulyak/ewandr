import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserOrganizationRoleEnum } from '../../common/models/user-organization-role.enum';

export class CreateOrganizationUserMappingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  organizationId: number;

  @IsOptional()
  @IsEnum(UserOrganizationRoleEnum)
  role?: UserOrganizationRoleEnum;
}
