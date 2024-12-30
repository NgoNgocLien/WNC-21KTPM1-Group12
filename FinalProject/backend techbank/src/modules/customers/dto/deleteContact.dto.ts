import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './createContact.dto';
import { IsNumber } from 'class-validator';

export class DeleteContactDto{
    @IsNumber()
    id: number
}
