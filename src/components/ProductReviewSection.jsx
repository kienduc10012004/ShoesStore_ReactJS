// ===== IMPORTS =====

import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addReview } from '../redux/slices/reviewSlice.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const max review images ------
const MAX_REVIEW_IMAGES = 3

// ------ Hàm/Component ProductReviewSection ------
const ProductReviewSection = ({ product }) => {

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ Lay dữ liệu user từ Redux store ------
  const user = useSelector((state) => state.authStore.user)

  // ------ Lay dữ liệu orders từ Redux store ------
  const orders = useSelector((state) => state.orderStore.orders)

  // ------ Lay dữ liệu reviews từ Redux store ------
  const reviews = useSelector((state) => state.reviewStore.reviews)

  // ------ State lưu rating ------
  const [rating, setRating] = useState(5)

  // ------ State lưu content ------
  const [content, setContent] = useState('')

  // ------ State lưu images ------
  const [images, setImages] = useState([])

  // ------ State lưu error ------
  const [error, setError] = useState('')

  // ------ Hàm/Component productReviews ------
  const productReviews = useMemo(() => {
    return reviews.filter((review) => {
      return (
        String(review.productId) === String(product?.id) &&
        review.hidden !== true
      )
    })
  }, [reviews, product])

  // ------ Custom hook quản lý user review ------
  const userReview = useMemo(() => {
    if (!user) return null

    return reviews.find((review) => {
      return (
        String(review.productId) === String(product?.id) &&
        review.username === user.username
      )
    })
  }, [reviews, product, user])

  // ------ Hàm/Component hasBoughtProduct ------
  const hasBoughtProduct = useMemo(() => {
    if (!user || !product) return false

    return orders.some((order) => {
      if (order.status !== 'Đã giao hàng') return false

      return order.products?.some((item) => {
        return String(item.id) === String(product.id)
      })
    })
  }, [orders, product, user])

  // ------ Hàm/Component averageRating ------
  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0

    // ------ Hàm/Component total ------
    const total = productReviews.reduce((sum, review) => {
      return sum + Number(review.rating || 0)
    }, 0)

    return total / productReviews.length
  }, [productReviews])

  // ------ Hàm/Component convertImagesToBase64 ------
  const convertImagesToBase64 = (files) => {
    return Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {

          // ------ Khai báo const reader ------
          const reader = new FileReader()

          reader.onload = () => {
            resolve({
              name: file.name,
              url: reader.result,
              type: 'image',
            })
          }

          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })
    )
  }

  // ------ Hàm xử lý change images ------
  const handleChangeImages = async (e) => {

    // ------ Mảng lưu danh sách selected files ------
    const selectedFiles = Array.from(e.target.files || [])

    setError('')

    if (selectedFiles.length === 0) return

    // ------ Hàm/Component invalidFiles ------
    const invalidFiles = selectedFiles.filter((file) => {
      return !file.type.startsWith('image')
    })

    if (invalidFiles.length > 0) {
      setError('Chỉ được chọn file hình ảnh')
      e.target.value = ''
      return
    }

    if (images.length + selectedFiles.length > MAX_REVIEW_IMAGES) {
      setError('Chỉ được gửi tối đa 3 hình ảnh')
      e.target.value = ''
      return
    }

    // ------ Khai báo const converted images ------
    const convertedImages = await convertImagesToBase64(selectedFiles)

    setImages((prev) => [...prev, ...convertedImages])
    e.target.value = ''
  }

  // ------ Hàm xử lý submit review ------
  const handleSubmitReview = (e) => {
    e.preventDefault()

    if (!user) {
      setError('Vui lòng đăng nhập để đánh giá sản phẩm')
      return
    }

    if (!hasBoughtProduct) {
      setError('Bạn chỉ được đánh giá sau khi đơn hàng đã giao thành công')
      return
    }

    if (!rating) {
      setError('Vui lòng chọn số sao đánh giá')
      return
    }

    if (content.trim().length < 10) {
      setError('Nội dung đánh giá tối thiểu 10 ký tự')
      return
    }

    dispatch(
      addReview({
        productId: product.id,
        productName: product.name,
        username: user.username,
        fullName: user.fullName || user.username,
        rating,
        content: content.trim(),
        images,
      })
    )

    setContent('')
    setImages([])
    setRating(5)
    setError('')

    alert(userReview ? 'Đã cập nhật đánh giá' : 'Đã gửi đánh giá')
  }

  // ------ Ham render stars ------
  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fa-solid fa-star ${
          index < value ? 'text-yellow-400' : 'text-slate-300'
        }`}
      ></i>
    ))
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <section className="mt-10 rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Đánh giá sản phẩm
          </h2>

          <p className="mt-1 font-bold text-slate-400">
            {productReviews.length} đánh giá từ khách hàng đã mua sản phẩm
          </p>
        </div>

        <div className="rounded-2xl bg-yellow-50 px-5 py-4">
          <p className="text-sm font-bold text-slate-500">Điểm trung bình</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-3xl font-black text-yellow-500">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
          </div>
        </div>
      </div>

      {user && hasBoughtProduct ? (
        <form onSubmit={handleSubmitReview} className="mb-8 rounded-2xl bg-slate-50 p-5">
          <h3 className="mb-4 text-xl font-black text-slate-800">
            {userReview ? 'Cập nhật đánh giá của bạn' : 'Viết đánh giá'}
          </h3>

          <div className="mb-4">
            <p className="mb-2 font-bold text-slate-700">Số sao</p>

            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, index) => {

                // ------ Khai báo const star value ------
                const starValue = index + 1

                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="cursor-pointer text-2xl"
                  >
                    <i
                      className={`fa-solid fa-star ${
                        starValue <= rating
                          ? 'text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    ></i>
                  </button>
                )
              })}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
          />

          <div className="mt-4">
            <label className="mb-2 block font-bold text-slate-700">
              Hình ảnh đánh giá, tối đa 3 ảnh
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleChangeImages}
              className="w-full rounded-xl border px-4 py-3"
            />

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative rounded-xl border bg-white p-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) =>
                          prev.filter((_, imageIndex) => imageIndex !== index)
                        )
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
                    >
                      X
                    </button>

                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-24 w-full rounded-lg object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm font-bold text-red-500">{error}</p>
          )}

          <button className="mt-5 cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700">
            {userReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
          </button>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl bg-slate-50 p-5 font-bold text-slate-500">
          {!user
            ? 'Vui lòng đăng nhập để đánh giá sản phẩm.'
            : 'Bạn chỉ có thể đánh giá sau khi mua sản phẩm và đơn hàng đã giao thành công.'}
        </div>
      )}

      {productReviews.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center font-bold text-slate-400">
          Sản phẩm chưa có đánh giá nào.
        </div>
      ) : (
        <div className="space-y-4">
          {productReviews.map((review) => (
            <div key={review.id} className="rounded-2xl border p-5">
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black text-slate-800">
                    {review.fullName || review.username}
                  </p>

                  <p className="text-sm font-bold text-slate-400">
                    {review.createdAt}
                    {review.updatedAt && ` - Cập nhật: ${review.updatedAt}`}
                  </p>
                </div>

                <div className="flex gap-1">
                  {renderStars(Number(review.rating))}
                </div>
              </div>

              <p className="font-semibold text-slate-700">{review.content}</p>

              {review.images?.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 md:w-96">
                  {review.images.map((image, index) => (
                    <img
                      key={`${image.name}-${index}`}
                      src={image.url}
                      alt={image.name}
                      className="h-24 rounded-xl border bg-slate-50 object-contain"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ===== EXPORTS =====

export default ProductReviewSection
