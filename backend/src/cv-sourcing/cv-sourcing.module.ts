// backend/src/cv-sourcing/cv-sourcing.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvSourcingController } from './cv-sourcing.controller';
import { CvSourcingService } from './cv-sourcing.service';
import { CvSourcingRole } from './cv-sourcing.entity';
import { CvResult } from './cv-result.entity';
import { RoleModule } from '../roles/role.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CvSourcingRole, CvResult]),
    forwardRef(() => RoleModule),
    CommonModule
  ],
  controllers: [CvSourcingController],
  providers: [CvSourcingService],
  exports: [CvSourcingService],
})
export class CvSourcingModule {}
