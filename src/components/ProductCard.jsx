// import { Link } from "react-router-dom";
// import { getGenderName } from "../utils/genderUtils.js";

// const ProductCard = ({ product }) => {
//   const isOutOfStock = Number(product.quantity || 0) <= 0;

//   const price = Number(product.price || 0);
//   const discount = Number(product.discount || 0);
//   const discountPrice = Math.round((price * (100 - discount)) / 100);

//   const rating = Number(product.rating || 5);
//   const totalReviews = Number(product.totalReviews || product.reviews?.length || 0);

//   return (
//     <Link
//       to={`/products/${product.id}/${product.alias}`}
//       className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-lg"
//     >
//       {isOutOfStock && (
//         <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/45">
//           <span className="rounded-full bg-white px-5 py-3 text-lg font-black text-red-600 shadow-xl">
//             Het hang
//           </span>
//         </div>
//       )}

//       {discount > 0 && (
//         <div className="absolute right-0 top-0 z-10 bg-red-500 px-2 py-1 text-xs font-bold text-white">
//           -{discount}%
//         </div>
//       )}

//       {product.hasGift && (
//         <div className="absolute left-0 top-0 z-10 bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
//           TANG QUA
//         </div>
//       )}

//       <div className="flex h-48 items-center justify-center bg-slate-50 p-4">
//         <img
//           src={product.image}
//           alt={product.name}
//           className={`max-h-full rounded-xl object-contain transition group-hover:scale-105 ${
//             isOutOfStock ? "grayscale" : ""
//           }`}
//         />
//       </div>

//       <div className="p-3">
//         {product.gender && (
//           <span className="rounded bg-black/10 px-3 py-1 text-xs font-bold text-black">
//             {getGenderName(product.gender)}
//           </span>
//         )}

//         <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-medium text-slate-800">
//           {product.name}
//         </h3>

//         <div className="md:flex items-center gap-3">
//           {discount > 0 ? (
//             <>
//               <p className="text-lg font-extrabold text-red-600">
//                 {discountPrice.toLocaleString("vi-VN")}d
//               </p>

//               <p className="text-sm text-slate-400 line-through">
//                 {price.toLocaleString("vi-VN")}d
//               </p>
//             </>
//           ) : (
//             <p className="text-lg font-extrabold text-red-600">
//               {price.toLocaleString("vi-VN")}d
//             </p>
//           )}
//         </div>

//         <p
//           className={`mt-2 text-xs font-bold ${
//             isOutOfStock ? "text-red-500" : "text-slate-500"
//           }`}
//         >
//           ★ {rating.toFixed(1)} ({totalReviews}) |{" "}
//           {isOutOfStock ? "Het hang" : "Con hang"}
//         </p>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;



// ===== IMPORTS =====

import { Link } from "react-router-dom";
import { getGenderName } from "../utils/genderUtils.js";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy visible reviews ------
const getVisibleReviews = (product) => {
  return Array.isArray(product?.reviews)
    ? product.reviews.filter((review) => review.hidden !== true)
    : [];
};

// ------ Hàm lấy average rating ------
const getAverageRating = (product) => {

  // ------ Khai báo const visible reviews ------
  const visibleReviews = getVisibleReviews(product);

  if (visibleReviews.length === 0) {
    return 0;
  }

  // ------ Hàm/Component totalRating ------
  const totalRating = visibleReviews.reduce((sum, review) => {
    return sum + Number(review.rating || 0);
  }, 0);

  return Math.round((totalRating / visibleReviews.length) * 10) / 10;
};

// ------ Hàm/Component ProductCard ------
const ProductCard = ({ product }) => {

  // ------ Khai báo const is out of stock ------
  const isOutOfStock = Number(product.quantity || 0) <= 0;

  // ------ Khai báo const price ------
  const price = Number(product.price || 0);

  // ------ Khai báo const discount ------
  const discount = Number(product.discount || 0);

  // ------ Khai báo const discount price ------
  const discountPrice = Math.round((price * (100 - discount)) / 100);

  // ------ Khai báo const visible reviews ------
  const visibleReviews = getVisibleReviews(product);

  // ------ Khai báo const total reviews ------
  const totalReviews = Number(product.totalReviews ?? visibleReviews.length);

  // ------ Khai báo const rating ------
  const rating = totalReviews > 0 ? getAverageRating(product) : 0;

  // ===== RENDER GIAO DIỆN =====

  return (
    <Link
      to={`/products/${product.id}/${product.alias}`}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-lg"
    >
      {isOutOfStock && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/45">
          <span className="rounded-full bg-white px-5 py-3 text-lg font-black text-red-600 shadow-xl">
            Hết hàng
          </span>
        </div>
      )}

      {discount > 0 && (
        <div className="absolute right-0 top-0 z-10 bg-red-500 px-2 py-1 text-xs font-bold text-white">
          -{discount}%
        </div>
      )}

      {product.hasGift && (
        <div className="absolute left-0 top-0 z-10 bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
          TẶNG QUÀ
        </div>
      )}

      <div className="flex h-48 items-center justify-center bg-slate-50 p-4">
        <img
          src={product.image}
          alt={product.name}
          className={`max-h-full rounded-xl object-contain transition group-hover:scale-105 ${
            isOutOfStock ? "grayscale" : ""
          }`}
        />
      </div>

      <div className="p-3">
        {product.gender && (
          <span className="rounded bg-black/10 px-3 py-1 text-xs font-bold text-black">
            {getGenderName(product.gender)}
          </span>
        )}

        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-medium text-slate-800">
          {product.name}
        </h3>

        <div className="md:flex items-center gap-3">
          {discount > 0 ? (
            <>
              <p className="text-lg font-extrabold text-red-600">
                {discountPrice.toLocaleString("vi-VN")}đ
              </p>

              <p className="text-sm text-slate-400 line-through">
                {price.toLocaleString("vi-VN")}đ
              </p>
            </>
          ) : (
            <p className="text-lg font-extrabold text-red-600">
              {price.toLocaleString("vi-VN")}đ
            </p>
          )}
        </div>

        <p
          className={`mt-2 text-xs font-bold ${
            isOutOfStock ? "text-red-500" : "text-slate-500"
          }`}
        >
          ★ {rating.toFixed(1)} ({totalReviews}) |{" "}
          {isOutOfStock ? "Hết hàng" : "Còn hàng"}
        </p>
      </div>
    </Link>
  );
};

// ===== EXPORTS =====

export default ProductCard;
