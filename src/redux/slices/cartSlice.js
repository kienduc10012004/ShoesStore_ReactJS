// ===== IMPORTS =====

import { createSlice } from '@reduxjs/toolkit'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy cart key ------
const getCartKey = (username) => {
  return username ? `kienShoesCart_${username}` : 'kienShoesCart_guest'
}

// ------ Hàm lấy cart from local storage ------
const getCartFromLocalStorage = (username) => {
  try {

    // ------ Khai báo const data ------
    const data = localStorage.getItem(getCartKey(username))
    if (!data || data === 'undefined' || data === 'null') return []

    // ------ Khai báo const cart ------
    const cart = JSON.parse(data)
    return Array.isArray(cart) ? cart : []
  } catch {
    return []
  }
}

// ------ Hàm/Component saveCartToLocalStorage ------
const saveCartToLocalStorage = (username, cart) => {
  localStorage.setItem(getCartKey(username), JSON.stringify(cart))
}

// ------ Hàm lấy cart item key ------
const getCartItemKey = (item) => {
  return `${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`
}

// ------ Đối tượng cấu hình/dữ liệu initial state ------
const initialState = {
  cart: [],
  username: null,
}

// ------ Đối tượng cấu hình/dữ liệu cart slice ------
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCartByUser: (state, action) => {

      // ------ Khai báo const username ------
      const username = action.payload

      state.username = username
      state.cart = getCartFromLocalStorage(username)
    },

    addToCart: (state, action) => {

      // ------ Khai báo const product ------
      const product = action.payload

      // ------ Khai báo const quantity add ------
      const quantityAdd = Number(product.cartQuantity || 1)

      // ------ Hàm/Component existedProduct ------
      const existedProduct = state.cart.find((item) => {
        return getCartItemKey(item) === getCartItemKey(product)
      })

      if (existedProduct) {
        existedProduct.cartQuantity =
          Number(existedProduct.cartQuantity || 0) + quantityAdd
      } else {
        state.cart.push({
          ...product,
          cartQuantity: quantityAdd,
        })
      }

      saveCartToLocalStorage(state.username, state.cart)
    },

    increaseCartItem: (state, action) => {

      // ------ Khai báo const cart item ------
      const cartItem = action.payload

      // ------ Hàm/Component item ------
      const item = state.cart.find((product) => {
        return getCartItemKey(product) === getCartItemKey(cartItem)
      })

      if (item) {
        item.cartQuantity = Number(item.cartQuantity || 0) + 1
      }

      saveCartToLocalStorage(state.username, state.cart)
    },

    decreaseCartItem: (state, action) => {

      // ------ Khai báo const cart item ------
      const cartItem = action.payload

      // ------ Hàm/Component item ------
      const item = state.cart.find((product) => {
        return getCartItemKey(product) === getCartItemKey(cartItem)
      })

      if (item) {
        item.cartQuantity = Number(item.cartQuantity || 0) - 1
      }

      state.cart = state.cart.filter((item) => Number(item.cartQuantity || 0) > 0)

      saveCartToLocalStorage(state.username, state.cart)
    },

    removeCartItem: (state, action) => {

      // ------ Khai báo const cart item ------
      const cartItem = action.payload

      state.cart = state.cart.filter((product) => {
        return getCartItemKey(product) !== getCartItemKey(cartItem)
      })

      saveCartToLocalStorage(state.username, state.cart)
    },

    clearCart: (state) => {
      state.cart = []
      localStorage.removeItem(getCartKey(state.username))
    },
  },
})

// ===== EXPORTS =====

export const {
  loadCartByUser,
  addToCart,
  increaseCartItem,
  decreaseCartItem,
  removeCartItem,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer