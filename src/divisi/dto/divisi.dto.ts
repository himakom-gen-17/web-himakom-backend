import { PartialType } from '@nestjs/mapped-types';

export class CreateDivisiDto {}

export class UpdateDivisiDto extends PartialType(CreateDivisiDto) {}
