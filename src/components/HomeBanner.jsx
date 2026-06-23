// ===== THIẾT LẬP MODULE =====

// ------ Hàm/Component HomeBanner ------
const HomeBanner = () => {

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="overflow-hidden rounded-xl bg-blue-100 lg:col-span-2">
        <img
          src="/images/banner-main.png"
          alt="Tải app KienShoes"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="grid gap-3">
        <div className="overflow-hidden rounded-xl bg-orange-100">
          <img
            src="/images/banner-sale.png"
            alt="Siêu sale"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-xl bg-blue-100">
          <img
            src="/images/banner-small.png"
            alt="KienShoes"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

// ===== EXPORTS =====

export default HomeBanner