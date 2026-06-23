// ===== IMPORTS =====

import { Navigate } from 'react-router-dom'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component ProtectedRoute ------
const ProtectedRoute = ({ children }) => {

  // ------ Khai báo const user ------
  const user =
    JSON.parse(localStorage.getItem('kienshoes_user')) || null

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

// ===== EXPORTS =====

export default ProtectedRoute