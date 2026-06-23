// ===== IMPORTS =====

import axios from 'axios'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Đối tượng cấu hình/dữ liệu axios client ------
const axiosClient = axios.create({
  baseURL: 'https://69f8c3e5f7044aa0103e73e0.mockapi.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== EXPORTS =====

export default axiosClient
