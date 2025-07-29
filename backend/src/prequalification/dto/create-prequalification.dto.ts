// backend/src/prequalification/dto/create-prequalification.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePrequalificationDto {
  @IsString()
  roleTitle: string;

  @IsString()
  rolePriority: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryTo?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsString()
  salaryType?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return Boolean(value);
  })
  @IsBoolean()
  salaryNotDefined?: boolean;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  experienceRequired?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  searchRadius?: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @Type(() => Number)
  @IsNumber()
  userId: number;
}
