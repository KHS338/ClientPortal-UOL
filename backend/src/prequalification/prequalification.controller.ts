// backend/src/prequalification/prequalification.controller.ts
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { PrequalificationService } from './prequalification.service';
import { CreatePrequalificationDto } from './dto/create-prequalification.dto';
import { CreditDeductionUtil } from '../common/utils/credit-deduction.util';

// Ensure upload directory exists
const uploadDir = 'uploads/prequalification';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `prequalification-${uniqueSuffix}${ext}`);
  },
});

@Controller('prequalification')
export class PrequalificationController {
  constructor(
    private readonly prequalificationService: PrequalificationService,
    private readonly creditDeductionUtil: CreditDeductionUtil
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async create(@Body() createPrequalificationDto: CreatePrequalificationDto, @UploadedFile() file?: Express.Multer.File) {
    try {
      // Add file path to DTO if file was uploaded
      if (file) {
        createPrequalificationDto.filePath = file.path;
      }

      // Check and deduct credit before creating the role
      const creditResult = await this.creditDeductionUtil.checkAndDeductCredit(
        createPrequalificationDto.userId, 
        'prequalification',
        createPrequalificationDto.roleTitle
      );

      if (!creditResult.success) {
        return {
          success: false,
          message: creditResult.message,
          error: 'INSUFFICIENT_CREDITS'
        };
      }

      const prequalificationRole = await this.prequalificationService.create(createPrequalificationDto);
      return {
        success: true,
        message: 'Pre-qualification role created successfully. ' + creditResult.message,
        data: prequalificationRole,
        remainingCredits: creditResult.remainingCredits
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    try {
      let prequalificationRoles;
      
      if (userId) {
        prequalificationRoles = await this.prequalificationService.findByUserId(parseInt(userId));
      } else {
        prequalificationRoles = await this.prequalificationService.findAll();
      }

      return {
        success: true,
        message: 'Pre-qualification roles retrieved successfully',
        data: prequalificationRoles
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('deleted')
  async getDeleted(@Query('userId') userId?: string) {
    try {
      let deletedRoles;
      
      if (userId) {
        deletedRoles = await this.prequalificationService.findDeletedByUserId(parseInt(userId));
      } else {
        deletedRoles = await this.prequalificationService.findAllDeleted();
      }

      return {
        success: true,
        message: 'Deleted pre-qualification roles retrieved successfully',
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
  async findOne(@Param('id') id: string) {
    try {
      const prequalificationRole = await this.prequalificationService.findById(parseInt(id));
      return {
        success: true,
        message: 'Pre-qualification role retrieved successfully',
        data: prequalificationRole
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreatePrequalificationDto>) {
    try {
      const prequalificationRole = await this.prequalificationService.update(parseInt(id), updateData);
      return {
        success: true,
        message: 'Pre-qualification role updated successfully',
        data: prequalificationRole
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
        await this.prequalificationService.hardDelete(parseInt(id));
        return {
          success: true,
          message: 'Pre-qualification role permanently deleted successfully'
        };
      } else {
        await this.prequalificationService.delete(parseInt(id));
        return {
          success: true,
          message: 'Pre-qualification role deleted successfully'
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
      const prequalificationRole = await this.prequalificationService.restore(parseInt(id));
      return {
        success: true,
        message: 'Pre-qualification role restored successfully',
        data: prequalificationRole
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
      candidatesSubmitted?: number;
      candidatesQualified?: number;
      candidatesRejected?: number;
      interviewsScheduled?: number;
    }
  ) {
    try {
      const prequalificationRole = await this.prequalificationService.updateCandidateCounts(parseInt(id), counts);
      return {
        success: true,
        message: 'Candidate count updated successfully',
        data: prequalificationRole
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
