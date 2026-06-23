// import { useEffect, useMemo, useRef, useState } from 'react'
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'

// import ProductReviews from '../../components/ProductReviews.jsx'
// import ProductCard from '../../components/ProductCard.jsx'
// import { addToCart } from '../../redux/slices/cartSlice.js'
// import { useProductQuery } from '../../hooks/useProductQuery.js'
// import { useProductsQuery } from '../../hooks/useProductsQuery.js'
// import { getSalePrice } from '../../utils/productPrice.js'
// import LoadingSpinner from '../../components/LoadingSpinner.jsx'

// const allSizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]

// const ProductDetail = () => {
//   const { id, alias } = useParams()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const imageZoomRef = useRef(null)

//   const user = useSelector((state) => state.authStore.user)
//   const gifts = useSelector((state) => state.giftStore?.gifts || [])

//   const {
//     data: productFromDetail,
//     isLoading: isLoadingProductDetail,
//   } = useProductQuery(id)

//   const {
//     data: allProducts = [],
//     isLoading: isLoadingProducts,
//   } = useProductsQuery()

//   const products = useMemo(() => {
//     return allProducts.filter((item) => !item.deleted)
//   }, [allProducts])

//   const product = useMemo(() => {
//     if (productFromDetail && !productFromDetail.deleted) {
//       return productFromDetail
//     }

//     return products.find((item) => {
//       const matchId = id && String(item.id) === String(id)
//       const matchAlias = alias && item.alias === alias

//       if (id && alias) return matchId && matchAlias

//       return matchId || matchAlias
//     })
//   }, [productFromDetail, products, id, alias])

//   const [selectedColorId, setSelectedColorId] = useState('')
//   const [mainImage, setMainImage] = useState('')
//   const [avtImage, setAvtImage] = useState('')
//   const [selectedSize, setSelectedSize] = useState(null)
//   const [sizeError, setSizeError] = useState('')
//   const [buyQuantity, setBuyQuantity] = useState(1)
//   const [selectedGiftId, setSelectedGiftId] = useState('none')
//   const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)
//   const [isZoomMode, setIsZoomMode] = useState(false)
//   const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
//   const [isAlbumOpen, setIsAlbumOpen] = useState(false)
//   const [albumImage, setAlbumImage] = useState('')
//   const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0)

//   useEffect(() => {
//     if (!product) return

//     const firstColor = product.colors?.[0]

//     setSelectedColorId(firstColor?.id || '')
//     setMainImage(firstColor?.defaultImage || product.image || '')
//     setAvtImage(firstColor?.defaultImage || product.image || '')
//     setSelectedSize(null)
//     setSizeError('')
//     setBuyQuantity(1)
//     setSelectedGiftId('none')
//     setIsZoomMode(false)
//     setIsAlbumOpen(false)
//     setIsLoginPopupOpen(false)
//   }, [product])

//   const selectedColor = useMemo(() => {
//     return product?.colors?.find((color) => color.id === selectedColorId)
//   }, [product, selectedColorId])

//   const selectedGift = useMemo(() => {
//     if (!product?.hasGift || selectedGiftId === 'none') return null
//     return gifts.find((gift) => String(gift.id) === String(selectedGiftId)) || null
//   }, [gifts, product, selectedGiftId])

//   const detailImages = useMemo(() => {
//     const images =
//       selectedColor?.detailImages ||
//       selectedColor?.images ||
//       (mainImage ? [mainImage] : [])

//     return images.length > 0 ? images : product?.image ? [product.image] : []
//   }, [selectedColor, mainImage, product])

//   const suggestedProducts = useMemo(() => {
//     if (!product) return []

//     const currentIndex = products.findIndex((item) => {
//       return String(item.id) === String(product.id)
//     })

//     if (currentIndex === -1) return []

//     const result = []

//     for (let i = 1; i <= products.length; i++) {
//       const nextIndex = (currentIndex + i) % products.length
//       const nextProduct = products[nextIndex]

//       if (String(nextProduct.id) !== String(product.id)) {
//         result.push(nextProduct)
//       }

//       if (result.length === 4) break
//     }

//     return result
//   }, [products, product])

//   const loading = isLoadingProductDetail || isLoadingProducts

//   if (loading) {
//     return (
//       <main className="bg-slate-50 py-10">
//         <div className="mx-auto max-w-7xl px-4">
//           <div className="rounded-3xl bg-white p-10 text-center font-bold text-slate-400 shadow-sm">
//             <LoadingSpinner/>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (!product) {
//     return (
//       <main className="bg-slate-50 py-10">
//         <div className="mx-auto max-w-7xl px-4">
//           <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
//             <h1 className="text-2xl font-black text-slate-900">
//               Khong tim thay san pham
//             </h1>

//             <Link
//               to="/products"
//               className="mt-5 inline-block rounded-xl bg-blue-950 px-6 py-3 font-bold text-white hover:bg-blue-900"
//             >
//               Quay lai san pham
//             </Link>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   const discount = Number(product.discount || 0)
//   const isDiscountProduct = discount > 0
//   const salePrice = isDiscountProduct
//     ? getSalePrice(product.price, discount)
//     : Number(product.price || 0)
//   const isOutOfStock = Number(product.quantity || 0) <= 0

//   const handleChangeColor = (color) => {
//     setSelectedColorId(color.id)
//     setMainImage(color.defaultImage || product.image)
//     setAvtImage(color.defaultImage || product.image)
//   }

//   const handleChooseSize = (size) => {
//     const isAvailable = product.sizes?.includes(size)

//     if (!isAvailable) {
//       setSizeError('Size nay hien da het')
//       return
//     }

//     setSelectedSize(size)
//     setSizeError('')
//   }

//   const handleDecrease = () => {
//     setBuyQuantity((prev) => Math.max(1, prev - 1))
//   }

//   const handleIncrease = () => {
//     setBuyQuantity((prev) => Math.min(Number(product.quantity || 1), prev + 1))
//   }

//   const createCartProduct = () => {
//     return {
//       ...product,
//       selectedColor,
//       selectedSize,
//       cartQuantity: buyQuantity,
//       image: avtImage || product.image,
//       selectedGift,
//       price: salePrice,
//       originalPrice: Number(product.price || 0),
//     }
//   }

//   const checkBeforeAction = () => {
//     if (!user) {
//       setIsLoginPopupOpen(true)
//       return false
//     }

//     if (isOutOfStock) {
//       setSizeError('San pham da het hang')
//       return false
//     }

//     if (!selectedSize) {
//       setSizeError('Vui long chon size')
//       return false
//     }

//     return true
//   }

//   const handleAddToCart = () => {
//     if (!checkBeforeAction()) return

//     dispatch(addToCart(createCartProduct()))
//     alert('Da them san pham vao gio hang')
//   }

//   const handleBuyNow = () => {
//     if (!checkBeforeAction()) return

//     navigate('/checkout', {
//       state: {
//         checkoutItems: [createCartProduct()],
//         checkoutType: 'BUY_NOW',
//         selectedGift,
//       },
//     })
//   }

//   const handleMouseMoveZoom = (e) => {
//     const imageBox = imageZoomRef.current
//     if (!imageBox) return

//     const rect = imageBox.getBoundingClientRect()
//     const x = ((e.clientX - rect.left) / rect.width) * 100
//     const y = ((e.clientY - rect.top) / rect.height) * 100

//     setZoomPosition({ x, y })
//   }

//   const handleOpenAlbum = () => {
//     const index = detailImages.findIndex((img) => img === mainImage)

//     setCurrentAlbumIndex(index >= 0 ? index : 0)
//     setAlbumImage(mainImage || detailImages[0] || product.image)
//     setIsAlbumOpen(true)
//   }

//   const handlePrevAlbumImage = () => {
//     if (detailImages.length === 0) return

//     const newIndex =
//       currentAlbumIndex <= 0 ? detailImages.length - 1 : currentAlbumIndex - 1

//     setCurrentAlbumIndex(newIndex)
//     setAlbumImage(detailImages[newIndex])
//   }

//   const handleNextAlbumImage = () => {
//     if (detailImages.length === 0) return

//     const newIndex =
//       currentAlbumIndex >= detailImages.length - 1 ? 0 : currentAlbumIndex + 1

//     setCurrentAlbumIndex(newIndex)
//     setAlbumImage(detailImages[newIndex])
//   }

//   return (
//     <main className="bg-slate-50 py-8">
//       <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
//         <section>
//           <div
//             ref={imageZoomRef}
//             onMouseMove={isZoomMode ? handleMouseMoveZoom : undefined}
//             onMouseLeave={() => setIsZoomMode(false)}
//             className={`relative flex h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 shadow-sm ${
//               isZoomMode ? 'cursor-zoom-in' : 'cursor-pointer'
//             }`}
//           >
//             <button
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setIsZoomMode(!isZoomMode)
//               }}
//               className="absolute right-4 top-4 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-blue-950 shadow hover:bg-slate-100"
//               title={isZoomMode ? 'Thu nho anh' : 'Phong to anh'}
//             >
//               <i
//                 className={
//                   isZoomMode
//                     ? 'fa-solid fa-magnifying-glass-minus'
//                     : 'fa-solid fa-magnifying-glass-plus'
//                 }
//               />
//             </button>

//             {mainImage && (
//               <img
//                 onClick={() => {
//                   if (!isZoomMode) handleOpenAlbum()
//                 }}
//                 src={mainImage}
//                 alt={product.name}
//                 className={`max-h-full rounded-2xl object-contain transition-transform duration-150 ${
//                   isOutOfStock ? 'grayscale' : ''
//                 }`}
//                 style={{
//                   transform: isZoomMode ? 'scale(2.2)' : 'scale(1)',
//                   transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
//                 }}
//               />
//             )}

//             {isZoomMode && (
//               <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-white">
//                 Di chuyen chuot de xem chi tiet
//               </div>
//             )}

//             {isOutOfStock && (
//               <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
//                 Het hang
//               </div>
//             )}
//           </div>

//           <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
//             {detailImages.map((image, index) => (
//               <button
//                 key={`${image}-${index}`}
//                 onClick={() => setMainImage(image)}
//                 className={`h-20 w-20 shrink-0 cursor-pointer rounded-xl border bg-white p-2 duration-100 hover:bg-black/10 ${
//                   mainImage === image ? 'border-orange-500' : 'border-slate-200'
//                 }`}
//               >
//                 <img
//                   src={image}
//                   alt={product.name}
//                   className="h-full w-full rounded-lg object-contain"
//                 />
//               </button>
//             ))}
//           </div>
//         </section>

//         <section className="rounded-2xl bg-white p-6 shadow-sm">
//           <div className="flex flex-wrap items-start justify-between gap-3">
//             <h1 className="text-3xl font-bold text-slate-900">
//               {product.name}
//             </h1>

//             {product.hasGift && (
//               <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
//                 Tang qua
//               </span>
//             )}
//           </div>

//           <div className="mt-10 flex flex-wrap items-center gap-3">
//             <p className="text-3xl font-extrabold text-red-600">
//               {salePrice.toLocaleString('vi-VN')}d
//             </p>

//             {isDiscountProduct && (
//               <>
//                 <p className="text-slate-400 line-through">
//                   {Number(product.price || 0).toLocaleString('vi-VN')}d
//                 </p>

//                 <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
//                   -{discount}%
//                 </span>
//               </>
//             )}
//           </div>

//           <p
//             className={`mt-3 font-bold ${
//               isOutOfStock ? 'text-red-500' : 'text-slate-500'
//             }`}
//           >
//             {isOutOfStock
//               ? 'San pham da het hang'
//               : `Con ${product.quantity} san pham`}
//           </p>

//           {product.hasGift && (
//             <div className="mt-5 rounded-2xl bg-orange-50 p-4">
//               <div className="mb-3 flex items-center justify-between gap-3">
//                 <h3 className="font-black text-orange-700">
//                   Chon qua tang kem
//                 </h3>
//                 <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600">
//                   Chon 1 qua tang
//                 </span>
//               </div>

//               <div
//                 className={`flex flex-col gap-2 pr-1 ${
//                   gifts.length + 1 > 3 ? 'max-h-[240px] overflow-y-auto' : ''
//                 }`}
//               >
//                 <label
//                   className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3 ${
//                     selectedGiftId === 'none'
//                       ? 'border-orange-500 ring-2 ring-orange-100'
//                       : 'border-slate-200'
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="selectedGift"
//                     value="none"
//                     checked={selectedGiftId === 'none'}
//                     onChange={() => setSelectedGiftId('none')}
//                   />
//                   <span className="p-3 font-bold text-slate-700">
//                     Khong nhan qua tang
//                   </span>
//                 </label>

//                 {gifts.map((gift) => (
//                   <label
//                     key={gift.id}
//                     className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3 ${
//                       String(selectedGiftId) === String(gift.id)
//                         ? 'border-orange-500 ring-2 ring-orange-100'
//                         : 'border-slate-200'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="selectedGift"
//                       value={gift.id}
//                       checked={String(selectedGiftId) === String(gift.id)}
//                       onChange={() => setSelectedGiftId(String(gift.id))}
//                     />
//                     <img
//                       src={gift.image}
//                       alt={gift.name}
//                       className="h-12 w-12 rounded-xl bg-orange-50 object-contain p-1"
//                     />
//                     <span className="font-bold text-slate-700">
//                       {gift.name}
//                     </span>
//                   </label>
//                 ))}
//               </div>

//               {gifts.length === 0 && (
//                 <p className="mt-3 text-sm font-bold text-orange-600">
//                   Hien chua co qua tang nao trong he thong.
//                 </p>
//               )}
//             </div>
//           )}

//           <div className="mt-6 border-t border-dashed pt-5">
//             <div className="flex justify-between">
//               <h3 className="font-bold text-slate-800">Mau sac</h3>

//               <p className="text-sm text-slate-400">
//                 {product.colors?.length || 0} lua chon
//               </p>
//             </div>

//             <div className="mt-3 flex flex-wrap gap-3">
//               {product.colors?.map((color) => (
//                 <button
//                   key={color.id}
//                   onClick={() => handleChangeColor(color)}
//                   className={`h-16 w-16 cursor-pointer rounded-xl border bg-white p-1 duration-100 hover:bg-black/10 ${
//                     selectedColorId === color.id
//                       ? 'border-orange-500'
//                       : 'border-slate-200'
//                   }`}
//                   title={color.name}
//                 >
//                   <img
//                     src={color.defaultImage}
//                     alt={color.name}
//                     className="h-full w-full rounded-lg object-contain"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="font-bold text-slate-800">Chon size</h3>

//             <div className="mt-3 flex flex-wrap gap-3">
//               {allSizes.map((size) => {
//                 const isAvailable = product.sizes?.includes(size)

//                 return (
//                   <button
//                     key={size}
//                     onClick={() => handleChooseSize(size)}
//                     disabled={!isAvailable || isOutOfStock}
//                     className={`rounded-lg border px-4 py-2 text-sm font-semibold duration-100 ${
//                       !isAvailable || isOutOfStock
//                         ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300'
//                         : selectedSize === size
//                         ? 'cursor-pointer border-red-600 bg-red-600 text-white hover:bg-red-600'
//                         : 'cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-black/10'
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 )
//               })}
//             </div>

//             {sizeError && (
//               <p className="mt-2 text-sm font-semibold text-red-500">
//                 {sizeError}
//               </p>
//             )}
//           </div>

//           <div className="mt-6">
//             <h3 className="font-bold text-slate-800">Mo ta san pham</h3>

//             <p className="mt-2 leading-7 text-slate-600">
//               {product.description}
//             </p>
//           </div>

//           <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
//             <div className="flex w-fit overflow-hidden rounded-xl border border-slate-300">
//               <button
//                 onClick={handleDecrease}
//                 disabled={isOutOfStock}
//                 className="cursor-pointer px-4 py-3 text-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
//               >
//                 -
//               </button>

//               <span className="px-5 py-3 font-bold">{buyQuantity}</span>

//               <button
//                 onClick={handleIncrease}
//                 disabled={isOutOfStock}
//                 className="cursor-pointer px-4 py-3 text-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
//               >
//                 +
//               </button>
//             </div>

//             <button
//               onClick={handleAddToCart}
//               disabled={isOutOfStock}
//               className="flex-1 cursor-pointer rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400"
//             >
//               {isOutOfStock ? 'Het hang' : 'Them gio'}
//             </button>

//             <button
//               onClick={handleBuyNow}
//               disabled={isOutOfStock}
//               className="flex-1 cursor-pointer rounded-xl bg-red-600 py-4 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
//             >
//               {isOutOfStock ? 'Het hang' : 'Mua hang ngay'}
//             </button>
//           </div>
//         </section>
//       </div>

//       <div className="mx-auto max-w-7xl px-4">
//         <ProductReviews product={product} />

//         {suggestedProducts.length > 0 && (
//           <section className="mt-10">
//             <div className="mb-5">
//               <h2 className="text-2xl font-black text-slate-900">
//                 San pham de xuat
//               </h2>
//               <p className="mt-1 font-semibold text-slate-500">
//                 Nhung san pham ban co the quan tam
//               </p>
//             </div>

//             <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
//               {suggestedProducts.map((item) => (
//                 <ProductCard key={item.id} product={item} />
//               ))}
//             </div>
//           </section>
//         )}
//       </div>

//       {isLoginPopupOpen && (
//         <div
//           onClick={() => setIsLoginPopupOpen(false)}
//           className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl"
//           >
//             <button
//               onClick={() => setIsLoginPopupOpen(false)}
//               className="absolute right-4 top-4 cursor-pointer rounded-full bg-slate-100 px-3 py-1 font-black text-slate-600 hover:bg-red-500 hover:text-white"
//             >
//               X
//             </button>

//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl text-orange-500">
//               <i className="fa-solid fa-lock" />
//             </div>

//             <h2 className="mt-5 text-2xl font-black text-slate-900">
//               Vui long dang nhap
//             </h2>

//             <p className="mt-3 font-semibold text-slate-500">
//               Ban can dang nhap de su dung tinh nang nay.
//             </p>

//             <div className="mt-6 grid gap-3 sm:grid-cols-2">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="cursor-pointer rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
//               >
//                 Dang nhap
//               </button>

//               <button
//                 onClick={() => setIsLoginPopupOpen(false)}
//                 className="cursor-pointer rounded-xl bg-slate-200 py-3 font-bold text-slate-700 hover:bg-slate-300"
//               >
//                 Khong, cam on
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAlbumOpen && (
//         <div
//           onClick={() => setIsAlbumOpen(false)}
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-8"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="relative flex h-[88vh] w-full max-w-5xl flex-col rounded-3xl bg-white p-5 shadow-2xl"
//           >
//             <button
//               onClick={() => setIsAlbumOpen(false)}
//               className="absolute right-4 top-4 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-xl text-slate-700 transition hover:bg-red-500 hover:text-white"
//               title="Dong"
//             >
//               <i className="fa-solid fa-xmark" />
//             </button>

//             <button
//               onClick={handlePrevAlbumImage}
//               className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-slate-800 shadow-lg transition hover:bg-slate-100"
//               title="Anh truoc"
//             >
//               <i className="fa-solid fa-chevron-left" />
//             </button>

//             <button
//               onClick={handleNextAlbumImage}
//               className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-slate-800 shadow-lg transition hover:bg-slate-100"
//               title="Anh tiep theo"
//             >
//               <i className="fa-solid fa-chevron-right" />
//             </button>

//             <div className="flex flex-1 items-center justify-center rounded-2xl p-6">
//               {albumImage && (
//                 <img
//                   src={albumImage}
//                   alt={product.name}
//                   className="max-h-[58vh] max-w-full rounded-2xl object-contain"
//                 />
//               )}
//             </div>

//             <div className="mt-4 flex justify-center gap-3 overflow-x-auto pb-1">
//               {detailImages.map((image, index) => (
//                 <button
//                   key={`${image}-${index}`}
//                   onClick={() => {
//                     setCurrentAlbumIndex(index)
//                     setAlbumImage(image)
//                   }}
//                   className={`h-20 w-20 shrink-0 cursor-pointer rounded-xl border-2 bg-white p-1 transition ${
//                     albumImage === image
//                       ? 'border-blue-700'
//                       : 'border-slate-200 hover:border-slate-400'
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={product.name}
//                     className="h-full w-full rounded-lg object-contain"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   )
// }

// export default ProductDetail





// ===== IMPORTS =====

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

import ProductReviews from '../../components/ProductReviews.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import { addToCart } from '../../redux/slices/cartSlice.js'
import { useProductQuery } from '../../hooks/useProductQuery.js'
import { useProductsQuery } from '../../hooks/useProductsQuery.js'
import { getSalePrice } from '../../utils/productPrice.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

// ------ Khai báo const all sizes ------
const allSizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]

// ------ Hàm/Component ProductDetail ------
const ProductDetail = () => {

  // ------ Khai báo const nhóm giá trị ------
  const { id, alias } = useParams()

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ Ref tham chiếu image zoom ref ------
  const imageZoomRef = useRef(null)

  // ------ Lay dữ liệu user từ Redux store ------
  const user = useSelector((state) => state.authStore.user)

  // ------ Lay dữ liệu gifts từ Redux store ------
  const gifts = useSelector((state) => state.giftStore?.gifts || [])

  const {
    data: productFromDetail,
    isLoading: isLoadingProductDetail,
  } = useProductQuery(id)

  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
  } = useProductsQuery()

  // ------ Hàm/Component products ------
  const products = useMemo(() => {
    return allProducts.filter((item) => !item.deleted)
  }, [allProducts])

  // ------ Hàm/Component product ------
  const product = useMemo(() => {
    if (productFromDetail && !productFromDetail.deleted) {
      return productFromDetail
    }

    return products.find((item) => {

      // ------ Khai báo const match id ------
      const matchId = id && String(item.id) === String(id)

      // ------ Khai báo const match alias ------
      const matchAlias = alias && item.alias === alias

      if (id && alias) return matchId && matchAlias

      return matchId || matchAlias
    })
  }, [productFromDetail, products, id, alias])

  // ------ State lưu selected color id ------
  const [selectedColorId, setSelectedColorId] = useState('')

  // ------ State lưu main image ------
  const [mainImage, setMainImage] = useState('')

  // ------ State lưu avt image ------
  const [avtImage, setAvtImage] = useState('')

  // ------ State lưu selected size ------
  const [selectedSize, setSelectedSize] = useState(null)

  // ------ State lưu size error ------
  const [sizeError, setSizeError] = useState('')

  // ------ State lưu buy quantity ------
  const [buyQuantity, setBuyQuantity] = useState(1)

  // ------ State lưu selected gift id ------
  const [selectedGiftId, setSelectedGiftId] = useState('none')

  // ------ State lưu is login popup open ------
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)

  // ------ State lưu is zoom mode ------
  const [isZoomMode, setIsZoomMode] = useState(false)

  // ------ State lưu zoom position ------
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

  // ------ State lưu is album open ------
  const [isAlbumOpen, setIsAlbumOpen] = useState(false)

  // ------ State lưu album image ------
  const [albumImage, setAlbumImage] = useState('')

  // ------ State lưu current album index ------
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0)

  useEffect(() => {
    if (!product) return

    // ------ Khai báo const first color ------
    const firstColor = product.colors?.[0]

    setSelectedColorId(firstColor?.id || '')
    setMainImage(firstColor?.defaultImage || product.image || '')
    setAvtImage(firstColor?.defaultImage || product.image || '')
    setSelectedSize(null)
    setSizeError('')
    setBuyQuantity(1)
    setSelectedGiftId('none')
    setIsZoomMode(false)
    setIsAlbumOpen(false)
    setIsLoginPopupOpen(false)
  }, [product])

  // ------ Hàm/Component selectedColor ------
  const selectedColor = useMemo(() => {
    return product?.colors?.find((color) => color.id === selectedColorId)
  }, [product, selectedColorId])

  // ------ Hàm/Component selectedGift ------
  const selectedGift = useMemo(() => {
    if (!product?.hasGift || selectedGiftId === 'none') return null
    return gifts.find((gift) => String(gift.id) === String(selectedGiftId)) || null
  }, [gifts, product, selectedGiftId])

  // ------ Hàm/Component detailImages ------
  const detailImages = useMemo(() => {

    // ------ Khai báo const images ------
    const images =
      selectedColor?.detailImages ||
      selectedColor?.images ||
      (mainImage ? [mainImage] : [])

    return images.length > 0 ? images : product?.image ? [product.image] : []
  }, [selectedColor, mainImage, product])

  // ------ Hàm/Component suggestedProducts ------
  const suggestedProducts = useMemo(() => {
    if (!product) return []

    // ------ Hàm/Component currentIndex ------
    const currentIndex = products.findIndex((item) => {
      return String(item.id) === String(product.id)
    })

    if (currentIndex === -1) return []

    // ------ Mảng lưu danh sách result ------
    const result = []

    for (let i = 1; i <= products.length; i++) {

      // ------ Khai báo const next index ------
      const nextIndex = (currentIndex + i) % products.length

      // ------ Khai báo const next product ------
      const nextProduct = products[nextIndex]

      if (String(nextProduct.id) !== String(product.id)) {
        result.push(nextProduct)
      }

      if (result.length === 4) break
    }

    return result
  }, [products, product])

  // ------ Khai báo const loading ------
  const loading = isLoadingProductDetail || isLoadingProducts

  if (loading) {
    return (
      <main className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl bg-white p-10 text-center font-bold text-slate-400 shadow-sm">
            <LoadingSpinner/>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-black text-slate-900">
              Không tìm thấy sản phẩm
            </h1>

            <Link
              to="/products"
              className="mt-5 inline-block rounded-xl bg-blue-950 px-6 py-3 font-bold text-white hover:bg-blue-900"
            >
              Quay lại sản phẩm
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ------ Khai báo const discount ------
  const discount = Number(product.discount || 0)

  // ------ Khai báo const is discount product ------
  const isDiscountProduct = discount > 0

  // ------ Khai báo const sale price ------
  const salePrice = isDiscountProduct
    ? getSalePrice(product.price, discount)
    : Number(product.price || 0)

  // ------ Khai báo const is out of stock ------
  const isOutOfStock = Number(product.quantity || 0) <= 0

  // ------ Hàm xử lý change color ------
  const handleChangeColor = (color) => {

    // ------ Khai báo const color default image ------
    const colorDefaultImage =
      color.defaultImage ||
      color.thumbnail ||
      color.images?.[0] ||
      color.detailImages?.[0] ||
      product.image

    setSelectedColorId(color.id)
    setMainImage(colorDefaultImage)
    setAvtImage(colorDefaultImage)
  }

  // ------ Hàm xử lý choose size ------
  const handleChooseSize = (size) => {

    // ------ Khai báo const is available ------
    const isAvailable = product.sizes?.includes(size)

    if (!isAvailable) {
      setSizeError('Size này hiện đã hết')
      return
    }

    setSelectedSize(size)
    setSizeError('')
  }

  // ------ Hàm xử lý decrease ------
  const handleDecrease = () => {
    setBuyQuantity((prev) => Math.max(1, prev - 1))
  }

  // ------ Hàm xử lý increase ------
  const handleIncrease = () => {
    setBuyQuantity((prev) => Math.min(Number(product.quantity || 1), prev + 1))
  }

  // ------ Hàm tạo cart product ------
  const createCartProduct = () => {

    // ------ Khai báo const cart image ------
    const cartImage =
      selectedColor?.defaultImage ||
      selectedColor?.thumbnail ||
      selectedColor?.images?.[0] ||
      selectedColor?.detailImages?.[0] ||
      avtImage ||
      product.image

    return {
      ...product,
      selectedColor,
      selectedSize,
      cartQuantity: buyQuantity,
      image: cartImage,
      selectedGift,
      price: salePrice,
      originalPrice: Number(product.price || 0),
    }
  }

  // ------ Hàm/Component checkBeforeAction ------
  const checkBeforeAction = () => {
    if (!user) {
      setIsLoginPopupOpen(true)
      return false
    }

    if (isOutOfStock) {
      setSizeError('Sản phẩm đã hết hàng')
      return false
    }

    if (!selectedSize) {
      setSizeError('Vui lòng chọn size')
      return false
    }

    return true
  }

  // ------ Hàm xử lý add to cart ------
  const handleAddToCart = () => {
    if (!checkBeforeAction()) return

    dispatch(addToCart(createCartProduct()))
    alert('Đã thêm sản phẩm vào giỏ hàng')
  }

  // ------ Hàm xử lý buy now ------
  const handleBuyNow = () => {
    if (!checkBeforeAction()) return

    navigate('/checkout', {
      state: {
        checkoutItems: [createCartProduct()],
        checkoutType: 'BUY_NOW',
        selectedGift,
      },
    })
  }

  // ------ Hàm xử lý mouse move zoom ------
  const handleMouseMoveZoom = (e) => {

    // ------ Khai báo const image box ------
    const imageBox = imageZoomRef.current
    if (!imageBox) return

    // ------ Khai báo const rect ------
    const rect = imageBox.getBoundingClientRect()

    // ------ Khai báo const x ------
    const x = ((e.clientX - rect.left) / rect.width) * 100

    // ------ Khai báo const y ------
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }

  // ------ Hàm xử lý open album ------
  const handleOpenAlbum = () => {

    // ------ Khai báo const index ------
    const index = detailImages.findIndex((img) => img === mainImage)

    setCurrentAlbumIndex(index >= 0 ? index : 0)
    setAlbumImage(mainImage || detailImages[0] || product.image)
    setIsAlbumOpen(true)
  }

  // ------ Hàm xử lý prev album image ------
  const handlePrevAlbumImage = () => {
    if (detailImages.length === 0) return

    // ------ Khai báo const new index ------
    const newIndex =
      currentAlbumIndex <= 0 ? detailImages.length - 1 : currentAlbumIndex - 1

    setCurrentAlbumIndex(newIndex)
    setAlbumImage(detailImages[newIndex])
  }

  // ------ Hàm xử lý next album image ------
  const handleNextAlbumImage = () => {
    if (detailImages.length === 0) return

    // ------ Khai báo const new index ------
    const newIndex =
      currentAlbumIndex >= detailImages.length - 1 ? 0 : currentAlbumIndex + 1

    setCurrentAlbumIndex(newIndex)
    setAlbumImage(detailImages[newIndex])
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="bg-slate-50 py-8">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
        <section>
          <div
            ref={imageZoomRef}
            onMouseMove={isZoomMode ? handleMouseMoveZoom : undefined}
            onMouseLeave={() => setIsZoomMode(false)}
            className={`relative flex h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 shadow-sm ${
              isZoomMode ? 'cursor-zoom-in' : 'cursor-pointer'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomMode(!isZoomMode)
              }}
              className="absolute right-4 top-4 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-blue-950 shadow hover:bg-slate-100"
              title={isZoomMode ? 'Thu nhỏ ảnh' : 'Phóng to ảnh'}
            >
              <i
                className={
                  isZoomMode
                    ? 'fa-solid fa-magnifying-glass-minus'
                    : 'fa-solid fa-magnifying-glass-plus'
                }
              />
            </button>

            {mainImage && (
              <img
                onClick={() => {
                  if (!isZoomMode) handleOpenAlbum()
                }}
                src={mainImage}
                alt={product.name}
                className={`max-h-full rounded-2xl object-contain transition-transform duration-150 ${
                  isOutOfStock ? 'grayscale' : ''
                }`}
                style={{
                  transform: isZoomMode ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            )}

            {isZoomMode && (
              <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-white">
                Di chuyển chuột để xem chi tiết
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
                Hết hàng
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {detailImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setMainImage(image)}
                className={`h-20 w-20 shrink-0 cursor-pointer rounded-xl border bg-white p-2 duration-100 hover:bg-black/10 ${
                  mainImage === image ? 'border-orange-500' : 'border-slate-200'
                }`}
              >
                <img
                  src={image}
                  alt={product.name}
                  className="h-full w-full rounded-lg object-contain"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-bold text-slate-900">
              {product.name}
            </h1>

            {product.hasGift && (
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                Tặng quà
              </span>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-extrabold text-red-600">
              {salePrice.toLocaleString('vi-VN')}đ
            </p>

            {isDiscountProduct && (
              <>
                <p className="text-slate-400 line-through">
                  {Number(product.price || 0).toLocaleString('vi-VN')}đ
                </p>

                <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p
            className={`mt-3 font-bold ${
              isOutOfStock ? 'text-red-500' : 'text-slate-500'
            }`}
          >
            {isOutOfStock
              ? 'Sản phẩm đã hết hàng'
              : `Còn ${product.quantity} sản phẩm`}
          </p>

          {product.hasGift && (
            <div className="mt-5 rounded-2xl bg-orange-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-black text-orange-700">
                  Chọn quà tặng kèm
                </h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600">
                  Chọn 1 quà tặng
                </span>
              </div>

              <div
                className={`flex flex-col gap-2 pr-1 ${
                  gifts.length + 1 > 3 ? 'max-h-[240px] overflow-y-auto' : ''
                }`}
              >
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3 ${
                    selectedGiftId === 'none'
                      ? 'border-orange-500 ring-2 ring-orange-100'
                      : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedGift"
                    value="none"
                    checked={selectedGiftId === 'none'}
                    onChange={() => setSelectedGiftId('none')}
                  />
                  <span className="p-3 font-bold text-slate-700">
                    Không nhận quà tặng
                  </span>
                </label>

                {gifts.map((gift) => (
                  <label
                    key={gift.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3 ${
                      String(selectedGiftId) === String(gift.id)
                        ? 'border-orange-500 ring-2 ring-orange-100'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedGift"
                      value={gift.id}
                      checked={String(selectedGiftId) === String(gift.id)}
                      onChange={() => setSelectedGiftId(String(gift.id))}
                    />
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="h-12 w-12 rounded-xl bg-orange-50 object-contain p-1"
                    />
                    <span className="font-bold text-slate-700">
                      {gift.name}
                    </span>
                  </label>
                ))}
              </div>

              {gifts.length === 0 && (
                <p className="mt-3 text-sm font-bold text-orange-600">
                  Hiện chưa có quà tặng nào trong hệ thống.
                </p>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-dashed pt-5">
            <div className="flex justify-between">
              <h3 className="font-bold text-slate-800">Màu sắc</h3>

              <p className="text-sm text-slate-400">
                {product.colors?.length || 0} lựa chọn
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors?.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleChangeColor(color)}
                  className={`h-16 w-16 cursor-pointer rounded-xl border bg-white p-1 duration-100 hover:bg-black/10 ${
                    selectedColorId === color.id
                      ? 'border-orange-500'
                      : 'border-slate-200'
                  }`}
                  title={color.name}
                >
                  <img
                    src={color.defaultImage}
                    alt={color.name}
                    className="h-full w-full rounded-lg object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-slate-800">Chọn size</h3>

            <div className="mt-3 flex flex-wrap gap-3">
              {allSizes.map((size) => {

                // ------ Khai báo const is available ------
                const isAvailable = product.sizes?.includes(size)

                return (
                  <button
                    key={size}
                    onClick={() => handleChooseSize(size)}
                    disabled={!isAvailable || isOutOfStock}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold duration-100 ${
                      !isAvailable || isOutOfStock
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300'
                        : selectedSize === size
                        ? 'cursor-pointer border-red-600 bg-red-600 text-white hover:bg-red-600'
                        : 'cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-black/10'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>

            {sizeError && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {sizeError}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-slate-800">Mô tả sản phẩm</h3>

            <p className="mt-2 leading-7 text-slate-600">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex w-fit overflow-hidden rounded-xl border border-slate-300">
              <button
                onClick={handleDecrease}
                disabled={isOutOfStock}
                className="cursor-pointer px-4 py-3 text-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                -
              </button>

              <span className="px-5 py-3 font-bold">{buyQuantity}</span>

              <button
                onClick={handleIncrease}
                disabled={isOutOfStock}
                className="cursor-pointer px-4 py-3 text-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 cursor-pointer rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isOutOfStock ? 'Hết hàng' : 'Thêm giỏ'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 cursor-pointer rounded-xl bg-red-600 py-4 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isOutOfStock ? 'Hết hàng' : 'Mua hàng ngay'}
            </button>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <ProductReviews product={product} />

        {suggestedProducts.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900">
                Sản phẩm đề xuất
              </h2>
              <p className="mt-1 font-semibold text-slate-500">
                Những sản phẩm bạn có thể quan tâm
              </p>
            </div>

            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {suggestedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {isLoginPopupOpen && (
        <div
          onClick={() => setIsLoginPopupOpen(false)}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <button
              onClick={() => setIsLoginPopupOpen(false)}
              className="absolute right-4 top-4 cursor-pointer rounded-full bg-slate-100 px-3 py-1 font-black text-slate-600 hover:bg-red-500 hover:text-white"
            >
              X
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl text-orange-500">
              <i className="fa-solid fa-lock" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Vui lòng đăng nhập
            </h2>

            <p className="mt-3 font-semibold text-slate-500">
              Bạn cần đăng nhập để sử dụng tính năng này.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => navigate('/login')}
                className="cursor-pointer rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
              >
                Đăng nhập
              </button>

              <button
                onClick={() => setIsLoginPopupOpen(false)}
                className="cursor-pointer rounded-xl bg-slate-200 py-3 font-bold text-slate-700 hover:bg-slate-300"
              >
                Không, cảm ơn
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlbumOpen && (
        <div
          onClick={() => setIsAlbumOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[88vh] w-full max-w-5xl flex-col rounded-3xl bg-white p-5 shadow-2xl"
          >
            <button
              onClick={() => setIsAlbumOpen(false)}
              className="absolute right-4 top-4 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-xl text-slate-700 transition hover:bg-red-500 hover:text-white"
              title="Đóng"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <button
              onClick={handlePrevAlbumImage}
              className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-slate-800 shadow-lg transition hover:bg-slate-100"
              title="Ảnh trước"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>

            <button
              onClick={handleNextAlbumImage}
              className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-slate-800 shadow-lg transition hover:bg-slate-100"
              title="Ảnh tiếp theo"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>

            <div className="flex flex-1 items-center justify-center rounded-2xl p-6">
              {albumImage && (
                <img
                  src={albumImage}
                  alt={product.name}
                  className="max-h-[58vh] max-w-full rounded-2xl object-contain"
                />
              )}
            </div>

            <div className="mt-4 flex justify-center gap-3 overflow-x-auto pb-1">
              {detailImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => {
                    setCurrentAlbumIndex(index)
                    setAlbumImage(image)
                  }}
                  className={`h-20 w-20 shrink-0 cursor-pointer rounded-xl border-2 bg-white p-1 transition ${
                    albumImage === image
                      ? 'border-blue-700'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full rounded-lg object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// ===== EXPORTS =====

export default ProductDetail