// ===== THIẾT LẬP MODULE =====

// ===== EXPORTS =====

// ------ Khai báo const gender options ------
export const genderOptions = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'boy', label: 'Giày nam' },
  { value: 'girl', label: 'Giày nữ' },
  { value: 'unisex', label: 'Nam và nữ' },
]

// ------ Hàm lấy gender name ------
export const getGenderName = (gender = []) => {
  if (!Array.isArray(gender)) return ''

  if (gender.includes('boy') && gender.includes('girl')) {
    return 'Nam và nữ'
  }

  if (gender.includes('boy')) {
    return 'Nam'
  }

  if (gender.includes('girl')) {
    return 'Nữ'
  }

  return ''
}

// ------ Hàm/Component checkGenderMatch ------
export const checkGenderMatch = (product, selectedGender) => {
  if (selectedGender === 'ALL') return true

  if (selectedGender === 'unisex') {
    return (
      product.gender?.includes('unisex') ||
      (product.gender?.includes('boy') && product.gender?.includes('girl'))
    )
  }

  return product.gender?.includes(selectedGender)
}