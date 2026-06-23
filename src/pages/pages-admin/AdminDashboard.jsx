// ===== IMPORTS =====

import { useSelector } from 'react-redux'

import { useProductsQuery } from '../../hooks/useProductsQuery.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

import {
  formatPrice,
  getAllCustomers,
  getNewestProducts,
  getOrderRevenue,
  getUniqueProductTypes,
  getUniqueBrands,
  getOrderStatistics,
  getTypeStatistics,
  getBrandStatistics,
} from '../../utils/adminUtils.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

const SOLD_STATS_KEY = 'kienshoes_sold_stats'

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

const saveSoldStatsToLocalStorage = (soldStats) => {
  localStorage.setItem(SOLD_STATS_KEY, JSON.stringify(soldStats))
}

const createSoldStatsFromOrders = (orders = []) => {
  const soldStats = {}

  orders.forEach((order) => {
    if (order.status !== 'Đã giao hàng') return

    ;(order.products || []).forEach((product) => {
      const productId = String(product.id)
      const quantity = Number(product.cartQuantity || 0)

      if (!productId || quantity <= 0) return

      soldStats[productId] = Number(soldStats[productId] || 0) + quantity

      const returnRequest = product.returnRequest
      const isRefundedReturn =
        returnRequest?.status === 'Đã chấp nhận' &&
        returnRequest?.refundStatus === 'Đã hoàn tiền'

      if (isRefundedReturn) {
        soldStats[productId] = Math.max(
          0,
          Number(soldStats[productId] || 0) - quantity,
        )
      }
    })
  })

  return soldStats
}

const getSyncedSoldStats = (orders = []) => {
  const soldStats = createSoldStatsFromOrders(orders)

  saveSoldStatsToLocalStorage(soldStats)

  return soldStats
}

// ------ Hàm/Component AdminDashboard ------
const AdminDashboard = () => {

  // ------ Lay dữ liệu orders từ Redux store ------
  const orders = useSelector((state) => state.orderStore.orders)


  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError,
    error,
  } = useProductsQuery()

  // ------ Khai báo const active products ------
  const activeProducts = products.filter((item) => !item.deleted)

  // ------ Khai báo const customers ------
  const customers = getAllCustomers()

  // ------ Khai báo const product types ------
  const productTypes = getUniqueProductTypes(activeProducts)

  // ------ Khai báo const brands ------
  const brands = getUniqueBrands(activeProducts)

  // ------ Khai báo const revenue ------
  const revenue = getOrderRevenue(orders)

  // ------ Khai báo const newest products ------
  const newestProducts = getNewestProducts(activeProducts, 5)

  const soldStats = getSyncedSoldStats(orders)

  const getSoldCountByProductId = (productId) => {
    return Number(soldStats[String(productId)] || 0)
  }

  // ------ Khai báo const type stats ------
  const typeStats = getTypeStatistics(activeProducts).map((item) => {
    const soldCount = activeProducts
      .filter((product) => product.typeName === item.type)
      .reduce((total, product) => {
        return total + getSoldCountByProductId(product.id)
      }, 0)

    return {
      ...item,
      soldCount,
    }
  })

  // ------ Khai báo const brand stats ------
  const brandStats = getBrandStatistics(activeProducts).map((item) => {
    const soldCount = activeProducts
      .filter((product) => product.brand === item.brand)
      .reduce((total, product) => {
        return total + getSoldCountByProductId(product.id)
      }, 0)

    return {
      ...item,
      soldCount,
    }
  })

  const {
    averageProductValue,
    largestOrderValue,
    validProductCount,
  } = getOrderStatistics(orders)

  // ------ Khai báo const delivered orders ------
  const deliveredOrders = orders.filter(
    (order) => order.status === 'Đã giao hàng',
  ).length

  // ------ Khai báo const shipping orders ------
  const shippingOrders = orders.filter(
    (order) => order.status === 'Đang giao hàng',
  ).length

  // ------ Khai báo const stats ------
  const stats = [
    {
      title: 'Khách hàng',
      value: customers.length,
      icon: 'fa-solid fa-users',
      color: 'bg-blue-500',
    },
    {
      title: 'Sản phẩm',
      value: activeProducts.length,
      icon: 'fa-solid fa-shoe-prints',
      color: 'bg-orange-500',
    },
    {
      title: 'Loại sản phẩm',
      value: productTypes.length,
      icon: 'fa-solid fa-layer-group',
      color: 'bg-violet-500',
    },
    {
      title: 'Số hãng',
      value: brands.length,
      icon: 'fa-solid fa-tags',
      color: 'bg-pink-500',
    },
  ]

  if (isLoadingProducts) {
    return (
      <LoadingSpinner/>
    )
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 font-bold text-slate-400">
          Tổng quan hệ thống quản lý KienShoes
        </p>
      </div>

      {isError && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error?.message || 'Không thể tải dữ liệu sản phẩm từ MockAPI.'}
        </div>
      )}

      <section className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white ${item.color}`}
            >
              <i className={item.icon}></i>
            </div>

            <p className="text-sm font-bold text-slate-400">
              {item.title}
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {item.value}
            </h2>
          </div>
        ))}
      </section>

      <section className="mt-5">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white">
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>

            <p className="text-sm font-bold text-slate-400">
              Tổng doanh thu
            </p>

            <h2 className="mt-2 text-4xl font-black text-emerald-600">
              {formatPrice(revenue)}
            </h2>

            <p className="mt-3 font-bold text-slate-400">
              Chỉ tính đơn đã giao. Sản phẩm đổi trả đã hoàn tiền sẽ được trừ đúng phần sản phẩm đó.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl bg-blue-50 p-6">
              <p className="text-sm font-bold text-blue-500">
                🧾 Giá trị sản phẩm trung bình
              </p>

              <h3 className="mt-2 text-3xl font-black text-blue-700">
                {formatPrice(averageProductValue)}
              </h3>

              <p className="mt-2 text-sm font-bold text-blue-400">
                Tính trên {validProductCount} sản phẩm đã giao chưa hoàn tiền
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 p-6">
              <p className="text-sm font-bold text-orange-500">
                💰 Đơn hàng lớn nhất
              </p>

              <h3 className="mt-2 text-3xl font-black text-orange-700">
                {formatPrice(largestOrderValue)}
              </h3>

              <p className="mt-2 text-sm font-bold text-orange-400">
                Đã trừ sản phẩm được hoàn tiền nếu có
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-black text-slate-900">
            Sản phẩm vừa thêm
          </h2>

          <div className="mt-5 space-y-4">
            {newestProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-xl bg-white object-contain"
                />

                <div className="flex-1">
                  <h3 className="font-black text-slate-800">
                    {product.name}
                  </h3>

                  <p className="text-sm font-bold text-slate-400">
                    {product.brand} - {product.typeName}
                  </p>
                </div>

                <p className="font-black text-red-500">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}

            {newestProducts.length === 0 && (
              <p className="font-bold text-slate-400">
                Chưa có sản phẩm nào.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Trạng thái đơn hàng
          </h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-500">
                Đang giao hàng
              </p>

              <h3 className="mt-1 text-3xl font-black text-blue-700">
                {shippingOrders}
              </h3>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-500">
                Đã giao hàng
              </p>

              <h3 className="mt-1 text-3xl font-black text-emerald-700">
                {deliveredOrders}
              </h3>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-sm font-bold text-orange-500">
                Tổng đơn hàng
              </p>

              <h3 className="mt-1 text-3xl font-black text-orange-700">
                {orders.length}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">
          Thống kê loại sản phẩm
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b text-sm text-slate-400">
                <th className="py-3 text-left">Loại sản phẩm</th>
                <th className="py-3 text-center">Số sản phẩm</th>
                <th className="py-3 text-center">Đã bán</th>
              </tr>
            </thead>

            <tbody>
              {typeStats.map((item) => (
                <tr key={item.type} className="border-b">
                  <td className="py-3 font-bold">{item.type}</td>
                  <td className="text-center font-bold">
                    {item.productCount}
                  </td>
                  <td className="text-center font-bold text-emerald-600">
                    {item.soldCount}
                  </td>
                </tr>
              ))}

              {typeStats.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-8 text-center font-bold text-slate-400"
                  >
                    Chưa có dữ liệu loại sản phẩm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">
          Thống kê hãng sản phẩm
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b text-sm text-slate-400">
                <th className="py-3 text-left">Hãng</th>
                <th className="py-3 text-center">Số sản phẩm</th>
                <th className="py-3 text-center">Đã bán</th>
              </tr>
            </thead>

            <tbody>
              {brandStats.map((item) => (
                <tr key={item.brand} className="border-b">
                  <td className="py-3 font-bold">{item.brand}</td>
                  <td className="text-center font-bold">
                    {item.productCount}
                  </td>
                  <td className="text-center font-bold text-emerald-600">
                    {item.soldCount}
                  </td>
                </tr>
              ))}

              {brandStats.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-8 text-center font-bold text-slate-400"
                  >
                    Chưa có dữ liệu hãng sản phẩm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

// ===== EXPORTS =====

export default AdminDashboard
