// ===== THIẾT LẬP MODULE =====


// ===== EXPORTS =====


// ------ Hàm lấy sale price ------
export const getSalePrice = (price, discount = 0) => {

  // ------ Khai báo const original price ------
  const originalPrice = Number(price || 0)

  // ------ Khai báo const discount percent ------
  const discountPercent = Number(discount || 0)

  return Math.round((originalPrice * (100 - discountPercent)) / 100)
}

// ------ Hàm/Component hasDiscount ------
export const hasDiscount = (product) => {
  return Number(product?.discount || 0) > 0
}

// ------ Hàm lấy display price ------
export const getDisplayPrice = (product) => {
  if (!product) return 0

  if (hasDiscount(product)) {
    return getSalePrice(product.price, product.discount)
  }

  return Number(product.price || 0)
}
