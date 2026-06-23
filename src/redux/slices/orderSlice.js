// ===== IMPORTS =====

import { createSlice } from '@reduxjs/toolkit'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const order prefix ------
const ORDER_PREFIX = 'kienshoes_orders_'
const SOLD_STATS_KEY = 'kienshoes_sold_stats'

// ------ Hàm lấy order key ------
const getOrderKey = (username) => {
  return username ? `${ORDER_PREFIX}${username}` : `${ORDER_PREFIX}guest`
}

// ------ Hàm/Component safeParse ------
const safeParse = (value, fallback = []) => {
  try {
    if (!value || value === 'undefined') return fallback

    // ------ Khai báo const parsed ------
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const safeParseObject = (value, fallback = {}) => {
  try {
    if (!value || value === 'undefined' || value === 'null') return fallback

    const parsed = JSON.parse(value)

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : fallback
  } catch {
    return fallback
  }
}

const getSoldStatsFromLocalStorage = () => {
  return safeParseObject(localStorage.getItem(SOLD_STATS_KEY), {})
}

const saveSoldStatsToLocalStorage = (soldStats) => {
  localStorage.setItem(SOLD_STATS_KEY, JSON.stringify(soldStats))
}

const increaseSoldStatsByProducts = (products = []) => {
  const soldStats = getSoldStatsFromLocalStorage()

  products.forEach((product) => {
    const productId = String(product.id)
    const quantity = Number(product.cartQuantity || 0)

    if (!productId || quantity <= 0) return

    soldStats[productId] = Number(soldStats[productId] || 0) + quantity
  })

  saveSoldStatsToLocalStorage(soldStats)
}

const decreaseSoldStatsByProduct = (product) => {
  const soldStats = getSoldStatsFromLocalStorage()
  const productId = String(product?.id || '')
  const quantity = Number(product?.cartQuantity || 0)

  if (!productId || quantity <= 0) return

  soldStats[productId] = Math.max(
    0,
    Number(soldStats[productId] || 0) - quantity,
  )

  saveSoldStatsToLocalStorage(soldStats)
}

// ------ Hàm lấy orders from local storage ------
const getOrdersFromLocalStorage = (username) => {
  return safeParse(localStorage.getItem(getOrderKey(username)), [])
}

// ------ Hàm/Component saveOrdersToLocalStorage ------
const saveOrdersToLocalStorage = (username, orders) => {
  localStorage.setItem(getOrderKey(username), JSON.stringify(orders))
}

// ------ Hàm lấy all orders for admin ------
const getAllOrdersForAdmin = () => {

  // ------ Mảng lưu danh sách result ------
  const result = []

  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith(ORDER_PREFIX)) return

    // ------ Mảng lưu danh sách orders ------
    const orders = safeParse(localStorage.getItem(key), [])
    result.push(...orders)
  })

  return result.sort((a, b) => Number(b.id) - Number(a.id))
}

// ------ Hàm lấy order owner username ------
const getOrderOwnerUsername = (order) => {


  return (
    order?.ownerUsername ||
    order?.customer?.username ||
    order?.username ||
    'guest'
  )
}

// ------ Hàm cập nhật order everywhere ------
const updateOrderEverywhere = (state, orderId, updater) => {

  // ------ Hàm cập nhật list ------
  const updateList = (orders) => {
    return orders.map((order) => {
      if (String(order.id) !== String(orderId)) return order

      // ------ Đối tượng cấu hình/dữ liệu cloned order ------
      const clonedOrder = {
        ...order,
        products: Array.isArray(order.products) ? [...order.products] : [],
      }

      updater(clonedOrder)

      clonedOrder.updatedAt = new Date().toLocaleString('vi-VN')

      return clonedOrder
    })
  }

  if (state.username === 'admin') {

    // ------ Khai báo const current order ------
    const currentOrder = state.orders.find(
      (item) => String(item.id) === String(orderId)
    )

    // ------ Khai báo const owner username ------
    const ownerUsername = getOrderOwnerUsername(currentOrder)

    if (ownerUsername) {

      // ------ Khai báo const owner orders ------
      const ownerOrders = getOrdersFromLocalStorage(ownerUsername)

      // ------ Khai báo const updated owner orders ------
      const updatedOwnerOrders = updateList(ownerOrders)
      saveOrdersToLocalStorage(ownerUsername, updatedOwnerOrders)
    }

    state.orders = getAllOrdersForAdmin()
    return
  }

  state.orders = updateList(state.orders)
  saveOrdersToLocalStorage(state.username, state.orders)
}

// ------ Hàm/Component normalizeOrderProducts ------
const normalizeOrderProducts = (products = []) => {
  return products.map((item) => ({
    ...item,
    returnRequest: item.returnRequest || null,
  }))
}

// ------ Đối tượng cấu hình/dữ liệu initial state ------
const initialState = {
  orders: [],
  username: null,
}

// ------ Đối tượng cấu hình/dữ liệu order slice ------
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    loadOrdersByUser: (state, action) => {

      // ------ Khai báo const username ------
      const username = action.payload

      state.username = username
      state.orders = getOrdersFromLocalStorage(username)
    },

    loadAllOrdersForAdmin: (state) => {
      state.username = 'admin'
      state.orders = getAllOrdersForAdmin()
    },

    addOrder: (state, action) => {

      // ------ Khai báo const customer note ------
      const customerNote = (
        action.payload.customerNote ??
        action.payload.note ??
        ''
      ).trim()

      // ------ Đối tượng cấu hình/dữ liệu order ------
      const order = {
        ...action.payload,
        note: customerNote,
        customerNote,
        products: normalizeOrderProducts(action.payload.products || []),
        stockStatus: action.payload.stockStatus || 'Chưa trừ kho',
        soldStatsRecorded: Boolean(action.payload.soldStatsRecorded),
      }

      state.orders.unshift(order)
      saveOrdersToLocalStorage(state.username, state.orders)
    },

    updateOrderStatus: (state, action) => {
      const {
        id,
        status,
        cancelReason,
        cancelBy,
        stockStatus,
      } = action.payload

      updateOrderEverywhere(state, id, (order) => {

        // ------ Khai báo const old status ------
        const oldStatus = order.status

        order.status = status

        if (stockStatus) {
          order.stockStatus = stockStatus
        }

        if (status === 'Đã giao hàng' && !order.soldStatsRecorded) {
          increaseSoldStatsByProducts(order.products)

          order.soldStatsRecorded = true
          order.soldStatsRecordedAt = new Date().toISOString()
        }

        if (status === 'Đã giao hàng' && oldStatus !== 'Đã giao hàng') {
          order.deliveredAt = new Date().toISOString()
          order.deliveredAtText = new Date().toLocaleString('vi-VN')
        }

        if (status === 'Đã bị hủy') {
          order.cancelReason = cancelReason || 'Không có'
          order.cancelBy = cancelBy || 'Admin'
          order.cancelAt = new Date().toISOString()
          order.cancelAtText = new Date().toLocaleString('vi-VN')
        }
      })
    },

    cancelOrderByCustomer: (state, action) => {

      // ------ Khai báo const nhóm giá trị ------
      const { id, reason } = action.payload

      updateOrderEverywhere(state, id, (order) => {
        order.status = 'Đã bị hủy'
        order.cancelReason = reason || 'Khách hàng tự hủy'
        order.cancelBy = 'Khách hàng'
        order.cancelAt = new Date().toISOString()
        order.cancelAtText = new Date().toLocaleString('vi-VN')
      })
    },

    requestReturnProduct: (state, action) => {
      const {
        orderId,
        productKey,
        reason,
        files = [],
      } = action.payload

      updateOrderEverywhere(state, orderId, (order) => {
        order.products = normalizeOrderProducts(order.products).map((item) => {

          // ------ Khai báo const current key ------
          const currentKey = `${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`

          if (currentKey !== productKey) return item

          return {
            ...item,
            returnRequest: {
              reason,
              files,
              status: 'Chờ duyệt',
              refundStatus: 'Chưa hoàn tiền',
              adminNote: '',
              rejectReason: '',
              stockReturned: false,
              soldStatsRefunded: false,
              createdAt: new Date().toLocaleString('vi-VN'),
              createdAtISO: new Date().toISOString(),
              updatedAt: new Date().toLocaleString('vi-VN'),
            },
          }
        })
      })
    },

    updateProductReturnRequest: (state, action) => {
      const {
        orderId,
        productKey,
        status,
        refundStatus,
        adminNote,
        rejectReason,
        stockReturned,
      } = action.payload

      updateOrderEverywhere(state, orderId, (order) => {
        order.products = normalizeOrderProducts(order.products).map((item) => {

          // ------ Khai báo const current key ------
          const currentKey = `${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`

          if (currentKey !== productKey || !item.returnRequest) return item

          // ------ Khai báo const old request ------
          const oldRequest = item.returnRequest

          const nextStatus = status || oldRequest.status
          const nextRefundStatus = refundStatus || oldRequest.refundStatus

          const shouldSubtractSoldStats =
            order.status === 'Đã giao hàng' &&
            nextStatus === 'Đã chấp nhận' &&
            nextRefundStatus === 'Đã hoàn tiền' &&
            !oldRequest.soldStatsRefunded

          if (shouldSubtractSoldStats) {
            decreaseSoldStatsByProduct(item)
          }

          return {
            ...item,
            returnRequest: {
              ...oldRequest,
              status: nextStatus,
              refundStatus: nextRefundStatus,
              adminNote: adminNote ?? oldRequest.adminNote,
              rejectReason: rejectReason ?? oldRequest.rejectReason,
              stockReturned:
                stockReturned !== undefined
                  ? stockReturned
                  : oldRequest.stockReturned,
              soldStatsRefunded:
                shouldSubtractSoldStats || oldRequest.soldStatsRefunded || false,
              soldStatsRefundedAt: shouldSubtractSoldStats
                ? new Date().toISOString()
                : oldRequest.soldStatsRefundedAt,
              updatedAt: new Date().toLocaleString('vi-VN'),
            },
          }
        })
      })
    },

    deleteOrder: (state, action) => {

      // ------ Khai báo const id ------
      const id = action.payload

      // ------ Khai báo const order ------
      const order = state.orders.find((item) => String(item.id) === String(id))

      if (state.username === 'admin') {

        // ------ Khai báo const owner username ------
        const ownerUsername = getOrderOwnerUsername(order)

        if (ownerUsername) {

          // ------ Khai báo const owner orders ------
          const ownerOrders = getOrdersFromLocalStorage(ownerUsername)

          // ------ Khai báo const new owner orders ------
          const newOwnerOrders = ownerOrders.filter(
            (item) => String(item.id) !== String(id)
          )
          saveOrdersToLocalStorage(ownerUsername, newOwnerOrders)
        }

        state.orders = getAllOrdersForAdmin()
      } else {
        state.orders = state.orders.filter(
          (item) => String(item.id) !== String(id)
        )
        saveOrdersToLocalStorage(state.username, state.orders)
      }
    },
  },
})

// ===== EXPORTS =====

export const {
  loadOrdersByUser,
  loadAllOrdersForAdmin,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  cancelOrderByCustomer,
  requestReturnProduct,
  updateProductReturnRequest,
} = orderSlice.actions

export default orderSlice.reducer
