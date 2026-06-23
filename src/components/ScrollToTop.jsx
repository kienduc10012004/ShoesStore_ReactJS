// ===== IMPORTS =====

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component ScrollToTop ------
const ScrollToTop = () => {

  // ------ Lấy thông tin vị trí route hiện tại ------
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [pathname])

  return null
}

// ===== EXPORTS =====

export default ScrollToTop