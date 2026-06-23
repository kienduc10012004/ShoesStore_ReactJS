// ===== IMPORTS =====

import ProductCard from './ProductCard.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component ProductList ------
const ProductList = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Không tìm thấy sản phẩm.
      </div>
    )
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// ===== EXPORTS =====

export default ProductList