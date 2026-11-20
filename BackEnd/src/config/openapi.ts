const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Tàn Sắc Vẹn Hương API',
    version: '1.0.0',
    description: 'REST API cho danh mục sản phẩm, guest checkout và thanh toán.'
  },
  servers: [{ url: '/', description: 'Server hiện tại' }],
  tags: [
    { name: 'System', description: 'Tình trạng dịch vụ' },
    { name: 'Products', description: 'Danh mục sản phẩm' },
    { name: 'Orders & Payment', description: 'Đơn hàng, tra cứu và thanh toán' }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['System'], summary: 'Kiểm tra tình trạng backend',
        responses: { '200': { description: 'Backend đang hoạt động' } }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'], summary: 'Lấy danh sách sản phẩm',
        parameters: [{ name: 'category', in: 'query', required: false, schema: { type: 'string', enum: ['nuoc-hoa', 'tram-huong', 'tinh-dau', 'nen-thom', 'dac-san'] } }],
        responses: { '200': { description: 'Danh sách sản phẩm' }, '500': { description: 'Không thể tải danh sách' } }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'], summary: 'Lấy chi tiết sản phẩm',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', example: 'tsvh-01' } }],
        responses: { '200': { description: 'Sản phẩm' }, '404': { description: 'Không tìm thấy sản phẩm' } }
      }
    },
    '/api/payment/create-order': {
      post: {
        tags: ['Orders & Payment'], summary: 'Tạo đơn hàng guest checkout',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrder' }, example: {
            customer: { name: 'Nguyễn Văn An', phone: '0901234567', address: 'Quận 1, TP. Hồ Chí Minh', notes: 'Gọi trước khi giao' },
            items: [{ productId: 'tsvh-01', quantity: 1 }], paymentMethod: 'vietqr'
          } } }
        },
        responses: { '201': { description: 'Đơn được lưu, có thể kèm mã QR thanh toán' }, '400': { description: 'Payload không hợp lệ' }, '409': { description: 'Sản phẩm hết hàng' } }
      }
    },
    '/api/payment/create-payment-link': {
      post: {
        tags: ['Orders & Payment'], summary: 'Tạo đơn guest checkout và payment link PayOS',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePaymentLink' }, example: {
            customerInfo: { fullName: 'Nguyễn Văn An', phone: '0901234567', address: 'Quận 1, TP. Hồ Chí Minh', note: 'Gọi trước khi giao' },
            items: [{ productId: 'tsvh-01', quantity: 1 }], isTestMode: true
          } } }
        },
        responses: { '201': { description: 'Đã lưu đơn PENDING và tạo link/QR PayOS' }, '400': { description: 'Payload không hợp lệ' }, '403': { description: 'Chế độ test bị tắt' }, '502': { description: 'PayOS không tạo được liên kết' }, '503': { description: 'PayOS chưa được cấu hình' } }
      }
    },
    '/api/payment/order/{orderCode}': {
      get: {
        tags: ['Orders & Payment'], summary: 'Lấy trạng thái đơn hàng để polling',
        parameters: [{ name: 'orderCode', in: 'path', required: true, schema: { type: 'integer', example: 82910472 } }],
        responses: { '200': { description: 'Trạng thái PENDING, PAID hoặc CANCELLED' }, '404': { description: 'Không tìm thấy đơn hàng' } }
      }
    },
    '/api/payment/order-status/{orderCode}': {
      get: {
        tags: ['Orders & Payment'], summary: 'Kiểm tra trạng thái đơn',
        parameters: [{ name: 'orderCode', in: 'path', required: true, schema: { type: 'integer', example: 82910472 } }],
        responses: { '200': { description: 'Trạng thái đơn hàng' }, '404': { description: 'Không tìm thấy đơn hàng' } }
      }
    },
    '/api/payment/lookup-orders': {
      get: {
        tags: ['Orders & Payment'], summary: 'Tra cứu đơn hàng bằng số điện thoại',
        parameters: [{ name: 'phone', in: 'query', required: true, schema: { type: 'string', example: '0901234567' } }],
        responses: { '200': { description: 'Tối đa 50 đơn; không bao gồm địa chỉ và ghi chú giao nhận' }, '400': { description: 'Số điện thoại không hợp lệ' } }
      }
    },
    '/api/payment/webhook': {
      post: {
        tags: ['Orders & Payment'], summary: 'Webhook xác nhận giao dịch PayOS',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } } },
        responses: { '200': { description: 'Luôn xác nhận webhook với PayOS; chỉ cập nhật đơn nếu chữ ký hợp lệ và code bằng 00' } }
      }
    },
    '/api/payment/simulate-success/{orderCode}': {
      post: {
        tags: ['Orders & Payment'], summary: 'Mô phỏng thanh toán thành công (chỉ môi trường phát triển)',
        parameters: [{ name: 'orderCode', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Đơn được chuyển sang PAID' }, '404': { description: 'Không tìm thấy endpoint hoặc đơn hàng' } }
      }
    }
  },
  components: {
    schemas: {
      CreateOrder: {
        type: 'object', required: ['customer', 'items', 'paymentMethod'],
        properties: {
          customer: {
            type: 'object', required: ['name', 'phone', 'address'],
            properties: { name: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }, notes: { type: 'string' } }
          },
          items: {
            type: 'array', minItems: 1, maxItems: 50,
            items: { type: 'object', required: ['productId', 'quantity'], properties: { productId: { type: 'string', example: 'tsvh-01' }, quantity: { type: 'integer', minimum: 1 } } }
          },
          paymentMethod: { type: 'string', enum: ['vietqr', 'cod'] }
        }
      },
      CreatePaymentLink: {
        type: 'object', required: ['customerInfo', 'items'],
        properties: {
          customerInfo: {
            type: 'object', required: ['fullName', 'phone', 'address'],
            properties: { fullName: { type: 'string', maxLength: 120 }, phone: { type: 'string', example: '0901234567' }, address: { type: 'string', maxLength: 500 }, note: { type: 'string', maxLength: 500 } }
          },
          items: {
            type: 'array', minItems: 1, maxItems: 50,
            items: { type: 'object', required: ['productId', 'quantity'], properties: { productId: { type: 'string' }, quantity: { type: 'integer', minimum: 1, maximum: 99 } } }
          },
          isTestMode: { type: 'boolean', description: 'Nếu true, backend tính payment link ở mức 2.000đ; không nhận giá từ client.' }
        }
      }
    }
  }
} as const;

export default openApiSpec;
