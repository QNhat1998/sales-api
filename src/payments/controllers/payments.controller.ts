import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PaymentsService } from '../services/payments.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

/**
 * Controller quản lý thanh toán
 */
@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Lấy danh sách thanh toán
   * @param page Trang hiện tại
   * @param limit Số lượng thanh toán mỗi trang
   * @returns Danh sách thanh toán và tổng số thanh toán
   */
  @ApiOperation({ summary: 'Lấy danh sách thanh toán' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng thanh toán mỗi trang (mặc định: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách thanh toán với phân trang',
  })
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paymentsService.findAll(+page, +limit);
  }

  /**
   * Lấy thông tin chi tiết thanh toán theo ID
   * @param id ID thanh toán
   * @returns Thông tin chi tiết thanh toán
   */
  @ApiOperation({ summary: 'Lấy thông tin chi tiết thanh toán theo ID' })
  @ApiParam({ name: 'id', description: 'ID của thanh toán', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin chi tiết thanh toán',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thanh toán' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  /**
   * Lấy thanh toán theo ID đơn hàng
   * @param orderId ID đơn hàng
   * @returns Danh sách thanh toán
   */
  @ApiOperation({ summary: 'Lấy thanh toán theo ID đơn hàng' })
  @ApiParam({ name: 'orderId', description: 'ID của đơn hàng', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách thanh toán của đơn hàng',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @Get('order/:orderId')
  async findByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.findByOrderId(orderId);
  }
}
