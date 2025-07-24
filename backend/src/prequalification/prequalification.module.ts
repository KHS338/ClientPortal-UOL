// backend/src/prequalification/prequalification.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrequalificationController } from './prequalification.controller';
import { PrequalificationService } from './prequalification.service';
import { PrequalificationRole } from './prequalification.entity';
import { RoleModule } from '../roles/role.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrequalificationRole]),
    forwardRef(() => RoleModule),
    CommonModule
  ],
  controllers: [PrequalificationController],
  providers: [PrequalificationService],
  exports: [PrequalificationService],
})
export class PrequalificationModule {}
