// ===== IMPORTS =====

import { createSlice } from '@reduxjs/toolkit'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy user from local storage ------
const getUserFromLocalStorage = () => {

  // ------ Khai báo const data ------
  const data = localStorage.getItem('kienshoes_user')
  return data ? JSON.parse(data) : null
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
      localStorage.setItem('kienshoes_user', JSON.stringify(action.payload))
    },

    logout: (state) => {
      state.user = null
      localStorage.removeItem('kienshoes_user')
    },
  },
})

// ===== EXPORTS =====

// ------ Khai báo const nhóm giá trị ------
export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer