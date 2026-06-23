// ===== IMPORTS =====

import { useMemo, useState } from 'react'

import ProductList from '../../components/ProductList.jsx'
import Pagination from '../../components/Pagination.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

import { useProductsQuery } from '../../hooks/useProductsQuery.js'

import { scrollToTop } from '../../utils/scrollToTop.js'
import { sortByPromotionPriority } from '../../utils/productSort.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import CountdownTimer from '../../components/CountdownTimer.jsx'

// ------ Khai báo const per page ------
const PER_PAGE = 8

// ------ Hàm/Component Promotions ------
const Promotions = () => {
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
  } = useProductsQuery()

  // ------ State lưu current page ------
  const [currentPage, setCurrentPage] = useState(1)

  // ------ Hàm/Component promotionProducts ------
  const promotionProducts = useMemo(() => {

    // ------ Hàm/Component products ------
    const products = allProducts.filter((product) => {
      return (
        !product.deleted &&
        (Number(product.discount || 0) > 0 || product.hasGift)
      )
    })

    return sortByPromotionPriority(products)
  }, [allProducts])

  // ------ Khai báo const total pages ------
  const totalPages = Math.ceil(promotionProducts.length / PER_PAGE) || 1

  // ------ Khai báo const start index ------
  const startIndex = (currentPage - 1) * PER_PAGE

  // ------ Khai báo const current products ------
  const currentProducts = promotionProducts.slice(
    startIndex,
    startIndex + PER_PAGE,
  )

  // ------ Hàm xử lý change page ------
  const handleChangePage = (page) => {
    setCurrentPage(page)
    scrollToTop()
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 overflow-hidden w-full max-h-100 rounded-3xl bg-orange-100">
        <img
          src="/images/banner1.png"
          alt="Ưu đãi KienShoes"
          className="w-full max-h-100"
        />
      </div>

      <div className="flex gap-2 items-center relative">
        <h1 className="whitespace-nowrap md:mb-6 text-3xl font-extrabold  text-red-600">
          Ưu đãi
        </h1> 
        <span className="ml-3 text-3xl text-red-600 md:hidden">-</span>
        <div className='text-red-600 md:absolute right-0 -top-2'><CountdownTimer targetDate="2026-12-31T23:59:59"/></div>
      </div>

      {isLoadingProducts ? (
        <div className="rounded-xl bg-white p-10 text-center font-bold text-slate-400">
          <LoadingSpinner/>
        </div>
      ) : currentProducts.length > 0 ? (
        <>
          <ProductList products={currentProducts} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={handleChangePage}
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center font-bold text-slate-500">
          Chưa có sản phẩm ưu đãi.
        </div>
      )}
    </main>
  )
}

// ===== EXPORTS =====

export default Promotions
