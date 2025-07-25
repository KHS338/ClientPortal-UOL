import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.invoiceService.findByUserId(parseInt(userId, 10));
    }
    return this.invoiceService.findAll();
  }

  @Get('stats')
  getStats(@Query('userId') userId?: string) {
    const userIdNum = userId ? parseInt(userId, 10) : undefined;
    return this.invoiceService.getInvoiceStats(userIdNum);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.invoiceService.findByUserId(userId);
  }

  @Get('number/:invoiceNumber')
  findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoiceService.findByInvoiceNumber(invoiceNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.remove(id);
  }

  @Post('generate/:userSubscriptionId')
  generateInvoiceForSubscription(@Param('userSubscriptionId', ParseIntPipe) userSubscriptionId: number) {
    return this.invoiceService.generateInvoiceForSubscription(userSubscriptionId);
  }

  @Patch(':id/mark-paid')
  markAsPaid(
    @Param('id', ParseIntPipe) id: number,
    @Body('paymentMethod') paymentMethod?: string
  ) {
    return this.invoiceService.markAsPaid(id, paymentMethod);
  }
}
