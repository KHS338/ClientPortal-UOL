// backend/src/lead-generation-industry/lead-generation-industry.controller.ts
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadGenerationIndustryService } from './lead-generation-industry.service';
import { CreateLeadGenerationIndustryDto } from './dto/create-lead-generation-industry.dto';
import { CreditDeductionUtil } from '../common/utils/credit-deduction.util';

@Controller('lead-generation-industry')
export class LeadGenerationIndustryController {
  constructor(
    private readonly leadGenerationIndustryService: LeadGenerationIndustryService,
    private readonly creditDeductionUtil: CreditDeductionUtil
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeadGenerationIndustryDto: CreateLeadGenerationIndustryDto) {
    try {
      // Check and deduct credit before creating the role
      const creditResult = await this.creditDeductionUtil.checkAndDeductCredit(
        createLeadGenerationIndustryDto.userId, 
        'lead-generation-industry'
      );

      if (!creditResult.success) {
        return {
          success: false,
          message: creditResult.message,
          error: 'INSUFFICIENT_CREDITS'
        };
      }

      const leadGenerationIndustry = await this.leadGenerationIndustryService.create(createLeadGenerationIndustryDto);
      return {
        success: true,
        message: 'Lead generation industry created successfully. ' + creditResult.message,
        data: leadGenerationIndustry,
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
      let leadGenerationIndustries;
      
      if (userId) {
        leadGenerationIndustries = await this.leadGenerationIndustryService.findByUserId(parseInt(userId));
      } else {
        leadGenerationIndustries = await this.leadGenerationIndustryService.findAll();
      }

      return {
        success: true,
        message: 'Lead generation industries retrieved successfully',
        data: leadGenerationIndustries
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
      let deletedIndustries;
      
      if (userId) {
        deletedIndustries = await this.leadGenerationIndustryService.findDeletedByUserId(parseInt(userId));
      } else {
        deletedIndustries = await this.leadGenerationIndustryService.findAllDeleted();
      }

      return {
        success: true,
        message: 'Deleted lead generation industries retrieved successfully',
        data: deletedIndustries
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
      const leadGenerationIndustry = await this.leadGenerationIndustryService.findById(parseInt(id));
      return {
        success: true,
        message: 'Lead generation industry retrieved successfully',
        data: leadGenerationIndustry
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
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateLeadGenerationIndustryDto>) {
    try {
      const leadGenerationIndustry = await this.leadGenerationIndustryService.update(parseInt(id), updateData);
      return {
        success: true,
        message: 'Lead generation industry updated successfully',
        data: leadGenerationIndustry
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
        await this.leadGenerationIndustryService.hardDelete(parseInt(id));
        return {
          success: true,
          message: 'Lead generation industry permanently deleted successfully'
        };
      } else {
        await this.leadGenerationIndustryService.delete(parseInt(id));
        return {
          success: true,
          message: 'Lead generation industry deleted successfully'
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
      const leadGenerationIndustry = await this.leadGenerationIndustryService.restore(parseInt(id));
      return {
        success: true,
        message: 'Lead generation industry restored successfully',
        data: leadGenerationIndustry
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
