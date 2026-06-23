// ===== THIẾT LẬP MODULE =====

// ===== EXPORTS =====

// ------ Hàm/Component scrollToTop ------
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior,
  })
}