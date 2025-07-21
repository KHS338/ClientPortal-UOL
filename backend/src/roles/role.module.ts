// backend/src/roles/role.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { CvSourcingModule } from '../cv-sourcing/cv-sourcing.module';
import { LeadGenerationIndustryModule } from '../lead-generation-industry/lead-generation-industry.module';
import { LeadGenerationJobModule } from '../lead-generation-job/lead-generation-job.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => CvSourcingModule),
    forwardRef(() => LeadGenerationIndustryModule),
    forwardRef(() => LeadGenerationJobModule)
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
