// backend/src/lead-generation-job/lead-generation-job.controller.ts
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadGenerationJobService } from './lead-generation-job.service';
import { CreateLeadGenerationJobDto } from './dto/create-lead-generation-job.dto';
import { CreditDeductionUtil } from '../common/utils/credit-deduction.util';

@Controller('lead-generation-job')
export class LeadGenerationJobController {
  constructor(
    private readonly leadGenerationJobService: LeadGenerationJobService,
    private readonly creditDeductionUtil: CreditDeductionUtil
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeadGenerationJobDto: CreateLeadGenerationJobDto) {
    try {
      // Check and deduct credit before creating the role
      const creditResult = await this.creditDeductionUtil.checkAndDeductCredit(
        createLeadGenerationJobDto.userId, 
        'lead-generation-job'
      );

      if (!creditResult.success) {
        return {
          success: false,
          message: creditResult.message,
          error: 'INSUFFICIENT_CREDITS'
        };
      }

      const leadGenerationJob = await this.leadGenerationJobService.create(createLeadGenerationJobDto);
      return {
        success: true,
        message: 'Lead generation job created successfully. ' + creditResult.message,
        data: leadGenerationJob,
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
      let leadGenerationJobs;
      
      if (userId) {
        leadGenerationJobs = await this.leadGenerationJobService.findByUserId(parseInt(userId));
      } else {
        leadGenerationJobs = await this.leadGenerationJobService.findAll();
      }

      return {
        success: true,
        message: 'Lead generation jobs retrieved successfully',
        data: leadGenerationJobs
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
      let deletedJobs;
      
      if (userId) {
        deletedJobs = await this.leadGenerationJobService.findDeletedByUserId(parseInt(userId));
      } else {
        deletedJobs = await this.leadGenerationJobService.findAllDeleted();
      }

      return {
        success: true,
        message: 'Deleted lead generation jobs retrieved successfully',
        data: deletedJobs
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
      const leadGenerationJob = await this.leadGenerationJobService.findById(parseInt(id));
      return {
        success: true,
        message: 'Lead generation job retrieved successfully',
        data: leadGenerationJob
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
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateLeadGenerationJobDto>) {
    try {
      const leadGenerationJob = await this.leadGenerationJobService.update(parseInt(id), updateData);
      return {
        success: true,
        message: 'Lead generation job updated successfully',
        data: leadGenerationJob
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
        await this.leadGenerationJobService.hardDelete(parseInt(id));
        return {
          success: true,
          message: 'Lead generation job permanently deleted successfully'
        };
      } else {
        await this.leadGenerationJobService.delete(parseInt(id));
        return {
          success: true,
          message: 'Lead generation job deleted successfully'
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
      const leadGenerationJob = await this.leadGenerationJobService.restore(parseInt(id));
      return {
        success: true,
        message: 'Lead generation job restored successfully',
        data: leadGenerationJob
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
