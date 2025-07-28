// backend/src/direct/direct.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectService } from './direct.service';
import { DirectController } from './direct.controller';
import { DirectRole } from './direct.entity';
import { DirectResult } from './direct-result.entity';
import { RoleModule } from '../roles/role.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectRole, DirectResult]),
    forwardRef(() => RoleModule),
    CommonModule
  ],
  controllers: [DirectController],
  providers: [DirectService],
  exports: [DirectService, TypeOrmModule]
})
export class DirectModule {}
