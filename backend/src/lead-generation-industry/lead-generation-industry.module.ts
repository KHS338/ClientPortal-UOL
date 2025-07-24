// backend/src/lead-generation-industry/lead-generation-industry.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadGenerationIndustryController } from './lead-generation-industry.controller';
import { LeadGenerationIndustryService } from './lead-generation-industry.service';
import { LeadGenerationIndustry } from './lead-generation-industry.entity';
import { RoleModule } from '../roles/role.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeadGenerationIndustry]),
    forwardRef(() => RoleModule),
    CommonModule
  ],
  controllers: [LeadGenerationIndustryController],
  providers: [LeadGenerationIndustryService],
  exports: [LeadGenerationIndustryService]
})
export class LeadGenerationIndustryModule {}
