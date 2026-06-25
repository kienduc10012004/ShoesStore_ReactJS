// ===== EXPORTS =====

// ------ Hàm định dạng price ------
export const formatPrice = (price) => {
  return Number(price || 0).toLocaleString('vi-VN') + 'đ'
}

// ------ Hàm lấy all customers ------
export const getAllCustomers = () => {

  // ------ Mảng lưu danh sách customers ------
  const customers = []

  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith('kienshoes_users')) return

    try {

      // ------ Khai báo const data ------
      const data = JSON.parse(localStorage.getItem(key))

      if (Array.isArray(data)) {
        customers.push(...data)
      }
    } catch {
      // Bo qua dữ liệu localStorage loi
    }
  })

  return customers
}

// ------ Hàm lấy unique product types ------
export const getUniqueProductTypes = (products = []) => {
  return [
    ...new Set(
      products
        .filter((item) => !item.deleted)
        .map((item) => item.typeName)
        .filter(Boolean)
    ),
  ]
}

// ------ Hàm lấy unique brands ------
export const getUniqueBrands = (products = []) => {
  return [
    ...new Set(
      products
        .filter((item) => !item.deleted)
        .map((item) => item.brand)
        .filter(Boolean)
    ),
  ]
}

// ------ Hàm lấy newest products ------
export const getNewestProducts = (products = [], limit = 5) => {
  return [...products]
    .filter((item) => !item.deleted)
    .sort((a, b) => {

      // ------ Khai báo const date a ------
      const dateA = new Date(a.createdAt || 0)

      // ------ Khai báo const date b ------
      const dateB = new Date(b.createdAt || 0)

      return dateB - dateA
    })
    .slice(0, limit)
}

// ------ Hàm/Component isRefundedProduct ------
const isRefundedProduct = (product) => {


  return (
    product.returnRequest?.status === 'Đã chấp nhận' &&
    product.returnRequest?.refundStatus === 'Đã hoàn tiền'
  )
}

// ------ Hàm lấy delivered valid products ------
export const getDeliveredValidProducts = (orders = []) => {

  // ------ Mảng lưu danh sách valid products ------
  const validProducts = []

  orders.forEach((order) => {
    if (order.status !== 'Đã giao hàng') return

    ;(order.products || []).forEach((product) => {
      if (isRefundedProduct(product)) return

      validProducts.push(product)
    })
  })

  return validProducts
}

// ------ Hàm lấy refunded amount of order ------
export const getRefundedAmountOfOrder = (order) => {
  return (order.products || []).reduce((sum, product) => {
    if (!isRefundedProduct(product)) return sum

    return sum + Number(product.price || 0) * Number(product.cartQuantity || 0)
  }, 0)
}

// ------ Hàm lấy real order value ------
export const getRealOrderValue = (order) => {
  if (order.status !== 'Đã giao hàng') return 0

  return Math.max(
    0,
    Number(order.totalPrice || 0) - getRefundedAmountOfOrder(order)
  )
}

// ------ Hàm lấy order revenue ------
export const getOrderRevenue = (orders = []) => {
  return orders.reduce((total, order) => {
    return total + getRealOrderValue(order)
  }, 0)
}

// ------ Hàm lấy order statistics ------
export const getOrderStatistics = (orders = []) => {

  // ------ Khai báo const delivered orders ------
  const deliveredOrders = orders.filter(
    (order) => order.status === 'Đã giao hàng'
  )

  if (deliveredOrders.length === 0) {
    return {
      averageOrderValue: 0,
      averageProductValue: 0,
      largestOrderValue: 0,
      validProductCount: 0,
    }
  }

  // ------ Khai báo let total revenue ------
  let totalRevenue = 0

  // ------ Khai báo let valid product count ------
  let validProductCount = 0

  // ------ Khai báo let largest order value ------
  let largestOrderValue = 0

  deliveredOrders.forEach((order) => {

    // ------ Khai báo const real order value ------
    const realOrderValue = getRealOrderValue(order)

    totalRevenue += realOrderValue
    largestOrderValue = Math.max(largestOrderValue, realOrderValue)

    ;(order.products || []).forEach((product) => {
      if (isRefundedProduct(product)) return

      validProductCount += Number(product.cartQuantity || 0)
    })
  })

  return {
    /*
      Trung bình theo đơn:
      Tổng doanh thu thực tế / số đơn đã giao
    */
    averageOrderValue:
      deliveredOrders.length === 0
        ? 0
        : Math.round(totalRevenue / deliveredOrders.length),

    /*
      Trung bình theo sản phẩm:
      Tổng doanh thu thực tế / tổng số lượng sản phẩm còn được tính doanh thu
    */
    averageProductValue:
      validProductCount === 0
        ? 0
        : Math.round(totalRevenue / validProductCount),

    /*
      Đơn hàng lớn nhất:
      Lấy giá trị thực tế của đơn sau khi trừ sản phẩm hoàn tiền.
    */
    largestOrderValue,
    validProductCount,
  }
}

/*
  Logic thống kê loại/hãng:

  importQuantity: tổng số lượng đã nhập kho ban đầu / sau khi admin cập nhật kho
  quantity: số lượng còn lại hiện tại

  Đã bán = importQuantity - quantity

  Ví dụ:
  - 2 sản phẩm cùng loại, mỗi sản phẩm nhập 30
  - importQuantity tổng = 60
  - khách mua 1, quantity tổng còn 59
  - đã bán = 60 - 59 = 1
*/

// ------ Hàm lấy product import quantity ------
const getProductImportQuantity = (product) => {
  return Number(
    product.importQuantity ??
      product.initialQuantity ??
      product.quantity ??
      0
  )
}

// ------ Hàm lấy product current quantity ------
const getProductCurrentQuantity = (product) => {
  return Number(product.quantity || 0)
}

// ------ Hàm lấy type statistics ------
export const getTypeStatistics = (products = []) => {

  // ------ Đối tượng cấu hình/dữ liệu stats ------
  const stats = {}

  products
    .filter((item) => !item.deleted)
    .forEach((product) => {

      // ------ Khai báo const type ------
      const type = product.typeName || 'Không rõ'

      if (!stats[type]) {
        stats[type] = {
          type,
          productCount: 0,
          importQuantity: 0,
          currentQuantity: 0,
          soldCount: 0,
        }
      }

      stats[type].productCount += 1
      stats[type].importQuantity += getProductImportQuantity(product)
      stats[type].currentQuantity += getProductCurrentQuantity(product)
    })

  Object.values(stats).forEach((item) => {
    item.soldCount = Math.max(
      0,
      Number(item.importQuantity || 0) - Number(item.currentQuantity || 0)
    )
  })

  return Object.values(stats)
}

// ------ Hàm lấy brand statistics ------
export const getBrandStatistics = (products = []) => {

  // ------ Đối tượng cấu hình/dữ liệu stats ------
  const stats = {}

  products
    .filter((item) => !item.deleted)
    .forEach((product) => {

      // ------ Khai báo const brand ------
      const brand = product.brand || 'Không rõ'

      if (!stats[brand]) {
        stats[brand] = {
          brand,
          productCount: 0,
          importQuantity: 0,
          currentQuantity: 0,
          soldCount: 0,
        }
      }

      stats[brand].productCount += 1
      stats[brand].importQuantity += getProductImportQuantity(product)
      stats[brand].currentQuantity += getProductCurrentQuantity(product)
    })

  Object.values(stats).forEach((item) => {
    item.soldCount = Math.max(
      0,
      Number(item.importQuantity || 0) - Number(item.currentQuantity || 0)
    )
  })

  return Object.values(stats)
}
