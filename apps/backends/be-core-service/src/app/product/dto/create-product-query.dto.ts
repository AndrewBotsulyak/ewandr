import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductQueryDto {
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
}
