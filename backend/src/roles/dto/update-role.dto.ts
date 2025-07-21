// backend/src/roles/dto/update-role.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4000)
  clientNo?: number;

  @IsOptional()
  @IsNumber()
  serviceTag?: number;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  cvSourcingRoleId?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
