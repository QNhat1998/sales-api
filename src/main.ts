/**
 * File: main.ts
 * Mô tả: Đây là file khởi động chính của ứng dụng NestJS
 *
 * Flow hoạt động:
 * 1. Import các module cần thiết
 * 2. Tạo ứng dụng NestJS từ AppModule
 * 3. Cấu hình validation pipes để xác thực dữ liệu đầu vào
 * 4. Cấu hình Swagger để tạo tài liệu API tự động
 * 5. Bật CORS để cho phép các domain khác gọi API
 * 6. Lắng nghe kết nối trên tất cả các giao diện mạng
 * 7. Hiển thị thông tin về URL server
 */

import { NestFactory } from '@nestjs/core'; // Import module chính để tạo ứng dụng NestJS
import { AppModule } from './app.module'; // Import module gốc chứa toàn bộ ứng dụng
import { ValidationPipe } from '@nestjs/common'; // Import pipe để xác thực dữ liệu tự động
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import module cho Swagger API docs

async function bootstrap() {
  // Khởi tạo ứng dụng NestJS từ AppModule (module gốc)
  const app = await NestFactory.create(AppModule);

  // Áp dụng global pipes cho validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không khai báo trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (ví dụ: string -> number)
      forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không được khai báo
    }),
  );

  // Cấu hình Swagger UI để tạo tài liệu API tự động
  const config = new DocumentBuilder()
    .setTitle('Sales API') // Thiết lập tiêu đề của API
    .setDescription('API documentation for Sales Management System') // Mô tả API
    .setVersion('1.0') // Phiên bản API
    // Thêm các tag để phân nhóm các endpoints
    .addTag('users', 'User management') // Endpoints quản lý người dùng
    .addTag('products', 'Product management') // Endpoints quản lý sản phẩm
    .addTag('categories', 'Category management') // Endpoints quản lý danh mục
    .addTag('brands', 'Brand management') // Endpoints quản lý thương hiệu
    .addTag('orders', 'Order management') // Endpoints quản lý đơn hàng
    .addTag('payments', 'Payment management') // Endpoints quản lý thanh toán
    .addTag('auth', 'Authentication') // Endpoints xác thực người dùng
    // Cấu hình xác thực JWT Bearer token cho Swagger
    .addBearerAuth(
      {
        type: 'http', // Loại xác thực
        scheme: 'bearer', // Scheme xác thực
        bearerFormat: 'JWT', // Format token (JWT)
        name: 'Authorization', // Tên header
        description: 'Enter JWT token', // Mô tả cho người dùng
        in: 'header', // Vị trí chứa token (trong header)
      },
      'JWT-auth', // Tên này sẽ được sử dụng để tham chiếu trong @ApiBearerAuth()
    )
    .build(); // Hoàn thành việc xây dựng cấu hình

  // Tạo tài liệu Swagger từ cấu hình và các controller đã khai báo
  const document = SwaggerModule.createDocument(app, config);
  // Thiết lập endpoint '/api' để hiển thị Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Giữ thông tin xác thực khi refresh trang
    },
  });

  // Bật CORS để cho phép các domain khác gọi API
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Lắng nghe trên tất cả các interfaces (0.0.0.0) để có thể truy cập từ mạng cục bộ
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000; // Lấy cổng từ biến môi trường hoặc mặc định 3000
  await app.listen(port, '0.0.0.0'); // Lắng nghe trên tất cả các địa chỉ IP

  // Lấy URL của server để hiển thị
  const serverUrl = await app.getUrl();
  // Hiển thị thông tin về cách truy cập ứng dụng
  console.log(`Server is running on: ${serverUrl}`); // URL server
  console.log(`Swagger UI available at: http://localhost:${port}/api`); // URL Swagger UI local
  console.log(
    `For local network access, use: http://<your-local-ip>:${port}/api`, // URL truy cập từ mạng cục bộ
  );
}
// Gọi hàm bootstrap để khởi động ứng dụng
bootstrap();
