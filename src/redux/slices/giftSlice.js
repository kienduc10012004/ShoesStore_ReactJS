// ===== IMPORTS =====

import { createSlice } from '@reduxjs/toolkit'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const gift storage key ------
const GIFT_STORAGE_KEY = 'kienshoes_gifts'

// ------ Hàm/Component safeParseGifts ------
const safeParseGifts = (data) => {
  try {
    if (!data || data === 'undefined' || data === 'null') return []

    // ------ Khai báo const parsed ------
    const parsed = JSON.parse(data)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ------ Hàm lấy gifts from local storage ------
const getGiftsFromLocalStorage = () => {
  return safeParseGifts(localStorage.getItem(GIFT_STORAGE_KEY))
}

// ------ Hàm/Component saveGiftsToLocalStorage ------
const saveGiftsToLocalStorage = (gifts) => {
  localStorage.setItem(GIFT_STORAGE_KEY, JSON.stringify(gifts))
}

// ------ Đối tượng cấu hình/dữ liệu initial state ------
const initialState = {
  gifts: getGiftsFromLocalStorage(),
}

// ------ Đối tượng cấu hình/dữ liệu gift slice ------
const giftSlice = createSlice({
  name: 'gift',
  initialState,
  reducers: {
    loadGifts: (state) => {
      state.gifts = getGiftsFromLocalStorage()
    },

    addGift: (state, action) => {

      // ------ Khai báo const gift ------
      const gift = action.payload

      state.gifts.unshift({
        id: Date.now(),
        name: gift.name,
        image: gift.image,
        createdAt: new Date().toLocaleString('vi-VN'),
      })

      saveGiftsToLocalStorage(state.gifts)
    },

    updateGift: (state, action) => {

      // ------ Khai báo const gift ------
      const gift = action.payload

      // ------ Khai báo const existed gift ------
      const existedGift = state.gifts.find((item) => item.id === gift.id)

      if (!existedGift) return

      existedGift.name = gift.name
      existedGift.image = gift.image
      existedGift.updatedAt = new Date().toLocaleString('vi-VN')

      saveGiftsToLocalStorage(state.gifts)
    },

    deleteGift: (state, action) => {

      // ------ Khai báo const id ------
      const id = action.payload

      state.gifts = state.gifts.filter((item) => item.id !== id)

      saveGiftsToLocalStorage(state.gifts)
    },
  },
})

// ===== EXPORTS =====

// ------ Khai báo const nhóm giá trị ------
export const { loadGifts, addGift, updateGift, deleteGift } = giftSlice.actions

export default giftSlice.reducer
