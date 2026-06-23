// ===== THIẾT LẬP MODULE =====


// ------ Khai báo const brands ------
const brands = [
  { id: 'ALL', name: 'Tất cả' },
  { id: 'NIKE', name: 'Nike' },
  { id: 'ADIDAS', name: 'Adidas' },
  { id: 'PUMA', name: 'Puma' },
  { id: 'VANS_CONVERSE', name: 'Vans / Converse' },
  { id: 'REEBOK', name: 'Reebok' },
  { id: 'ASICS', name: 'Asics' },
  { id: 'NB', name: 'New Balance' },
]

// ------ Hàm/Component BrandFilter ------
const BrandFilter = ({ selectedBrand, onChangeBrand }) => {

  // ===== RENDER GIAO DIỆN =====


  return (
    <div className="flex flex-wrap gap-2">
      {brands.map((brand) => (
        <button
          key={brand.id}
          onClick={() => onChangeBrand(brand.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            selectedBrand === brand.id
              ? 'bg-orange-500 text-white'
              : 'bg-white text-slate-600 shadow-sm hover:bg-orange-100'
          }`}
        >
          {brand.name}
        </button>
      ))}
    </div>
  )
}

// ===== EXPORTS =====


export default BrandFilter
