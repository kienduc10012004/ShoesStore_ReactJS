// ===== IMPORTS =====

import { useMemo, useRef, useState } from 'react'
import { useProductsQuery } from '../../hooks/useProductsQuery.js'
import { useProductMutations } from '../../hooks/useProductMutations.js'
import { formatPrice } from '../../utils/adminUtils.js'
import { showConfirm } from '../../utils/confirmDialog.js'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const per page ------
const PER_PAGE = 10

// ------ Đối tượng cấu hình/dữ liệu empty form ------
const emptyForm = {
  name: '',
  brand: '',
  type: 'low-top',
  typeName: 'Giày cổ thấp',
  price: '',
  quantity: '',
  image: '',
  shortDescription: '',
  description: '',
  discount: 0,
  hasGift: false,
  sizes: '35,36,37,38,39,40,41,42,43,44,45',
  gender: ['boy', 'girl'],
}

// ------ Hàm tạo empty color form ------
const createEmptyColorForm = () => ({
  id: '',
  name: '',
  folderName: '',
  defaultImage: '',
  detailImagesText: '',
})

// ------ Hàm lấy sale price ------
const getSalePrice = (price, discount) => {

  // ------ Khai báo const original price ------
  const originalPrice = Number(price || 0)

  // ------ Khai báo const discount percent ------
  const discountPercent = Number(discount || 0)

  return Math.round((originalPrice * (100 - discountPercent)) / 100)
}

// ------ Hàm lấy type by type name ------
const getTypeByTypeName = (typeName) => {
  switch (typeName) {
    case 'Giày cổ cao':
      return 'high-top'
    case 'Giày chạy bộ':
      return 'running'
    case 'Giày thể thao':
      return 'sport'
    default:
      return 'low-top'
  }
}

// ------ Hàm tạo alias ------
const createAlias = (name = '') => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ------ Hàm lấy color id ------
const getColorId = (name = '', index = 0) => {

  // ------ Khai báo const alias ------
  const alias = createAlias(name)
  return alias || `mau-${index + 1}`
}

// ------ Hàm/Component splitImagesText ------
const splitImagesText = (value = '') => {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

// ------ Hàm/Component convertProductColorsToForm ------
const convertProductColorsToForm = (product) => {
  if (!product?.colors?.length) {
    return [
      {
        id: 'default',
        name: 'Mặc định',
        folderName: 'default',
        defaultImage: product?.image || '',
        detailImagesText: product?.image || '',
      },
    ]
  }

  return product.colors.map((color, index) => {

    // ------ Mảng lưu danh sách images ------
    const images = color.detailImages || color.images || []

    return {
      id: color.id || getColorId(color.name, index),
      name: color.name || '',
      folderName: color.folderName || color.id || getColorId(color.name, index),
      defaultImage:
        color.defaultImage ||
        color.thumbnail ||
        images[0] ||
        product?.image ||
        '',
      detailImagesText:
        images.length > 0
          ? images.join('\n')
          : color.defaultImage || product?.image || '',
    }
  })
}

// ------ Hàm/Component ManageProducts ------
const ManageProducts = () => {
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
    isError,
    error,
  } = useProductsQuery()

  const {
    addProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductMutations()

  // ------ Khai báo const is saving ------
  const isSaving =
    addProductMutation.isPending ||
    updateProductMutation.isPending ||
    deleteProductMutation.isPending

  // ------ Hàm/Component products ------
  const products = useMemo(() => {
    return allProducts.filter((item) => !item.deleted)
  }, [allProducts])

  // ------ State lưu form ------
  const [form, setForm] = useState(emptyForm)

  // ------ State lưu color forms ------
  const [colorForms, setColorForms] = useState([
    {
      id: 'default',
      name: 'Mặc định',
      folderName: 'default',
      defaultImage: '',
      detailImagesText: '',
    },
  ])

  // ------ State lưu editing product ------
  const [editingProduct, setEditingProduct] = useState(null)

  // ------ State lưu search text ------
  const [searchText, setSearchText] = useState('')

  // ------ State lưu keyword ------
  const [keyword, setKeyword] = useState('')

  // ------ State lưu current page ------
  const [currentPage, setCurrentPage] = useState(1)

  // ------ State lưu errors ------
  const [errors, setErrors] = useState({})

  // ------ Ref tham chiếu product table ref ------
  const productTableRef = useRef(null)

  // ------ Chuỗi class hiển thị label class ------
  const labelClass = 'mb-2 block text-sm font-bold text-slate-700'

  // ------ Chuỗi class hiển thị input class ------
  const inputClass =
    'w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500'

  // ------ Chuỗi class hiển thị error class ------
  const errorClass = 'mt-1 text-sm font-semibold text-red-500'

  // ------ Hàm lấy input class ------
  const getInputClass = (fieldName) => {
    return `${inputClass} ${
      errors[fieldName] ? 'border-red-500' : 'border-slate-300'
    }`
  }

  // ------ Hàm/Component brands ------
  const brands = useMemo(() => {
    return [...new Set(products.map((item) => item.brand).filter(Boolean))]
  }, [products])

  // ------ Hàm/Component filteredProducts ------
  const filteredProducts = useMemo(() => {

    // ------ Khai báo const value ------
    const value = keyword.toLowerCase().trim()
    if (!value) return products

    return products.filter((item) => {
      return (
        item.name?.toLowerCase().includes(value) ||
        item.brand?.toLowerCase().includes(value) ||
        item.typeName?.toLowerCase().includes(value) ||
        String(item.id).includes(value)
      )
    })
  }, [products, keyword])

  // ------ Khai báo const total pages ------
  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE) || 1

  // ------ Khai báo const start index ------
  const startIndex = (currentPage - 1) * PER_PAGE

  // ------ Khai báo const current products ------
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PER_PAGE,
  )

  // ------ Hàm kiểm tra sizes ------
  const validateSizes = (sizesText) => {
    if (!sizesText.trim()) {
      return 'Vui lòng nhập size sản phẩm'
    }

    // ------ Khai báo const sizes ------
    const sizes = sizesText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (sizes.length === 0) {
      return 'Vui lòng nhập ít nhất 1 size'
    }

    // ------ Khai báo const is all number ------
    const isAllNumber = sizes.every((item) => !Number.isNaN(Number(item)))

    if (!isAllNumber) {
      return 'Size chỉ được nhập số và cách nhau bằng dấu phẩy'
    }

    // ------ Hàm/Component isValidRange ------
    const isValidRange = sizes.every((item) => {

      // ------ Khai báo const size ------
      const size = Number(item)
      return size >= 35 && size <= 45
    })

    if (!isValidRange) {
      return 'Size phải nằm trong khoảng từ 35 đến 45'
    }

    // ------ Tập hợp giá trị unique sizes không trùng lặp ------
    const uniqueSizes = new Set(sizes.map((item) => Number(item)))

    if (uniqueSizes.size !== sizes.length) {
      return 'Không được nhập size trùng nhau'
    }

    return ''
  }


  // ------ Hàm kiểm tra colors ------
  const validateColors = () => {
    if (colorForms.length === 0) {
      return 'Vui lòng thêm ít nhất 1 màu sản phẩm'
    }

    // ------ Tập hợp giá trị used ids không trùng lặp ------
    const usedIds = new Set()

    for (let index = 0; index < colorForms.length; index++) {

      // ------ Khai báo const color ------
      const color = colorForms[index]

      // ------ Khai báo const color name ------
      const colorName = color.name.trim()

      // ------ Khai báo const default image ------
      const defaultImage = color.defaultImage.trim()

      // ------ Khai báo const detail images ------
      const detailImages = splitImagesText(color.detailImagesText)

      if (!colorName) {
        return `Vui lòng nhập tên màu ở màu số ${index + 1}`
      }

      if (!defaultImage) {
        return `Vui lòng nhập ảnh đại diện cho màu "${colorName}"`
      }

      if (detailImages.length === 0) {
        return `Vui lòng nhập ít nhất 1 ảnh chi tiết cho màu "${colorName}"`
      }

      // ------ Khai báo const color id ------
      const colorId = getColorId(colorName, index)

      if (usedIds.has(colorId)) {
        return `Tên màu "${colorName}" đang bị trùng`
      }

      usedIds.add(colorId)
    }

    return ''
  }

  // ------ Hàm kiểm tra form ------
  const validateForm = () => {

    // ------ Đối tượng cấu hình/dữ liệu new errors ------
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống'
    }

    if (!form.brand.trim()) {
      newErrors.brand = 'Vui lòng nhập hãng sản phẩm'
    }

    if (!form.typeName) {
      newErrors.typeName = 'Vui lòng chọn loại sản phẩm'
    }

    if (!form.price) {
      newErrors.price = 'Vui lòng nhập giá gốc'
    } else if (Number(form.price) <= 0) {
      newErrors.price = 'Giá gốc phải lớn hơn 0'
    }

    if (form.discount === '' || form.discount === null) {
      newErrors.discount = 'Vui lòng nhập phần trăm giảm giá'
    } else if (Number(form.discount) < 0 || Number(form.discount) > 100) {
      newErrors.discount = 'Giảm giá phải từ 0% đến 100%'
    }

    if (form.quantity === '' || form.quantity === null) {
      newErrors.quantity = 'Vui lòng nhập số lượng tồn kho'
    } else if (Number(form.quantity) < 0) {
      newErrors.quantity = 'Số lượng không được nhỏ hơn 0'
    }

    // ------ Khai báo const first color image ------
    const firstColorImage = colorForms[0]?.defaultImage?.trim() || ''

    if (!form.image.trim() && !firstColorImage) {
      newErrors.image = 'Vui lòng nhập ảnh đại diện hoặc ảnh màu đầu tiên'
    }

    // ------ Khai báo const color error ------
    const colorError = validateColors()
    if (colorError) {
      newErrors.colors = colorError
    }

    // ------ Khai báo const size error ------
    const sizeError = validateSizes(form.sizes)
    if (sizeError) {
      newErrors.sizes = sizeError
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // ------ Hàm xử lý change ------
  const handleChange = (e) => {

    // ------ Khai báo const nhóm giá trị ------
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'typeName' ? { type: getTypeByTypeName(value) } : {}),
    })

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }


  // ------ Hàm xử lý change color form ------
  const handleChangeColorForm = (index, fieldName, value) => {
    setColorForms((prev) => {
      return prev.map((color, colorIndex) => {
        if (colorIndex !== index) return color

        // ------ Đối tượng cấu hình/dữ liệu new color ------
        const newColor = {
          ...color,
          [fieldName]: value,
        }

        if (fieldName === 'name') {
          newColor.id = getColorId(value, index)
          newColor.folderName = getColorId(value, index)
        }

        return newColor
      })
    })

    if (errors.colors) {
      setErrors((prev) => ({
        ...prev,
        colors: '',
      }))
    }
  }

  // ------ Hàm xử lý add color ------
  const handleAddColor = () => {
    setColorForms((prev) => [
      ...prev,
      {
        ...createEmptyColorForm(),
        id: `mau-${prev.length + 1}`,
        folderName: `mau-${prev.length + 1}`,
      },
    ])
  }

  // ------ Hàm xử lý remove color ------
  const handleRemoveColor = (index) => {
    if (colorForms.length === 1) {
      alert('Sản phẩm phải có ít nhất 1 màu')
      return
    }

    setColorForms((prev) => prev.filter((_, colorIndex) => colorIndex !== index))
  }

  // ------ Hàm xử lý set main image from color ------
  const handleSetMainImageFromColor = (color) => {

    // ------ Khai báo const image ------
    const image = color.defaultImage.trim()

    if (!image) {
      alert('Màu này chưa có ảnh đại diện')
      return
    }

    setForm((prev) => ({
      ...prev,
      image,
    }))
  }

  // ------ Hàm xử lý search ------
  const handleSearch = () => {
    setKeyword(searchText)
    setCurrentPage(1)
  }

  // ------ Hàm xử lý clear search ------
  const handleClearSearch = () => {
    setSearchText('')
    setKeyword('')
    setCurrentPage(1)
  }

  // ------ Hàm/Component resetForm ------
  const resetForm = () => {
    setForm(emptyForm)
    setColorForms([
      {
        id: 'default',
        name: 'Mặc định',
        folderName: 'default',
        defaultImage: '',
        detailImagesText: '',
      },
    ])
    setEditingProduct(null)
    setErrors({})
  }

  // ------ Hàm xử lý change page ------
  const handleChangePage = (page) => {
    setCurrentPage(page)

    productTableRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  // ------ Hàm lấy product data ------
  const getProductData = () => {

    // ------ Khai báo const price ------
    const price = Number(form.price || 0)

    // ------ Khai báo const discount ------
    const discount = Number(form.discount || 0)

    // ------ Khai báo const sale price ------
    const salePrice = getSalePrice(price, discount)

    // ------ Khai báo const quantity ------
    const quantity = Number(form.quantity || 0)

    // ------ Khai báo const old quantity ------
    const oldQuantity = Number(editingProduct?.quantity || 0)

    // ------ Khai báo const old import quantity ------
    const oldImportQuantity = Number(
      editingProduct?.importQuantity ??
        editingProduct?.initialQuantity ??
        oldQuantity,
    )

    /*
      Nếu admin sửa số lượng tồn kho trong form thì xem như nhập lại kho.
      Vì vậy importQuantity sẽ cập nhật theo quantity mới để thống kê đã bán đúng.
    */

    // ------ Khai báo const should sync import quantity ------
    const shouldSyncImportQuantity =
      !editingProduct || quantity !== oldQuantity

    // ------ Hàm/Component normalizedColors ------
    const normalizedColors = colorForms.map((color, index) => {

      // ------ Khai báo const color name ------
      const colorName = color.name.trim()

      // ------ Khai báo const color id ------
      const colorId = color.id || getColorId(colorName, index)

      // ------ Khai báo const detail images ------
      const detailImages = splitImagesText(color.detailImagesText)

      // ------ Khai báo const default image ------
      const defaultImage = color.defaultImage.trim() || detailImages[0]

      return {
        id: colorId,
        name: colorName,
        folderName: color.folderName || colorId,
        defaultImage,
        detailImages,
        images: detailImages,
        thumbnail: defaultImage,
      }
    })

    // ------ Khai báo const product image ------
    const productImage =
      form.image.trim() ||
      normalizedColors[0]?.defaultImage ||
      editingProduct?.image ||
      ''

    return {
      ...editingProduct,
      ...form,
      id: editingProduct?.id,
      alias: editingProduct?.alias || createAlias(form.name),
      type: getTypeByTypeName(form.typeName),
      image: productImage,
      imgLink: productImage,
      price,
      salePrice,
      oldPrice: price,
      quantity,
      importQuantity: shouldSyncImportQuantity ? quantity : oldImportQuantity,
      discount,
      hasGift: form.hasGift,
      sizes: form.sizes
        .split(',')
        .map((item) => Number(item.trim()))
        .filter(Boolean),
      categories: [
        {
          id: form.brand.toUpperCase(),
          category: form.brand.toUpperCase(),
        },
      ],
      colors: normalizedColors,
      feature: editingProduct?.feature || false,
      deleted: false,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gender: form.gender,
      reviews: editingProduct?.reviews || [],
      rating: Number(editingProduct?.rating || 0),
      totalReviews: Number(
        editingProduct?.totalReviews ??
          editingProduct?.reviews?.filter?.((review) => review.hidden !== true)
            .length ??
          0,
      ),
    }
  }

  // ------ Hàm xử lý submit ------
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync(getProductData())
        alert('Cập nhật sản phẩm thành công')
      } else {
        await addProductMutation.mutateAsync(getProductData())
        alert('Thêm sản phẩm thành công')
      }

      resetForm()
    } catch (error) {
      alert(error?.message || 'Không thể lưu sản phẩm. Vui lòng thử lại.')
    }
  }

  // ------ Hàm xử lý edit ------
  const handleEdit = (product) => {
    setEditingProduct(product)
    setErrors({})

    setForm({
      name: product.name || '',
      brand: product.brand || '',
      type: product.type || 'low-top',
      typeName: product.typeName || 'Giày cổ thấp',
      price: product.price || '',
      quantity: product.quantity || '',
      image: product.image || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      discount: product.discount || 0,
      hasGift: product.hasGift || false,
      sizes: product.sizes?.join(',') || '',
      gender: Array.isArray(product.gender) ? product.gender : ['boy', 'girl'],
    })

    setColorForms(convertProductColorsToForm(product))

    window.scrollTo(0, 0)
  }

  // ------ Hàm xử lý delete ------
  const handleDelete = async (product) => {
    const confirmDelete = await showConfirm({
      title: 'Xóa sản phẩm?',
      message: `Bạn có chắc muốn xóa vĩnh viễn sản phẩm "${product.name}" không?`,
      confirmText: 'Xóa',
    })

    if (!confirmDelete) return

    try {
      await deleteProductMutation.mutateAsync(product.id)

      alert('Xóa sản phẩm thành công')
    } catch (error) {
      alert(error?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.')
    }
  }

  // ------ Khai báo const preview sale price ------
  const previewSalePrice = getSalePrice(form.price, form.discount)

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="grid w-full min-w-0 max-w-full gap-8 overflow-x-hidden px-4 py-5 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-8">
      <section className="min-w-0 lg:col-span-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-6 shadow-sm lg:sticky lg:top-24"
        >
          <h2 className="mb-6 text-xl font-black">
            {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Tên sản phẩm *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={getInputClass('name')}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && <p className={errorClass}>{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Giá gốc *</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  className={getInputClass('price')}
                  placeholder="3000000"
                />
                {errors.price && <p className={errorClass}>{errors.price}</p>}
              </div>

              <div>
                <label className={labelClass}>Giảm giá (%) *</label>
                <input
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  max="100"
                  className={getInputClass('discount')}
                  placeholder="10"
                />
                {errors.discount && (
                  <p className={errorClass}>{errors.discount}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-sm font-bold text-slate-500">
                Giá bán sau giảm
              </p>
              <p className="mt-1 text-2xl font-black text-red-600">
                {formatPrice(previewSalePrice)}
              </p>
            </div>

            <div>
              <label className={labelClass}>Giới tính *</label>
              <select
                value={
                  form.gender?.includes('boy') && form.gender?.includes('girl')
                    ? 'boy-girl'
                    : form.gender?.includes('boy')
                      ? 'boy'
                      : form.gender?.includes('girl')
                        ? 'girl'
                        : 'boy-girl'
                }
                onChange={(e) => {

                  // ------ Khai báo const value ------
                  const value = e.target.value

                  setForm({
                    ...form,
                    gender: value === 'boy-girl' ? ['boy', 'girl'] : [value],
                  })
                }}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="boy">Nam</option>
                <option value="girl">Nữ</option>
                <option value="boy-girl">Nam và nữ</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Số lượng tồn kho *</label>
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                type="number"
                className={getInputClass('quantity')}
                placeholder="100"
              />
              {errors.quantity && (
                <p className={errorClass}>{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Hãng sản phẩm *</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                list="brand-list"
                className={getInputClass('brand')}
                placeholder="Nike, Adidas..."
              />

              <datalist id="brand-list">
                {brands.map((brand) => (
                  <option key={brand} value={brand} />
                ))}
              </datalist>

              {errors.brand && <p className={errorClass}>{errors.brand}</p>}
            </div>

            <div>
              <label className={labelClass}>Loại sản phẩm *</label>
              <select
                name="typeName"
                value={form.typeName}
                onChange={handleChange}
                className={`${getInputClass('typeName')} cursor-pointer`}
              >
                <option value="Giày cổ thấp">Giày cổ thấp</option>
                <option value="Giày cổ cao">Giày cổ cao</option>
              </select>

              {errors.typeName && (
                <p className={errorClass}>{errors.typeName}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Ảnh đại diện sản phẩm</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className={getInputClass('image')}
                placeholder="/img-shoes/... hoặc lấy từ ảnh màu đầu tiên"
              />
              {errors.image && <p className={errorClass}>{errors.image}</p>}

              {form.image && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-bold text-slate-500">
                    Xem trước ảnh đại diện
                  </p>
                  <img
                    src={form.image}
                    alt={form.name}
                    className="h-24 w-24 rounded-xl bg-white object-contain p-2"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-orange-600">
                    Màu sắc và ảnh sản phẩm
                  </h3>
                  <p className="mt-1 text-xs font-bold text-orange-700">
                    Mỗi màu có 1 ảnh đại diện và nhiều ảnh chi tiết.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddColor}
                  className="shrink-0 cursor-pointer rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
                >
                  + Màu
                </button>
              </div>

              {errors.colors && (
                <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-500">
                  {errors.colors}
                </p>
              )}

              <div className="space-y-4">
                {colorForms.map((color, index) => {

                  // ------ Khai báo const detail images ------
                  const detailImages = splitImagesText(color.detailImagesText)

                  return (
                    <div
                      key={index}
                      className="rounded-2xl border bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h4 className="font-black text-slate-800">
                          Màu {index + 1}
                        </h4>

                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          className="cursor-pointer rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-100"
                        >
                          Xóa màu
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            Tên màu *
                          </label>
                          <input
                            value={color.name}
                            onChange={(e) =>
                              handleChangeColorForm(
                                index,
                                'name',
                                e.target.value,
                              )
                            }
                            className={`${inputClass} border-slate-300`}
                            placeholder="Đen, Trắng, Trắng / Đen..."
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            Ảnh đại diện màu *
                          </label>
                          <input
                            value={color.defaultImage}
                            onChange={(e) =>
                              handleChangeColorForm(
                                index,
                                'defaultImage',
                                e.target.value,
                              )
                            }
                            className={`${inputClass} border-slate-300`}
                            placeholder="/img-shoes/...-01.avif"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            Ảnh chi tiết của màu *
                          </label>
                          <textarea
                            value={color.detailImagesText}
                            onChange={(e) =>
                              handleChangeColorForm(
                                index,
                                'detailImagesText',
                                e.target.value,
                              )
                            }
                            rows="4"
                            className={`${inputClass} border-slate-300`}
                            placeholder={`Mỗi dòng 1 ảnh:
/img-shoes/...-01.avif
/img-shoes/...-02.avif
/img-shoes/...-03.avif`}
                          />
                        </div>

                        {color.defaultImage && (
                          <div className="rounded-xl bg-slate-50 p-3">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-xs font-bold text-slate-500">
                                Xem trước
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  handleSetMainImageFromColor(color)
                                }
                                className="cursor-pointer rounded-lg bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-300"
                              >
                                Dùng làm ảnh đại diện
                              </button>
                            </div>

                            <div className="flex gap-2 overflow-x-auto">
                              <img
                                src={color.defaultImage}
                                alt={color.name}
                                className="h-16 w-16 shrink-0 rounded-lg bg-white object-contain p-1 ring-2 ring-orange-300"
                              />

                              {detailImages.map((image, imageIndex) => (
                                <img
                                  key={`${image}-${imageIndex}`}
                                  src={image}
                                  alt={color.name}
                                  className="h-16 w-16 shrink-0 rounded-lg bg-white object-contain p-1"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <label className={labelClass}>Các size hiện có *</label>
              <input
                name="sizes"
                value={form.sizes}
                onChange={handleChange}
                className={getInputClass('sizes')}
                placeholder="35,36,37..."
              />
              {errors.sizes && <p className={errorClass}>{errors.sizes}</p>}
            </div>

            <div>
              <label className={labelClass}>Mô tả ngắn</label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows="3"
                className={inputClass}
                placeholder="Nhập mô tả ngắn"
              />
            </div>

            <div>
              <label className={labelClass}>Mô tả chi tiết</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                className={inputClass}
                placeholder="Nhập mô tả chi tiết"
              />
            </div>

            <div className="rounded-2xl bg-orange-50 p-4">
              <h3 className="mb-3 font-black text-orange-600">
                Trạng thái quà tặng
              </h3>

              <label className="flex cursor-pointer items-center gap-2 font-bold text-orange-600">
                <input
                  type="checkbox"
                  name="hasGift"
                  checked={form.hasGift}
                  onChange={handleChange}
                  className='accent-orange-600'
                />
                Sản phẩm này được chọn quà tặng
              </label>

              <p className="mt-2 text-sm font-semibold text-orange-700">
                Danh sách quà tặng được quản lý riêng ở mục Quản lý quà tặng.
                Khách hàng sẽ chọn 1 quà hoặc chọn không nhận quà ở trang chi
                tiết sản phẩm.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                disabled={isSaving}
                className="flex-1 cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-slate-400 duration-100"
              >
                {isSaving
                  ? 'Đang lưu...'
                  : editingProduct
                    ? 'Cập nhật'
                    : 'Tạo mới'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="cursor-pointer rounded-xl bg-slate-200 hover:bg-slate-300 duration-100 px-5 font-bold disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </section>

      <section
        className="min-w-0 w-full overflow-hidden lg:col-span-8"
        ref={productTableRef}
      >
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">Danh sách sản phẩm</h2>
              <p className="mt-1 text-sm font-bold text-slate-400">
                Hiển thị {currentProducts.length} / {filteredProducts.length}{' '}
                sản phẩm
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 md:w-72"
                placeholder="Tìm kiếm sản phẩm..."
              />

              <button
                type="button"
                onClick={handleSearch}
                className="cursor-pointer rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-black/80 duration-100"
              >
                Tìm
              </button>

              {keyword && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="cursor-pointer rounded-xl bg-slate-200 px-4 py-3 font-bold text-slate-700 hover:bg-slate-300"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {isError && (
            <div className="m-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
              {error?.message || 'Không thể tải danh sách sản phẩm.'}
            </div>
          )}

          <div
            className="w-full overflow-x-auto"
            style={{
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <table className="w-full min-w-[1050px] table-fixed text-left xl:min-w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b text-xs uppercase text-slate-400">
                  <th className="w-[34%] p-4">Sản phẩm</th>
                  <th className="w-[22%] p-4">Thông tin</th>
                  <th className="w-[16%] p-4 text-right">Giá</th>
                  <th className="w-[10%] p-4 text-center">Kho</th>
                  <th className="w-[18%] p-4 text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {isLoadingProducts ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center font-bold text-slate-400"
                    >
                      <LoadingSpinner/>
                    </td>
                  </tr>
                ) : currentProducts.length > 0 ? (
                  currentProducts.map((product) => {

                    // ------ Khai báo const sale price ------
                    const salePrice = getSalePrice(
                      product.price,
                      product.discount,
                    )

                    return (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-slate-50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-16 w-16 rounded-xl bg-slate-100 object-contain"
                            />

                            <div>
                              <p className="font-black">{product.name}</p>
                              <p className="text-xs font-bold text-indigo-600">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="font-bold">{product.brand}</p>
                          <p className="text-sm text-slate-400">
                            {product.typeName}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {Number(product.discount) > 0 && (
                              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                                -{product.discount}%
                              </span>
                            )}

                            {product.colors?.length > 0 && (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
                                {product.colors.length} màu
                              </span>
                            )}

                            {product.hasGift && (
                              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                                Quà tặng
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          {Number(product.discount) > 0 && (
                            <p className="text-sm font-bold text-slate-400 line-through">
                              {formatPrice(product.price)}
                            </p>
                          )}

                          <p className="font-black text-red-500">
                            {formatPrice(salePrice)}
                          </p>

                          <p className="text-xs font-bold text-slate-400">
                            Giảm: {product.discount || 0}%
                          </p>
                        </td>

                        <td className="p-4 text-center">
                          <p className="font-black">{product.quantity}</p>
                          <p className="text-xs font-bold text-slate-400">
                            sản phẩm
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <button
                              onClick={() => handleEdit(product)}
                              disabled={isSaving}
                              className="min-w-[70px] cursor-pointer rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              Sửa
                            </button>

                            <button
                              onClick={() => handleDelete(product)}
                              disabled={isSaving}
                              className="min-w-[70px] cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center font-bold text-slate-400"
                    >
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-center gap-2 border-t p-5">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleChangePage(index + 1)}
                className={`cursor-pointer rounded-xl px-4 py-2 font-bold ${
                  currentPage === index + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

// ===== EXPORTS =====

export default ManageProducts
