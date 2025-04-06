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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

/**
 * Controller quản lý đơn hàng
 */
@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Lấy danh sách đơn hàng
   * @param page Trang hiện tại
   * @param limit Số lượng đơn hàng mỗi trang
   * @returns Danh sách đơn hàng và tổng số đơn hàng
   */
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng đơn hàng mỗi trang (mặc định: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách đơn hàng với phân trang',
  })
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.ordersService.findAll(+page, +limit);
  }

  /**
   * Lấy thông tin chi tiết đơn hàng theo ID
   * @param id ID đơn hàng
   * @returns Thông tin chi tiết đơn hàng
   */
  @ApiOperation({ summary: 'Lấy thông tin chi tiết đơn hàng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng', type: 'number' })
  @ApiResponse({
    status: 200,
    description:
      'Trả về thông tin chi tiết đơn hàng và danh sách sản phẩm trong đơn hàng',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  /**
   * Lấy danh sách các mục trong đơn hàng
   * @param id ID đơn hàng
   * @returns Danh sách các mục trong đơn hàng
   */
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm trong đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách sản phẩm trong đơn hàng',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @Get(':id/items')
  async getOrderItems(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderItems(id);
  }

  /**
   * Tạo đơn hàng mới
   * @param createOrderDto Dữ liệu đơn hàng mới
   * @returns Thông tin đơn hàng đã tạo
   */
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({
    status: 201,
    description: 'Đơn hàng đã được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc thiếu sản phẩm trong đơn hàng',
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  /**
   * Cập nhật thông tin đơn hàng
   * @param id ID đơn hàng
   * @param updateOrderDto Dữ liệu cập nhật
   * @returns Thông tin đơn hàng đã cập nhật
   */
  @ApiOperation({ summary: 'Cập nhật thông tin đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Đơn hàng đã được cập nhật thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  /**
   * Xóa đơn hàng
   * @param id ID đơn hàng
   * @returns Thông báo xóa thành công
   */
  @ApiOperation({ summary: 'Xóa đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng', type: 'number' })
  @ApiResponse({ status: 200, description: 'Đơn hàng đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.remove(id);
    return { message: 'Order deleted successfully' };
  }
}
