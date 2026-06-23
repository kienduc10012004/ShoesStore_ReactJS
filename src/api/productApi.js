// ===== IMPORTS =====

import axiosClient from './axiosClient.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Đối tượng cấu hình/dữ liệu product api ------
const productApi = {
  getAll() {
    return axiosClient.get('/shoes')
  },

  getById(id) {
    return axiosClient.get(`/shoes/${id}`)
  },

  create(product) {

    // ------ Khai báo const nhóm giá trị ------
    const { id, ...data } = product
    return axiosClient.post('/shoes', data)
  },

  update(id, product) {

    // ------ Khai báo const nhóm giá trị ------
    const { id: productId, ...data } = product
    return axiosClient.put(`/shoes/${id}`, data)
  },

  remove(id) {
    return axiosClient.delete(`/shoes/${id}`)
  },
}

// ===== EXPORTS =====

export default productApi