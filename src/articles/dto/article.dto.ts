import { PartialType } from '@nestjs/swagger';

export class CreateArticleDto {
  title: string;

  slug: string;

  thumbnail: string;

  content: string;

  divisiId: number;

  userId: string;

  categories: {
    id: number;
    name: string;
  }[];
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
