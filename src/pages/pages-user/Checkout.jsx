// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { useFormik } from 'formik'
// import * as Yup from 'yup'

// import { addOrder } from '../../redux/slices/orderSlice.js'
// import { clearCart } from '../../redux/slices/cartSlice.js'

// import { useProductsQuery } from '../../hooks/useProductsQuery.js'

// import { generateOrderCode } from '../../utils/orderCode.js'

// import {
//   provinceList,
//   getDistrictsByProvince,
// } from '../../data/address-data.js'

// const storeList = [
//   { id: 1, name: 'q.Binh Tan - tp.Ho Chi Minh' },
//   { id: 2, name: 'q.Go Vap - tp.Ho Chi Minh' },
//   { id: 3, name: 'q.Tan Phu - tp.Ho Chi Minh' },
// ]

// const getProductDetailLink = (item) => {
//   return `/products/${item.id}/${item.alias || 'chi-tiet-san-pham'}`
// }

// const Checkout = ({ cart = [] }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const user = useSelector((state) => state.authStore.user)

//   /*
//     Phase 2:
//     San pham dung de kiem tra ton kho duoc lay tu TanStack Query,
//     khong lay tu Redux productStore nua.
//   */
//   const {
//     data: products = [],
//     isLoading: isLoadingProducts,
//   } = useProductsQuery()

//   const checkoutItems = location.state?.checkoutItems || cart
//   const checkoutType = location.state?.checkoutType || 'CART'
//   const selectedGift =
//     location.state?.selectedGift ||
//     checkoutItems.find((item) => item.selectedGift)?.selectedGift ||
//     null

//   const totalPrice = checkoutItems.reduce((total, item) => {
//     return total + Number(item.price || 0) * Number(item.cartQuantity || 0)
//   }, 0)

//   const getStockError = () => {
//     for (const cartItem of checkoutItems) {
//       const product = products.find((item) => {
//         return String(item.id) === String(cartItem.id)
//       })

//       if (!product) {
//         return `San pham "${cartItem.name}" khong con ton tai trong he thong`
//       }

//       if (product.deleted) {
//         return `San pham "${cartItem.name}" da ngung kinh doanh`
//       }

//       if (Number(product.quantity || 0) <= 0) {
//         return `San pham "${cartItem.name}" da het hang`
//       }

//       if (Number(product.quantity || 0) < Number(cartItem.cartQuantity || 0)) {
//         return `San pham "${cartItem.name}" chi con ${product.quantity} san pham trong kho`
//       }
//     }

//     return ''
//   }

//   const formik = useFormik({
//     initialValues: {
//       fullName: '',
//       phone: '',
//       email: '',
//       receiveMethod: 'store',
//       store: 'q.Binh Tan - tp.Ho Chi Minh',
//       province: 'Ho Chi Minh',
//       district: '',
//       address: '',
//       paymentMethod: 'cash',
//       note: '',
//     },

//     validationSchema: Yup.object({
//       fullName: Yup.string().trim().required('Vui long nhap ho ten'),

//       phone: Yup.string()
//         .required('Vui long nhap so dien thoai')
//         .matches(/^(0[3|5|7|8|9])[0-9]{8}$/, 'So dien thoai khong hop le'),

//       email: Yup.string()
//         .required('Vui long nhap email')
//         .email('Email khong dung dinh dang'),

//       store: Yup.string().when('receiveMethod', {
//         is: 'store',
//         then: (schema) => schema.required('Vui long chon cua hang'),
//       }),

//       province: Yup.string().when('receiveMethod', {
//         is: 'delivery',
//         then: (schema) => schema.required('Vui long chon tinh/thanh'),
//       }),

//       district: Yup.string().when('receiveMethod', {
//         is: 'delivery',
//         then: (schema) => schema.required('Vui long chon quan/huyen'),
//       }),

//       address: Yup.string().when('receiveMethod', {
//         is: 'delivery',
//         then: (schema) => schema.required('Vui long nhap dia chi'),
//       }),
//     }),

//     onSubmit: (values) => {
//       if (!user) {
//         alert('Vui long dang nhap de dat hang')
//         navigate('/login')
//         return
//       }

//       if (isLoadingProducts) {
//         alert('Du lieu san pham dang tai, vui long thu lai sau.')
//         return
//       }

//       const stockError = getStockError()
//       if (stockError) {
//         alert(stockError)
//         return
//       }

//       const newOrder = {
//         id: Date.now(),
//         orderCode: generateOrderCode(),
//         ownerUsername: user.username,

//         customer: {
//           username: user.username,
//           fullName: values.fullName,
//           phone: values.phone,
//           email: values.email,
//         },

//         receiveMethod: values.receiveMethod,

//         deliveryInfo:
//           values.receiveMethod === 'store'
//             ? {
//                 store: values.store,
//               }
//             : {
//                 province: values.province,
//                 district: values.district,
//                 address: values.address,
//               },

//         paymentMethod: values.paymentMethod,
//         note: values.note,
//         products: checkoutItems,
//         selectedGift,
//         gift: selectedGift,
//         totalPrice,
//         status: 'Dang xu ly',

//         /*
//           Quan trong:
//           Khi user vua dat hang, KHONG tru kho.
//           Kho chi tru khi admin chuyen don sang "Dang giao hang" hoac "Da giao hang".
//         */
//         stockStatus: 'Chua tru kho',
//         canceledStockReturned: false,

//         createdAt: new Date().toLocaleString('vi-VN'),
//         createdAtISO: new Date().toISOString(),
//       }

//       dispatch(addOrder(newOrder))

//       if (checkoutType === 'CART') {
//         dispatch(clearCart())
//       }

//       alert('Dat hang thanh cong!')
//       navigate('/order-check')
//     },
//   })

//   const districts = getDistrictsByProvince(formik.values.province)

//   if (checkoutItems.length === 0) {
//     return (
//       <main className="mx-auto max-w-7xl px-4 py-10">
//         <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
//           <h1 className="text-2xl font-bold text-slate-800">
//             Chua co san pham de thanh toan
//           </h1>

//           <button
//             onClick={() => navigate('/products')}
//             className="mt-5 cursor-pointer rounded-xl bg-blue-950 px-6 py-3 font-bold text-white"
//           >
//             Quay lai mua hang
//           </button>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main className="bg-slate-50 py-10">
//       <form
//         onSubmit={formik.handleSubmit}
//         className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.2fr_1fr]"
//       >
//         <section className="rounded-3xl border bg-white p-6">
//           <h1 className="mb-6 text-3xl font-extrabold">
//             Thong tin don hang
//           </h1>

//           <label className="font-bold">Ho va ten</label>
//           <input
//             name="fullName"
//             value={formik.values.fullName}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             className="mt-2 w-full rounded-xl border px-4 py-3"
//             placeholder="Nhap ho va ten"
//           />
//           {formik.touched.fullName && formik.errors.fullName && (
//             <p className="mt-1 text-sm font-bold text-red-500">
//               {formik.errors.fullName}
//             </p>
//           )}

//           <div className="mt-4 grid gap-4 md:grid-cols-2">
//             <div>
//               <label className="font-bold">So dien thoai</label>
//               <input
//                 name="phone"
//                 value={formik.values.phone}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-2 w-full rounded-xl border px-4 py-3"
//                 placeholder="Nhap so dien thoai"
//               />
//               {formik.touched.phone && formik.errors.phone && (
//                 <p className="mt-1 text-sm font-bold text-red-500">
//                   {formik.errors.phone}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="font-bold">Email</label>
//               <input
//                 name="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-2 w-full rounded-xl border px-4 py-3"
//                 placeholder="Nhap email"
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <p className="mt-1 text-sm font-bold text-red-500">
//                   {formik.errors.email}
//                 </p>
//               )}
//             </div>
//           </div>

//           <h3 className="mt-5 mb-3 font-bold">Phuong thuc nhan hang</h3>

//           <div className="grid gap-4 md:grid-cols-2">
//             <label className="cursor-pointer rounded-2xl border p-5 text-lg font-semibold">
//               <input
//                 type="radio"
//                 name="receiveMethod"
//                 value="store"
//                 checked={formik.values.receiveMethod === 'store'}
//                 onChange={(e) => {
//                   formik.handleChange(e)
//                   formik.setFieldValue('store', 'q.Binh Tan - tp.Ho Chi Minh')
//                   formik.setFieldValue('district', '')
//                   formik.setFieldValue('address', '')
//                 }}
//                 className='accent-orange-600'
//               />
//               <span className="ml-2">Nhan tai cua hang</span>
//             </label>

//             <label className="cursor-pointer rounded-2xl border p-5 text-lg font-semibold">
//               <input
//                 type="radio"
//                 name="receiveMethod"
//                 value="delivery"
//                 checked={formik.values.receiveMethod === 'delivery'}
//                 onChange={(e) => {
//                   formik.handleChange(e)
//                   formik.setFieldValue('district', '')
//                   formik.setFieldValue('address', '')
//                 }}
//                 className='accent-orange-600'
//               />
//               <span className="ml-2">Giao hang tan noi</span>
//             </label>
//           </div>

//           {formik.values.receiveMethod === 'store' && (
//             <div className="mt-5 rounded-3xl border bg-slate-50 p-5">
//               <h3 className="mb-4 text-xl font-black">He thong cua hang</h3>

//               <select
//                 name="store"
//                 value={formik.values.store}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="w-full cursor-pointer rounded-2xl border px-5 py-4 text-lg font-bold"
//               >
//                 {storeList.map((store) => (
//                   <option key={store.id} value={store.name}>
//                     {store.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {formik.values.receiveMethod === 'delivery' && (
//             <div className="mt-5 rounded-3xl bg-slate-100 p-5">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <select
//                   name="province"
//                   value={formik.values.province}
//                   onChange={(e) => {
//                     formik.handleChange(e)
//                     formik.setFieldValue('district', '')
//                   }}
//                   onBlur={formik.handleBlur}
//                   className="w-full cursor-pointer rounded-2xl border px-5 py-4 text-lg"
//                 >
//                   {provinceList.map((item) => (
//                     <option key={item.value} value={item.value}>
//                       {item.name}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   name="district"
//                   value={formik.values.district}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="w-full cursor-pointer rounded-2xl border px-5 py-4 text-lg"
//                 >
//                   <option value="">Chon quan/huyen</option>
//                   {districts.map((item) => (
//                     <option key={item.value} value={item.value}>
//                       {item.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <input
//                 name="address"
//                 value={formik.values.address}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="mt-4 w-full rounded-2xl border px-5 py-4 text-lg"
//                 placeholder="Dia chi"
//               />
//             </div>
//           )}

//           <h3 className="mt-5 mb-3 font-bold">Phuong thuc thanh toan</h3>

//           <div className="grid gap-4 md:grid-cols-2">
//             <label className="cursor-pointer rounded-xl border p-4">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="cash"
//                 checked={formik.values.paymentMethod === 'cash'}
//                 onChange={formik.handleChange}
//                 className='accent-orange-600'
//               />
//               <span className="ml-2">Tien mat</span>
//             </label>

//             <label className="cursor-pointer rounded-xl border p-4">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="bank"
//                 checked={formik.values.paymentMethod === 'bank'}
//                 onChange={formik.handleChange}
//                 className='accent-orange-600'
//               />
//               <span className="ml-2">Ngan hang/Momo</span>
//             </label>
//           </div>

//           <textarea
//             name="note"
//             className="mt-5 w-full rounded-xl border px-4 py-3"
//             rows="4"
//             placeholder="Ghi chu them neu co"
//             value={formik.values.note}
//             onChange={formik.handleChange}
//           />

//           <button
//             disabled={isLoadingProducts}
//             className="mt-5 w-full cursor-pointer rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400 duration-100"
//           >
//             {isLoadingProducts ? 'Dang kiem tra ton kho...' : 'Dat hang'}
//           </button>
//         </section>

//         <section className="h-fit rounded-3xl border bg-white p-6">
//           <h2 className="mb-5 text-2xl font-bold">San pham thanh toan</h2>

//           <div className="mb-4 w-fit rounded-xl bg-red-50 p-4">
//             <p className="font-bold text-red-600">
//               {checkoutType === 'BUY_NOW'
//                 ? 'Mua ngay'
//                 : 'Thanh toan tu gio hang'}
//             </p>
//           </div>

//           {selectedGift && (
//             <div className="mb-4 flex items-center gap-3 rounded-xl bg-orange-50 p-4">
//               <img
//                 src={selectedGift.image}
//                 alt={selectedGift.name}
//                 className="h-14 w-14 rounded-xl bg-white object-contain p-1"
//               />
//               <div>
//                 <p className="text-sm font-bold text-orange-500">
//                   Qua tang da chon
//                 </p>
//                 <p className="font-black text-orange-700">
//                   {selectedGift.name}
//                 </p>
//               </div>
//             </div>
//           )}

//           {checkoutItems.map((item) => (
//             <Link
//               to={getProductDetailLink(item)}
//               key={`${item.id}-${item.selectedSize}-${item.selectedColor?.id}`}
//               className="mb-4 flex gap-4 rounded-xl bg-slate-200 p-4 transition hover:bg-slate-300"
//             >
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="h-20 w-20 rounded-xl object-contain"
//               />

//               <div className="flex-1">
//                 <h3 className="font-bold hover:text-blue-700">
//                   {item.name}
//                 </h3>
//                 <p className="mt-2">Size: {item.selectedSize}</p>
//                 <p>Mau sac: {item.selectedColor?.name}</p>
//                 <p>So luong: {item.cartQuantity}</p>

//                 <p className="mt-1 font-bold text-red-600">
//                   {(
//                     Number(item.price || 0) * Number(item.cartQuantity || 0)
//                   ).toLocaleString('vi-VN')}
//                   d
//                 </p>
//               </div>
//             </Link>
//           ))}

//           <div className="mt-5 flex justify-between text-2xl font-bold">
//             <span>Tong tien</span>
//             <span className="text-red-600">
//               {totalPrice.toLocaleString('vi-VN')}d
//             </span>
//           </div>
//         </section>
//       </form>
//     </main>
//   )
// }

// export default Checkout


// ===== IMPORTS =====

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

import { addOrder } from '../../redux/slices/orderSlice.js'
import { clearCart } from '../../redux/slices/cartSlice.js'

import { useProductsQuery } from '../../hooks/useProductsQuery.js'

import { generateOrderCode } from '../../utils/orderCode.js'

import {
  provinceList,
  getDistrictsByProvince,
} from '../../data/address-data.js'

// ------ Khai báo const store list ------
const storeList = [
  { id: 1, name: 'q.Bình Tân - tp.Hồ Chí Minh' },
  { id: 2, name: 'q.Gò Vấp - tp.Hồ Chí Minh' },
  { id: 3, name: 'q.Tân Phú - tp.Hồ Chí Minh' },
]

// ------ Hàm lấy product detail link ------
const getProductDetailLink = (item) => {
  return `/products/${item.id}/${item.alias || 'chi-tiet-san-pham'}`
}

// ------ Hàm/Component Checkout ------
const Checkout = ({ cart = [] }) => {

  // ------ Lấy thông tin vị trí route hiện tại ------
  const location = useLocation()

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ Lay dữ liệu user từ Redux store ------
  const user = useSelector((state) => state.authStore.user)

  /*
    Phase 2:
    Sản phẩm dùng để kiểm tra tồn kho được lấy từ TanStack Query,
    không lấy từ Redux productStore nữa.
  */
  const {
    data: products = [],
    isLoading: isLoadingProducts,
  } = useProductsQuery()

  // ------ Khai báo const checkout items ------
  const checkoutItems = location.state?.checkoutItems || cart

  // ------ Khai báo const checkout type ------
  const checkoutType = location.state?.checkoutType || 'CART'

  // ------ Khai báo const selected gift ------
  const selectedGift =
    location.state?.selectedGift ||
    checkoutItems.find((item) => item.selectedGift)?.selectedGift ||
    null

  // ------ Hàm/Component totalPrice ------
  const totalPrice = checkoutItems.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.cartQuantity || 0)
  }, 0)

  // ------ Hàm lấy stock error ------
  const getStockError = () => {
    for (const cartItem of checkoutItems) {

      // ------ Hàm/Component product ------
      const product = products.find((item) => {
        return String(item.id) === String(cartItem.id)
      })

      if (!product) {
        return `Sản phẩm "${cartItem.name}" không còn tồn tại trong hệ thống`
      }

      if (product.deleted) {
        return `Sản phẩm "${cartItem.name}" đã ngừng kinh doanh`
      }

      if (Number(product.quantity || 0) <= 0) {
        return `Sản phẩm "${cartItem.name}" đã hết hàng`
      }

      if (Number(product.quantity || 0) < Number(cartItem.cartQuantity || 0)) {
        return `Sản phẩm "${cartItem.name}" chỉ còn ${product.quantity} sản phẩm trong kho`
      }
    }

    return ''
  }

  // ------ Đối tượng cấu hình/dữ liệu formik ------
  const formik = useFormik({
    initialValues: {
      fullName: '',
      phone: '',
      email: '',
      receiveMethod: 'store',
      store: 'q.Bình Tân - tp.Hồ Chí Minh',
      province: 'Hồ Chí Minh',
      district: '',
      address: '',
      paymentMethod: 'cash',
      note: '',
    },

    validationSchema: Yup.object({
      fullName: Yup.string().trim().required('Vui lòng nhập họ tên'),

      phone: Yup.string()
        .required('Vui lòng nhập số điện thoại')
        .matches(/^(0[3|5|7|8|9])[0-9]{8}$/, 'Số điện thoại không hợp lệ'),

      email: Yup.string()
        .required('Vui lòng nhập email')
        .email('Email không đúng định dạng'),

      store: Yup.string().when('receiveMethod', {
        is: 'store',
        then: (schema) => schema.required('Vui lòng chọn cửa hàng'),
      }),

      province: Yup.string().when('receiveMethod', {
        is: 'delivery',
        then: (schema) => schema.required('Vui lòng chọn tỉnh/thành'),
      }),

      district: Yup.string().when('receiveMethod', {
        is: 'delivery',
        then: (schema) => schema.required('Vui lòng chọn quận/huyện'),
      }),

      address: Yup.string().when('receiveMethod', {
        is: 'delivery',
        then: (schema) => schema.required('Vui lòng nhập địa chỉ'),
      }),
    }),

    onSubmit: (values) => {
      if (!user) {
        alert('Vui lòng đăng nhập để đặt hàng')
        navigate('/login')
        return
      }

      if (isLoadingProducts) {
        alert('Dữ liệu sản phẩm đang tải, vui lòng thử lại sau.')
        return
      }

      // ------ Khai báo const stock error ------
      const stockError = getStockError()
      if (stockError) {
        alert(stockError)
        return
      }

      // ------ Khai báo const customer note ------
      const customerNote = values.note.trim()

      // ------ Đối tượng cấu hình/dữ liệu new order ------
      const newOrder = {
        id: Date.now(),
        orderCode: generateOrderCode(),
        ownerUsername: user.username,

        customer: {
          username: user.username,
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
        },

        receiveMethod: values.receiveMethod,

        deliveryInfo:
          values.receiveMethod === 'store'
            ? {
                store: values.store,
              }
            : {
                province: values.province,
                district: values.district,
                address: values.address,
              },

        paymentMethod: values.paymentMethod,
        note: customerNote,
        customerNote,
        products: checkoutItems,
        selectedGift,
        gift: selectedGift,
        totalPrice,
        status: 'Đang xử lý',

        /*
          Quan trọng:
          Khi user vừa đặt hàng, KHÔNG trừ kho.
          Kho chỉ trừ khi admin chuyển đơn sang "Đang giao hàng" hoặc "Đã giao hàng".
        */
        stockStatus: 'Chưa trừ kho',
        canceledStockReturned: false,

        createdAt: new Date().toLocaleString('vi-VN'),
        createdAtISO: new Date().toISOString(),
      }

      dispatch(addOrder(newOrder))

      if (checkoutType === 'CART') {
        dispatch(clearCart())
      }

      alert('Đặt hàng thành công!')
      navigate('/order-check')
    },
  })

  // ------ Khai báo const districts ------
  const districts = getDistrictsByProvince(formik.values.province)

  if (checkoutItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">
            Chưa có sản phẩm để thanh toán
          </h1>

          <button
            onClick={() => navigate('/products')}
            className="mt-5 cursor-pointer rounded-xl bg-blue-950 px-6 py-3 font-bold text-white"
          >
            Quay lại mua hàng
          </button>
        </div>
      </main>
    )
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="bg-slate-50 py-10">
      <form
        onSubmit={formik.handleSubmit}
        className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.2fr_1fr]"
      >
        <section className="rounded-3xl border bg-white p-6">
          <h1 className="mb-6 text-3xl font-extrabold">
            Thông tin đơn hàng
          </h1>

          <label className="font-bold">Họ và tên</label>
          <input
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            placeholder="Nhập họ và tên"
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <p className="mt-1 text-sm font-bold text-red-500">
              {formik.errors.fullName}
            </p>
          )}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="font-bold">Số điện thoại</label>
              <input
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-2 w-full rounded-xl border px-4 py-3"
                placeholder="Nhập số điện thoại"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="font-bold">Email</label>
              <input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-2 w-full rounded-xl border px-4 py-3"
                placeholder="Nhập email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>
          </div>

          <h3 className="mt-5 mb-3 font-bold">Phương thức nhận hàng</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="cursor-pointer rounded-2xl border p-5 text-lg font-semibold">
              <input
                type="radio"
                name="receiveMethod"
                value="store"
                checked={formik.values.receiveMethod === 'store'}
                onChange={(e) => {
                  formik.handleChange(e)
                  formik.setFieldValue('store', 'q.Bình Tân - tp.Hồ Chí Minh')
                  formik.setFieldValue('district', '')
                  formik.setFieldValue('address', '')
                }}
                className='accent-orange-600'
              />
              <span className="ml-2">Nhận tại cửa hàng</span>
            </label>

            <label className="cursor-pointer rounded-2xl border p-5 text-lg font-semibold">
              <input
                type="radio"
                name="receiveMethod"
                value="delivery"
                checked={formik.values.receiveMethod === 'delivery'}
                onChange={(e) => {
                  formik.handleChange(e)
                  formik.setFieldValue('district', '')
                  formik.setFieldValue('address', '')
                }}
                className='accent-orange-600'
              />
              <span className="ml-2">Giao hàng tận nơi</span>
            </label>
          </div>

          {formik.values.receiveMethod === 'store' && (
            <div className="mt-5 rounded-3xl border bg-slate-50 p-5">
              <h3 className="mb-4 text-xl font-black">Hệ thống cửa hàng</h3>

              <select
                name="store"
                value={formik.values.store}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full cursor-pointer rounded-2xl border px-5 py-4 text-lg font-bold"
              >
                {storeList.map((store) => (
                  <option key={store.id} value={store.name}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formik.values.receiveMethod === 'delivery' && (
            <div className="mt-5 rounded-3xl bg-slate-100 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  name="province"
                  value={formik.values.province}
                  onChange={(e) => {
                    formik.handleChange(e)
                    formik.setFieldValue('district', '')
                  }}
                  onBlur={formik.handleBlur}
                  className="w-full cursor-pointer rounded-2xl border px-5 py-4 text-lg"
                >
                  {provinceList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <select
                  name="district"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full cursor-pointer rounded-2xl border px-5 py-4 text-lg"
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-4 w-full rounded-2xl border px-5 py-4 text-lg"
                placeholder="Địa chỉ"
              />
            </div>
          )}

          <h3 className="mt-5 mb-3 font-bold">Phương thức thanh toán</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="cursor-pointer rounded-xl border p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formik.values.paymentMethod === 'cash'}
                onChange={formik.handleChange}
                className='accent-orange-600'
              />
              <span className="ml-2">Tiền mặt</span>
            </label>

            <label className="cursor-pointer rounded-xl border p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={formik.values.paymentMethod === 'bank'}
                onChange={formik.handleChange}
                className='accent-orange-600'
              />
              <span className="ml-2">Ngân hàng/Momo</span>
            </label>
          </div>

          <textarea
            name="note"
            className="mt-5 w-full rounded-xl border px-4 py-3"
            rows="4"
            placeholder="Ghi chú thêm nếu có"
            value={formik.values.note}
            onChange={formik.handleChange}
          />

          <button
            disabled={isLoadingProducts}
            className="mt-5 w-full cursor-pointer rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400 duration-100"
          >
            {isLoadingProducts ? 'Đang kiểm tra tồn kho...' : 'Đặt hàng'}
          </button>
        </section>

        <section className="h-fit rounded-3xl border bg-white p-6">
          <h2 className="mb-5 text-2xl font-bold">Sản phẩm thanh toán</h2>

          <div className="mb-4 w-fit rounded-xl bg-red-50 p-4">
            <p className="font-bold text-red-600">
              {checkoutType === 'BUY_NOW'
                ? 'Mua ngay'
                : 'Thanh toán từ giỏ hàng'}
            </p>
          </div>

          {selectedGift && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-orange-50 p-4">
              <img
                src={selectedGift.image}
                alt={selectedGift.name}
                className="h-14 w-14 rounded-xl bg-white object-contain p-1"
              />
              <div>
                <p className="text-sm font-bold text-orange-500">
                  Quà tặng đã chọn
                </p>
                <p className="font-black text-orange-700">
                  {selectedGift.name}
                </p>
              </div>
            </div>
          )}

          {checkoutItems.map((item) => (
            <Link
              to={getProductDetailLink(item)}
              key={`${item.id}-${item.selectedSize}-${item.selectedColor?.id}`}
              className="mb-4 flex gap-4 rounded-xl bg-slate-200 p-4 transition hover:bg-slate-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded-xl object-contain"
              />

              <div className="flex-1">
                <h3 className="font-bold hover:text-blue-700">
                  {item.name}
                </h3>
                <p className="mt-2">Size: {item.selectedSize}</p>
                <p>Màu sắc: {item.selectedColor?.name}</p>
                <p>Số lượng: {item.cartQuantity}</p>

                <p className="mt-1 font-bold text-red-600">
                  {(
                    Number(item.price || 0) * Number(item.cartQuantity || 0)
                  ).toLocaleString('vi-VN')}
                  đ
                </p>
              </div>
            </Link>
          ))}

          <div className="mt-5 flex justify-between text-2xl font-bold">
            <span>Tổng tiền</span>
            <span className="text-red-600">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </section>
      </form>
    </main>
  )
}

// ===== EXPORTS =====

export default Checkout