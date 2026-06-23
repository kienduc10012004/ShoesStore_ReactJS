// import { useMemo, useState } from 'react'
// import { checkGenderMatch } from '../utils/genderUtils.js'

// export const useProductFilter = (products = [], perPage = 10) => {
//   const [searchText, setSearchText] = useState('')
//   const [selectedBrand, setSelectedBrand] = useState('ALL')
//   const [selectedType, setSelectedType] = useState('ALL')
//   const [selectedGender, setSelectedGender] = useState('ALL')
//   const [selectedPrice, setSelectedPrice] = useState('ALL')
//   const [sortPrice, setSortPrice] = useState('default')
//   const [currentPage, setCurrentPage] = useState(1)

//   const filteredProducts = useMemo(() => {
//     let result = [...products]

//     if (searchText.trim()) {
//       const keyword = searchText.toLowerCase().trim()

//       result = result.filter((product) => {
//         return (
//           product.name?.toLowerCase().includes(keyword) ||
//           product.brand?.toLowerCase().includes(keyword) ||
//           product.shortDescription?.toLowerCase().includes(keyword)
//         )
//       })
//     }

//     if (selectedBrand !== 'ALL') {
//       result = result.filter((product) => product.brand === selectedBrand)
//     }

//     if (selectedType !== 'ALL') {
//       result = result.filter((product) => product.typeName === selectedType)
//     }

//     result = result.filter((product) => {
//       return checkGenderMatch(product, selectedGender)
//     })

//     if (selectedPrice !== 'ALL') {
//       result = result.filter((product) => {
//         const price = Number(product.price)

//         if (selectedPrice === '1') return price < 1000000
//         if (selectedPrice === '2') return price >= 1000000 && price <= 2000000
//         if (selectedPrice === '3') return price >= 2000000 && price <= 3000000
//         if (selectedPrice === '4') return price >= 3000000 && price <= 5000000
//         if (selectedPrice === '5') return price > 5000000

//         return true
//       })
//     }

//     if (sortPrice === 'asc') {
//       result.sort((a, b) => Number(a.price) - Number(b.price))
//     }

//     if (sortPrice === 'desc') {
//       result.sort((a, b) => Number(b.price) - Number(a.price))
//     }

//     return result
//   }, [
//     products,
//     searchText,
//     selectedBrand,
//     selectedType,
//     selectedGender,
//     selectedPrice,
//     sortPrice,
//   ])

//   const totalPages = Math.ceil(filteredProducts.length / perPage) || 1

//   const currentProducts = filteredProducts.slice(
//     (currentPage - 1) * perPage,
//     currentPage * perPage
//   )

//   const changeSearchText = (value) => {
//     setSearchText(value)
//     setCurrentPage(1)
//   }

//   const changeBrand = (value) => {
//     setSelectedBrand(value)
//     setCurrentPage(1)
//   }

//   const changeType = (value) => {
//     setSelectedType(value)
//     setCurrentPage(1)
//   }

//   const changeGender = (value) => {
//     setSelectedGender(value)
//     setCurrentPage(1)
//   }

//   const changePrice = (value) => {
//     setSelectedPrice(value)
//     setCurrentPage(1)
//   }

//   const changeSortPrice = (value) => {
//     setSortPrice(value)
//     setCurrentPage(1)
//   }

//   const resetFilter = () => {
//     setSearchText('')
//     setSelectedBrand('ALL')
//     setSelectedType('ALL')
//     setSelectedGender('ALL')
//     setSelectedPrice('ALL')
//     setSortPrice('default')
//     setCurrentPage(1)
//   }

//   return {
//     searchText,
//     selectedBrand,
//     selectedType,
//     selectedGender,
//     selectedPrice,
//     sortPrice,
//     currentPage,
//     totalPages,
//     currentProducts,
//     filteredProducts,

//     setCurrentPage,
//     changeSearchText,
//     changeBrand,
//     changeType,
//     changeGender,
//     changePrice,
//     changeSortPrice,
//     resetFilter,
//   }
// }

// ===== IMPORTS =====

import { useMemo, useState } from "react";
import { checkGenderMatch } from "../utils/genderUtils.js";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm lấy visible reviews ------
const getVisibleReviews = (product) => {
  return Array.isArray(product?.reviews)
    ? product.reviews.filter((review) => review.hidden !== true)
    : [];
};

// ------ Hàm lấy product rating ------
const getProductRating = (product) => {

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

// ===== EXPORTS =====

// ------ Custom hook quản lý product filter ------
export const useProductFilter = (products = [], perPage = 10) => {

  // ------ State lưu search text ------
  const [searchText, setSearchText] = useState("");

  // ------ State lưu selected brand ------
  const [selectedBrand, setSelectedBrand] = useState("ALL");

  // ------ State lưu selected type ------
  const [selectedType, setSelectedType] = useState("ALL");

  // ------ State lưu selected gender ------
  const [selectedGender, setSelectedGender] = useState("ALL");

  // ------ State lưu selected price ------
  const [selectedPrice, setSelectedPrice] = useState("ALL");

  // ------ State lưu selected rating ------
  const [selectedRating, setSelectedRating] = useState("ALL");

  // ------ State lưu sort price ------
  const [sortPrice, setSortPrice] = useState("default");

  // ------ State lưu current page ------
  const [currentPage, setCurrentPage] = useState(1);

  // ------ Hàm/Component filteredProducts ------
  const filteredProducts = useMemo(() => {

    // ------ Khai báo let result ------
    let result = [...products];

    if (searchText.trim()) {

      // ------ Khai báo const keyword ------
      const keyword = searchText.toLowerCase().trim();

      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(keyword) ||
          product.brand?.toLowerCase().includes(keyword) ||
          product.shortDescription?.toLowerCase().includes(keyword)
        );
      });
    }

    if (selectedBrand !== "ALL") {
      result = result.filter((product) => product.brand === selectedBrand);
    }

    if (selectedType !== "ALL") {
      result = result.filter((product) => product.typeName === selectedType);
    }

    result = result.filter((product) => {
      return checkGenderMatch(product, selectedGender);
    });

    if (selectedPrice !== "ALL") {
      result = result.filter((product) => {

        // ------ Khai báo const price ------
        const price = Number(product.price);

        if (selectedPrice === "1") return price < 1000000;
        if (selectedPrice === "2") return price >= 1000000 && price <= 2000000;
        if (selectedPrice === "3") return price >= 2000000 && price <= 3000000;
        if (selectedPrice === "4") return price >= 3000000 && price <= 5000000;
        if (selectedPrice === "5") return price > 5000000;

        return true;
      });
    }

    if (selectedRating !== "ALL") {
      result = result.filter((product) => {

        // ------ Khai báo const rating ------
        const rating = getProductRating(product);

        // Chưa có đánh giá
        if (selectedRating === "0") {
          return rating === 0;
        }

        // ------ Khai báo const selected ------
        const selected = Number(selectedRating);

        // Chỉ lấy đúng số sao
        return rating >= selected && rating < selected + 1;
      });
    }

    if (sortPrice === "asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortPrice === "desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [
    products,
    searchText,
    selectedBrand,
    selectedType,
    selectedGender,
    selectedPrice,
    selectedRating,
    sortPrice,
  ]);

  // ------ Khai báo const total pages ------
  const totalPages = Math.ceil(filteredProducts.length / perPage) || 1;

  // ------ Khai báo const current products ------
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ------ Hàm/Component changeSearchText ------
  const changeSearchText = (value) => {
    setSearchText((prev) => {
      if (prev === value) return prev;
      setCurrentPage(1);
      return value;
    });
  };

  // ------ Hàm/Component changeBrand ------
  const changeBrand = (value) => {
    setSelectedBrand(value);
    setCurrentPage(1);
  };

  // ------ Hàm/Component changeType ------
  const changeType = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  // ------ Hàm/Component changeGender ------
  const changeGender = (value) => {
    setSelectedGender(value);
    setCurrentPage(1);
  };

  // ------ Hàm/Component changePrice ------
  const changePrice = (value) => {
    setSelectedPrice(value);
    setCurrentPage(1);
  };

  // ------ Hàm/Component changeRating ------
  const changeRating = (value) => {
    setSelectedRating(value);
    setCurrentPage(1);
  };

  // ------ Hàm/Component changeSortPrice ------
  const changeSortPrice = (value) => {
    setSortPrice(value);
    setCurrentPage(1);
  };

  // ------ Hàm/Component resetFilter ------
  const resetFilter = () => {
    setSearchText("");
    setSelectedBrand("ALL");
    setSelectedType("ALL");
    setSelectedGender("ALL");
    setSelectedPrice("ALL");
    setSelectedRating("ALL");
    setSortPrice("default");
    setCurrentPage(1);
  };

  return {
    searchText,
    selectedBrand,
    selectedType,
    selectedGender,
    selectedPrice,
    selectedRating,
    sortPrice,
    currentPage,
    totalPages,
    currentProducts,
    filteredProducts,

    setCurrentPage,
    changeSearchText,
    changeBrand,
    changeType,
    changeGender,
    changePrice,
    changeRating,
    changeSortPrice,
    resetFilter,
  };
};
