import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class DeleteUserFromShopDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  shopIds: number[];
}
