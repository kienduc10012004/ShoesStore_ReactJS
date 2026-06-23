// ===== IMPORTS =====

import { NavLink } from 'react-router-dom'

import Carousel from '../../components/Carousel.jsx'
import ProductList from '../../components/ProductList.jsx'
import FlashSale from '../../components/FlashSale.jsx'
import ProductToolbar from '../../components/ProductToolbar.jsx'
import AdvPopup from '../../components/AdvPopup.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

import { useProductFilter } from '../../hooks/useProductFilter.js'
import { useProductsQuery } from '../../hooks/useProductsQuery.js'

import {
  sortByNewest,
  sortByPromotionPriority,
} from '../../utils/productSort.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

// ------ Hàm/Component Home ------
const Home = () => {
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
  } = useProductsQuery()

  // ------ Khai báo const products ------
  const products = allProducts.filter((item) => !item.deleted)

  // ------ Khai báo const filter ------
  const filter = useProductFilter(products, 8)

  // ------ Khai báo const newest products ------
  const newestProducts = sortByNewest(filter.filteredProducts).slice(0, 4)

  // ------ Khai báo const promotion products ------
  const promotionProducts = sortByPromotionPriority(
    filter.filteredProducts.filter((product) => {
      return Number(product.discount || 0) > 0 || product.hasGift
    }),
  ).slice(0, 8)

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="bg-slate-50 pb-10">
      <AdvPopup/>
      <section className="mx-auto max-w-7xl px-4 pt-5">
        <Carousel />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5">
        <FlashSale />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8">
        <ProductToolbar
          products={products}
          searchText={filter.searchText}
          setSearchText={filter.changeSearchText}
          selectedBrand={filter.selectedBrand}
          setSelectedBrand={filter.changeBrand}
          selectedType={filter.selectedType}
          setSelectedType={filter.changeType}
          selectedGender={filter.selectedGender}
          setSelectedGender={filter.changeGender}
          selectedPrice={filter.selectedPrice}
          setSelectedPrice={filter.changePrice}
          selectedRating={filter.selectedRating}
          setSelectedRating={filter.changeRating}
          sortPrice={filter.sortPrice}
          setSortPrice={filter.changeSortPrice}
          onReset={filter.resetFilter}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-red-600">
            Sản phẩm mới thêm
          </h2>

          <NavLink
            to="/products"
            className="font-bold text-black duration-100 hover:text-orange-500"
          >
            Xem tất cả sản phẩm
          </NavLink>
        </div>

        {isLoadingProducts ? (
          <div className="rounded-xl bg-white p-10 text-center font-bold text-slate-400">
            <LoadingSpinner />
          </div>
        ) : (
          <ProductList products={newestProducts} />
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-red-600">
            Sản phẩm ưu đãi
          </h2>

          <NavLink
            to="/promotions"
            className="font-bold text-black duration-100 hover:text-orange-500"
          >
            Xem thêm sản phẩm ưu đãi
          </NavLink>
        </div>

        {isLoadingProducts ? (
          <div className="rounded-xl bg-white p-10 text-center font-bold text-slate-400">
            <LoadingSpinner />
          </div>
        ) : promotionProducts.length > 0 ? (
          <ProductList products={promotionProducts} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Không tìm thấy sản phẩm.
          </div>
        )}
      </section>
    </main>
  )
}

// ===== EXPORTS =====

export default Home