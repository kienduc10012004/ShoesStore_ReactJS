// ===== IMPORTS =====

import { Navigate } from 'react-router-dom'
import { readJsonStorage } from '../utils/storage.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component AdminRoute ------
const AdminRoute = ({ children }) => {

  // ------ Khai báo const user ------
  const user = readJsonStorage('HiKushoes_user', null)

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

// ===== EXPORTS =====

export default AdminRoute
