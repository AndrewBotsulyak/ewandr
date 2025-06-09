import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  surname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  patronymic: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;
}
