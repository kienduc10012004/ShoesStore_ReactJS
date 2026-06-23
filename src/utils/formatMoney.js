// ===== THIẾT LẬP MODULE =====

// ===== EXPORTS =====

// ------ Hàm định dạng money ------
export const formatMoney = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
