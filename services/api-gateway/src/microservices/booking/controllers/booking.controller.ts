import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateBookingRequestDto } from '../dto/create-booking-request.dto';
import { AdminGuard, JwtAuthGuard } from '@src/guards';
import { BookingProxy } from '../proxy/booking.proxy';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingProxy: BookingProxy) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAll() {
    return this.bookingProxy.getAll();
  }

  @Get('my')
  async getMy(@Request() req) {
    const userId = req.user.sub || req.user.id || req.user.userId;
    return this.bookingProxy.getByUserId(userId);
  }

  @Get('my/active')
  async getMyActive(@Request() req) {
    const userId = req.user.sub || req.user.id || req.user.userId;
    return this.bookingProxy.getActiveByUserId(userId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.bookingProxy.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookingRequestDto, @Request() req) {
    const userId = req.user.sub || req.user.id || req.user.userId;
    return this.bookingProxy.create({ ...dto, userId });
  }

  @Patch(':id/confirm')
  @UseGuards(AdminGuard)
  async confirm(@Param('id') id: string) {
    return this.bookingProxy.confirm(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.bookingProxy.cancel(id);
  }

  @Patch(':id/start')
  @UseGuards(AdminGuard)
  async start(@Param('id') id: string) {
    return this.bookingProxy.start(id);
  }

  @Patch(':id/complete')
  @UseGuards(AdminGuard)
  async complete(@Param('id') id: string) {
    return this.bookingProxy.complete(id);
  }
}
