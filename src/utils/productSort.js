// ===== THIẾT LẬP MODULE =====

// ===== EXPORTS =====

// ------ Hàm/Component sortByPromotionPriority ------
export const sortByPromotionPriority = (products = []) => {
  if (!Array.isArray(products)) return []

  return [...products].sort((a, b) => {

    // ------ Hàm lấy priority ------
    const getPriority = (product) => {
      if (Number(product.discount || 0) > 0 && product.hasGift) return 1
      if (Number(product.discount || 0) > 0) return 2
      if (product.hasGift) return 3
      return 4
    }

    return getPriority(a) - getPriority(b)
  })
}

// ------ Hàm/Component sortByNewest ------
export const sortByNewest = (products = []) => {
  if (!Array.isArray(products)) return []

  return [...products].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  )
}
