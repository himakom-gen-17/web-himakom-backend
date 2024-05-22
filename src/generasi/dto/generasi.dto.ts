import { PartialType } from '@nestjs/mapped-types';

export class CreateGenerasiDto {
  name: number;

  visi: string;

  misi: string;

  image: string;
}

export class UpdateGenerasiDto extends PartialType(CreateGenerasiDto) {}
