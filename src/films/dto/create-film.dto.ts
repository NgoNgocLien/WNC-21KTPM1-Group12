import { ApiProperty } from '@nestjs/swagger';
import { film_rating } from '@prisma/client';
import { IsString, IsNumber, IsOptional, IsEnum, IsDecimal, IsNotEmpty, IsPositive, Length, Min, Max } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({
    description: 'Title of the film',
    example: 'The Matrix',
  })
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    description: 'Description of the film',
    example: 'A hacker discovers the truth about his reality.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    description: 'Release year of the film',
    example: 1999,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  release_year?: number | null;

  @ApiProperty({
    description: 'Language ID of the film',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @Max(255)
  language_id: number;

  @ApiProperty({
    description: 'Original language ID of the film',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  original_language_id?: number | null;

  @ApiProperty({
    description: 'Rental duration in days',
    example: 3,
    default: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rental_duration: number;

  @ApiProperty({
    description: 'Rental rate for the film',
    example: 4.99,
    default: 4.99,
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  rental_rate: number;

  @ApiProperty({
    description: 'Length of the film in minutes',
    example: 136,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  length?: number | null;

  @ApiProperty({
    description: 'Replacement cost of the film',
    example: 19.99,
    default: 19.99,
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  replacement_cost: number;

  @ApiProperty({
    description: 'Rating of the film',
    enum: film_rating,
    default: film_rating.G,
    example: 'G',
    required: false,
  })
  @IsOptional()
  @IsEnum(film_rating)
  rating?: film_rating | null;

  @ApiProperty({
    description: 'Special features of the film',
    example: 'Trailers,Commentaries,Deleted Scenes,Behind the Scenes',
    required: false,
  })
  @IsOptional()
  @IsString()
  special_features?: string | null;
}