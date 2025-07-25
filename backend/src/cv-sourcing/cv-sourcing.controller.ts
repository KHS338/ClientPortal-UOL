// backend/src/cv-sourcing/cv-sourcing.controller.ts
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CvSourcingService } from './cv-sourcing.service';
import { CreateCvSourcingDto } from './dto/create-cv-sourcing.dto';
import { CreditDeductionUtil } from '../common/utils/credit-deduction.util';

@Controller('cv-sourcing')
export class CvSourcingController {
  constructor(
    private readonly cvSourcingService: CvSourcingService,
    private readonly creditDeductionUtil: CreditDeductionUtil
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCvSourcingDto: CreateCvSourcingDto) {
    try {
      // Check and deduct credit before creating the role
      const creditResult = await this.creditDeductionUtil.checkAndDeductCredit(
        createCvSourcingDto.userId, 
        'cv-sourcing'
      );

      if (!creditResult.success) {
        return {
          success: false,
          message: creditResult.message,
          error: 'INSUFFICIENT_CREDITS'
        };
      }

      const cvSourcingRole = await this.cvSourcingService.create(createCvSourcingDto);
      return {
        success: true,
        message: 'CV sourcing role created successfully. ' + creditResult.message,
        data: cvSourcingRole,
        remainingCredits: creditResult.remainingCredits
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    try {
      let cvSourcingRoles;
      
      if (userId) {
        cvSourcingRoles = await this.cvSourcingService.findByUserId(parseInt(userId));
      } else {
        cvSourcingRoles = await this.cvSourcingService.findAll();
      }

      return {
        success: true,
        message: 'CV sourcing roles retrieved successfully',
        data: cvSourcingRoles
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Get('deleted')
  async getDeleted(@Query('userId') userId?: string) {
    try {
      let deletedRoles;
      
      if (userId) {
        deletedRoles = await this.cvSourcingService.findDeletedByUserId(parseInt(userId));
      } else {
        deletedRoles = await this.cvSourcingService.findAllDeleted();
      }

      return {
        success: true,
        message: 'Deleted CV sourcing roles retrieved successfully',
        data: deletedRoles
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const cvSourcingRole = await this.cvSourcingService.findById(parseInt(id));
      return {
        success: true,
        message: 'CV sourcing role retrieved successfully',
        data: cvSourcingRole
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateCvSourcingDto>) {
    try {
      const cvSourcingRole = await this.cvSourcingService.update(parseInt(id), updateData);
      return {
        success: true,
        message: 'CV sourcing role updated successfully',
        data: cvSourcingRole
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('hard') hard?: string) {
    try {
      if (hard === 'true') {
        await this.cvSourcingService.hardDelete(parseInt(id));
        return {
          success: true,
          message: 'CV sourcing role permanently deleted successfully'
        };
      } else {
        await this.cvSourcingService.delete(parseInt(id));
        return {
          success: true,
          message: 'CV sourcing role deleted successfully'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    try {
      const cvSourcingRole = await this.cvSourcingService.restore(parseInt(id));
      return {
        success: true,
        message: 'CV sourcing role restored successfully',
        data: cvSourcingRole
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Put(':id/candidate-count')
  async updateCandidateCount(
    @Param('id') id: string,
    @Body() counts: {
      cvsCount?: number;
      lisCount?: number;
      ziCount?: number;
      totalCandidates?: number;
      rejectedCvs?: number;
      rejectedLis?: number;
      qualifiedCandidates?: number;
    }
  ) {
    try {
      const cvSourcingRole = await this.cvSourcingService.updateCandidateCounts(parseInt(id), counts);
      return {
        success: true,
        message: 'Candidate count updated successfully',
        data: cvSourcingRole
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }
}
