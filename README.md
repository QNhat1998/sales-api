<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Students API

API quản lý học sinh và đơn hàng xây dựng trên NestJS, TypeORM và MySQL.

## Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- Node.js (>= 18.x)
- npm hoặc yarn
- MySQL (>= 8.0)

### Cài đặt cục bộ (Local)

1. Clone repository:

```bash
git clone <repository-url>
cd students-api
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file .env từ file .env.example và cập nhật các thông số:

```bash
cp .env.example .env
```

4. Cấu hình cơ sở dữ liệu MySQL với thông tin trong file .env

5. Chạy ứng dụng ở chế độ development:

```bash
npm run start:dev
```

6. Truy cập Swagger UI để xem tài liệu API:

```
http://localhost:3000/api
```

### Triển khai lên server

#### Cách 1: Sử dụng Render.com

1. Tạo tài khoản trên [Render.com](https://render.com/)

2. Tạo Web Service mới:

   - Liên kết với repository Git
   - Chọn "Node" làm runtime
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

3. Thêm Environment Variables:

   - Thêm tất cả biến trong file `.env.example` với giá trị thực

4. Cấu hình Database:
   - Tạo MySQL Database trên Render hoặc sử dụng dịch vụ bên ngoài như AWS RDS, DigitalOcean
   - Cập nhật thông tin kết nối trong Environment Variables

#### Cách 2: Sử dụng Docker và VPS (như DigitalOcean, AWS EC2)

1. Tạo Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

2. Tạo docker-compose.yml:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    depends_on:
      - mysql
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=root
      - DB_PASSWORD=password
      - DB_DATABASE=sales_db
      - JWT_SECRET=your_jwt_secret_key
      - JWT_EXPIRES_IN=15m
      - JWT_REFRESH_SECRET=your_refresh_token_secret
      - JWT_REFRESH_EXPIRES_IN=7d

  mysql:
    image: mysql:8.0
    ports:
      - '3306:3306'
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=sales_db
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

3. Triển khai lên VPS:
   - Cài đặt Docker và Docker Compose trên server
   - Upload code lên server
   - Chạy lệnh: `docker-compose up -d`

## Sử dụng API

1. Đăng ký tài khoản: `POST /auth/signup`
2. Đăng nhập: `POST /auth/login`
3. Sử dụng access_token trong header Authorization: `Bearer {access_token}`
4. Khi token hết hạn, gọi API refresh token: `POST /auth/refresh` với body chứa refresh_token

## Testing

1. Để gọi các API bảo mật, cần đăng nhập trước để lấy token
2. Trong Swagger UI:
   - Đăng nhập qua endpoint `/auth/login`
   - Dùng token nhận được trong phần Authorize (Nút "Authorize" ở đầu trang)
   - Nhập: `Bearer {access_token}` (nhớ thêm từ "Bearer" và khoảng trắng)

## Lưu ý về CORS

API đã được cấu hình để cho phép cross-origin requests từ bất kỳ domain nào. Trong môi trường production, nên giới hạn origins cho phù hợp trong file `src/main.ts`.
