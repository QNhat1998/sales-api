GET /users - Lấy danh sách khách hàng
GET /users/:id - Lấy thông tin chi tiết khách hàng
POST /users - Tạo khách hàng mới
PUT /users/:id - Cập nhật khách hàng
DELETE /users/:id - Xóa khách hàng
GET /users/:id/orders - Lấy đơn hàng của khách hàng

GET /orders - Lấy danh sách đơn hàng
GET /orders/:id - Lấy thông tin chi tiết đơn hàng
POST /orders - Tạo đơn hàng mới
PUT /orders/:id - Cập nhật đơn hàng
DELETE /orders/:id - Xóa đơn hàng
PUT /orders/:id/status - Cập nhật trạng thái đơn hàng
GET /orders/:id/items - Lấy chi tiết đơn hàng

GET /order-items/:id - Lấy thông tin chi tiết item
POST /orders/:id/items - Thêm sản phẩm vào đơn hàng
PUT /order-items/:id - Cập nhật chi tiết đơn hàng
DELETE /order-items/:id - Xóa sản phẩm khỏi đơn hàng

GET /payments - Lấy danh sách thanh toán
GET /payments/:id - Lấy thông tin chi tiết thanh toán
POST /payments - Tạo thanh toán mới
PUT /payments/:id - Cập nhật thanh toán
DELETE /payments/:id - Xóa thanh toán
PUT /payments/:id/status - Cập nhật trạng thái thanh toán
GET /orders/:id/payments - Lấy thanh toán của đơn hàng

Mỗi endpoint cần được bảo vệ bằng JWT token xác thực, ngoại trừ các endpoint đăng nhập, đăng ký và làm mới token. Các endpoint có thể hỗ trợ thêm các tham số truy vấn như:
?page=1&limit=10 - Phân trang
?sort=created_at:desc - Sắp xếp
?search=keyword - Tìm kiếm
?fields=id,name,price - Chọn trường
?status=active - Lọc theo trạng thái
