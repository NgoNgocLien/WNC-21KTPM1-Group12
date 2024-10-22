import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString, Length } from 'class-validator'

export class CreateActorDto {
  @ApiProperty({
    description: "Actor first name",
    example: "JOHN"
  })
  @IsDefined()
  @IsString()
  @Length(1, 45)
  first_name: string

  @ApiProperty({
    description: "Actor last name",
    example: "DOE",
  })
  @IsDefined()
  @IsString()
  @Length(1, 45)
  last_name: string
}
