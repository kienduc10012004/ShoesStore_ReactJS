// ===== IMPORTS =====

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy cart item key ------
const getCartItemKey = (item) => {
  return `${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`
}

// ------ Hàm lấy product detail link ------
const getProductDetailLink = (item) => {
  return `/products/${item.id}/${item.alias || 'chi-tiet-san-pham'}`
}

// ------ Đối tượng cấu hình/dữ liệu cart popup ------
const CartPopup = ({
  isOpen,
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}) => {

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  // ------ State lưu selected keys ------
  const [selectedKeys, setSelectedKeys] = useState([])

  // ------ Hàm/Component cartKeys ------
  const cartKeys = useMemo(() => {
    return cart.map((item) => getCartItemKey(item))
  }, [cart])

  // ------ Hàm/Component selectedItems ------
  const selectedItems = useMemo(() => {
    return cart.filter((item) => selectedKeys.includes(getCartItemKey(item)))
  }, [cart, selectedKeys])

  // ------ Khai báo const is checked all ------
  const isCheckedAll = cart.length > 0 && selectedKeys.length === cart.length

  // ------ Hàm/Component totalPrice ------
  const totalPrice = selectedItems.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.cartQuantity || 0)
  }, 0)

  // ------ Hàm xử lý go to product detail ------
  const handleGoToProductDetail = (item) => {
    onClose()
    navigate(getProductDetailLink(item))
  }

  // ------ Hàm xử lý toggle item ------
  const handleToggleItem = (item) => {

    // ------ Khai báo const key ------
    const key = getCartItemKey(item)

    setSelectedKeys((prev) => {
      if (prev.includes(key)) {
        return prev.filter((itemKey) => itemKey !== key)
      }

      return [...prev, key]
    })
  }

  // ------ Hàm xử lý toggle all ------
  const handleToggleAll = () => {
    if (isCheckedAll) {
      setSelectedKeys([])
      return
    }

    setSelectedKeys(cartKeys)
  }

  // ------ Hàm xử lý remove selected ------
  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng tick chọn sản phẩm cần xóa.')
      return
    }

    // ------ Khai báo const confirm delete ------
    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn?`,
    )

    if (!confirmDelete) return

    selectedItems.forEach((item) => {
      onRemove(item)
    })

    setSelectedKeys([])
  }

  // ------ Hàm xử lý checkout ------
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn sản phẩm để thanh toán.')
      return
    }

    onClose()

    navigate('/checkout', {
      state: {
        checkoutItems: selectedItems,
        checkoutType: 'CART',
      },
    })
  }

  // ------ Hàm xử lý remove one ------
  const handleRemoveOne = (item) => {

    // ------ Khai báo const key ------
    const key = getCartItemKey(item)

    onRemove(item)

    setSelectedKeys((prev) => prev.filter((itemKey) => itemKey !== key))
  }

  // ------ Hàm xử lý decrease ------
  const handleDecrease = (item) => {
    if (Number(item.cartQuantity || 0) <= 1) return

    onDecrease(item)
  }

  // ------ Hàm xử lý increase ------
  const handleIncrease = (item) => {

    // ------ Khai báo const current quantity ------
    const currentQuantity = Number(item.cartQuantity || 0)

    // ------ Khai báo const stock quantity ------
    const stockQuantity = Number(item.quantity || 0)

    if (stockQuantity > 0 && currentQuantity >= stockQuantity) {
      alert('Số lượng sản phẩm trong kho không đủ.')
      return
    }

    onIncrease(item)
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[999] bg-black/40 transition duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950">
              Giỏ hàng của bạn
            </h2>

            <p className="text-sm text-slate-500">
              Có {cart.length} sản phẩm trong giỏ
            </p>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 font-bold duration-100 hover:bg-slate-300"
          >
            X
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-6 text-4xl">
              <i className="fa-solid fa-cart-arrow-down"></i>
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Giỏ hàng trống
            </h3>

            <p className="mt-2 text-slate-500">
              Hãy thêm sản phẩm yêu thích vào giỏ hàng.
            </p>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-center justify-between border-b bg-slate-50 px-5 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={isCheckedAll}
                  onChange={handleToggleAll}
                  className="h-4 w-4 cursor-pointer accent-orange-600"
                />
                Chọn tất cả ({cart.length})
              </label>

              <button
                onClick={handleRemoveSelected}
                className="cursor-pointer rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white hover:bg-red-600"
              >
                Xóa đã chọn
              </button>
            </div>

            <div
              className={`flex-1 p-5 ${
                cart.length > 0 ? 'overflow-y-auto' : 'overflow-visible'
              }`}
            >
              {cart.map((item) => {

                // ------ Khai báo const item key ------
                const itemKey = getCartItemKey(item)

                // ------ Khai báo const checked ------
                const checked = selectedKeys.includes(itemKey)

                // ------ Khai báo const is min quantity ------
                const isMinQuantity = Number(item.cartQuantity || 0) <= 1

                return (
                  <div
                    key={itemKey}
                    className={`mb-4 flex gap-3 rounded-2xl border p-3 ${
                      checked
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 bg-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleItem(item)}
                      className="mt-8 h-4 w-4 cursor-pointer accent-orange-600"
                    />

                    <button
                      type="button"
                      onClick={() => handleGoToProductDetail(item)}
                      className="shrink-0 cursor-pointer"
                      title="Xem chi tiết sản phẩm"
                    >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl bg-slate-50 object-contain hover:scale-105 duration-150"
                        />
                    </button>

                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => handleGoToProductDetail(item)}
                        className="line-clamp-2 cursor-pointer text-left font-bold text-slate-800 hover:text-orange-500"
                        title="Xem chi tiết sản phẩm"
                      >
                        {item.name}
                      </button>

                      <p className="mt-1 text-sm text-slate-500">
                        Size: {item.selectedSize} | Màu:{' '}
                        {item.selectedColor?.name}
                      </p>

                      <p className="mt-2 font-extrabold text-red-600">
                        {(
                          Number(item.price || 0) *
                          Number(item.cartQuantity || 0)
                        ).toLocaleString('vi-VN')}
                        đ
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleDecrease(item)}
                          disabled={isMinQuantity}
                          className="cursor-pointer rounded border px-3 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300"
                        >
                          -
                        </button>

                        <span className="min-w-8 text-center font-bold">
                          {item.cartQuantity}
                        </span>

                        <button
                          onClick={() => handleIncrease(item)}
                          className="cursor-pointer rounded border px-3 py-1 hover:bg-slate-100"
                        >
                          +
                        </button>

                        <button
                          onClick={() => handleRemoveOne(item)}
                          className="ml-auto cursor-pointer text-sm p-2 bg-red-100 rounded-lg font-bold text-red-500 hover:text-red-600 duration-100 hover:bg-red-200"
                        >
                          Xóa
                        </button>
                      </div>

                      {Number(item.quantity || 0) > 0 && (
                        <p className="mt-2 text-xs font-bold text-slate-400">
                          Kho còn: {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="shrink-0 border-t bg-white p-5">
              <p className="mb-2 text-sm font-bold text-slate-500">
                Đã chọn: {selectedItems.length} sản phẩm
              </p>

              <div className="mb-4 flex items-center justify-between text-xl font-extrabold">
                <span>Tổng tiền</span>
                <span className="text-red-600">
                  {totalPrice.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full cursor-pointer rounded-xl bg-red-600 py-4 font-bold text-white transition duration-100 hover:bg-red-700"
              >
                Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ===== EXPORTS =====

export default CartPopup