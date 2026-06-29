// ===== IMPORTS =====

import { createSlice } from '@reduxjs/toolkit'
import { readJsonStorage } from '../../utils/storage.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy user from local storage ------
const getUserFromLocalStorage = () => {
  return readJsonStorage('HiKushoes_user', null)
}

// ------ Đối tượng cấu hình/dữ liệu auth slice ------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromLocalStorage(),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload
      localStorage.setItem('HiKushoes_user', JSON.stringify(action.payload))
    },

    logout: (state) => {
      state.user = null
      localStorage.removeItem('HiKushoes_user')
    },
  },
})

// ===== EXPORTS =====

// ------ Khai báo const nhóm giá trị ------
export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
