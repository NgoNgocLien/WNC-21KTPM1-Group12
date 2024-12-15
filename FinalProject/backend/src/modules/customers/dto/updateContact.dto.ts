import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './createContact.dto';
import { IsNumber } from 'class-validator';

export class UpdateContactDto extends PartialType(CreateContactDto) {
    @IsNumber()
    id: number
}
