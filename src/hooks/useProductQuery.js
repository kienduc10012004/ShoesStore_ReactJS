// ===== IMPORTS =====

import { useQuery } from '@tanstack/react-query'
import productApi from '../api/productApi.js'
import { normalizeProduct, productKeys } from './useProductsQuery.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ===== EXPORTS =====

// ------ Custom hook quản lý product query ------
export const useProductQuery = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    enabled: Boolean(id),
    queryFn: async () => {

      // ------ Khai báo const res ------
      const res = await productApi.getById(id)

      // ------ Khai báo const data ------
      const data = res?.data || res
      return normalizeProduct(data)
    },
  })
}
