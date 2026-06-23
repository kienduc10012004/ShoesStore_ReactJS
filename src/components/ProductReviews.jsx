
// ===== IMPORTS =====

import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProductMutations } from '../hooks/useProductMutations.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const max review images ------
const MAX_REVIEW_IMAGES = 1

// ------ Hàm/Component normalizeDefaultReview ------
const normalizeDefaultReview = (review, productId, index) => {
  return {
    id: review.id || `default-${productId}-${index}`,
    productId,
    username: review.username || review.userName || 'khach-hang',
    fullName: review.fullName || review.userName || 'Khách hàng',
    userName: review.userName || review.fullName || 'Khách hàng',
    rating: Number(review.rating || 5),
    content: review.content || review.comment || '',
    comment: review.comment || review.content || '',
    images: review.images || [],
    createdAt: review.createdAt || '',
    createdAtISO: review.createdAtISO || '',
    updatedAt: review.updatedAt || '',
    updatedAtISO: review.updatedAtISO || '',
    hidden: Boolean(review.hidden),
    isDefault: true,
  }
}

// ------ Hàm/Component normalizeReviewForMockAPI ------
const normalizeReviewForMockAPI = (review) => {
  return {
    id: review.id || Date.now(),
    productId: review.productId,
    username: review.username || review.userName || 'khach-hang',
    fullName: review.fullName || review.userName || 'Khách hàng',
    userName: review.userName || review.fullName || 'Khách hàng',
    rating: Number(review.rating || 5),
    content: review.content || review.comment || '',
    comment: review.comment || review.content || '',
    images: review.images || [],
    createdAt: review.createdAt || new Date().toLocaleString('vi-VN'),
    createdAtISO: review.createdAtISO || new Date().toISOString(),
    updatedAt: review.updatedAt || '',
    updatedAtISO: review.updatedAtISO || '',
    hidden: Boolean(review.hidden),
  }
}

// ------ Hàm/Component calculateVisibleRatingInfo ------
const calculateVisibleRatingInfo = (reviews = []) => {

  // ------ Khai báo const visible reviews ------
  const visibleReviews = reviews.filter((review) => review.hidden !== true)

  // ------ Khai báo const total reviews ------
  const totalReviews = visibleReviews.length

  if (totalReviews === 0) {
    return {
      rating: 0,
      totalReviews: 0,
    }
  }

  // ------ Hàm/Component totalRating ------
  const totalRating = visibleReviews.reduce((sum, review) => {
    return sum + Number(review.rating || 0)
  }, 0)

  return {
    rating: Math.round((totalRating / totalReviews) * 10) / 10,
    totalReviews,
  }
}

// ------ Hàm/Component ProductReviews ------
const ProductReviews = ({ product }) => {

  // ------ Lay dữ liệu user từ Redux store ------
  const user = useSelector((state) => state.authStore.user)

  // ------ Lay dữ liệu orders từ Redux store ------
  const orders = useSelector((state) => state.orderStore.orders)

  // ------ Lay dữ liệu local reviews từ Redux store ------
  const localReviews = useSelector((state) => state.reviewStore?.reviews || [])

  // ------ State lưu filter star ------
  const [filterStar, setFilterStar] = useState('ALL')

  // ------ State lưu rating ------
  const [rating, setRating] = useState(5)

  // ------ State lưu content ------
  const [content, setContent] = useState('')

  // ------ State lưu images ------
  const [images, setImages] = useState([])

  // ------ State lưu is remove old images ------
  const [isRemoveOldImages, setIsRemoveOldImages] = useState(false)

  // ------ State lưu error ------
  const [error, setError] = useState('')

  // ------ State lưu preview image ------
  const [previewImage, setPreviewImage] = useState(null)

  // ------ Khai báo const nhóm giá trị ------
  const { updateProductMutation } = useProductMutations()

  // ------ Khai báo const is submitting ------
  const isSubmitting = updateProductMutation.isPending

  // ------ Hàm/Component productReviews ------
  const productReviews = useMemo(() => {
    if (!product) return []

    /*
      Chỉ hiển thị review chưa bị ẩn.
      Nếu admin ẩn review trong MockAPI bằng hidden: true,
      phía user sẽ không còn thấy review đó nữa.
    */

    // ------ Mảng lưu danh sách default reviews ------
    const defaultReviews = (product.reviews || [])
      .filter((review) => review.hidden !== true)
      .map((review, index) => normalizeDefaultReview(review, product.id, index))

    // ------ Hàm/Component savedReviews ------
    const savedReviews = localReviews.filter((review) => {
      return (
        String(review.productId) === String(product.id) &&
        review.hidden !== true
      )
    })

    // ------ Khai báo const merged reviews ------
    const mergedReviews = [...savedReviews, ...defaultReviews]

    // ------ Khai báo const review map ------
    const reviewMap = new Map()

    mergedReviews.forEach((review) => {

      // ------ Khai báo const key ------
      const key =
        review.id ||
        `${review.username || review.userName}-${review.createdAt || ''}-${review.content || review.comment || ''}`

      if (!reviewMap.has(key)) {
        reviewMap.set(key, review)
      }
    })

    return Array.from(reviewMap.values())
  }, [product, localReviews])

  // ------ Hàm/Component filteredReviews ------
  const filteredReviews = useMemo(() => {
    if (filterStar === 'ALL') return productReviews

    return productReviews.filter((review) => {
      return Number(review.rating) === Number(filterStar)
    })
  }, [productReviews, filterStar])

  // ------ Custom hook quản lý user review ------
  const userReview = useMemo(() => {
    if (!user || !product) return null

    return productReviews.find((review) => {
      return (
        String(review.productId) === String(product.id) &&
        review.username === user.username
      )
    })
  }, [productReviews, product, user])

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

  useEffect(() => {
    setImages([])
    setIsRemoveOldImages(false)
  }, [userReview?.id, product?.id])

  // ------ Hàm/Component currentReviewImages ------
  const currentReviewImages = useMemo(() => {
    if (images.length > 0) return images
    if (isRemoveOldImages) return []
    return userReview?.images || []
  }, [images, isRemoveOldImages, userReview])

  // ------ Hàm/Component averageRating ------
  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return Number(product?.rating || 0)

    // ------ Hàm/Component total ------
    const total = productReviews.reduce((sum, review) => {
      return sum + Number(review.rating || 0)
    }, 0)

    return total / productReviews.length
  }, [productReviews, product])

  // ------ Hàm/Component countByStar ------
  const countByStar = (star) => {
    return productReviews.filter((review) => {
      return Number(review.rating) === Number(star)
    }).length
  }

  // ------ Hàm/Component percentByStar ------
  const percentByStar = (star) => {
    if (productReviews.length === 0) return 0

    return Math.round((countByStar(star) / productReviews.length) * 100)
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
      setError('Chỉ được gửi tối đa 1 hình ảnh')
      e.target.value = ''
      return
    }

    // ------ Khai báo const converted images ------
    const convertedImages = await convertImagesToBase64(selectedFiles)

    setIsRemoveOldImages(false)
    setImages((prev) => [...prev, ...convertedImages])
    e.target.value = ''
  }

  // ------ Hàm xử lý submit review ------
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setError('')

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

    try {

      // ------ Khai báo const now text ------
      const nowText = new Date().toLocaleString('vi-VN')

      // ------ Khai báo const now iso ------
      const nowISO = new Date().toISOString()

      /*
        Quan trọng:
        Khi user đánh giá, phải lấy toàn bộ product.reviews từ MockAPI,
        gồm cả review hidden:true, để không làm mất các đánh giá admin đã ẩn.
      */

      // ------ Mảng lưu danh sách current reviews ------
      const currentReviews = (product.reviews || []).map((review, index) =>
        normalizeReviewForMockAPI({
          ...normalizeDefaultReview(review, product.id, index),
          productId: product.id,
        })
      )

      // ------ Mảng lưu danh sách old review images ------
      const oldReviewImages = userReview?.images || []

      // ------ Khai báo const final review images ------
      const finalReviewImages =
        images.length > 0 ? images : isRemoveOldImages ? [] : oldReviewImages

      // ------ Đối tượng cấu hình/dữ liệu new review ------
      const newReview = normalizeReviewForMockAPI({
        id: userReview?.id || Date.now(),
        productId: product.id,
        productName: product.name,
        username: user.username,
        fullName: user.fullName || user.username,
        userName: user.fullName || user.username,
        rating,
        content: content.trim(),
        comment: content.trim(),
        images: finalReviewImages,
        createdAt: userReview?.createdAt || nowText,
        createdAtISO: userReview?.createdAtISO || nowISO,
        updatedAt: userReview ? nowText : '',
        updatedAtISO: userReview ? nowISO : '',
        hidden: false,
      })

      // ------ Hàm/Component existedReviewIndex ------
      const existedReviewIndex = currentReviews.findIndex((review) => {
        return (
          review.username === user.username &&
          review.hidden !== true
        )
      })

      // ------ Mảng lưu danh sách new reviews ------
      let newReviews = []

      if (existedReviewIndex !== -1) {
        newReviews = currentReviews.map((review, index) => {
          if (index !== existedReviewIndex) return review

          return {
            ...review,
            ...newReview,
            images: finalReviewImages,
          }
        })
      } else {
        newReviews = [...currentReviews, newReview]
      }

      // ------ Khai báo const nhóm giá trị ------
      const { rating: roundedRating, totalReviews } =
        calculateVisibleRatingInfo(newReviews)

      await updateProductMutation.mutateAsync({
        ...product,
        reviews: newReviews,
        rating: roundedRating,
        totalReviews,
        updatedAt: new Date().toISOString(),
      })

      setContent('')
      setImages([])
      setIsRemoveOldImages(false)
      setRating(5)
      setError('')

      alert(userReview ? 'Đã cập nhật đánh giá' : 'Đã gửi đánh giá')
    } catch (error) {
      setError(error?.message || error || 'Không thể cập nhật đánh giá lên MockAPI')
    }
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">
          Đánh giá sản phẩm
        </h2>

        <p className="mt-1 font-bold text-slate-400">
          Tổng hợp đánh giá từ khách hàng đã mua sản phẩm.
        </p>
      </div>

      <div className="grid gap-6 rounded-3xl bg-slate-50 p-5 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center">
          <p className="text-sm font-bold text-slate-400">Điểm trung bình</p>

          <div className="mt-2 text-5xl font-black text-yellow-500">
            {averageRating.toFixed(1)}
          </div>

          <div className="mt-3 flex gap-1 text-xl">
            {renderStars(Math.round(averageRating))}
          </div>

          <p className="mt-2 text-sm font-bold text-slate-500">
            {productReviews.length} đánh giá
          </p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="w-14 shrink-0 font-bold text-slate-700">
                {star} <i className="fa-solid fa-star text-yellow-400"></i>
              </div>

              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{ width: `${percentByStar(star)}%` }}
                ></div>
              </div>

              <div className="w-10 text-right text-sm font-bold text-slate-500">
                {countByStar(star)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => setFilterStar('ALL')}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold ${
            filterStar === 'ALL'
              ? 'bg-blue-950 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Tất cả ({productReviews.length})
        </button>

        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setFilterStar(star)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold ${
              Number(filterStar) === star
                ? 'bg-blue-950 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {star} <i className="fa-solid fa-star text-yellow-400"></i> (
            {countByStar(star)})
          </button>
        ))}
      </div>

      {user && hasBoughtProduct ? (
        <form
          onSubmit={handleSubmitReview}
          className="mt-6 rounded-3xl border bg-white p-5"
        >
          <h3 className="text-xl font-black text-slate-900">
            {userReview ? 'Cập nhật đánh giá của bạn' : 'Viết đánh giá'}
          </h3>

          <p className="mt-1 text-sm font-bold text-slate-400">
            Chỉ khách hàng đã mua và nhận hàng thành công mới được đánh giá.
          </p>

          <div className="mt-4">
            <p className="mb-2 font-bold text-slate-700">Chọn số sao</p>

            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, index) => {

                // ------ Khai báo const star value ------
                const starValue = index + 1

                return (
                  <button
                    key={starValue}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setRating(starValue)}
                    className="cursor-pointer text-3xl disabled:cursor-not-allowed"
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
            disabled={isSubmitting}
            rows="4"
            className="mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-950 disabled:cursor-not-allowed disabled:bg-slate-100"
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
          />

          <div className="mt-4">
            <label className="mb-2 block font-bold text-slate-700">
              Hình ảnh đánh giá, tối đa 1 ảnh
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isSubmitting}
              onChange={handleChangeImages}
              className="w-full rounded-xl border px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            {currentReviewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 md:w-96">
                {currentReviewImages.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative rounded-xl border bg-slate-50 p-2"
                  >
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (images.length > 0) {
                          setImages((prev) =>
                            prev.filter((_, imageIndex) => imageIndex !== index)
                          )
                          return
                        }

                        setIsRemoveOldImages(true)
                      }}
                      className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white disabled:cursor-not-allowed"
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

          <button
            disabled={isSubmitting}
            className="mt-5 cursor-pointer rounded-xl bg-blue-950 px-6 py-3 font-bold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting
              ? 'Đang lưu...'
              : userReview
                ? 'Cập nhật đánh giá'
                : 'Gửi đánh giá'}
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed bg-slate-50 p-5 font-bold text-slate-500">
          {!user
            ? 'Vui lòng đăng nhập để đánh giá sản phẩm.'
            : 'Bạn chỉ có thể đánh giá sau khi mua sản phẩm và đơn hàng đã giao thành công.'}
        </div>
      )}

      <div
        className={`mt-6 space-y-4 ${
          filteredReviews.length > 3
            ? 'max-h-[550px] overflow-y-auto pr-2'
            : ''
        }`}
      >
        {filteredReviews.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-slate-500">
            Chưa có đánh giá nào cho mức sao này.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="rounded-2xl border p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <i className="fa-solid fa-user"></i>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-800">
                        {review.fullName || review.userName || 'Khách hàng'}
                      </p>

                      <div className="mt-1 flex gap-1">
                        {renderStars(Number(review.rating))}
                      </div>
                    </div>

                    <div className="text-sm font-bold text-slate-400">
                      {review.createdAt}
                      {review.updatedAt && (
                        <span> - Cập nhật: {review.updatedAt}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-500">
                    Đã mua hàng
                  </div>

                  <p className="mt-3 font-semibold text-slate-700">
                    {review.content || review.comment}
                  </p>

                  {review.images?.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3 md:w-96">
                      {review.images.map((image, index) => (
                        <button
                          key={`${image.name}-${index}`}
                          type="button"
                          onClick={() => setPreviewImage(image)}
                          className="rounded-xl border bg-slate-50 p-2 hover:border-blue-950"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="h-24 w-full rounded-lg object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl bg-white p-5"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold hover:bg-red-500 hover:text-white"
            >
              X
            </button>

            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}

// ===== EXPORTS =====

export default ProductReviews
      