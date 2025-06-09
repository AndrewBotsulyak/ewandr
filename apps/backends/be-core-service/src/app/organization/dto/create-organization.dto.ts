import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/[a-zA-Z0-9\s-]/g, {
    message: 'Name contains forbidden characters',
  })
  title: string;
}
