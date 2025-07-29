// backend/src/prequalification/dto/update-prequalification.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdatePrequalificationDto {
  @IsOptional()
  @IsString()
  roleTitle?: string;

  @IsOptional()
  @IsString()
  rolePriority?: string;

  @IsOptional()
  @IsString()
  location?: string;

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
  qualificationCriteria?: string;

  @IsOptional()
  @IsString()
  assessmentType?: string;
}
