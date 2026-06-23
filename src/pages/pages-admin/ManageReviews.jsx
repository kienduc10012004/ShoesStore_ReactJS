// ===== IMPORTS =====

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProductsQuery } from '../../hooks/useProductsQuery.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { scrollToTop } from '../../utils/scrollToTop.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const per page ------
const PER_PAGE = 10

// ------ Hàm lấy visible reviews ------
const getVisibleReviews = (product) => {
  return Array.isArray(product?.reviews)
    ? product.reviews.filter((review) => review.hidden !== true)
    : []
}

// ------ Hàm lấy all reviews ------
const getAllReviews = (product) => {
  return Array.isArray(product?.reviews) ? product.reviews : []
}

// ------ Hàm/Component countByStar ------
const countByStar = (reviews, star) => {
  return reviews.filter((review) => Number(review.rating) === Number(star))
    .length
}

// ------ Hàm/Component ManageReviews ------
const ManageReviews = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProductsQuery()

  // ------ State lưu search text ------
  const [searchText, setSearchText] = useState('')

  // ------ State lưu keyword ------
  const [keyword, setKeyword] = useState('')

  // ------ State lưu current page ------
  const [currentPage, setCurrentPage] = useState(1)

  // ------ Hàm/Component productReviewStats ------
  const productReviewStats = useMemo(() => {
    return products
      .filter((product) => !product.deleted)
      .map((product) => {

        // ------ Khai báo const all reviews ------
        const allReviews = getAllReviews(product)

        // ------ Khai báo const visible reviews ------
        const visibleReviews = getVisibleReviews(product)

        return {
          product,
          allReviews,
          visibleReviews,
          totalReviews: visibleReviews.length,
          hiddenReviews: allReviews.length - visibleReviews.length,
          rating: Number(product.rating || 0),
          starCount: {
            1: countByStar(visibleReviews, 1),
            2: countByStar(visibleReviews, 2),
            3: countByStar(visibleReviews, 3),
            4: countByStar(visibleReviews, 4),
            5: countByStar(visibleReviews, 5),
          },
        }
      })
      .filter((item) => getAllReviews(item.product).length > 0)
  }, [products])

  // ------ Hàm/Component filteredStats ------
  const filteredStats = useMemo(() => {

    // ------ Khai báo const value ------
    const value = keyword.toLowerCase().trim()

    if (!value) return productReviewStats

    return productReviewStats.filter(({ product }) => {
      return (
        product.name?.toLowerCase().includes(value) ||
        product.brand?.toLowerCase().includes(value) ||
        String(product.id).includes(value)
      )
    })
  }, [productReviewStats, keyword])

  // ------ Khai báo const total pages ------
  const totalPages = Math.ceil(filteredStats.length / PER_PAGE) || 1

  // ------ Khai báo const start index ------
  const startIndex = (currentPage - 1) * PER_PAGE

  // ------ Khai báo const current stats ------
  const currentStats = filteredStats.slice(startIndex, startIndex + PER_PAGE)

  // ------ Hàm/Component totalReviewCount ------
  const totalReviewCount = productReviewStats.reduce((sum, item) => {
    return sum + item.totalReviews
  }, 0)

  // ------ Hàm/Component totalHiddenCount ------
  const totalHiddenCount = productReviewStats.reduce((sum, item) => {
    return sum + item.hiddenReviews
  }, 0)

  // ------ Khai báo const average rating ------
  const averageRating =
    totalReviewCount === 0
      ? 0
      : productReviewStats.reduce((sum, item) => {
          return sum + item.rating * item.totalReviews
        }, 0) / totalReviewCount

  // ------ Hàm xử lý search ------
  const handleSearch = () => {
    setKeyword(searchText)
    setCurrentPage(1)
  }

  // ------ Hàm xử lý clear search ------
  const handleClearSearch = () => {
    setSearchText('')
    setKeyword('')
    setCurrentPage(1)
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="grid w-full min-w-0 max-w-full gap-8 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Quản lý đánh giá
        </h1>

        <p className="mt-2 font-bold text-slate-400">
          Xem thống kê đánh giá theo từng sản phẩm và xử lý chi tiết đánh giá.
        </p>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-400">Sản phẩm có đánh giá</p>
          <h2 className="mt-2 text-3xl font-black">{productReviewStats.length}</h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-500">Tổng đánh giá hiển thị</p>
          <h2 className="mt-2 text-3xl font-black text-emerald-600">
            {totalReviewCount}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-red-500">Đánh giá đã ẩn</p>
          <h2 className="mt-2 text-3xl font-black text-red-600">
            {totalHiddenCount}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-yellow-500">Điểm trung bình</p>
          <h2 className="mt-2 text-3xl font-black text-yellow-500">
            ★ {averageRating.toFixed(1)}
          </h2>
        </div>
      </section>

      {isError && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error?.message || 'Không thể tải đánh giá từ MockAPI.'}
        </div>
      )}

      <section className="min-w-0 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Danh sách sản phẩm được đánh giá</h2>
            <p className="mt-1 text-sm font-bold text-slate-400">
              Hiển thị {currentStats.length} / {filteredStats.length} sản phẩm
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 md:w-80"
              placeholder="Tìm ID, tên sản phẩm, hãng..."
            />

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
          </div>
        </div>

        <div
          className="w-full overflow-x-auto"
          style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
        >
          <table className="w-full min-w-[1050px] table-fixed text-left xl:min-w-full">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b text-xs uppercase text-slate-400">
                <th className="w-[38%] p-4">Sản phẩm</th>
                <th className="w-[16%] p-4 text-center">Tổng số đánh giá</th>
                <th className="w-[30%] p-4 text-center">Số sao</th>
                <th className="w-[16%] p-4 text-center">Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center font-bold text-slate-400"
                  >
                    <LoadingSpinner/>
                  </td>
                </tr>
              ) : currentStats.length > 0 ? (
                currentStats.map(({ product, totalReviews, hiddenReviews, rating, starCount }) => (
                  <tr key={product.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-xl bg-slate-100 object-contain"
                        />
                        <div>
                          <p className="line-clamp-2 font-black text-slate-900">
                            {product.name}
                          </p>

                          <p className="text-xs font-bold text-indigo-600">
                            ID: {product.id}
                          </p>

                          <p className="text-xs font-bold text-slate-400">
                            {product.brand} / {product.typeName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <p className="text-2xl font-black text-blue-950">
                        {totalReviews}
                      </p>

                      <p className="text-xs font-bold text-yellow-500">
                        ★ {rating.toFixed(1)}
                      </p>

                      {hiddenReviews > 0 && (
                        <p className="mt-1 text-xs font-bold text-red-500">
                          {hiddenReviews} đã ẩn
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm font-bold text-slate-700">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div
                            key={star}
                            className="rounded-xl bg-slate-50 px-3 py-2"
                          >
                            <span className="text-yellow-500">
                              {star} sao
                            </span>{' '}
                            ({starCount[star]})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <Link
                        to={`/admin/reviews/${product.id}`}
                        className="inline-block rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 duration-100"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center font-bold text-slate-400"
                  >
                    Không tìm thấy sản phẩm có đánh giá.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap justify-center gap-2 border-t p-5">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentPage(index + 1)
                scrollToTop()
              }}
              className={`cursor-pointer rounded-xl px-4 py-2 font-bold ${
                currentPage === index + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

// ===== EXPORTS =====

export default ManageReviews
