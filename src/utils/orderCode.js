// ===== THIẾT LẬP MODULE =====

// ------ Khai báo const order code counter key ------
const ORDER_CODE_COUNTER_KEY = 'kienshoes_order_code_counter'

// ------ Khai báo const order code prefix ------
const ORDER_CODE_PREFIX = 'KS251210'

// ===== EXPORTS =====

// ------ Hàm/Component generateOrderCode ------
export const generateOrderCode = () => {

  // ------ Khai báo const current counter ------
  const currentCounter =
    Number(localStorage.getItem(ORDER_CODE_COUNTER_KEY)) || 0

  // ------ Khai báo const next counter ------
  const nextCounter = currentCounter + 1

  localStorage.setItem(
    ORDER_CODE_COUNTER_KEY,
    String(nextCounter)
  )

  return `${ORDER_CODE_PREFIX}${nextCounter}`
}