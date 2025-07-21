// backend/src/roles/dto/create-role.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(4000)
  clientNo: number;

  @IsNumber()
  serviceTag: number;

  @IsNumber()
  clientId: number;

  @IsOptional()
  @IsNumber()
  cvSourcingRoleId?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
