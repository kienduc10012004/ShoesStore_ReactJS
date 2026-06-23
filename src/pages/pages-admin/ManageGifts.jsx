// ===== IMPORTS =====

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addGift,
  deleteGift,
  updateGift,
} from "../../redux/slices/giftSlice.js";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Đối tượng cấu hình/dữ liệu empty form ------
const emptyForm = {
  name: "",
  image: "",
};

// ------ Hàm/Component normalizeText ------
const normalizeText = (value = "") => {
  return value.trim().toLowerCase();
};

// ------ Hàm/Component ManageGifts ------
const ManageGifts = () => {

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch();

  // ------ Lay dữ liệu gifts từ Redux store ------
  const gifts = useSelector((state) => state.giftStore.gifts);

  // ------ State lưu form ------
  const [form, setForm] = useState(emptyForm);

  // ------ State lưu editing gift ------
  const [editingGift, setEditingGift] = useState(null);

  // ------ State lưu errors ------
  const [errors, setErrors] = useState({});

  // ------ State lưu selected gift ids ------
  const [selectedGiftIds, setSelectedGiftIds] = useState([]);

  // ------ Hàm kiểm tra form ------
  const validateForm = () => {

    // ------ Đối tượng cấu hình/dữ liệu new errors ------
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Vui lòng nhập tên quà tặng";
    }

    if (!form.image.trim()) {
      newErrors.image = "Vui lòng nhập đường dẫn hình ảnh quà tặng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------ Hàm/Component isDuplicateGift ------
  const isDuplicateGift = () => {

    // ------ Khai báo const gift name ------
    const giftName = normalizeText(form.name);

    // ------ Khai báo const gift image ------
    const giftImage = normalizeText(form.image);

    return gifts.some((gift) => {

      // ------ Khai báo const is same gift ------
      const isSameGift =
        normalizeText(gift.name) === giftName &&
        normalizeText(gift.image) === giftImage;

      // ------ Khai báo const is current editing gift ------
      const isCurrentEditingGift =
        editingGift && String(gift.id) === String(editingGift.id);

      return isSameGift && !isCurrentEditingGift;
    });
  };

  // ------ Hàm xử lý change ------
  const handleChange = (e) => {

    // ------ Khai báo const nhóm giá trị ------
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // ------ Hàm/Component resetForm ------
  const resetForm = () => {
    setForm(emptyForm);
    setEditingGift(null);
    setErrors({});
  };

  // ------ Hàm xử lý submit ------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isDuplicateGift()) {
      alert("Quà tặng này đã tồn tại trong danh sách.");
      return;
    }

    // ------ Đối tượng cấu hình/dữ liệu gift data ------
    const giftData = {
      id: editingGift?.id,
      name: form.name.trim(),
      image: form.image.trim(),
    };

    if (editingGift) {
      dispatch(updateGift(giftData));
      alert("Cập nhật quà tặng thành công");
    } else {
      dispatch(addGift(giftData));
      alert("Thêm quà tặng thành công");
    }

    resetForm();
  };

  // ------ Hàm xử lý edit gift ------
  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setForm({
      name: gift.name || "",
      image: gift.image || "",
    });
    setErrors({});
    window.scrollTo(0, 0);
  };

  // ------ Hàm xử lý delete gift ------
  const handleDeleteGift = (gift) => {

    // ------ Khai báo const confirm delete ------
    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa quà tặng "${gift.name}"?`,
    );

    if (!confirmDelete) return;

    dispatch(deleteGift(gift.id));
    setSelectedGiftIds((prev) =>
      prev.filter((id) => String(id) !== String(gift.id)),
    );
  };

  // ------ Hàm xử lý toggle select gift ------
  const handleToggleSelectGift = (giftId) => {
    setSelectedGiftIds((prev) => {

      // ------ Khai báo const existed ------
      const existed = prev.some((id) => String(id) === String(giftId));

      if (existed) {
        return prev.filter((id) => String(id) !== String(giftId));
      }

      return [...prev, giftId];
    });
  };

  // ------ Hàm xử lý delete selected gifts ------
  const handleDeleteSelectedGifts = () => {
    if (selectedGiftIds.length === 0) return;

    // ------ Khai báo const confirm delete ------
    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa ${selectedGiftIds.length} quà tặng đã chọn?`,
    );

    if (!confirmDelete) return;

    selectedGiftIds.forEach((id) => {
      dispatch(deleteGift(id));
    });

    setSelectedGiftIds([]);
  };

  // ------ Hàm xử lý delete all gifts ------
  const handleDeleteAllGifts = () => {
    if (gifts.length === 0) return;

    // ------ Khai báo const confirm delete ------
    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa tất cả ${gifts.length} quà tặng?`,
    );

    if (!confirmDelete) return;

    gifts.forEach((gift) => {
      dispatch(deleteGift(gift.id));
    });

    setSelectedGiftIds([]);
    resetForm();
  };

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="grid w-full min-w-0 max-w-full gap-8 overflow-x-hidden px-4 py-5 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-8">
      <section className="min-w-0 lg:col-span-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-6 shadow-sm lg:sticky lg:top-24"
        >
          <h1 className="text-2xl font-black text-slate-900">
            {editingGift ? "Cập nhật quà tặng" : "Thêm quà tặng"}
          </h1>

          <p className="mt-2 text-sm font-bold text-slate-400">
            Quà tặng dùng chung cho tất cả sản phẩm có bật trạng thái có quà
            tặng.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Tên quà tặng *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 ${
                  errors.name ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="Ví dụ: Tất trắng KienShoes"
              />

              {errors.name && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Hình ảnh quà tặng *
              </label>

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 ${
                  errors.image ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="/img-gifts/tat.png"
              />

              {errors.image && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {errors.image}
                </p>
              )}
            </div>

            {form.image && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm font-bold text-slate-500">
                  Xem trước
                </p>

                <img
                  src={form.image}
                  alt={form.name}
                  className="h-28 w-28 rounded-2xl bg-white object-contain p-2"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button className="flex-1 cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-black/80 duration-100">
                {editingGift ? "Cập nhật" : "Thêm mới"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer rounded-xl duration-100 bg-slate-200 px-5 font-bold text-slate-700 hover:bg-slate-300"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="min-w-0 lg:col-span-8">
        <div className="overflow-visible rounded-3xl border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Danh sách quà tặng
              </h2>
              <p className="mt-1 text-sm font-bold text-slate-400">
                Hiện có {gifts.length} quà tặng
              </p>
            </div>

            {gifts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedGiftIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedGifts}
                    className="cursor-pointer rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 duration-100"
                  >
                    Xóa đã chọn ({selectedGiftIds.length})
                  </button>
                )}

                <button
                  onClick={handleDeleteAllGifts}
                  className="cursor-pointer rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-red-600 duration-100"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {gifts.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl text-orange-500">
                <i className="fa-solid fa-gift"></i>
              </div>
              <h3 className="text-xl font-black text-slate-800">
                Chưa có quà tặng nào
              </h3>
              <p className="mt-2 font-semibold text-slate-400">
                Hãy thêm quà tặng để khách hàng có thể lựa chọn.
              </p>
            </div>
          ) : (
            <div
              className={`grid  gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 ${
                gifts.length > 6 ? "overflow-y-scroll max-h-[750px]" : ""
              }`}
            >
              {gifts.map((gift) => {

                // ------ Khai báo const checked ------
                const checked = selectedGiftIds.some(
                  (id) => String(id) === String(gift.id),
                );

                return (
                  <div
                    key={gift.id}
                    className={`relative rounded-3xl border bg-slate-50 p-4 ${
                      checked ? "border-orange-500 ring-2 ring-orange-100" : ""
                    }`}
                  >
                    <label className="absolute left-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white shadow">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleSelectGift(gift.id)}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </label>

                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="h-40 w-full rounded-2xl bg-white object-contain p-3"
                    />

                    <div className="group relative mt-4">
                      <h3 className="line-clamp-1 cursor-default font-black text-slate-800">
                        {gift.name}
                      </h3>

                      <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-[280px] max-w-[calc(100vw-80px)] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100 hover:visible hover:opacity-100">
                        <div className="flex items-start gap-2">
                          <i className="fa-solid fa-gift mt-1 text-orange-500"></i>

                          <div className="min-w-0 flex-1 select-text break-words whitespace-normal">
                            {gift.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-400">
                      {gift.image}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEditGift(gift)}
                        className="flex-1 cursor-pointer rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 duration-100"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDeleteGift(gift)}
                        className="flex-1 cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 duration-100"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

// ===== EXPORTS =====

export default ManageGifts;
