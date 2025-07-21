// backend/src/direct/direct.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectService } from './direct.service';
import { DirectController } from './direct.controller';
import { DirectRole } from './direct.entity';
import { RoleModule } from '../roles/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectRole]),
    forwardRef(() => RoleModule)
  ],
  controllers: [DirectController],
  providers: [DirectService],
  exports: [DirectService, TypeOrmModule]
})
export class DirectModule {}
