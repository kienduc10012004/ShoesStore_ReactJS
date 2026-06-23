// ===== IMPORTS =====

import { useMutation, useQueryClient } from '@tanstack/react-query'
import productApi from '../api/productApi.js'
import { productKeys } from './useProductsQuery.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm xóa id from body ------
const removeIdFromBody = (product = {}) => {

  // ------ Khai báo const nhóm giá trị ------
  const { id, ...data } = product
  return data
}

// ===== EXPORTS =====

// ------ Custom hook quản lý product mutations ------
export const useProductMutations = () => {

  // ------ Khai báo const query client ------
  const queryClient = useQueryClient()

  // ------ Hàm/Component refreshProducts ------
  const refreshProducts = (productId) => {
    queryClient.invalidateQueries({ queryKey: productKeys.all })

    if (productId) {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      })
    }
  }

  // ------ Đối tượng cấu hình/dữ liệu add product mutation ------
  const addProductMutation = useMutation({
    mutationFn: async (product) => {

      // ------ Khai báo const res ------
      const res = await productApi.create(removeIdFromBody(product))
      return res.data
    },
    onSuccess: () => {
      refreshProducts()
    },
  })

  // ------ Đối tượng cấu hình/dữ liệu update product mutation ------
  const updateProductMutation = useMutation({
    mutationFn: async (product) => {
      if (!product?.id) {
        throw new Error('Không tìm thấy ID sản phẩm để cập nhật.')
      }

      // ------ Khai báo const res ------
      const res = await productApi.update(product.id, removeIdFromBody(product))
      return res.data
    },
    onSuccess: (updatedProduct) => {
      refreshProducts(updatedProduct?.id)
    },
  })

  // ------ Đối tượng cấu hình/dữ liệu delete product mutation ------
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      if (!id) {
        throw new Error('Không tìm thấy ID sản phẩm để xóa.')
      }

      await productApi.remove(id)
      return id
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: productKeys.detail(id) })
      refreshProducts(id)
    },
  })

  // ------ Đối tượng cấu hình/dữ liệu decrease stock mutation ------
  const decreaseStockMutation = useMutation({
    mutationFn: async ({ product, quantity }) => {
      if (!product?.id) {
        throw new Error('Không tìm thấy ID sản phẩm để cập nhật tồn kho.')
      }

      // ------ Khai báo const new quantity ------
      const newQuantity = Math.max(
        0,
        Number(product.quantity || 0) - Number(quantity || 0),
      )

      // ------ Khai báo const res ------
      const res = await productApi.update(
        product.id,
        removeIdFromBody({
          ...product,
          quantity: newQuantity,
          updatedAt: new Date().toISOString(),
        }),
      )

      return res.data
    },
    onSuccess: (updatedProduct) => {
      refreshProducts(updatedProduct?.id)
    },
  })

  // ------ Đối tượng cấu hình/dữ liệu increase stock mutation ------
  const increaseStockMutation = useMutation({
    mutationFn: async ({ product, quantity }) => {
      if (!product?.id) {
        throw new Error('Không tìm thấy ID sản phẩm để cập nhật tồn kho.')
      }

      // ------ Khai báo const new quantity ------
      const newQuantity = Number(product.quantity || 0) + Number(quantity || 0)

      // ------ Khai báo const res ------
      const res = await productApi.update(
        product.id,
        removeIdFromBody({
          ...product,
          quantity: newQuantity,
          updatedAt: new Date().toISOString(),
        }),
      )

      return res.data
    },
    onSuccess: (updatedProduct) => {
      refreshProducts(updatedProduct?.id)
    },
  })

  return {
    addProductMutation,
    updateProductMutation,
    deleteProductMutation,
    decreaseStockMutation,
    increaseStockMutation,
  }
}
