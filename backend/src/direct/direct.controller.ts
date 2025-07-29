// backend/src/direct/direct.controller.ts
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { DirectService } from './direct.service';
import { CreateDirectDto } from './dto/create-direct.dto';
import { CreditDeductionUtil } from '../common/utils/credit-deduction.util';

// Ensure upload directory exists
const uploadDir = 'uploads/direct';
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
    cb(null, `direct-${uniqueSuffix}${ext}`);
  },
});

@Controller('direct')
export class DirectController {
  constructor(
    private readonly directService: DirectService,
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
  async create(@Body() createDirectDto: CreateDirectDto, @UploadedFile() file?: Express.Multer.File) {
    try {
      // Add file path to DTO if file was uploaded
      if (file) {
        createDirectDto.filePath = file.path;
      }

      // Check and deduct credit before creating the role
      const creditResult = await this.creditDeductionUtil.checkAndDeductCredit(
        createDirectDto.userId, 
        'direct',
        createDirectDto.roleTitle
      );

      if (!creditResult.success) {
        return {
          success: false,
          message: creditResult.message,
          error: 'INSUFFICIENT_CREDITS'
        };
      }

      const directRole = await this.directService.create(createDirectDto);
      return {
        success: true,
        message: '360 Direct role created successfully. ' + creditResult.message,
        data: directRole,
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
      let directRoles;
      
      if (userId) {
        directRoles = await this.directService.findByUserId(parseInt(userId));
      } else {
        directRoles = await this.directService.findAll();
      }

      return {
        success: true,
        message: '360 Direct roles retrieved successfully',
        data: directRoles
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
        deletedRoles = await this.directService.findDeletedByUserId(parseInt(userId));
      } else {
        deletedRoles = await this.directService.findAllDeleted();
      }

      return {
        success: true,
        message: 'Deleted 360 direct roles retrieved successfully',
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
      const directRole = await this.directService.findById(parseInt(id));
      return {
        success: true,
        message: '360 Direct role retrieved successfully',
        data: directRole
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateDirectDto>) {
    try {
      const directRole = await this.directService.update(parseInt(id), updateData);
      return {
        success: true,
        message: '360 Direct role updated successfully',
        data: directRole
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
        await this.directService.hardDelete(parseInt(id));
        return {
          success: true,
          message: '360 Direct role permanently deleted successfully'
        };
      } else {
        await this.directService.delete(parseInt(id));
        return {
          success: true,
          message: '360 Direct role deleted successfully'
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
      const directRole = await this.directService.restore(parseInt(id));
      return {
        success: true,
        message: '360 Direct role restored successfully',
        data: directRole
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Put(':id/activity-count')
  async updateActivityCount(
    @Param('id') id: string,
    @Body() counts: {
      contactsApproached?: number;
      responsesReceived?: number;
      meetingsScheduled?: number;
      successfulPlacements?: number;
    }
  ) {
    try {
      const directRole = await this.directService.updateActivityCounts(parseInt(id), counts);
      return {
        success: true,
        message: 'Activity count updated successfully',
        data: directRole
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
