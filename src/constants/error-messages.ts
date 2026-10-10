export const ERROR_MESSAGES: Record<string, string> = {
  // Auth & Account
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác.",
  EMAIL_NOT_VERIFIED: "Vui lòng xác thực email trước khi đăng nhập.",
  EMAIL_ALREADY_IN_USE: "Email này đã được đăng ký. Vui lòng chọn email khác.",
  SAME_PASSWORD: "Mật khẩu mới phải khác với mật khẩu hiện tại.",
  RESET_LINK_INVALID: "Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.",
  NO_PASSWORD_SET: "Tài khoản này đăng nhập bằng Google, vui lòng đăng nhập bằng Google.",
  USER_BANNED: "Tài khoản của bạn đã bị khóa.",
  USER_NOT_FOUND: "Không tìm thấy người dùng.",
  UNAUTHORIZED: "Bạn cần đăng nhập để thực hiện thao tác này.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",

  // Products & Categories
  SLUG_ALREADY_IN_USE: "Đường dẫn (slug) này đã được sử dụng.",
  SKU_ALREADY_IN_USE: "Mã SKU này đã được sử dụng.",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm.",
  CATEGORY_NOT_FOUND: "Không tìm thấy danh mục.",
  CATEGORY_HAS_CHILDREN: "Danh mục đang chứa danh mục con, không thể xóa.",
  CATEGORY_HAS_PRODUCTS: "Danh mục đang chứa sản phẩm, không thể xóa.",

  // Cart & Orders
  CART_ITEM_NOT_FOUND: "Không tìm thấy sản phẩm trong giỏ hàng.",
  INSUFFICIENT_STOCK: "Số lượng tồn kho không đủ để đáp ứng yêu cầu.",
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng.",
  CANNOT_CANCEL_ORDER: "Đơn hàng này không thể hủy ở trạng thái hiện tại.",
  ORDER_ALREADY_PROCESSED: "Đơn hàng đã được xử lý.",

  // Vouchers & Promotions
  VOUCHER_NOT_FOUND: "Mã giảm giá không tồn tại.",
  VOUCHER_EXPIRED: "Mã giảm giá đã hết hạn sử dụng.",
  VOUCHER_NOT_STARTED: "Mã giảm giá chưa đến thời gian áp dụng.",
  VOUCHER_USAGE_LIMIT_REACHED: "Mã giảm giá đã hết lượt sử dụng.",
  VOUCHER_USER_LIMIT_REACHED: "Bạn đã dùng hết lượt cho mã giảm giá này.",
  MIN_ORDER_AMOUNT_NOT_MET: "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá.",

  // Inventory, Shipments & Warehouses
  WAREHOUSE_NOT_FOUND: "Không tìm thấy kho hàng.",
  SUPPLIER_NOT_FOUND: "Không tìm thấy nhà cung cấp.",
  PURCHASE_ORDER_NOT_FOUND: "Không tìm thấy đơn nhập hàng.",
  SHIPMENT_NOT_FOUND: "Không tìm thấy vận đơn.",
  RETURN_REQUEST_NOT_FOUND: "Không tìm thấy yêu cầu đổi trả.",

  // Generic
  INTERNAL_SERVER_ERROR: "Lỗi hệ thống máy chủ. Vui lòng thử lại sau.",
  VALIDATION_ERROR: "Dữ liệu gửi lên không hợp lệ.",
  NETWORK_ERROR: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.",
};

export function getErrorMessage(
  error: unknown,
  fallback = "Có lỗi xảy ra. Vui lòng thử lại sau.",
): string {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const err = error as { code?: string; message?: string };
    if (err.code && ERROR_MESSAGES[err.code]) {
      return ERROR_MESSAGES[err.code];
    }
    if (err.message && typeof err.message === "string") {
      // If message is an error code key
      if (ERROR_MESSAGES[err.message]) {
        return ERROR_MESSAGES[err.message];
      }
      return err.message;
    }
  }

  return fallback;
}
