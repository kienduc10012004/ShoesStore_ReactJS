// ===== IMPORTS =====

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteOrder,
  updateOrderStatus,
  updateProductReturnRequest,
} from '../../redux/slices/orderSlice.js'
import { useProductsQuery } from '../../hooks/useProductsQuery.js'
import { useProductMutations } from '../../hooks/useProductMutations.js'
import { formatPrice } from '../../utils/adminUtils.js'
import { showConfirm } from '../../utils/confirmDialog.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const status list ------
const statusList = [
  'Đang xử lý',
  'Đang giao hàng',
  'Đã giao hàng',
  'Đã bị hủy',
]

// ------ Khai báo const admin cancel reason list ------
const adminCancelReasonList = [
  'Không gửi được đơn vị vận chuyển',
  'Sự cố về sản phẩm',
  'Lý do khác',
]

// ------ Hàm tạo product key ------
const createProductKey = (item) => {
  return `${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`
}

// ------ Hàm/Component ManageOrders ------
const ManageOrders = () => {

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ Lay dữ liệu orders từ Redux store ------
  const orders = useSelector((state) => state.orderStore.orders)

  const {
    data: products = [],
    isLoading: isLoadingProducts,
  } = useProductsQuery()

  // ------ Khai báo const nhóm giá trị ------
  const { updateProductMutation } = useProductMutations()

  // ------ Khai báo const is updating stock ------
  const isUpdatingStock = updateProductMutation.isPending

  // ------ State lưu search text ------
  const [searchText, setSearchText] = useState('')

  // ------ State lưu keyword ------
  const [keyword, setKeyword] = useState('')

  // ------ State lưu status filter ------
  const [statusFilter, setStatusFilter] = useState('ALL')

  // ------ State lưu thông báo export ------
  const [exportNotice, setExportNotice] = useState(null)

  // ------ State lưu cancel modal ------
  const [cancelModal, setCancelModal] = useState({
    open: false,
    order: null,
    reason: '',
    customReason: '',
  })

  // ------ State lưu return modal ------
  const [returnModal, setReturnModal] = useState({
    open: false,
    order: null,
    product: null,
    decision: '',
    rejectReason: '',
    adminNote: '',
    refundStatus: 'Chưa hoàn tiền',
  })

  // ------ State lưu preview modal ------
  const [previewModal, setPreviewModal] = useState({
    open: false,
    files: [],
    index: 0,
  })

  // ------ Hàm/Component filteredOrders ------
  const filteredOrders = useMemo(() => {

    // ------ Khai báo let result ------
    let result = [...orders]

    if (keyword.trim()) {

      // ------ Khai báo const value ------
      const value = keyword.toLowerCase().trim()

      result = result.filter((order) => {
        return (
          order.orderCode?.toLowerCase().includes(value) ||
          order.customer?.username?.toLowerCase().includes(value) ||
          order.customer?.fullName?.toLowerCase().includes(value) ||
          order.customer?.phone?.includes(value) ||
          order.customer?.email?.toLowerCase().includes(value)
        )
      })
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((order) => order.status === statusFilter)
    }

    return result
  }, [orders, keyword, statusFilter])

  // ------ Hàm/Component returnItems ------
  const returnItems = useMemo(() => {

    // ------ Mảng lưu danh sách result ------
    const result = []

    filteredOrders.forEach((order) => {
      ;(order.products || []).forEach((product) => {
        if (product.returnRequest) {
          result.push({
            order,
            product,
            productKey: createProductKey(product),
          })
        }
      })
    })

    return result
  }, [filteredOrders])

  // ------ Hàm/Component isFinalStatus ------
  const isFinalStatus = (status) => {
    return status === 'Đã giao hàng' || status === 'Đã bị hủy'
  }

  // ------ Hàm/Component canDeleteOrder ------
  const canDeleteOrder = (order) => {
    return order.status === 'Đã giao hàng' || order.status === 'Đã bị hủy'
  }

  // ------ Hàm xử lý search ------
  const handleSearch = () => {
    setKeyword(searchText)
  }

  // ------ Hàm xử lý clear search ------
  const handleClearSearch = () => {
    setSearchText('')
    setKeyword('')
    setStatusFilter('ALL')
  }

  // ------ Hàm lấy payment method text ------
  const getPaymentMethodText = (paymentMethod) => {
    return paymentMethod === 'bank' ? 'Ngân hàng/Momo' : 'Tiền mặt'
  }

  // ------ Hàm lấy receive method text ------
  const getReceiveMethodText = (receiveMethod) => {
    return receiveMethod === 'store' ? 'Nhận tại cửa hàng' : 'Giao hàng tận nơi'
  }

  // ------ Hàm lấy delivery address text ------
  const getDeliveryAddressText = (order) => {
    if (order.receiveMethod === 'store') {
      return order.deliveryInfo?.store || 'Chưa có'
    }

    return [
      order.deliveryInfo?.address,
      order.deliveryInfo?.district,
      order.deliveryInfo?.province,
    ]
      .filter(Boolean)
      .join(', ') || 'Chưa có'
  }

  // ------ Hàm lấy products text ------
  const getProductsText = (order) => {
    return (order.products || [])
      .map((item, index) => {

        // ------ Khai báo const color name ------
        const colorName = item.selectedColor?.name || 'Mặc định'

        // ------ Khai báo const quantity ------
        const quantity = Number(item.cartQuantity || 0)

        // ------ Khai báo const price ------
        const price = Number(item.price || 0)

        // ------ Khai báo const total ------
        const total = price * quantity

        return `${index + 1}. ${item.name} | Size: ${item.selectedSize || 'Không có'} | Màu: ${colorName} | SL: ${quantity} | Đơn giá: ${price} | Thành tiền: ${total}`
      })
      .join('\n')
  }

  // ------ Hàm lấy return text ------
  const getReturnText = (order) => {

    // ------ Mảng lưu danh sách return products ------
    const returnProducts = (order.products || []).filter((item) => item.returnRequest)

    if (returnProducts.length === 0) return 'Không có'

    return returnProducts
      .map((item, index) => {

        // ------ Khai báo const request ------
        const request = item.returnRequest

        return `${index + 1}. ${item.name} | Lý do: ${request.reason || 'Không có'} | Trạng thái: ${request.status || 'Chờ duyệt'} | Hoàn tiền: ${request.refundStatus || 'Chưa hoàn tiền'}`
      })
      .join('\n')
  }

  // ------ Hàm hiển thị thông báo export ------
  const showExportNotice = (type, message) => {
    setExportNotice({ type, message })
  }

  useEffect(() => {
    if (!exportNotice) return

    const timer = setTimeout(() => {
      setExportNotice(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [exportNotice])

  // ------ Hàm xử lý export excel ------
  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      showExportNotice('warning', 'Không có đơn hàng nào để xuất Excel.')
      return
    }

    // ------ Hàm/Component exportData ------
    const exportData = filteredOrders.map((order, index) => {

      // ------ Hàm/Component productQuantity ------
      const productQuantity = (order.products || []).reduce((total, item) => {
        return total + Number(item.cartQuantity || 0)
      }, 0)

      return {
        STT: index + 1,
        'Mã đơn': order.orderCode || `KS${order.id}`,
        'Khách hàng': order.customer?.fullName || '',
        'Tên đăng nhập': order.customer?.username || order.ownerUsername || '',
        'Số điện thoại': order.customer?.phone || '',
        Email: order.customer?.email || '',
        'Ngày đặt': order.createdAt || '',
        'Trạng thái đơn': order.status || '',
        'Trạng thái kho': order.stockStatus || 'Chưa trừ kho',
        'Phương thức nhận hàng': getReceiveMethodText(order.receiveMethod),
        'Địa chỉ / cửa hàng': getDeliveryAddressText(order),
        'Phương thức thanh toán': getPaymentMethodText(order.paymentMethod),
        'Ghi chú khách hàng': order.customerNote || order.note || '',
        'Tổng số sản phẩm': productQuantity,
        'Tổng tiền': Number(order.totalPrice || 0),
        'Quà tặng': order.selectedGift?.name || order.gift?.name || 'Không có',
        'Sản phẩm trong đơn': getProductsText(order),
        'Đổi trả': getReturnText(order),
        'Hủy bởi': order.cancelBy || '',
        'Lý do hủy': order.cancelReason || '',
        'Thời gian hủy': order.cancelAtText || '',
      }
    })

    // ------ Khai báo const worksheet ------
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 24 },
      { wch: 18 },
      { wch: 16 },
      { wch: 26 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 22 },
      { wch: 36 },
      { wch: 22 },
      { wch: 35 },
      { wch: 16 },
      { wch: 16 },
      { wch: 24 },
      { wch: 70 },
      { wch: 60 },
      { wch: 16 },
      { wch: 32 },
      { wch: 22 },
    ]

    // ------ Khai báo const workbook ------
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachDonHang')

    // ------ Khai báo const date text ------
    const dateText = new Date()
      .toISOString()
      .slice(0, 10)

    XLSX.writeFile(workbook, `HiKushoes-don-hang-${dateText}.xlsx`)
    showExportNotice(
      'success',
      `Đã xuất ${filteredOrders.length} đơn hàng ra file Excel.`
    )
  }

  // ------ Hàm/Component findProductInMockAPI ------
  const findProductInMockAPI = (cartItem) => {
    return products.find((product) => {
      return String(product.id) === String(cartItem.id)
    })
  }

  // ------ Hàm/Component decreaseStockByOrderProducts ------
  const decreaseStockByOrderProducts = async (orderProducts = []) => {
    for (const orderProduct of orderProducts) {

      // ------ Khai báo const product ------
      const product = findProductInMockAPI(orderProduct)

      if (!product) {
        throw new Error(`Không tìm thấy sản phẩm "${orderProduct.name}" trên MockAPI`)
      }

      // ------ Khai báo const current quantity ------
      const currentQuantity = Number(product.quantity || 0)

      // ------ Khai báo const decrease quantity ------
      const decreaseQuantity = Number(orderProduct.cartQuantity || 0)

      if (currentQuantity < decreaseQuantity) {
        throw new Error(
          `Sản phẩm "${orderProduct.name}" chỉ còn ${currentQuantity} sản phẩm trong kho`
        )
      }

      await updateProductMutation.mutateAsync({
        ...product,
        quantity: Math.max(0, currentQuantity - decreaseQuantity),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  // ------ Hàm/Component increaseStockByOrderProducts ------
  const increaseStockByOrderProducts = async (orderProducts = []) => {
    for (const orderProduct of orderProducts) {

      // ------ Khai báo const product ------
      const product = findProductInMockAPI(orderProduct)

      if (!product) {
        throw new Error(`Không tìm thấy sản phẩm "${orderProduct.name}" trên MockAPI`)
      }

      // ------ Khai báo const current quantity ------
      const currentQuantity = Number(product.quantity || 0)

      // ------ Khai báo const increase quantity ------
      const increaseQuantity = Number(orderProduct.cartQuantity || 0)

      await updateProductMutation.mutateAsync({
        ...product,
        quantity: currentQuantity + increaseQuantity,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  // ------ Hàm mở cancel modal ------
  const openCancelModal = (order) => {
    setCancelModal({
      open: true,
      order,
      reason: '',
      customReason: '',
    })
  }

  // ------ Hàm đóng cancel modal ------
  const closeCancelModal = () => {
    setCancelModal({
      open: false,
      order: null,
      reason: '',
      customReason: '',
    })
  }

  // ------ Hàm xử lý change status ------
  const handleChangeStatus = async (order, status) => {
    if (isFinalStatus(order.status)) return

    if (isLoadingProducts) {
      alert('Dữ liệu sản phẩm đang tải, vui lòng thử lại sau.')
      return
    }

    if (status === 'Đã bị hủy') {
      openCancelModal(order)
      return
    }

    // ------ Khai báo const old status ------
    const oldStatus = order.status

    // ------ Khai báo const was stock decreased ------
    const wasStockDecreased = order.stockStatus === 'Đã trừ kho'

    // ------ Khai báo const need decrease stock ------
    const needDecreaseStock =
      (status === 'Đang giao hàng' || status === 'Đã giao hàng') &&
      !wasStockDecreased

    // ------ Khai báo const need increase stock ------
    const needIncreaseStock =
      oldStatus === 'Đang giao hàng' &&
      status === 'Đang xử lý' &&
      wasStockDecreased

    try {
      if (needDecreaseStock) {
        await decreaseStockByOrderProducts(order.products)

        dispatch(
          updateOrderStatus({
            id: order.id,
            status,
            stockStatus: 'Đã trừ kho',
          })
        )

        return
      }

      if (needIncreaseStock) {
        await increaseStockByOrderProducts(order.products)

        dispatch(
          updateOrderStatus({
            id: order.id,
            status,
            stockStatus: 'Đã cộng lại kho',
          })
        )

        return
      }

      dispatch(
        updateOrderStatus({
          id: order.id,
          status,
        })
      )
    } catch (error) {
      alert(error?.message || 'Không thể cập nhật trạng thái đơn hàng')
    }
  }

  // ------ Hàm xử lý confirm cancel ------
  const handleConfirmCancel = async () => {
    if (!cancelModal.reason) {
      alert('Vui lòng chọn lý do hủy đơn')
      return
    }

    if (cancelModal.reason === 'Lý do khác' && !cancelModal.customReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn')
      return
    }

    // ------ Khai báo const cancel reason ------
    const cancelReason =
      cancelModal.reason === 'Lý do khác'
        ? cancelModal.customReason.trim()
        : cancelModal.reason

    // ------ Khai báo const should increase stock ------
    const shouldIncreaseStock =
      cancelModal.order?.stockStatus === 'Đã trừ kho'

    try {
      if (isLoadingProducts) {
        alert('Dữ liệu sản phẩm đang tải, vui lòng thử lại sau.')
        return
      }

      if (shouldIncreaseStock) {
        await increaseStockByOrderProducts(cancelModal.order.products)
      }

      dispatch(
        updateOrderStatus({
          id: cancelModal.order.id,
          status: 'Đã bị hủy',
          cancelReason,
          cancelBy: 'Admin',
          stockStatus: shouldIncreaseStock
            ? 'Đã cộng lại kho'
            : cancelModal.order?.stockStatus || 'Chưa trừ kho',
        })
      )

      closeCancelModal()
      alert(
        shouldIncreaseStock
          ? 'Đã hủy đơn hàng và cộng lại tồn kho'
          : 'Đã hủy đơn hàng'
      )
    } catch (error) {
      alert(error?.message || 'Không thể hủy đơn hàng')
    }
  }

  // ------ Hàm xử lý delete order ------
  const handleDeleteOrder = async (order) => {
    if (!canDeleteOrder(order)) {
      alert('Chỉ được xóa đơn hàng đã giao hoặc đã bị hủy')
      return
    }

    const confirmDelete = await showConfirm({
      title: 'Xóa đơn hàng?',
      message: `Bạn có chắc muốn xóa đơn ${order.orderCode || `KS${order.id}`}?`,
      confirmText: 'Xóa',
    })

    if (!confirmDelete) return

    dispatch(deleteOrder(order.id))
  }

  // ------ Hàm mở return modal ------
  const openReturnModal = (order, product) => {

    // ------ Khai báo const request ------
    const request = product.returnRequest

    setReturnModal({
      open: true,
      order,
      product,
      decision: request?.status || 'Chờ duyệt',
      rejectReason: request?.rejectReason || '',
      adminNote: request?.adminNote || '',
      refundStatus: request?.refundStatus || 'Chưa hoàn tiền',
    })
  }

  // ------ Hàm đóng return modal ------
  const closeReturnModal = () => {
    setReturnModal({
      open: false,
      order: null,
      product: null,
      decision: '',
      rejectReason: '',
      adminNote: '',
      refundStatus: 'Chưa hoàn tiền',
    })
  }

  // ------ Hàm mở preview modal ------
  const openPreviewModal = (files, index) => {
    setPreviewModal({
      open: true,
      files,
      index,
    })
  }

  // ------ Hàm đóng preview modal ------
  const closePreviewModal = () => {
    setPreviewModal({
      open: false,
      files: [],
      index: 0,
    })
  }

  // ------ Hàm xử lý prev preview file ------
  const handlePrevPreviewFile = () => {
    setPreviewModal((prev) => {
      if (prev.files.length === 0) return prev

      return {
        ...prev,
        index: prev.index <= 0 ? prev.files.length - 1 : prev.index - 1,
      }
    })
  }

  // ------ Hàm xử lý next preview file ------
  const handleNextPreviewFile = () => {
    setPreviewModal((prev) => {
      if (prev.files.length === 0) return prev

      return {
        ...prev,
        index: prev.index >= prev.files.length - 1 ? 0 : prev.index + 1,
      }
    })
  }

  // ------ Hàm/Component shouldReturnStock ------
  const shouldReturnStock = () => {
    return (
      returnModal.decision === 'Đã chấp nhận' &&
      returnModal.refundStatus === 'Đã hoàn tiền' &&
      !returnModal.product?.returnRequest?.stockReturned
    )
  }

  // ------ Hàm xử lý update return request ------
  const handleUpdateReturnRequest = async () => {

    // ------ Khai báo const current status ------
    const currentStatus = returnModal.product?.returnRequest?.status

    // ------ Khai báo const saved refund status ------
    const savedRefundStatus =
      returnModal.product?.returnRequest?.refundStatus || 'Chưa hoàn tiền'

    if (currentStatus !== 'Chờ duyệt' && returnModal.decision !== currentStatus) {
      alert('Trạng thái đổi trả đã xử lý thì không được cập nhật lại')
      return
    }

    if (
      currentStatus === 'Đã chấp nhận' &&
      savedRefundStatus === 'Đã hoàn tiền' &&
      returnModal.refundStatus !== 'Đã hoàn tiền'
    ) {
      alert('Yêu cầu đã hoàn tiền thì không được chuyển lại thành chưa hoàn tiền')
      return
    }

    if (
      currentStatus === 'Đã từ chối' &&
      returnModal.refundStatus !== 'Chưa hoàn tiền'
    ) {
      alert('Yêu cầu đã từ chối thì trạng thái hoàn tiền phải là chưa hoàn tiền')
      return
    }

    if (
      returnModal.decision === 'Đã từ chối' &&
      !returnModal.rejectReason.trim()
    ) {
      alert('Vui lòng nhập lý do từ chối đổi trả')
      return
    }

    // ------ Khai báo const final refund status ------
    const finalRefundStatus =
      returnModal.decision === 'Đã từ chối'
        ? 'Chưa hoàn tiền'
        : returnModal.refundStatus

    // ------ Khai báo const need return stock ------
    const needReturnStock = shouldReturnStock()

    try {
      if (isLoadingProducts) {
        alert('Dữ liệu sản phẩm đang tải, vui lòng thử lại sau.')
        return
      }

      if (needReturnStock) {
        await increaseStockByOrderProducts([returnModal.product])
      }

      dispatch(
        updateProductReturnRequest({
          orderId: returnModal.order.id,
          productKey: createProductKey(returnModal.product),
          status: returnModal.decision,
          refundStatus: finalRefundStatus,
          adminNote: returnModal.adminNote.trim(),
          rejectReason:
            returnModal.decision === 'Đã từ chối'
              ? returnModal.rejectReason.trim()
              : '',
          stockReturned:
            needReturnStock ||
            returnModal.product?.returnRequest?.stockReturned ||
            false,
        })
      )

      closeReturnModal()
      alert(
        needReturnStock
          ? 'Đã cập nhật yêu cầu đổi trả và cộng lại tồn kho'
          : 'Đã cập nhật yêu cầu đổi trả'
      )
    } catch (error) {
      alert(error?.message || 'Không thể cập nhật yêu cầu đổi trả')
    }
  }

  // ------ Hàm lấy status class ------
  const getStatusClass = (status) => {
    switch (status) {
      case 'Đã giao hàng':
        return 'bg-emerald-100 text-emerald-700'
      case 'Đang giao hàng':
        return 'bg-blue-100 text-blue-700'
      case 'Đã bị hủy':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-orange-100 text-orange-700'
    }
  }

  // ------ Hàm lấy return status class ------
  const getReturnStatusClass = (status) => {
    switch (status) {
      case 'Đã chấp nhận':
        return 'bg-emerald-100 text-emerald-700'
      case 'Đã từ chối':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  // ------ Mảng lưu danh sách return files ------
  const returnFiles = returnModal.product?.returnRequest?.files || []

  // ------ Khai báo const current preview file ------
  const currentPreviewFile = previewModal.files[previewModal.index]

  // ------ Khai báo const current return status ------
  const currentReturnStatus = returnModal.product?.returnRequest?.status

  // ------ Khai báo const current refund status ------
  const currentRefundStatus =
    returnModal.product?.returnRequest?.refundStatus || 'Chưa hoàn tiền'

  /*
    Logic khóa đổi trả:
    - Nếu trạng thái đã lưu là "Đã chấp nhận" hoặc "Đã từ chối"
      thì không được đổi trạng thái xử lý nữa.
    - Nếu đã từ chối thì hoàn tiền luôn là "Chưa hoàn tiền".
    - Nếu đã chấp nhận thì chỉ được đổi hoàn tiền từ "Chưa hoàn tiền"
      sang "Đã hoàn tiền".
    - Nếu đã hoàn tiền rồi thì không được đổi ngược về "Chưa hoàn tiền".
  */

  // ------ Khai báo const is return decision locked ------
  const isReturnDecisionLocked =
    currentReturnStatus && currentReturnStatus !== 'Chờ duyệt'

  // ------ Khai báo const is refund select disabled ------
  const isRefundSelectDisabled =
    returnModal.decision !== 'Đã chấp nhận' ||
    (currentReturnStatus === 'Đã chấp nhận' &&
      currentRefundStatus === 'Đã hoàn tiền')

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="grid w-full min-w-0 gap-8 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Quản lý đơn hàng</h1>
        <p className="mt-2 font-bold text-slate-400">
          Theo dõi, cập nhật trạng thái và xử lý đơn hàng.
        </p>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-400">Tổng đơn hàng</p>
          <h2 className="mt-2 text-3xl font-black">{orders.length}</h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-orange-500">Đang xử lý</p>
          <h2 className="mt-2 text-3xl font-black text-orange-600">
            {orders.filter((item) => item.status === 'Đang xử lý').length}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-blue-500">Đang giao hàng</p>
          <h2 className="mt-2 text-3xl font-black text-blue-600">
            {orders.filter((item) => item.status === 'Đang giao hàng').length}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-500">Đã giao hàng</p>
          <h2 className="mt-2 text-3xl font-black text-emerald-600">
            {orders.filter((item) => item.status === 'Đã giao hàng').length}
          </h2>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Danh sách đơn hà<ng></ng></h2>
            <p className="mt-1 text-sm font-bold text-slate-400">
              Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 md:w-72"
              placeholder="Mã đơn, tên, SĐT, email..."
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer rounded-xl border px-4 py-3"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {statusList.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="cursor-pointer rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-black/80 duration-100"
            >
              Tìm
            </button>

            <button
              onClick={handleClearSearch}
              className="cursor-pointer rounded-xl bg-slate-200 px-5 py-3 font-bold hover:bg-slate-300 duration-100"
            >
              Reset
            </button>

            <button
              onClick={handleExportExcel}
              className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 duration-100"
            >
              <i className="fa-solid fa-file-excel mr-2"></i>
              Xuất Excel
            </button>
          </div>
        </div>

        {exportNotice && (
          <div
            className={`mx-5 mb-5 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 shadow-sm ${
              exportNotice.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <i
                className={`fa-solid mt-1 ${
                  exportNotice.type === 'success'
                    ? 'fa-circle-check'
                    : 'fa-circle-exclamation'
                }`}
              ></i>
              <p className="font-bold">{exportNotice.message}</p>
            </div>

            <button
              type="button"
              onClick={() => setExportNotice(null)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/70 font-black hover:bg-white"
              aria-label="Đóng thông báo"
            >
              X
            </button>
          </div>
        )}

        {isUpdatingStock && (
          <div className="m-5 rounded-2xl bg-blue-50 p-4 font-bold flex flex-col justify-center gap-2 text-blue-600"> 
             <p className='text-center'>Đang cập nhật...</p>
          </div>
        )}
        <div
          className="overflow-x-auto"
          style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
        >
          <table className="min-w-[1250px] table-fixed text-left">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-400">
                <th className="w-[160px] p-4">Mã đơn</th>
                <th className="w-[220px] p-4">Khách hàng</th>
                <th className="w-[160px] p-4 text-right">Tổng tiền</th>
                <th className="w-[170px] p-4 text-center">Ngày đặt</th>
                <th className="w-[180px] p-4 text-center">Trạng thái</th>
                <th className="w-[220px] p-4 text-center">Đổi trả / Hủy</th>
                <th className="w-[280px] p-4 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {

                // ------ Mảng lưu danh sách return count ------
                const returnCount = (order.products || []).filter(
                  (item) => item.returnRequest
                ).length

                return (
                  <tr key={order.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-black text-indigo-600">
                      {order.orderCode || `KS${order.id}`}
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {order.stockStatus || 'Chưa trừ kho'}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold">{order.customer?.fullName}</p>
                      <p className="text-xs font-bold text-slate-400">
                        {order.customer?.phone}
                      </p>
                    </td>

                    <td className="p-4 text-right font-black text-red-500">
                      {formatPrice(order.totalPrice)}
                    </td>

                    <td className="p-4 text-center text-sm font-bold text-slate-500">
                      {order.createdAt}
                    </td>

                    <td className="p-4 text-center">
                      <select
                        value={order.status}
                        disabled={isFinalStatus(order.status) || isUpdatingStock}
                        onChange={(e) => handleChangeStatus(order, e.target.value)}
                        className={`w-fit cursor-pointer rounded-xl px-3 py-2 text-sm font-bold disabled:cursor-not-allowed ${getStatusClass(order.status)}`}
                      >
                        {statusList.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      {order.status === 'Đã bị hủy' && order.cancelReason ? (
                        <div className="rounded-xl bg-red-50 p-2 text-xs font-bold text-red-600">
                          <p>Hủy bởi: {order.cancelBy || 'Không rõ'}</p>
                        </div>
                      ) : returnCount > 0 ? (
                        <div className="rounded-xl bg-orange-50 p-2 text-xs font-bold text-orange-700">
                          {returnCount} sản phẩm có yêu cầu đổi trả
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">
                          Không có
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-nowrap justify-center gap-2">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 whitespace-nowrap"
                        >
                          Chi tiết
                        </Link>

                        <button
                          disabled={returnCount === 0 || isUpdatingStock}
                          onClick={() => {

                            // ------ Mảng lưu danh sách first return product ------
                            const firstReturnProduct = (order.products || []).find(
                              (item) => item.returnRequest
                            )
                            if (firstReturnProduct) {
                              openReturnModal(order, firstReturnProduct)
                            }
                          }}
                          className="cursor-pointer rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Đổi trả
                        </button>

                        <button
                          disabled={!canDeleteOrder(order) || isUpdatingStock}
                          onClick={() => handleDeleteOrder(order)}
                          className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center font-bold text-slate-400"
                  >
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {returnItems.length > 0 && (
        <section className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Danh sách sản phẩm yêu cầu đổi trả
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {returnItems.map(({ order, product, productKey }) => (
              <div
                key={`${order.id}-${productKey}`}
                className="rounded-2xl border bg-slate-50 p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl bg-white object-contain"
                  />

                  <div className="flex-1">
                    <p className="font-black">{product.name}</p>
                    <p className="text-sm font-bold text-slate-400">
                      Đơn: {order.orderCode || `KS${order.id}`}
                    </p>
                    <p className="text-sm font-bold text-slate-400">
                      SL: {product.cartQuantity}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-3 rounded-xl p-2 text-sm font-bold ${getReturnStatusClass(
                    product.returnRequest.status
                  )}`}
                >
                  <p>{product.returnRequest.status}</p>
                  <p>Hoàn tiền: {product.returnRequest.refundStatus}</p>
                </div>

                <button
                  onClick={() => openReturnModal(order, product)}
                  className="mt-3 w-full rounded-xl bg-orange-500 py-2 font-bold text-white hover:bg-orange-600 cursor-pointer duration-100"
                >
                  Xử lý đổi trả
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {cancelModal.open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-black text-slate-900">Lý do hủy đơn</h2>

            <div className="mt-5 space-y-3">
              {adminCancelReasonList.map((reason) => (
                <label
                  key={reason}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-bold"
                >
                  <input
                    type="radio"
                    name="adminCancelReason"
                    value={reason}
                    checked={cancelModal.reason === reason}
                    onChange={(e) =>
                      setCancelModal((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  />
                  {reason}
                </label>
              ))}
            </div>

            {cancelModal.reason === 'Lý do khác' && (
              <textarea
                value={cancelModal.customReason}
                onChange={(e) =>
                  setCancelModal((prev) => ({
                    ...prev,
                    customReason: e.target.value,
                  }))
                }
                rows="4"
                className="mt-4 w-full rounded-xl border px-4 py-3"
                placeholder="Nhập lý do hủy đơn"
              />
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleConfirmCancel}
                className="flex-1 cursor-pointer rounded-xl bg-red-500 py-3 font-bold text-white hover:bg-red-600"
              >
                Xác nhận hủy
              </button>

              <button
                onClick={closeCancelModal}
                className="flex-1 cursor-pointer rounded-xl bg-slate-200 py-3 font-bold hover:bg-slate-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {returnModal.open && (
        <div
          onClick={closeReturnModal}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 py-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Xử lý đổi trả sản phẩm
                  </h2>

                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Đơn hàng:{' '}
                    {returnModal.order?.orderCode ||
                      `KS${returnModal.order?.id}`}
                  </p>
                </div>

                <button
                  onClick={closeReturnModal}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 font-black hover:bg-red-500 hover:text-white"
                >
                  X
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <section className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="mb-3 font-black text-slate-800">
                    Thông tin yêu cầu
                  </h3>

                  <p>
                    <b>Khách hàng:</b>{' '}
                    {returnModal.order?.customer?.fullName}
                  </p>
                  <p>
                    <b>SĐT:</b> {returnModal.order?.customer?.phone}
                  </p>
                  <p>
                    <b>Email:</b>{' '}
                    {returnModal.order?.customer?.email || 'Chưa có'}
                  </p>
                  <p className="mt-3">
                    <b>Lý do đổi trả:</b>{' '}
                    {returnModal.product?.returnRequest?.reason}
                  </p>
                  <p>
                    <b>Ngày gửi:</b>{' '}
                    {returnModal.product?.returnRequest?.createdAt}
                  </p>
                  <p>
                    <b>Trạng thái hiện tại:</b>{' '}
                    {returnModal.product?.returnRequest?.status}
                  </p>
                  <p>
                    <b>Hoàn tiền:</b>{' '}
                    {returnModal.product?.returnRequest?.refundStatus ||
                      'Chưa hoàn tiền'}
                  </p>
                  <p>
                    <b>Cộng kho:</b>{' '}
                    {returnModal.product?.returnRequest?.stockReturned
                      ? 'Đã cộng lại kho'
                      : 'Chưa cộng kho'}
                  </p>
                </section>

                <section className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="mb-3 font-black text-slate-800">
                    Sản phẩm đổi trả
                  </h3>

                  <div className="flex gap-3 rounded-2xl bg-white p-3">
                    <img
                      src={returnModal.product?.image}
                      alt={returnModal.product?.name}
                      className="h-16 w-16 rounded-xl bg-slate-100 object-contain"
                    />

                    <div>
                      <p className="font-black">{returnModal.product?.name}</p>
                      <p className="text-sm font-bold text-slate-500">
                        Size: {returnModal.product?.selectedSize || 'Không có'} |
                        Màu:{' '}
                        {returnModal.product?.selectedColor?.name || 'Mặc định'}
                      </p>
                      <p className="text-sm font-bold text-slate-500">
                        Số lượng trả: {returnModal.product?.cartQuantity}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <section className="mt-6 rounded-2xl bg-slate-50 p-5">
                <h3 className="mb-4 font-black text-slate-800">
                  Hình ảnh / video minh chứng
                </h3>

                {returnFiles.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {returnFiles.map((file, index) => (
                      <button
                        key={`${file.name}-${index}`}
                        type="button"
                        onClick={() => openPreviewModal(returnFiles, index)}
                        className="overflow-hidden rounded-2xl border bg-white p-3 text-left hover:shadow-md"
                      >
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-40 w-full rounded-xl object-contain"
                          />
                        ) : (
                          <video
                            src={file.url}
                            className="h-40 w-full rounded-xl object-contain"
                            controls
                          />
                        )}

                        <p className="mt-2 line-clamp-1 text-sm font-bold text-slate-600">
                          {file.name}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="font-bold text-slate-400">
                    Khách hàng chưa gửi hình ảnh hoặc video minh chứng.
                  </p>
                )}
              </section>

              <section className="mt-6 rounded-2xl border p-5">
                <h3 className="mb-4 font-black text-slate-800">
                  Cập nhật xử lý đổi trả
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-bold">
                      Trạng thái xử lý
                    </label>
                    <select
                      value={returnModal.decision}
                      disabled={isReturnDecisionLocked}
                      onChange={(e) =>
                        setReturnModal((prev) => ({
                          ...prev,
                          decision: e.target.value,
                          refundStatus:
                            e.target.value === 'Đã từ chối'
                              ? 'Chưa hoàn tiền'
                              : prev.refundStatus,
                        }))
                      }
                      className="w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="Chờ duyệt">Chờ duyệt</option>
                      <option value="Đã chấp nhận">Đã chấp nhận</option>
                      <option value="Đã từ chối">Đã từ chối</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-bold">
                      Trạng thái hoàn tiền
                    </label>
                    <select
                      value={returnModal.refundStatus}
                      disabled={isRefundSelectDisabled}
                      onChange={(e) =>
                        setReturnModal((prev) => ({
                          ...prev,
                          refundStatus: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="Chưa hoàn tiền">Chưa hoàn tiền</option>
                      <option value="Đã hoàn tiền">Đã hoàn tiền</option>
                    </select>
                  </div>
                </div>

                {returnModal.decision === 'Đã từ chối' && (
                  <textarea
                    value={returnModal.rejectReason}
                    onChange={(e) =>
                      setReturnModal((prev) => ({
                        ...prev,
                        rejectReason: e.target.value,
                      }))
                    }
                    rows="3"
                    disabled={isReturnDecisionLocked}
                    className="mt-4 w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
                    placeholder="Nhập lý do từ chối"
                  />
                )}

                <textarea
                  value={returnModal.adminNote}
                  onChange={(e) =>
                    setReturnModal((prev) => ({
                      ...prev,
                      adminNote: e.target.value,
                    }))
                  }
                  rows="4"
                  className="mt-4 w-full rounded-xl border px-4 py-3"
                  placeholder="Ghi chú admin"
                />

                {shouldReturnStock() && (
                  <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                    Khi bấm lưu, hệ thống sẽ tự cộng lại số lượng sản phẩm vào
                    kho.
                  </div>
                )}
              </section>
            </div>

            <div className="shrink-0 border-t bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleUpdateReturnRequest}
                  disabled={isUpdatingStock}
                  className="flex-1 cursor-pointer rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isUpdatingStock ? 'Đang lưu...' : 'Lưu cập nhật'}
                </button>

                <button
                  onClick={closeReturnModal}
                  className="flex-1 cursor-pointer rounded-xl bg-slate-200 py-3 font-bold hover:bg-slate-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewModal.open && (
        <div
          onClick={closePreviewModal}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white p-5 shadow-2xl"
          >
            <button
              onClick={closePreviewModal}
              className="absolute right-4 top-4 z-20 rounded-full bg-red-500 px-4 py-2 font-bold text-white"
            >
              X
            </button>

            {previewModal.files.length > 1 && (
              <>
                <button
                  onClick={handlePrevPreviewFile}
                  className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-black text-slate-700 shadow-lg hover:bg-slate-100"
                  title="Xem file trước"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>

                <button
                  onClick={handleNextPreviewFile}
                  className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-black text-slate-700 shadow-lg hover:bg-slate-100"
                  title="Xem file tiếp theo"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>

                <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-white">
                  {previewModal.index + 1} / {previewModal.files.length}
                </div>
              </>
            )}

            <div className="flex flex-1 items-center justify-center overflow-auto p-6">
              {currentPreviewFile?.type === 'image' ? (
                <img
                  src={currentPreviewFile.url}
                  alt={currentPreviewFile.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video
                  src={currentPreviewFile?.url}
                  controls
                  className="max-h-full max-w-full rounded-2xl"
                />
              )}
            </div>

            {currentPreviewFile?.name && (
              <p className="shrink-0 text-center text-sm font-bold text-slate-500">
                {currentPreviewFile.name}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

// ===== EXPORTS =====

export default ManageOrders
