// ===== IMPORTS =====

import { useQuery } from '@tanstack/react-query'
import productApi from '../api/productApi.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ===== EXPORTS =====

// ------ Đối tượng cấu hình/dữ liệu product keys ------
export const productKeys = {
  all: ['products'],
  detail: (id) => ['products', String(id)],
}

// ------ Hàm/Component normalizeProduct ------
export const normalizeProduct = (product = {}) => {

  // ------ Khai báo const quantity ------
  const quantity = Number(product.quantity || 0)

  // ------ Khai báo const visible reviews ------
  const visibleReviews = Array.isArray(product.reviews)
    ? product.reviews.filter((review) => review.hidden !== true)
    : []

  return {
    ...product,
    id: product.id,
    name: product.name || '',
    alias: product.alias || '',
    brand: product.brand || '',
    type: product.type || 'low-top',
    typeName: product.typeName || 'Giày cổ thấp',
    price: Number(product.price || 0),
    salePrice: Number(product.salePrice || product.price || 0),
    oldPrice: Number(product.oldPrice || product.price || 0),
    discount: Number(product.discount || 0),
    quantity,
    importQuantity: Number(product.importQuantity ?? quantity),
    image: product.image || '',
    imgLink: product.imgLink || product.image || '',
    deleted: Boolean(product.deleted),
    feature: Boolean(product.feature),
    hasGift: Boolean(product.hasGift),
    gender: Array.isArray(product.gender) ? product.gender : ['boy', 'girl'],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    rating: Number(product.totalReviews ?? visibleReviews.length) > 0
      ? Number(product.rating || 0)
      : 0,
    totalReviews: Number(product.totalReviews ?? visibleReviews.length),
    createdAt: product.createdAt || '',
    updatedAt: product.updatedAt || '',
  }
}

// ------ Custom hook quản lý products query ------
export const useProductsQuery = () => {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: async () => {

      // ------ Khai báo const res ------
      const res = await productApi.getAll()

      // ------ Khai báo const data ------
      const data = Array.isArray(res) ? res : res.data

      return Array.isArray(data)
        ? data.map((product) => normalizeProduct(product))
        : []
    },
  })
}
