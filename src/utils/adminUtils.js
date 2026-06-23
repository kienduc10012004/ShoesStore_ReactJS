// ===== THIẾT LẬP MODULE =====

// export const formatPrice = (price) => {
//   return Number(price || 0).toLocaleString('vi-VN') + 'd'
// }

// export const getAllCustomers = () => {
//   const users =
//     JSON.parse(localStorage.getItem('kienshoes_users')) || []

//   return users
// }

// export const getOrderRevenue = (orders = []) => {
//   return orders
//     .filter(
//       (order) =>
//         order.status === 'Dang giao hang' ||
//         order.status === 'Da giao hang'
//     )
//     .reduce(
//       (total, order) =>
//         total + Number(order.totalPrice || 0),
//       0
//     )
// }

// export const getUniqueProductTypes = (products = []) => {
//   return [...new Set(products.map((item) => item.typeName))]
// }

// export const getNewestProducts = (
//   products = [],
//   limit = 5
// ) => {
//   return [...products]
//     .sort((a, b) => Number(b.id) - Number(a.id))
//     .slice(0, limit)
// }

// export const getProductStatistics = (
//   products = [],
//   orders = []
// ) => {
//   const deliveredOrders = orders.filter(
//     (order) => order.status === 'Da giao hang'
//   )

//   const productSales = {}
//   const typeSales = {}

//   deliveredOrders.forEach((order) => {
//     const orderProducts =
//       order.products ||
//       order.checkoutItems ||
//       []

//     orderProducts.forEach((product) => {
//       const quantity =
//         Number(product.cartQuantity) || 0

//       productSales[product.id] =
//         (productSales[product.id] || 0) +
//         quantity

//       const type =
//         product.typeName ||
//         product.type ||
//         'Khac'

//       typeSales[type] =
//         (typeSales[type] || 0) +
//         quantity
//     })
//   })

//   const bestProductId = Object.keys(
//     productSales
//   ).sort(
//     (a, b) =>
//       productSales[b] - productSales[a]
//   )[0]

//   const bestProduct = products.find(
//     (item) =>
//       String(item.id) ===
//       String(bestProductId)
//   )

//   const typeStats = [
//     ...new Set(
//       products.map((item) => item.typeName)
//     ),
//   ].map((type) => ({
//     type,
//     productCount: products.filter(
//       (item) => item.typeName === type
//     ).length,
//     soldCount: typeSales[type] || 0,
//   }))

//   const bestType = [...typeStats].sort(
//     (a, b) => b.soldCount - a.soldCount
//   )[0]

//   const worstType = [...typeStats].sort(
//     (a, b) => a.soldCount - b.soldCount
//   )[0]

//   return {
//     bestProduct,
//     bestProductSold:
//       productSales[bestProduct?.id] || 0,
//     bestType,
//     worstType,
//     typeStats,
//   }
// }

// export const getBrandStatistics = (
//   products = [],
//   orders = []
// ) => {
//   const deliveredOrders = orders.filter(
//     (order) => order.status === 'Da giao hang'
//   )

//   const brandSales = {}

//   deliveredOrders.forEach((order) => {
//     const orderProducts =
//       order.products ||
//       order.checkoutItems ||
//       []

//     orderProducts.forEach((product) => {
//       const quantity =
//         Number(product.cartQuantity) || 0

//       const brand =
//         product.brand ||
//         'Khong xac dinh'

//       brandSales[brand] =
//         (brandSales[brand] || 0) +
//         quantity
//     })
//   })

//   const brandStats = [
//     ...new Set(products.map((p) => p.brand)),
//   ].map((brand) => ({
//     brand,
//     productCount: products.filter(
//       (item) => item.brand === brand
//     ).length,
//     soldCount: brandSales[brand] || 0,
//   }))

//   const bestBrand = [...brandStats].sort(
//     (a, b) => b.soldCount - a.soldCount
//   )[0]

//   const worstBrand = [...brandStats].sort(
//     (a, b) => a.soldCount - b.soldCount
//   )[0]

//   return {
//     brandStats,
//     bestBrand,
//     worstBrand,
//   }
// }

// export const saveCustomerIfNotExist = (user) => {
//   if (!user || user.role === 'admin') return

//   const users =
//     JSON.parse(localStorage.getItem('kienshoes_users')) || []

//   const existed = users.find(
//     (item) => item.username === user.username
//   )

//   if (existed) return

//   const newUsers = [
//     ...users,
//     {
//       ...user,
//       createdAt: new Date().toLocaleString('vi-VN'),
//       status: 'Hoat dong',
//     },
//   ]

//   localStorage.setItem(
//     'kienshoes_users',
//     JSON.stringify(newUsers)
//   )
// }


// export const getOrderStatistics = (orders) => {
//   const deliveredOrders = orders.filter(
//     (order) => order.status === 'Da giao hang'
//   )

//   if (deliveredOrders.length === 0) {
//     return {
//       averageOrderValue: 0,
//       largestOrderValue: 0,
//     }
//   }

//   const totalRevenue = deliveredOrders.reduce(
//     (sum, order) => sum + Number(order.totalPrice || 0),
//     0
//   )

//   const averageOrderValue =
//     totalRevenue / deliveredOrders.length

//   const largestOrderValue = Math.max(
//     ...deliveredOrders.map((order) =>
//       Number(order.totalPrice || 0)
//     )
//   )

//   return {
//     averageOrderValue,
//     largestOrderValue,
//   }
// }


//88888888888888888888888

// export const formatPrice = (price) => {
//   return Number(price || 0).toLocaleString('vi-VN') + 'd'
// }

// export const getAllCustomers = () => {
//   const customers = []

//   Object.keys(localStorage).forEach((key) => {
//     if (!key.startsWith('kienshoes_users')) return

//     try {
//       const data = JSON.parse(localStorage.getItem(key))

//       if (Array.isArray(data)) {
//         customers.push(...data)
//       }
//     } catch {
//       // ignore
//     }
//   })

//   return customers
// }

// export const getUniqueProductTypes = (products = []) => {
//   return [
//     ...new Set(
//       products
//         .filter((item) => !item.deleted)
//         .map((item) => item.typeName)
//         .filter(Boolean)
//     ),
//   ]
// }

// export const getUniqueBrands = (products = []) => {
//   return [
//     ...new Set(
//       products
//         .filter((item) => !item.deleted)
//         .map((item) => item.brand)
//         .filter(Boolean)
//     ),
//   ]
// }

// export const getNewestProducts = (products = [], limit = 5) => {
//   return [...products]
//     .filter((item) => !item.deleted)
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, limit)
// }

// export const isValidRevenueOrder = (order) => {
//   if (order.status !== 'Da giao hang') return false

//   const hasAcceptedRefundedReturn = order.products?.some((item) => {
//     return (
//       item.returnRequest?.status === 'Da chap nhan' &&
//       item.returnRequest?.refundStatus === 'Da hoan tien'
//     )
//   })

//   return !hasAcceptedRefundedReturn
// }

// export const getOrderRevenue = (orders = []) => {
//   return orders.reduce((total, order) => {
//     if (order.status !== 'Da giao hang') return total

//     const refundedAmount = (order.products || []).reduce((sum, item) => {
//       const isRefunded =
//         item.returnRequest?.status === 'Da chap nhan' &&
//         item.returnRequest?.refundStatus === 'Da hoan tien'

//       if (!isRefunded) return sum

//       return sum + Number(item.price || 0) * Number(item.cartQuantity || 0)
//     }, 0)

//     return total + Math.max(0, Number(order.totalPrice || 0) - refundedAmount)
//   }, 0)
// }

// export const getOrderStatistics = (orders = []) => {
//   const validOrders = orders.filter(isValidRevenueOrder)

//   if (validOrders.length === 0) {
//     return {
//       averageOrderValue: 0,
//       largestOrderValue: 0,
//     }
//   }

//   const total = validOrders.reduce(
//     (sum, order) => sum + Number(order.totalPrice || 0),
//     0
//   )

//   return {
//     averageOrderValue: Math.round(total / validOrders.length),
//     largestOrderValue: Math.max(
//       ...validOrders.map((order) => Number(order.totalPrice || 0))
//     ),
//   }
// }

// export const getSoldCountByProductId = (orders = [], productId) => {
//   return orders.reduce((total, order) => {
//     if (order.status !== 'Da giao hang') return total

//     return (
//       total +
//       (order.products || []).reduce((sum, item) => {
//         if (String(item.id) !== String(productId)) return sum

//         const isRefunded =
//           item.returnRequest?.status === 'Da chap nhan' &&
//           item.returnRequest?.refundStatus === 'Da hoan tien'

//         if (isRefunded) return sum

//         return sum + Number(item.cartQuantity || 0)
//       }, 0)
//     )
//   }, 0)
// }

// export const getTypeStatistics = (products = [], orders = []) => {
//   const stats = {}

//   products
//     .filter((item) => !item.deleted)
//     .forEach((product) => {
//       const type = product.typeName || 'Khong ro'

//       if (!stats[type]) {
//         stats[type] = {
//           type,
//           productCount: 0,
//           soldCount: 0,
//         }
//       }

//       stats[type].productCount += 1
//       stats[type].soldCount += getSoldCountByProductId(orders, product.id)
//     })

//   return Object.values(stats)
// }

// export const getBrandStatistics = (products = [], orders = []) => {
//   const stats = {}

//   products
//     .filter((item) => !item.deleted)
//     .forEach((product) => {
//       const brand = product.brand || 'Khong ro'

//       if (!stats[brand]) {
//         stats[brand] = {
//           brand,
//           productCount: 0,
//           soldCount: 0,
//         }
//       }

//       stats[brand].productCount += 1
//       stats[brand].soldCount += getSoldCountByProductId(orders, product.id)
//     })

//   return Object.values(stats)
// }



//888888

// export const formatPrice = (price) => {
//   return Number(price || 0).toLocaleString('vi-VN') + 'd'
// }

// export const getAllCustomers = () => {
//   const customers = []

//   Object.keys(localStorage).forEach((key) => {
//     if (!key.startsWith('kienshoes_users')) return

//     try {
//       const data = JSON.parse(localStorage.getItem(key))

//       if (Array.isArray(data)) {
//         customers.push(...data)
//       }
//     } catch {
//       // ignore invalid localStorage data
//     }
//   })

//   return customers
// }

// export const getUniqueProductTypes = (products = []) => {
//   return [
//     ...new Set(
//       products
//         .filter((item) => !item.deleted)
//         .map((item) => item.typeName)
//         .filter(Boolean)
//     ),
//   ]
// }

// export const getUniqueBrands = (products = []) => {
//   return [
//     ...new Set(
//       products
//         .filter((item) => !item.deleted)
//         .map((item) => item.brand)
//         .filter(Boolean)
//     ),
//   ]
// }

// export const getNewestProducts = (products = [], limit = 5) => {
//   return [...products]
//     .filter((item) => !item.deleted)
//     .sort((a, b) => {
//       const dateA = new Date(a.createdAt || 0)
//       const dateB = new Date(b.createdAt || 0)

//       return dateB - dateA
//     })
//     .slice(0, limit)
// }

// export const isValidRevenueOrder = (order) => {
//   if (order.status !== 'Da giao hang') return false

//   const hasAcceptedRefundedReturn = order.products?.some((item) => {
//     return (
//       item.returnRequest?.status === 'Da chap nhan' &&
//       item.returnRequest?.refundStatus === 'Da hoan tien'
//     )
//   })

//   return !hasAcceptedRefundedReturn
// }

// export const getOrderRevenue = (orders = []) => {
//   return orders.reduce((total, order) => {
//     if (order.status !== 'Da giao hang') return total

//     const refundedAmount = (order.products || []).reduce((sum, item) => {
//       const isRefunded =
//         item.returnRequest?.status === 'Da chap nhan' &&
//         item.returnRequest?.refundStatus === 'Da hoan tien'

//       if (!isRefunded) return sum

//       return sum + Number(item.price || 0) * Number(item.cartQuantity || 0)
//     }, 0)

//     return total + Math.max(0, Number(order.totalPrice || 0) - refundedAmount)
//   }, 0)
// }

// export const getOrderStatistics = (orders = []) => {
//   const validOrders = orders.filter(isValidRevenueOrder)

//   if (validOrders.length === 0) {
//     return {
//       averageOrderValue: 0,
//       largestOrderValue: 0,
//     }
//   }

//   const total = validOrders.reduce(
//     (sum, order) => sum + Number(order.totalPrice || 0),
//     0
//   )

//   return {
//     averageOrderValue: Math.round(total / validOrders.length),
//     largestOrderValue: Math.max(
//       ...validOrders.map((order) => Number(order.totalPrice || 0))
//     ),
//   }
// }

// export const getTypeStatistics = (products = []) => {
//   const stats = {}

//   products
//     .filter((item) => !item.deleted)
//     .forEach((product) => {
//       const type = product.typeName || 'Khong ro'

//       if (!stats[type]) {
//         stats[type] = {
//           type,
//           productCount: 0,
//           soldCount: 0,
//           quantityCount: 0,
//         }
//       }

//       stats[type].productCount += 1
//       stats[type].soldCount += Number(product.sold || 0)
//       stats[type].quantityCount += Number(product.quantity || 0)
//     })

//   return Object.values(stats)
// }

// export const getBrandStatistics = (products = []) => {
//   const stats = {}

//   products
//     .filter((item) => !item.deleted)
//     .forEach((product) => {
//       const brand = product.brand || 'Khong ro'

//       if (!stats[brand]) {
//         stats[brand] = {
//           brand,
//           productCount: 0,
//           soldCount: 0,
//           quantityCount: 0,
//         }
//       }

//       stats[brand].productCount += 1
//       stats[brand].soldCount += Number(product.sold || 0)
//       stats[brand].quantityCount += Number(product.quantity || 0)
//     })

//   return Object.values(stats)
// }


//88888

// export const formatPrice = (price) => {
//   return Number(price || 0).toLocaleString('vi-VN') + 'd'
// }

// export const getAllCustomers = () => {
//   const customers = []

//   Object.keys(localStorage).forEach((key) => {
//     if (!key.startsWith('kienshoes_users')) return

//     try {
//       const data = JSON.parse(localStorage.getItem(key))

//       if (Array.isArray(data)) {
//         customers.push(...data)
//       }
//     } catch {
//       // Bo qua dữ liệu localStorage loi
//     }
//   })

//   return customers
// }

// export const getUniqueProductTypes = (products = []) => {
//   return [
//     ...new Set(
//       products
//         .filter((item) => !item.deleted)
//         .map((item) => item.typeName)
//         .filter(Boolean)
//     ),
//   ]
// }

// export const getUniqueBrands = (products = []) => {
//   return [
//     ...new Set(
//       products
//         .filter((item) => !item.deleted)
//         .map((item) => item.brand)
//         .filter(Boolean)
//     ),
//   ]
// }

// export const getNewestProducts = (products = [], limit = 5) => {
//   return [...products]
//     .filter((item) => !item.deleted)
//     .sort((a, b) => {
//       const dateA = new Date(a.createdAt || 0)
//       const dateB = new Date(b.createdAt || 0)

//       return dateB - dateA
//     })
//     .slice(0, limit)
// }

// export const isValidRevenueOrder = (order) => {
//   if (order.status !== 'Da giao hang') return false

//   const hasAcceptedRefundedReturn = order.products?.some((item) => {
//     return (
//       item.returnRequest?.status === 'Da chap nhan' &&
//       item.returnRequest?.refundStatus === 'Da hoan tien'
//     )
//   })

//   return !hasAcceptedRefundedReturn
// }

// export const getOrderRevenue = (orders = []) => {
//   return orders.reduce((total, order) => {
//     if (order.status !== 'Da giao hang') return total

//     const refundedAmount = (order.products || []).reduce((sum, item) => {
//       const isRefunded =
//         item.returnRequest?.status === 'Da chap nhan' &&
//         item.returnRequest?.refundStatus === 'Da hoan tien'

//       if (!isRefunded) return sum

//       return sum + Number(item.price || 0) * Number(item.cartQuantity || 0)
//     }, 0)

//     return total + Math.max(0, Number(order.totalPrice || 0) - refundedAmount)
//   }, 0)
// }

// export const getOrderStatistics = (orders = []) => {
//   const validOrders = orders.filter(isValidRevenueOrder)

//   if (validOrders.length === 0) {
//     return {
//       averageOrderValue: 0,
//       largestOrderValue: 0,
//     }
//   }

//   const total = validOrders.reduce(
//     (sum, order) => sum + Number(order.totalPrice || 0),
//     0
//   )

//   return {
//     averageOrderValue: Math.round(total / validOrders.length),
//     largestOrderValue: Math.max(
//       ...validOrders.map((order) => Number(order.totalPrice || 0))
//     ),
//   }
// }

// /*
//   Logic thong ke moi:

//   importQuantity: tong so luong da nhap kho ban dau / sau khi admin cap nhat kho
//   quantity: so luong con lai hien tai

//   Da ban = importQuantity - quantity

//   Vi du:
//   - 2 san pham cung loai, moi san pham nhap 30
//   - importQuantity tong = 60
//   - khach mua 1, quantity tong con 59
//   - da ban = 60 - 59 = 1
// */

// const getProductImportQuantity = (product) => {
//   return Number(product.importQuantity ?? product.initialQuantity ?? product.quantity ?? 0)
// }

// const getProductCurrentQuantity = (product) => {
//   return Number(product.quantity || 0)
// }

// export const getTypeStatistics = (products = []) => {
//   const stats = {}

//   products
//     .filter((item) => !item.deleted)
//     .forEach((product) => {
//       const type = product.typeName || 'Khong ro'

//       if (!stats[type]) {
//         stats[type] = {
//           type,
//           productCount: 0,
//           importQuantity: 0,
//           currentQuantity: 0,
//           soldCount: 0,
//         }
//       }

//       stats[type].productCount += 1
//       stats[type].importQuantity += getProductImportQuantity(product)
//       stats[type].currentQuantity += getProductCurrentQuantity(product)
//     })

//   Object.values(stats).forEach((item) => {
//     item.soldCount = Math.max(
//       0,
//       Number(item.importQuantity || 0) - Number(item.currentQuantity || 0)
//     )
//   })

//   return Object.values(stats)
// }

// export const getBrandStatistics = (products = []) => {
//   const stats = {}

//   products
//     .filter((item) => !item.deleted)
//     .forEach((product) => {
//       const brand = product.brand || 'Khong ro'

//       if (!stats[brand]) {
//         stats[brand] = {
//           brand,
//           productCount: 0,
//           importQuantity: 0,
//           currentQuantity: 0,
//           soldCount: 0,
//         }
//       }

//       stats[brand].productCount += 1
//       stats[brand].importQuantity += getProductImportQuantity(product)
//       stats[brand].currentQuantity += getProductCurrentQuantity(product)
//     })

//   Object.values(stats).forEach((item) => {
//     item.soldCount = Math.max(
//       0,
//       Number(item.importQuantity || 0) - Number(item.currentQuantity || 0)
//     )
//   })

//   return Object.values(stats)
// }


//88888

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
