// backend/src/lead-generation-job/lead-generation-job.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadGenerationJobController } from './lead-generation-job.controller';
import { LeadGenerationJobService } from './lead-generation-job.service';
import { LeadGenerationJob } from './lead-generation-job.entity';
import { LeadGenerationJobResult } from './lead-generation-job-result.entity';
import { RoleModule } from '../roles/role.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeadGenerationJob, LeadGenerationJobResult]),
    forwardRef(() => RoleModule),
    CommonModule
  ],
  controllers: [LeadGenerationJobController],
  providers: [LeadGenerationJobService],
  exports: [LeadGenerationJobService]
})
export class LeadGenerationJobModule {}
