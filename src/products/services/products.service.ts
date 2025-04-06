import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

/**
 * Service quản lý sản phẩm
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  /**
   * Lấy danh sách sản phẩm có phân trang
   * @param page Trang hiện tại
   * @param limit Số lượng sản phẩm mỗi trang
   * @returns Danh sách sản phẩm và tổng số sản phẩm
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await this.productsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category', 'brand'],
    });

    return { data, total };
  }

  /**
   * Lấy thông tin chi tiết sản phẩm theo ID
   * @param id ID sản phẩm
   * @returns Thông tin chi tiết sản phẩm
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { product_id: id },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Tìm kiếm sản phẩm
   * @param searchTerm Từ khóa tìm kiếm
   * @param page Trang hiện tại
   * @param limit Số lượng sản phẩm mỗi trang
   * @returns Danh sách sản phẩm và tổng số sản phẩm
   */
  async search(
    searchTerm: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await this.productsRepository.findAndCount({
      where: [
        { product_name: searchTerm }, // Có thể sử dụng LIKE nếu cần
        { description: searchTerm },
        { sku: searchTerm },
      ],
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category', 'brand'],
    });

    return { data, total };
  }

  /**
   * Tạo sản phẩm mới
   * @param createProductDto Dữ liệu sản phẩm mới
   * @returns Thông tin sản phẩm đã tạo
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Kiểm tra SKU nếu được cung cấp
    if (createProductDto.sku) {
      const existingProduct = await this.productsRepository.findOne({
        where: { sku: createProductDto.sku },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with SKU ${createProductDto.sku} already exists`,
        );
      }
    }

    // Tạo sản phẩm mới
    const product = this.productsRepository.create(createProductDto);

    // Lưu vào database
    return this.productsRepository.save(product);
  }

  /**
   * Cập nhật thông tin sản phẩm
   * @param id ID của sản phẩm
   * @param updateProductDto Dữ liệu cập nhật
   * @returns Thông tin sản phẩm đã cập nhật
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Tìm sản phẩm theo ID
    const product = await this.findOne(id);

    // Kiểm tra SKU nếu được cung cấp và khác với SKU hiện tại
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productsRepository.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with SKU ${updateProductDto.sku} already exists`,
        );
      }
    }

    // Cập nhật các trường
    Object.assign(product, updateProductDto);

    // Lưu vào database
    return this.productsRepository.save(product);
  }

  /**
   * Xóa sản phẩm
   * @param id ID của sản phẩm
   */
  async remove(id: number): Promise<void> {
    // Tìm sản phẩm theo ID
    const product = await this.findOne(id);

    // Xóa sản phẩm
    await this.productsRepository.remove(product);
  }
}
