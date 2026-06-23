// ===== IMPORTS =====

import { createSlice } from '@reduxjs/toolkit'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const review storage key ------
const REVIEW_STORAGE_KEY = 'kienshoes_reviews'

// ------ Hàm lấy reviews from local storage ------
const getReviewsFromLocalStorage = () => {
  try {

    // ------ Khai báo const data ------
    const data = localStorage.getItem(REVIEW_STORAGE_KEY)

    if (!data || data === 'undefined' || data === 'null') {
      return []
    }

    // ------ Khai báo const reviews ------
    const reviews = JSON.parse(data)

    return Array.isArray(reviews) ? reviews : []
  } catch {
    return []
  }
}

// ------ Hàm/Component saveReviewsToLocalStorage ------
const saveReviewsToLocalStorage = (reviews) => {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews))
}

// ------ Đối tượng cấu hình/dữ liệu initial state ------
const initialState = {
  reviews: getReviewsFromLocalStorage(),
}

// ------ Đối tượng cấu hình/dữ liệu review slice ------
const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    loadReviews: (state) => {
      state.reviews = getReviewsFromLocalStorage()
    },

    addReview: (state, action) => {

      // ------ Khai báo const review ------
      const review = action.payload

      // ------ Hàm/Component existedReview ------
      const existedReview = state.reviews.find((item) => {
        return (
          String(item.productId) === String(review.productId) &&
          item.username === review.username
        )
      })

      if (existedReview) {
        existedReview.rating = review.rating
        existedReview.content = review.content
        existedReview.images = review.images || []
        existedReview.updatedAt = new Date().toLocaleString('vi-VN')
      } else {
        state.reviews.unshift({
          ...review,
          id: Date.now(),
          hidden: false,
          createdAt: new Date().toLocaleString('vi-VN'),
          updatedAt: '',
        })
      }

      saveReviewsToLocalStorage(state.reviews)
    },

    updateReview: (state, action) => {

      // ------ Khai báo const nhóm giá trị ------
      const { id, rating, content, images } = action.payload

      // ------ Khai báo const review ------
      const review = state.reviews.find((item) => item.id === id)

      if (!review) return

      review.rating = rating
      review.content = content
      review.images = images || []
      review.updatedAt = new Date().toLocaleString('vi-VN')

      saveReviewsToLocalStorage(state.reviews)
    },

    toggleReviewHidden: (state, action) => {

      // ------ Khai báo const id ------
      const id = action.payload

      // ------ Khai báo const review ------
      const review = state.reviews.find((item) => item.id === id)

      if (!review) return

      review.hidden = !review.hidden

      saveReviewsToLocalStorage(state.reviews)
    },

    deleteReview: (state, action) => {

      // ------ Khai báo const id ------
      const id = action.payload

      state.reviews = state.reviews.filter((item) => item.id !== id)

      saveReviewsToLocalStorage(state.reviews)
    },
  },
})

// ===== EXPORTS =====

export const {
  loadReviews,
  addReview,
  updateReview,
  toggleReviewHidden,
  deleteReview,
} = reviewSlice.actions

export default reviewSlice.reducer
