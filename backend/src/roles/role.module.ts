// backend/src/roles/role.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { CvSourcingModule } from '../cv-sourcing/cv-sourcing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => CvSourcingModule)
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
