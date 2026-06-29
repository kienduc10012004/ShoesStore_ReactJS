// ===== IMPORTS =====

import { useEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

import CartPopup from './components/CartPopup.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

import UserLayout from './layouts/UserLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

import Home from './pages/pages-user/Home.jsx'
import Products from './pages/pages-user/Products.jsx'
import Promotions from './pages/pages-user/Promotions.jsx'
import ProductDetail from './pages/pages-user/ProductDetail.jsx'
import Checkout from './pages/pages-user/Checkout.jsx'
import OrderCheck from './pages/pages-user/OrderCheck.jsx'
import Policy from './pages/pages-user/Policy.jsx'
import PolicyDetail from './pages/pages-user/PolicyDetail.jsx'

import AdminDashboard from './pages/pages-admin/AdminDashboard.jsx'
import ManageProducts from './pages/pages-admin/ManageProducts.jsx'
import ManageOrders from './pages/pages-admin/ManageOrders.jsx'
import OrderDetailAdmin from './pages/pages-admin/OrderDetailAdmin.jsx'
import ManageCustomers from './pages/pages-admin/ManageCustomers.jsx'
import AdminProfile from './pages/pages-admin/AdminProfile.jsx'
import ManageReviews from './pages/pages-admin/ManageReviews.jsx'
import ManageGifts from './pages/pages-admin/ManageGifts.jsx'
import ReviewDetail from './pages/pages-admin/ReviewDetail.jsx'

import Login from './pages/pages-auth/Login.jsx'
import Register from './pages/pages-auth/Register.jsx'
import ForgotPassword from './pages/pages-auth/ForgotPassword.jsx'
import ResetPassword from './pages/pages-auth/ResetPassword.jsx'

import { scrollToTop } from './utils/scrollToTop.js'
import { registerConfirmHandler } from './utils/confirmDialog.js'
import { useProductsQuery } from './hooks/useProductsQuery.js'

import {
  increaseCartItem,
  decreaseCartItem,
  removeCartItem,
  loadCartByUser,
} from './redux/slices/cartSlice.js'

import {
  loadOrdersByUser,
  loadAllOrdersForAdmin,
} from './redux/slices/orderSlice.js'

import BackToTop from "./components/BackToTop.jsx"

// ------ Hàm lấy loại thông báo ------
const getNoticeType = (value) => {
  const text = String(value || '').toLowerCase()

  if (text.includes('thành công') || text.startsWith('đã ')) {
    return 'success'
  }

  if (
    text.includes('không') ||
    text.includes('vui lòng') ||
    text.includes('hết') ||
    text.includes('lỗi')
  ) {
    return 'warning'
  }

  return 'info'
}

// ------ Hàm lấy style thông báo ------
const getNoticeStyle = (type) => {
  if (type === 'success') {
    return {
      icon: 'fa-circle-check',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    }
  }

  if (type === 'warning') {
    return {
      icon: 'fa-circle-exclamation',
      className: 'border-amber-200 bg-amber-50 text-amber-700',
    }
  }

  return {
    icon: 'fa-circle-info',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  }
}

// ------ Hàm/Component RouteChangeHandler ------
const RouteChangeHandler = () => {

  // ------ Lấy thông tin vị trí route hiện tại ------
  const location = useLocation()

  useEffect(() => {
    scrollToTop('auto')
  }, [location.pathname])

  return null
}

// ------ Hàm/Component App ------
function App() {

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ Lay dữ liệu cart từ Redux store ------
  const cart = useSelector((state) => state.cartStore.cart)

  // ------ Lay dữ liệu user từ Redux store ------
  const user = useSelector((state) => state.authStore.user)
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
    isError: isProductError,
    error: productError,
  } = useProductsQuery()

  // ------ Hàm/Component products ------
  const products = useMemo(() => {
    return allProducts.filter((item) => !item.deleted)
  }, [allProducts])

  // ------ State lưu is open cart ------
  const [isOpenCart, setIsOpenCart] = useState(false)

  // ------ State lưu message ------
  const [message, setMessage] = useState('')

  // ------ State lưu thông báo alert ------
  const [alertNotice, setAlertNotice] = useState(null)

  // ------ State lưu hộp xác nhận ------
  const [confirmDialog, setConfirmDialog] = useState(null)

  useEffect(() => {
    if (!user) {
      dispatch(loadCartByUser(null))
      dispatch(loadOrdersByUser(null))
      return
    }

    dispatch(loadCartByUser(user.username))

    if (user.role === 'admin') {
      dispatch(loadAllOrdersForAdmin())
    } else {
      dispatch(loadOrdersByUser(user.username))
    }
  }, [user, dispatch])

  useEffect(() => {
    if (!message) return

    // ------ Hàm/Component timer ------
    const timer = setTimeout(() => {
      setMessage('')
    }, 2500)

    return () => clearTimeout(timer)
  }, [message])

  useEffect(() => {
    const originalAlert = window.alert

    window.alert = (value) => {
      setAlertNotice({
        id: Date.now(),
        message: String(value || ''),
        type: getNoticeType(value),
      })
    }

    return () => {
      window.alert = originalAlert
    }
  }, [])

  useEffect(() => {
    if (!alertNotice) return

    const timer = setTimeout(() => {
      setAlertNotice(null)
    }, 3200)

    return () => clearTimeout(timer)
  }, [alertNotice])

  useEffect(() => {
    return registerConfirmHandler((options = {}) => {
      return new Promise((resolve) => {
        setConfirmDialog({
          title: options.title || 'Xác nhận thao tác',
          message: options.message || 'Bạn có chắc muốn thực hiện thao tác này?',
          confirmText: options.confirmText || 'Xác nhận',
          cancelText: options.cancelText || 'Hủy',
          type: options.type || 'danger',
          resolve,
        })
      })
    })
  }, [])

  // ------ Hàm đóng hộp xác nhận ------
  const closeConfirmDialog = (result) => {
    if (confirmDialog?.resolve) {
      confirmDialog.resolve(result)
    }

    setConfirmDialog(null)
  }

  // ------ Hàm/Component requireLogin ------
  const requireLogin = (callback) => {
    if (!user) {
      setMessage('Hãy đăng nhập để sử dụng tính năng này!')
      return
    }

    callback()
  }

  // ------ Hàm xử lý open cart ------
  const handleOpenCart = () => {
    requireLogin(() => setIsOpenCart(true))
  }

  // ------ Hàm/Component totalQuantity ------
  const totalQuantity = cart.reduce((total, item) => {
    return total + item.cartQuantity
  }, 0)

  // ------ Hằng số style thông báo ------
  const loginNoticeStyle = getNoticeStyle('warning')
  const alertNoticeStyle = getNoticeStyle(alertNotice?.type)

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="bg-slate-50 text-slate-800">
      <RouteChangeHandler />

      {isProductError && (
        <div className="fixed left-1/2 top-5 z-[9999] -translate-x-1/2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg">
          {productError?.message || 'Không thể tải dữ liệu sản phẩm từ MockAPI'}
        </div>
      )}

      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* USER */}
        <Route
          element={
            <UserLayout
              cartCount={totalQuantity}
              totalQuantity={totalQuantity}
              user={user}
              onOpenCart={handleOpenCart}
              onShowLoginMessage={setMessage}
            />
          }
        >
          <Route
            path="/"
            element={
              <Home
                products={products}
                isLoadingProducts={isLoadingProducts}
              />
            }
          />

          <Route
            path="/products"
            element={
              <Products
                products={products}
                isLoadingProducts={isLoadingProducts}
              />
            }
          />

          <Route
            path="/products/:id/:alias"
            element={
              <ProductDetail
                products={products}
                isLoadingProducts={isLoadingProducts}
              />
            }
          />

          <Route
            path="/promotions"
            element={
              <Promotions
                products={products}
                isLoadingProducts={isLoadingProducts}
              />
            }
          />

          <Route path="/policy" element={<Policy />} />
          <Route path="/policy/:type" element={<PolicyDetail />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout cart={cart} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-check"
            element={
              <ProtectedRoute>
                <OrderCheck />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="orders/:id" element={<OrderDetailAdmin />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="reviews/:productId" element={<ReviewDetail />} />
          <Route path="gifts" element={<ManageGifts />} />
        </Route>

        {/* NOT FOUND */}
        <Route
          path="*"
          element={
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
              <div className="rounded-3xl bg-white p-30 text-center shadow-xl">
                <h1 className="text-5xl font-black text-red-500">
                  404
                </h1>
                <p className="mt-3 font-bold text-slate-500">
                  Không tìm thấy trang.
                </p>
              </div>
            </main>
          }
        />
      </Routes>

      <div className="fixed right-4 top-24 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {message && (
          <div
            className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 shadow-xl ${loginNoticeStyle.className}`}
          >
            <div className="flex items-start gap-3">
              <i className={`fa-solid ${loginNoticeStyle.icon} mt-1`}></i>
              <p className="text-sm font-bold leading-6">{message}</p>
            </div>

            <button
              type="button"
              onClick={() => setMessage('')}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/70 font-black hover:bg-white"
              aria-label="Đóng thông báo"
            >
              X
            </button>
          </div>
        )}

        {alertNotice && (
          <div
            className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 shadow-xl ${alertNoticeStyle.className}`}
          >
            <div className="flex items-start gap-3">
              <i className={`fa-solid ${alertNoticeStyle.icon} mt-1`}></i>
              <p className="text-sm font-bold leading-6">
                {alertNotice.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAlertNotice(null)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/70 font-black hover:bg-white"
              aria-label="Đóng thông báo"
            >
              X
            </button>
          </div>
        )}
      </div>

      <CartPopup
        isOpen={isOpenCart}
        cart={cart}
        onClose={() => setIsOpenCart(false)}
        onIncrease={(item) => dispatch(increaseCartItem(item))}
        onDecrease={(item) => dispatch(decreaseCartItem(item))}
        onRemove={(item) => dispatch(removeCartItem(item))}
      />

      {confirmDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  confirmDialog.type === 'danger'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                <i
                  className={`fa-solid ${
                    confirmDialog.type === 'danger'
                      ? 'fa-triangle-exclamation'
                      : 'fa-circle-question'
                  }`}
                ></i>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {confirmDialog.title}
                </h3>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => closeConfirmDialog(false)}
                className="cursor-pointer rounded-xl bg-slate-100 py-3 font-bold text-slate-700 hover:bg-slate-200"
              >
                {confirmDialog.cancelText}
              </button>

              <button
                type="button"
                onClick={() => closeConfirmDialog(true)}
                className={`cursor-pointer rounded-xl py-3 font-bold text-white ${
                  confirmDialog.type === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <BackToTop isHidden={isOpenCart} />
    </div>
  )
}

// ===== EXPORTS =====

export default App
