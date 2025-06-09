import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationQueryService } from './organization-query/organization-query.service';

@Controller()
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationQueryService: OrganizationQueryService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne() {
    return await this.organizationService.findOne();
  }

  @Get('/details')
  @UseInterceptors(ClassSerializerInterceptor)
  async getDetails() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
    let retVal = await this.organizationQueryService.getDetails();

    if (retVal != null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      retVal = retVal[0];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return retVal;
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return await this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return this.organizationService.remove(id);
  }
}
