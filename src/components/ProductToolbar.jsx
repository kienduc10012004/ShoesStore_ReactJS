// ===== IMPORTS =====

import { useEffect, useMemo, useState } from "react";
import { genderOptions } from "../utils/genderUtils.js";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Đối tượng cấu hình/dữ liệu product toolbar ------
const ProductToolbar = ({
  products,
  searchText,
  setSearchText,

  selectedBrand,
  setSelectedBrand,

  selectedType,
  setSelectedType,

  selectedGender,
  setSelectedGender,

  selectedPrice,
  setSelectedPrice,

  selectedRating,
  setSelectedRating,

  sortPrice,
  setSortPrice,

  onReset,
}) => {

  // ------ State lưu local search text ------
  const [localSearchText, setLocalSearchText] = useState(searchText || "");

  // ------ Hàm/Component brands ------
  const brands = useMemo(() => {
    return [
      "ALL",
      ...new Set(products.map((item) => item.brand).filter(Boolean)),
    ];
  }, [products]);

  // ------ Hàm/Component productTypes ------
  const productTypes = useMemo(() => {
    return [
      "ALL",
      ...new Set(products.map((item) => item.typeName).filter(Boolean)),
    ];
  }, [products]);

  useEffect(() => {
    if (localSearchText === searchText) return;

    // ------ Hàm/Component timer ------
    const timer = setTimeout(() => {
      setSearchText(localSearchText);
    }, 2000);

    return () => clearTimeout(timer);
  }, [localSearchText, searchText, setSearchText]);

  useEffect(() => {
    if (searchText !== localSearchText) {
      setLocalSearchText(searchText || "");
    }
  }, [searchText]);

  // ===== RENDER GIAO DIỆN =====

  return (
    <section className="mb-8 rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Bạn đang tìm gì?
          </p>
          <input
            type="text"
            placeholder="Tên giày, thương hiệu, mô tả..."
            value={localSearchText}
            onChange={(e) => setLocalSearchText(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Thương hiệu
          </p>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-3"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand === "ALL" ? "Tất cả" : brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Loại giày
          </p>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-3"
          >
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type === "ALL" ? "Tất cả" : type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Giới tính
          </p>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-3"
          >
            {genderOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Khoảng giá
          </p>
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="ALL">Tất cả</option>
            <option value="1">Dưới 1 triệu</option>
            <option value="2">1 - 2 triệu</option>
            <option value="3">2 - 3 triệu</option>
            <option value="4">3 - 5 triệu</option>
            <option value="5">Trên 5 triệu</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Đánh giá
          </p>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="ALL">Tất cả</option>
            <option value="5">5⭐</option>
            <option value="4">4⭐</option>
            <option value="3">3⭐</option>
            <option value="2">2⭐</option>
            <option value="1">1⭐</option>
            <option value="0">0⭐</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-slate-400">
            Sắp xếp
          </p>
          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="default">Mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setLocalSearchText("");
              onReset();
            }}
            className="mb-1 w-full cursor-pointer rounded-xl bg-black px-4 py-3 font-bold text-white duration-100 hover:bg-orange-600"
          >
            Xóa lọc
          </button>
        </div>
      </div>
    </section>
  );
};

// ===== EXPORTS =====

export default ProductToolbar;
