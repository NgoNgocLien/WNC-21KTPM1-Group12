import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString, Length } from 'class-validator'

export class CreateActorDto {
  @ApiProperty({
    description: "Actor first name",
    example: "JOHN"
  })
  @Length(1, 45)
  @IsString()
  @IsDefined()
  first_name: string

  @ApiProperty({
    description: "Actor last name",
    example: "DOE",
  })
  @Length(1, 45)
  @IsString()
  @IsDefined()
  last_name: string
}
