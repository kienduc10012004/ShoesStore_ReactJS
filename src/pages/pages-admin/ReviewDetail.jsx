// ===== IMPORTS =====

import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProductQuery } from '../../hooks/useProductQuery.js'
import { useProductMutations } from '../../hooks/useProductMutations.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy visible reviews ------
const getVisibleReviews = (reviews = []) => {
  return reviews.filter((review) => review.hidden !== true)
}

// ------ Hàm/Component calculateRatingInfo ------
const calculateRatingInfo = (reviews = []) => {

  // ------ Khai báo const visible reviews ------
  const visibleReviews = getVisibleReviews(reviews)

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

// ------ Hàm/Component ReviewDetail ------
const ReviewDetail = () => {

  // ------ Khai báo const nhóm giá trị ------
  const { productId } = useParams()

  const {
    data: product,
    isLoading,
  } = useProductQuery(productId)

  // ------ Khai báo const nhóm giá trị ------
  const { updateProductMutation } = useProductMutations()

  // ------ State lưu filter star ------
  const [filterStar, setFilterStar] = useState('ALL')

  // ------ State lưu preview image ------
  const [previewImage, setPreviewImage] = useState(null)

  // ------ State lưu message ------
  const [message, setMessage] = useState('')

  // ------ Khai báo const is updating ------
  const isUpdating = updateProductMutation.isPending

  // ------ Hàm/Component reviews ------
  const reviews = useMemo(() => {
    return Array.isArray(product?.reviews) ? product.reviews : []
  }, [product])

  // ------ Hàm/Component filteredReviews ------
  const filteredReviews = useMemo(() => {
    if (filterStar === 'ALL') return reviews

    return reviews.filter((review) => {
      return Number(review.rating) === Number(filterStar)
    })
  }, [reviews, filterStar])

  // ------ Giá trị tính toán visible reviews ------
  const visibleReviews = useMemo(() => getVisibleReviews(reviews), [reviews])

  // ------ Giá trị tính toán rating info ------
  const ratingInfo = useMemo(() => calculateRatingInfo(reviews), [reviews])

  // ------ Hàm/Component countByStar ------
  const countByStar = (star) => {
    return visibleReviews.filter((review) => Number(review.rating) === Number(star))
      .length
  }

  // ------ Ham render stars ------
  const renderStars = (value) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fa-solid fa-star ${
          index < Number(value || 0) ? 'text-yellow-400' : 'text-slate-300'
        }`}
      ></i>
    ))
  }

  // ------ Hàm cập nhật product reviews ------
  const updateProductReviews = async (newReviews, successMessage) => {
    if (!product) return

    try {
      setMessage('')

      // ------ Khai báo const nhóm giá trị ------
      const { rating, totalReviews } = calculateRatingInfo(newReviews)

      await updateProductMutation.mutateAsync({
        ...product,
        reviews: newReviews,
        rating,
        totalReviews,
        updatedAt: new Date().toISOString(),
      })

      setMessage(successMessage)
    } catch (error) {
      setMessage(error?.message || 'Không thể cập nhật đánh giá')
    }
  }

  // ------ Hàm xử lý toggle hidden ------
  const handleToggleHidden = (review) => {

    // ------ Hàm/Component newReviews ------
    const newReviews = reviews.map((item) => {
      if (String(item.id) !== String(review.id)) return item

      return {
        ...item,
        hidden: !item.hidden,
        updatedAt: new Date().toLocaleString('vi-VN'),
      }
    })

    updateProductReviews(
      newReviews,
      review.hidden ? 'Đã hiển thị lại đánh giá' : 'Đã ẩn đánh giá',
    )
  }

  // ------ Hàm xử lý delete review ------
  const handleDeleteReview = (review) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return

    // ------ Khai báo const new reviews ------
    const newReviews = reviews.filter((item) => String(item.id) !== String(review.id))

    updateProductReviews(newReviews, 'Đã xóa đánh giá')
  }

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="rounded-3xl bg-white p-10 text-center font-bold text-slate-400">
          <LoadingSpinner/>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-black text-slate-900">
          Không tìm thấy sản phẩm
        </h1>

        <Link
          to="/admin/reviews"
          className="mt-4 inline-block font-bold text-indigo-600"
        >
          Quay lại quản lý đánh giá
        </Link>
      </main>
    )
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="grid w-full min-w-0 max-w-full gap-8 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to="/admin/reviews"
          className="font-bold text-indigo-600"
        >
          Quay lại quản lý đánh giá
        </Link>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Chi tiết đánh giá sản phẩm
        </h1>

        <p className="mt-2 font-bold text-slate-400">
          Xem, ẩn/hiện và xóa đánh giá của khách hàng.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Thông tin sản phẩm
          </h2>

          <div className="mt-5 flex gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-28 w-28 rounded-2xl bg-slate-100 object-contain"
            />

            <div>
              <p className="text-xs font-bold text-indigo-600">
                ID: {product.id}
              </p>

              <h3 className="mt-1 text-xl font-black text-slate-900">
                {product.name}
              </h3>

              <p className="mt-1 font-bold text-slate-400">
                {product.brand} / {product.typeName}
              </p>

              <Link
                to={`/products/${product.id}/${product.alias}`}
                className="mt-3 inline-block text-sm font-bold text-blue-600 hover:underline"
              >
                Xem trang sản phẩm
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-yellow-50 p-5 text-center">
            <p className="text-sm font-bold text-slate-500">Điểm trung bình</p>

            <h3 className="mt-2 text-5xl font-black text-yellow-500">
              ★ {ratingInfo.rating.toFixed(1)}
            </h3>

            <p className="mt-2 font-bold text-slate-500">
              {ratingInfo.totalReviews} đánh giá đang hiển thị
            </p>

            <p className="mt-1 text-sm font-bold text-red-500">
              {reviews.length - visibleReviews.length} đánh giá đã ẩn
            </p>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Thống kê số sao
          </h2>

          <div className="mt-5 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {

              // ------ Khai báo const count ------
              const count = countByStar(star)

              // ------ Khai báo const percent ------
              const percent =
                ratingInfo.totalReviews === 0
                  ? 0
                  : Math.round((count / ratingInfo.totalReviews) * 100)

              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="w-16 shrink-0 font-bold text-slate-700">
                    {star} <i className="fa-solid fa-star text-yellow-400"></i>
                  </div>

                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="w-16 text-right text-sm font-bold text-slate-500">
                    {count}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {message && (
        <div
          className={`rounded-2xl p-4 font-bold ${
            message.includes('Không')
              ? 'bg-red-50 text-red-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {message}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Tất cả đánh giá</h2>

            <p className="mt-1 text-sm font-bold text-slate-400">
              Hiển thị {filteredReviews.length} / {reviews.length} đánh giá
            </p>
          </div>

          <select
            value={filterStar}
            onChange={(e) => setFilterStar(e.target.value)}
            className="w-full cursor-pointer rounded-xl border px-4 py-3 font-bold md:w-56"
          >
            <option value="ALL">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>

        <div className={`space-y-4 p-5 ${
          filteredReviews.length > 3 ? 'overflow-y-auto max-h-[550px]' : ''
        }`}>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <div
                key={`${review.id || review.createdAtISO || index}`}
                className={`rounded-2xl border p-5 ${
                  review.hidden ? 'bg-red-50/50' : 'bg-white'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <i className="fa-solid fa-user"></i>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-black text-slate-900">
                          {review.fullName ||
                            review.userName ||
                            review.username ||
                            'Khách hàng'}
                        </p>

                        <p className="text-sm font-bold text-slate-400">
                          @{review.username || 'khach-hang'}
                        </p>

                        <div className="mt-2 flex gap-1">
                          {renderStars(Number(review.rating))}
                        </div>
                      </div>

                      <div className="text-sm font-bold text-slate-400 md:text-right">
                        <p>{review.createdAt || 'Chưa có thời gian'}</p>

                        {review.updatedAt && (
                          <p>Cập nhật: {review.updatedAt}</p>
                        )}

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            review.hidden
                              ? 'bg-red-100 text-red-600'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}
                        >
                          {review.hidden ? 'Đã ẩn' : 'Đang hiển thị'}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 font-semibold leading-7 text-slate-700">
                      {review.content || review.comment || 'Không có nội dung'}
                    </p>

                    {review.images?.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-3 md:w-96">
                        {review.images.map((image, imageIndex) => (
                          <button
                            key={`${image.name}-${imageIndex}`}
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

                  <div className="flex shrink-0 gap-2 lg:flex-col">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleToggleHidden(review)}
                      className={`min-w-[90px] cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300 ${
                        review.hidden
                          ? 'bg-emerald-500 hover:bg-emerald-600 duration-100'
                          : 'bg-amber-500 hover:bg-amber-600 duration-100'
                      }`}
                    >
                      {review.hidden ? 'Hiện' : 'Ẩn'}
                    </button>

                    <button
                      disabled={isUpdating}
                      onClick={() => handleDeleteReview(review)}
                      className="min-w-[90px] cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300 duration-100"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed p-8 text-center font-bold text-slate-400">
              Không có đánh giá nào.
            </div>
          )}
        </div>
      </section>

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
    </main>
  )
}

// ===== EXPORTS =====

export default ReviewDetail
