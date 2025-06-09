import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OrganizationUserMappingService } from './organization-user-mapping.service';
import { CreateOrganizationUserMappingDto } from './dto/create-organization-user-mapping.dto';
import { ExcludeUsersOrganizationFieldsInterceptor } from './utils/exclude-users-organization-fields.interceptor';
import {
  ExcludeOrganizationsUserFieldsInterceptor,
} from './utils/exclude-organizations-user-fields.interceptor';

@Controller()
export class OrganizationUserMappingController {
  constructor(
    private readonly organizationUserMappingService: OrganizationUserMappingService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(
    @Body() createOrganizationUserMappingDto: CreateOrganizationUserMappingDto,
  ) {
    return this.organizationUserMappingService.create(
      createOrganizationUserMappingDto,
    );
  }

  // @Get()
  // findAll() {
  //   return this.organizationUserMappingService.findAll();
  // }
  //
  @Get('/:orgId/users')
  @UseInterceptors(ExcludeUsersOrganizationFieldsInterceptor) // custom response interceptor
  async getUsersByOrg(@Param('orgId') orgId: number) {
    return await this.organizationUserMappingService.getUsersByOrg(orgId);
  }

  @Get('/:userId/organizations')
  @UseInterceptors(ExcludeOrganizationsUserFieldsInterceptor) // custom response interceptor
  async getOrgsByUserId(@Param('userId') userId: number) {
    return await this.organizationUserMappingService.getOrgsByUserId(userId);
  }
  //
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateOrganizationUserMappingDto: UpdateOrganizationUserMappingDto,
  // ) {
  //   return this.organizationUserMappingService.update(
  //     +id,
  //     updateOrganizationUserMappingDto,
  //   );
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.organizationUserMappingService.remove(+id);
  // }
}
