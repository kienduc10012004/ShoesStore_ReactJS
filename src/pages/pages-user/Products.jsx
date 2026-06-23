// import ProductList from '../../components/ProductList.jsx'
// import Pagination from '../../components/Pagination.jsx'
// import ProductToolbar from '../../components/ProductToolbar.jsx'

// import { useProductFilter } from '../../hooks/useProductFilter.js'
// import { useProductsQuery } from '../../hooks/useProductsQuery.js'

// import { scrollToTop } from '../../utils/scrollToTop.js'
// import LoadingSpinner from '../../components/LoadingSpinner.jsx'

// const Products = () => {
//   const {
//     data: allProducts = [],
//     isLoading: isLoadingProducts,
//   } = useProductsQuery()

//   const products = allProducts.filter((item) => !item.deleted)

//   const filter = useProductFilter(products, 8)

//   const handleChangePage = (page) => {
//     filter.setCurrentPage(page)
//     scrollToTop()
//   }

//   return (
//     <main className="mx-auto max-w-7xl px-4 py-8">
//       <h1 className="mb-6 text-3xl font-extrabold text-red-600">
//         Tat ca san pham
//       </h1>

//       <ProductToolbar
//         products={products}
//         searchText={filter.searchText}
//         setSearchText={filter.changeSearchText}
//         selectedBrand={filter.selectedBrand}
//         setSelectedBrand={filter.changeBrand}
//         selectedType={filter.selectedType}
//         setSelectedType={filter.changeType}
//         selectedGender={filter.selectedGender}
//         setSelectedGender={filter.changeGender}
//         selectedPrice={filter.selectedPrice}
//         setSelectedPrice={filter.changePrice}
//         sortPrice={filter.sortPrice}
//         setSortPrice={filter.changeSortPrice}
//         onReset={filter.resetFilter}
//       />

//       {isLoadingProducts ? (
//         <div className="rounded-xl bg-white p-10 text-center font-bold text-slate-400">
//           <LoadingSpinner/>
//         </div>
//       ) : (
//         <>
//           <ProductList products={filter.currentProducts} />

//           <Pagination
//             currentPage={filter.currentPage}
//             totalPages={filter.totalPages}
//             onChangePage={handleChangePage}
//           />
//         </>
//       )}
//     </main>
//   )
// }

// export default Products


// ===== IMPORTS =====

import ProductList from '../../components/ProductList.jsx'
import Pagination from '../../components/Pagination.jsx'
import ProductToolbar from '../../components/ProductToolbar.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

import { useProductFilter } from '../../hooks/useProductFilter.js'
import { useProductsQuery } from '../../hooks/useProductsQuery.js'

import { scrollToTop } from '../../utils/scrollToTop.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

// ------ Hàm/Component Products ------
const Products = () => {
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
  } = useProductsQuery()

  // ------ Khai báo const products ------
  const products = allProducts.filter((item) => !item.deleted)

  // ------ Khai báo const filter ------
  const filter = useProductFilter(products, 8)

  // ------ Hàm xử lý change page ------
  const handleChangePage = (page) => {
    filter.setCurrentPage(page)
    scrollToTop()
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-red-600">
        Tất cả sản phẩm
      </h1>

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

      {isLoadingProducts ? (
        <div className="rounded-xl bg-white p-10 text-center font-bold text-slate-400">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <ProductList products={filter.currentProducts} />

          <Pagination
            currentPage={filter.currentPage}
            totalPages={filter.totalPages}
            onChangePage={handleChangePage}
          />
        </>
      )}
    </main>
  )
}

// ===== EXPORTS =====

export default Products