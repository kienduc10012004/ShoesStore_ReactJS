// // import { Link, useParams } from 'react-router-dom'
// // import { useSelector } from 'react-redux'
// // import { formatPrice } from '../../utils/adminUtils.js'

// // const OrderDetailAdmin = () => {
// //   const { id } = useParams()
// //   const orders = useSelector((state) => state.orderStore.orders)

// //   const order = orders.find((item) => String(item.id) === String(id))

// //   if (!order) {
// //     return (
// //       <main className="p-6">
// //         <h1 className="text-2xl font-black text-slate-900">
// //           Khong tim thay don hang
// //         </h1>

// //         <Link
// //           to="/admin/orders"
// //           className="mt-4 inline-block font-bold text-indigo-600"
// //         >
// //           Quay lai quan ly don hang
// //         </Link>
// //       </main>
// //     )
// //   }

// //   return (
// //     <main className="w-full px-4 py-5 sm:px-6 lg:px-8">
// //       <div className="mb-6">
// //         <Link
// //           to="/admin/orders"
// //           className="font-bold text-indigo-600"
// //         >
// //           ← Quay lai
// //         </Link>

// //         <h1 className="mt-3 text-3xl font-black text-slate-900">
// //           Chi tiet don hang
// //         </h1>

// //         <p className="mt-2 font-bold text-slate-400">
// //           Ma don: {order.orderCode || `KS${order.id}`}
// //         </p>
// //       </div>

// //       <section className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
// //         <div className="rounded-3xl border bg-white p-6 shadow-sm">
// //           <h2 className="text-xl font-black text-slate-900">
// //             Thong tin nhan hang
// //           </h2>

// //           <div className="mt-4 space-y-2 font-bold text-slate-700">
// //             <p>Khach hang: {order.customer?.fullName}</p>
// //             <p>SDT: {order.customer?.phone}</p>
// //             <p>Email: {order.customer?.email || 'Chua co'}</p>
// //             <p>Trang thai: {order.status}</p>
// //             <p>Ngay dat: {order.createdAt}</p>
// //             <p>Thanh toan: {order.paymentMethod === 'bank' ? 'Ngan hang/Momo' : 'Tien mat'}</p>
// //             <p>Nhan hang: {order.receiveMethod === 'store' ? 'Nhan tai cua hang' : 'Giao hang tan noi'}</p>
// //           </div>

// //           {order.selectedGift && (
// //             <div className="mt-5 rounded-2xl bg-orange-50 p-4">
// //               <h3 className="font-black text-orange-700">
// //                 Qua tang
// //               </h3>

// //               <div className="mt-3 flex items-center gap-3">
// //                 <img
// //                   src={order.selectedGift.image}
// //                   alt={order.selectedGift.name}
// //                   className="h-16 w-16 rounded-xl bg-white object-contain"
// //                 />

// //                 <p className="font-black">{order.selectedGift.name}</p>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         <div className="rounded-3xl border bg-white p-6 shadow-sm">
// //           <h2 className="text-xl font-black text-slate-900">
// //             San pham trong don
// //           </h2>

// //           <div className="mt-5 space-y-4">
// //             {order.products?.map((item) => (
// //               <div
// //                 key={`${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`}
// //                 className="rounded-2xl border bg-slate-50 p-4"
// //               >
// //                 <div className="flex gap-4">
// //                   <img
// //                     src={item.image}
// //                     alt={item.name}
// //                     className="h-20 w-20 rounded-xl bg-white object-contain"
// //                   />

// //                   <div className="flex-1">
// //                     <h3 className="font-black text-slate-900">
// //                       {item.name}
// //                     </h3>

// //                     <p className="text-sm font-bold text-slate-500">
// //                       Size: {item.selectedSize} | Mau:{' '}
// //                       {item.selectedColor?.name || 'Mac dinh'}
// //                     </p>

// //                     <p className="text-sm font-bold text-slate-500">
// //                       So luong: {item.cartQuantity}
// //                     </p>

// //                     <p className="mt-1 font-black text-red-500">
// //                       {formatPrice(Number(item.price || 0) * Number(item.cartQuantity || 0))}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {item.returnRequest && (
// //                   <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-slate-700">
// //                     <p>Ly do doi tra: {item.returnRequest.reason}</p>
// //                     <p>Trang thai: {item.returnRequest.status}</p>
// //                     <p>Hoan tien: {item.returnRequest.refundStatus || 'Chua hoan tien'}</p>
// //                     {item.returnRequest.rejectReason && (
// //                       <p>Ly do tu choi: {item.returnRequest.rejectReason}</p>
// //                     )}
// //                     {item.returnRequest.adminNote && (
// //                       <p>Ghi chu admin: {item.returnRequest.adminNote}</p>
// //                     )}
// //                     {item.returnRequest.stockReturned && (
// //                       <p className="text-emerald-700">Da cong lai kho</p>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           <div className="mt-6 border-t pt-4 text-right text-2xl font-black text-red-600">
// //             Tong tien: {formatPrice(order.totalPrice)}
// //           </div>
// //         </div>
// //       </section>
// //     </main>
// //   )
// // }

// // export default OrderDetailAdmin


// import { Link, useParams } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { formatPrice } from '../../utils/adminUtils.js'

// const getProductDetailLink = (item) => {
//   return `/products/${item.id}/${item.alias || 'chi-tiet-san-pham'}`
// }

// const OrderDetailAdmin = () => {
//   const { id } = useParams()
//   const orders = useSelector((state) => state.orderStore.orders)

//   const order = orders.find((item) => String(item.id) === String(id))

//   if (!order) {
//     return (
//       <main className="p-6">
//         <h1 className="text-2xl font-black text-slate-900">
//           Khong tim thay don hang
//         </h1>

//         <Link
//           to="/admin/orders"
//           className="mt-4 inline-block font-bold text-indigo-600"
//         >
//           Quay lai quan ly don hang
//         </Link>
//       </main>
//     )
//   }

//   return (
//     <main className="w-full px-4 py-5 sm:px-6 lg:px-8">
//       <div className="mb-6">
//         <Link
//           to="/admin/orders"
//           className="font-bold text-indigo-600"
//         >
//           Quay lai
//         </Link>

//         <h1 className="mt-3 text-3xl font-black text-slate-900">
//           Chi tiet don hang
//         </h1>

//         <p className="mt-2 font-bold text-slate-400">
//           Ma don: {order.orderCode || `KS${order.id}`}
//         </p>
//       </div>

//       <section className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
//         <div className="rounded-3xl border bg-white p-6 shadow-sm">
//           <h2 className="text-xl font-black text-slate-900">
//             Thong tin nhan hang
//           </h2>

//           <div className="mt-4 space-y-2 font-bold text-slate-700">
//             <p>Khach hang: {order.customer?.fullName}</p>
//             <p>SDT: {order.customer?.phone}</p>
//             <p>Email: {order.customer?.email || 'Chua co'}</p>
//             <p>Trang thai: {order.status}</p>
//             <p>Ngay dat: {order.createdAt}</p>
//             <p>Thanh toan: {order.paymentMethod === 'bank' ? 'Ngan hang/Momo' : 'Tien mat'}</p>
//             <p>Nhan hang: {order.receiveMethod === 'store' ? 'Nhan tai cua hang' : 'Giao hang tan noi'}</p>
//             <p>Trang thai kho: {order.stockStatus || 'Chua tru kho'}</p>
//           </div>

//           {order.status === 'Da bi huy' && (
//             <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
//               <h3 className="font-black">Thong tin huy don</h3>
//               <p className="mt-2">Huy boi: {order.cancelBy || 'Khong ro'}</p>
//               <p>Ly do huy: {order.cancelReason || 'Khong co'}</p>
//               <p>Thoi gian huy: {order.cancelAtText || 'Chua co'}</p>
//               <p>
//                 Cong lai kho:{' '}
//                 {order.canceledStockReturned ? 'Da cong lai kho' : 'Khong can / chua cong'}
//               </p>
//             </div>
//           )}

//           {order.selectedGift && (
//             <div className="mt-5 rounded-2xl bg-orange-50 p-4">
//               <h3 className="font-black text-orange-700">
//                 Qua tang
//               </h3>

//               <div className="mt-3 flex items-center gap-3">
//                 <img
//                   src={order.selectedGift.image}
//                   alt={order.selectedGift.name}
//                   className="h-16 w-16 rounded-xl bg-white object-contain"
//                 />

//                 <p className="font-black">{order.selectedGift.name}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="rounded-3xl border bg-white p-6 shadow-sm">
//           <h2 className="text-xl font-black text-slate-900">
//             San pham trong don
//           </h2>

//           <div className="mt-5 space-y-4">
//             {order.products?.map((item) => (
//               <div
//                 key={`${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`}
//                 className="rounded-2xl border bg-slate-50 p-4"
//               >
//                 <div className="flex gap-4">
//                   <Link to={getProductDetailLink(item)}>
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="h-20 w-20 rounded-xl bg-white object-contain transition hover:scale-105"
//                     />
//                   </Link>

//                   <div className="flex-1">
//                     <Link
//                       to={getProductDetailLink(item)}
//                       className="font-black text-slate-900 hover:text-blue-700"
//                     >
//                       {item.name}
//                     </Link>

//                     <p className="text-sm font-bold text-slate-500">
//                       Size: {item.selectedSize} | Mau:{' '}
//                       {item.selectedColor?.name || 'Mac dinh'}
//                     </p>

//                     <p className="text-sm font-bold text-slate-500">
//                       So luong: {item.cartQuantity}
//                     </p>

//                     <p className="mt-1 font-black text-red-500">
//                       {formatPrice(Number(item.price || 0) * Number(item.cartQuantity || 0))}
//                     </p>
//                   </div>
//                 </div>

//                 {item.returnRequest && (
//                   <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-slate-700">
//                     <p>Ly do doi tra: {item.returnRequest.reason}</p>
//                     <p>Trang thai: {item.returnRequest.status}</p>
//                     <p>Hoan tien: {item.returnRequest.refundStatus || 'Chua hoan tien'}</p>
//                     {item.returnRequest.rejectReason && (
//                       <p>Ly do tu choi: {item.returnRequest.rejectReason}</p>
//                     )}
//                     {item.returnRequest.adminNote && (
//                       <p>Ghi chu admin: {item.returnRequest.adminNote}</p>
//                     )}
//                     {item.returnRequest.stockReturned && (
//                       <p className="text-emerald-700">Da cong lai kho</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 border-t pt-4 text-right text-2xl font-black text-red-600">
//             Tong tien: {formatPrice(order.totalPrice)}
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }

// export default OrderDetailAdmin


// ===== IMPORTS =====

import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatPrice } from '../../utils/adminUtils.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy product detail link ------
const getProductDetailLink = (item) => {
  return `/products/${item.id}/${item.alias || 'chi-tiet-san-pham'}`
}

// ------ Hàm/Component OrderDetailAdmin ------
const OrderDetailAdmin = () => {

  // ------ Khai báo const nhóm giá trị ------
  const { id } = useParams()

  // ------ Lay dữ liệu orders từ Redux store ------
  const orders = useSelector((state) => state.orderStore.orders)

  // ------ Khai báo const order ------
  const order = orders.find((item) => String(item.id) === String(id))

  if (!order) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-black text-slate-900">
          Không tìm thấy đơn hàng
        </h1>

        <Link
          to="/admin/orders"
          className="mt-4 inline-block font-bold text-indigo-600"
        >
          Quay lại quản lý đơn hàng
        </Link>
      </main>
    )
  }

  // ------ Khai báo const customer note ------
  const customerNote = (order.customerNote || order.note || '').trim()

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/admin/orders"
          className="font-bold text-indigo-600"
        >
          Quay lại
        </Link>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Chi tiết đơn hàng
        </h1>

        <p className="mt-2 font-bold text-slate-400">
          Mã đơn: {order.orderCode || `KS${order.id}`}
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Thông tin nhận hàng
          </h2>

          <div className="mt-4 space-y-2 font-bold text-slate-700">
            <p>Khách hàng: {order.customer?.fullName}</p>
            <p>SĐT: {order.customer?.phone}</p>
            <p>Email: {order.customer?.email || 'Chưa có'}</p>
            <p>Trạng thái: {order.status}</p>
            <p>Ngày đặt: {order.createdAt}</p>
            <p>Thanh toán: {order.paymentMethod === 'bank' ? 'Ngân hàng/Momo' : 'Tiền mặt'}</p>
            <p>Nhận hàng: {order.receiveMethod === 'store' ? 'Nhận tại cửa hàng' : 'Giao hàng tận nơi'}</p>
            <p>Trạng thái kho: {order.stockStatus || 'Chưa trừ kho'}</p>
          </div>

          {customerNote && (
            <div className="mt-5 rounded-2xl bg-blue-50 p-4">
              <h3 className="font-black text-blue-700">
                Ghi chú của khách hàng
              </h3>

              <p className="mt-2 whitespace-pre-wrap break-words font-semibold text-slate-700">
                {customerNote}
              </p>
            </div>
          )}

          {order.status === 'Đã bị hủy' && (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
              <h3 className="font-black">Thông tin hủy đơn</h3>
              <p className="mt-2">Hủy bởi: {order.cancelBy || 'Không rõ'}</p>
              <p>Lý do hủy: {order.cancelReason || 'Không có'}</p>
              <p>Thời gian hủy: {order.cancelAtText || 'Chưa có'}</p>
              <p>
                Cộng lại kho:{' '}
                {order.canceledStockReturned ? 'Đã cộng lại kho' : 'Không cần / chưa cộng'}
              </p>
            </div>
          )}

          {order.selectedGift && (
            <div className="mt-5 rounded-2xl bg-orange-50 p-4">
              <h3 className="font-black text-orange-700">
                Quà tặng
              </h3>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src={order.selectedGift.image}
                  alt={order.selectedGift.name}
                  className="h-16 w-16 rounded-xl bg-white object-contain"
                />

                <p className="font-black">{order.selectedGift.name}</p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Sản phẩm trong đơn
          </h2>

          <div className="mt-5 space-y-4">
            {order.products?.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor?.id || 'default'}`}
                className="rounded-2xl border bg-slate-50 p-4"
              >
                <div className="flex gap-4">
                  <Link to={getProductDetailLink(item)}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl bg-white object-contain transition hover:scale-105"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link
                      to={getProductDetailLink(item)}
                      className="font-black text-slate-900 hover:text-blue-700"
                    >
                      {item.name}
                    </Link>

                    <p className="text-sm font-bold text-slate-500">
                      Size: {item.selectedSize} | Màu:{' '}
                      {item.selectedColor?.name || 'Mặc định'}
                    </p>

                    <p className="text-sm font-bold text-slate-500">
                      Số lượng: {item.cartQuantity}
                    </p>

                    <p className="mt-1 font-black text-red-500">
                      {formatPrice(Number(item.price || 0) * Number(item.cartQuantity || 0))}
                    </p>
                  </div>
                </div>

                {item.returnRequest && (
                  <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-slate-700">
                    <p>Lý do đổi trả: {item.returnRequest.reason}</p>
                    <p>Trạng thái: {item.returnRequest.status}</p>
                    <p>Hoàn tiền: {item.returnRequest.refundStatus || 'Chưa hoàn tiền'}</p>
                    {item.returnRequest.rejectReason && (
                      <p>Lý do từ chối: {item.returnRequest.rejectReason}</p>
                    )}
                    {item.returnRequest.adminNote && (
                      <p>Ghi chú admin: {item.returnRequest.adminNote}</p>
                    )}
                    {item.returnRequest.stockReturned && (
                      <p className="text-emerald-700">Đã cộng lại kho</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 text-right text-2xl font-black text-red-600">
            Tổng tiền: {formatPrice(order.totalPrice)}
          </div>
        </div>
      </section>
    </main>
  )
}

// ===== EXPORTS =====

export default OrderDetailAdmin