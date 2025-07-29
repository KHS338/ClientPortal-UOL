// backend/src/lead-generation-job/lead-generation-job.controller.ts
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeadGenerationJobService } from './lead-generation-job.service';
import { CreateLeadGenerationJobDto } from './dto/create-lead-generation-job.dto';
import { CreditDeductionUtil } from '../common/utils/credit-deduction.util';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Multer configuration for file upload
const multerConfig = {
  storage: diskStorage({
    destination: './uploads/lead-generation-job',
    filename: (req, file, cb) => {
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};

@Controller('lead-generation-job')
export class LeadGenerationJobController {
  constructor(
    private readonly leadGenerationJobService: LeadGenerationJobService,
    private readonly creditDeductionUtil: CreditDeductionUtil
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // Process the body data to handle FormData properly
      const createLeadGenerationJobDto: CreateLeadGenerationJobDto = { ...body };

      // Add file path to DTO if file was uploaded
      if (file) {
        createLeadGenerationJobDto.filePath = file.path;
      }

      // Handle skills array from FormData
      if (body.skills) {
        if (typeof body.skills === 'string') {
          // If skills is a string (from FormData), convert it to array
          createLeadGenerationJobDto.skills = body.skills.split(',').map((skill: string) => skill.trim());
        } else if (Array.isArray(body.skills)) {
          createLeadGenerationJobDto.skills = body.skills;
        }
      }

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
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async update(
    @Param('id') id: string, 
    @Body() updateData: Partial<CreateLeadGenerationJobDto>,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // Add file path to update data if file was uploaded
      if (file) {
        updateData.filePath = file.path;
      }

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
