import {
  IsEmail,
  IsNotEmpty, IsNumber,
  Length,
} from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  @Length(2, 255)
  title: string;

  @IsNotEmpty()
  @Length(13, 13)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
