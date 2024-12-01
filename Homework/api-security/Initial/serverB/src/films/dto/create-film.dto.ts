import { ApiProperty } from '@nestjs/swagger';
import { film_rating } from '@prisma/client';
import { IsString, IsNumber, IsOptional, IsEnum, IsDecimal, IsNotEmpty, IsPositive, Length, Min, Max, IsDefined } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({
    description: 'Title of the film',
    example: 'The Matrix',
  })
  @Length(1, 255)
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty({
    description: 'Description of the film',
    example: 'A hacker discovers the truth about his reality.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    description: 'Release year of the film',
    example: 1999,
    required: false,
  })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  release_year?: number | null;

  @ApiProperty({
    description: 'Language ID of the film',
    example: 1,
  })
  @Max(255)
  @Min(1)
  @IsNumber()
  @IsDefined()
  language_id: number;

  @ApiProperty({
    description: 'Original language ID of the film',
    example: 1,
    required: false,
  })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  original_language_id?: number | null;

  @ApiProperty({
    description: 'Rental duration in days',
    example: 3,
    default: 3,
    required: false,
  })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  rental_duration: number;

  @ApiProperty({
    description: 'Rental rate for the film',
    example: 4.99,
    default: 4.99,
    required: false,
  })
  @IsDecimal()
  @IsOptional()
  rental_rate: number;

  @ApiProperty({
    description: 'Length of the film in minutes',
    example: 136,
    required: false,
  })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  length?: number | null;

  @ApiProperty({
    description: 'Replacement cost of the film',
    example: 19.99,
    default: 19.99,
    required: false,
  })
  @IsDecimal()
  @IsOptional()
  replacement_cost: number;

  @ApiProperty({
    description: 'Rating of the film',
    enum: film_rating,
    default: film_rating.G,
    example: 'G',
    required: false,
  })
  @IsEnum(film_rating)
  @IsOptional()
  rating?: film_rating | null;

  @ApiProperty({
    description: 'Special features of the film',
    example: 'Trailers,Commentaries,Deleted Scenes,Behind the Scenes',
    required: false,
  })
  @IsString()
  @IsOptional()
  special_features?: string | null;
}