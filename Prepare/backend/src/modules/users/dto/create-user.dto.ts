import {
  IsDefined,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDecimal,
  IsPositive,
  Length,
  Min,
  Max,
} from 'class-validator';

export class CreateUserDto {
  @Length(1, 255)
  @IsString()
  @IsDefined()
  username: string;

  @Length(1, 255)
  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
