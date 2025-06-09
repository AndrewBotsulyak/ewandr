import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsQueryDto {
  @IsNotEmpty({
    message: 'shopId query param should be provided',
  })
  @IsNumber(
    {},
    {
      message: 'shopId not valid',
    },
  )
  @Type(() => Number)
  shopId: number;

  @IsOptional()
  @Type(() => Boolean)
  isOrganizationContext?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'categoryId not valid' })
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search?: string;
}
