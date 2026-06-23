// ===== IMPORTS =====

import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'
import orderReducer from './slices/orderSlice'
import reviewReducer from './slices/reviewSlice.js'
import giftReducer from './slices/giftSlice.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====



// ------ Đối tượng cấu hình/dữ liệu store ------
const store = configureStore({
  reducer: {
    cartStore: cartReducer,
    authStore: authReducer,
    orderStore: orderReducer,
    reviewStore: reviewReducer,
    giftStore: giftReducer,
  },
})

// ===== EXPORTS =====

export default store