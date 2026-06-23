// ===== IMPORTS =====

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrderByCustomer,
  requestReturnProduct,
} from "../../redux/slices/orderSlice.js";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const return reason list ------
const returnReasonList = [
  "Hàng không giống hình",
  "Không cần nữa",
  "Không phù hợp",
  "Lý do khác",
];

// ------ Khai báo const customer cancel reason list ------
const customerCancelReasonList = [
  "Không cần nữa",
  "Muốn đổi sản phẩm",
  "Muốn đổi size",
  "Lý do khác",
];

// ------ Khai báo const max images ------
const MAX_IMAGES = 3;

// ------ Khai báo const max video ------
const MAX_VIDEO = 1;

// ------ Khai báo const max video duration ------
const MAX_VIDEO_DURATION = 20;

// ------ Khai báo const return window ms ------
const RETURN_WINDOW_MS = 7 * 60 * 1000;

// ------ Hàm tạo product key ------
const createProductKey = (item) => {
  return `${item.id}-${item.selectedSize}-${item.selectedColor?.id || "default"}`;
};

// ------ Hàm lấy product detail link ------
const getProductDetailLink = (item) => {
  return `/products/${item.id}/${item.alias || "chi-tiet-san-pham"}`;
};

// ------ Hàm lấy delivered time ------
const getDeliveredTime = (order) => {
  if (order.deliveredAt) {

    // ------ Khai báo const time ------
    const time = new Date(order.deliveredAt).getTime();
    if (!Number.isNaN(time)) return time;
  }

  return null;
};

// ------ Hàm định dạng time left ------
const formatTimeLeft = (ms) => {

  // ------ Khai báo const safe ms ------
  const safeMs = Math.max(0, ms);

  // ------ Khai báo const total seconds ------
  const totalSeconds = Math.ceil(safeMs / 1000);

  // ------ Khai báo const minutes ------
  const minutes = Math.floor(totalSeconds / 60);

  // ------ Khai báo const seconds ------
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

// ------ Hàm/Component OrderCheck ------
const OrderCheck = () => {

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch();

  // ------ Lay dữ liệu orders từ Redux store ------
  const orders = useSelector((state) => state.orderStore.orders);

  // ------ Lay dữ liệu user từ Redux store ------
  const user = useSelector((state) => state.authStore.user);

  // ------ State lưu now ------
  const [now, setNow] = useState(Date.now());

  // ------ State lưu active tab ------
  const [activeTab, setActiveTab] = useState("PURCHASED");

  // ------ State lưu cancel modal ------
  const [cancelModal, setCancelModal] = useState({
    open: false,
    order: null,
    reason: "",
    customReason: "",
    error: "",
  });

  // ------ State lưu return modal ------
  const [returnModal, setReturnModal] = useState({
    open: false,
    order: null,
    product: null,
    reason: "",
    customReason: "",
    files: [],
    error: "",
  });

  useEffect(() => {

    // ------ Hàm/Component timer ------
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ------ Hàm định dạng price ------
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  };

  // ------ Hàm lấy return time left ------
  const getReturnTimeLeft = (order) => {
    if (order.status !== "Đã giao hàng") return 0;

    // ------ Khai báo const delivered time ------
    const deliveredTime = getDeliveredTime(order);

    if (!deliveredTime) return 0;

    return deliveredTime + RETURN_WINDOW_MS - now;
  };

  // ------ Hàm/Component canReturnProduct ------
  const canReturnProduct = (order, product) => {
    return (
      order.status === "Đã giao hàng" &&
      !product.returnRequest &&
      getReturnTimeLeft(order) > 0
    );
  };

  // ------ Hàm/Component purchasedOrders ------
  const purchasedOrders = useMemo(() => {
    return orders
      .filter((order) => order.status !== "Đã bị hủy")
      .map((order) => ({
        ...order,
        products: (order.products || []).filter((item) => !item.returnRequest),
      }))
      .filter((order) => order.products.length > 0);
  }, [orders]);

  // ------ Hàm/Component returnOrders ------
  const returnOrders = useMemo(() => {
    return orders
      .filter((order) => order.status !== "Đã bị hủy")
      .map((order) => ({
        ...order,
        products: (order.products || []).filter((item) => item.returnRequest),
      }))
      .filter((order) => order.products.length > 0);
  }, [orders]);

  // ------ Hàm/Component canceledOrders ------
  const canceledOrders = useMemo(() => {
    return orders.filter((order) => order.status === "Đã bị hủy");
  }, [orders]);

  // ------ Hàm xử lý cancel order ------
  const handleCancelOrder = (order) => {
    setCancelModal({
      open: true,
      order,
      reason: "",
      customReason: "",
      error: "",
    });
  };

  // ------ Hàm đóng cancel modal ------
  const closeCancelModal = () => {
    setCancelModal({
      open: false,
      order: null,
      reason: "",
      customReason: "",
      error: "",
    });
  };

  // ------ Hàm xử lý confirm cancel order ------
  const handleConfirmCancelOrder = () => {
    if (!cancelModal.reason) {
      setCancelModal((prev) => ({
        ...prev,
        error: "Vui lòng chọn lý do hủy đơn.",
      }));
      return;
    }

    if (
      cancelModal.reason === "Lý do khác" &&
      !cancelModal.customReason.trim()
    ) {
      setCancelModal((prev) => ({
        ...prev,
        error: "Vui lòng nhập lý do hủy đơn.",
      }));
      return;
    }

    // ------ Khai báo const reason ------
    const reason =
      cancelModal.reason === "Lý do khác"
        ? cancelModal.customReason.trim()
        : cancelModal.reason;

    dispatch(
      cancelOrderByCustomer({
        id: cancelModal.order.id,
        reason,
      }),
    );

    closeCancelModal();
  };

  // ------ Hàm mở return modal ------
  const openReturnModal = (order, product) => {
    if (!canReturnProduct(order, product)) {
      alert("Sản phẩm đã hết thời gian yêu cầu đổi trả.");
      return;
    }

    setReturnModal({
      open: true,
      order,
      product,
      reason: "",
      customReason: "",
      files: [],
      error: "",
    });
  };

  // ------ Hàm đóng return modal ------
  const closeReturnModal = () => {
    setReturnModal({
      open: false,
      order: null,
      product: null,
      reason: "",
      customReason: "",
      files: [],
      error: "",
    });
  };

  // ------ Hàm kiểm tra video duration ------
  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {

      // ------ Khai báo const video ------
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration <= MAX_VIDEO_DURATION);
      };

      video.onerror = () => {
        resolve(false);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // ------ Hàm lấy file type ------
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "invalid";
  };

  // ------ Hàm xử lý choose files ------
  const handleChooseFiles = async (event) => {

    // ------ Mảng lưu danh sách selected files ------
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) return;

    // ------ Hàm/Component invalidFiles ------
    const invalidFiles = selectedFiles.filter((file) => {
      return getFileType(file) === "invalid";
    });

    if (invalidFiles.length > 0) {
      setReturnModal((prev) => ({
        ...prev,
        error: "Chỉ được chọn file hình ảnh hoặc video.",
      }));
      event.target.value = "";
      return;
    }

    // ------ Khai báo const old image count ------
    const oldImageCount = returnModal.files.filter(
      (file) => file.type === "image",
    ).length;

    // ------ Khai báo const old video count ------
    const oldVideoCount = returnModal.files.filter(
      (file) => file.type === "video",
    ).length;

    // ------ Khai báo const image files ------
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    // ------ Khai báo const video files ------
    const videoFiles = selectedFiles.filter((file) =>
      file.type.startsWith("video/"),
    );

    if (oldImageCount + imageFiles.length > MAX_IMAGES) {
      setReturnModal((prev) => ({
        ...prev,
        error: `Chỉ được gửi tối đa ${MAX_IMAGES} ảnh.`,
      }));
      event.target.value = "";
      return;
    }

    if (oldVideoCount + videoFiles.length > MAX_VIDEO) {
      setReturnModal((prev) => ({
        ...prev,
        error: `Chỉ được gửi tối đa ${MAX_VIDEO} video.`,
      }));
      event.target.value = "";
      return;
    }

    for (const video of videoFiles) {

      // ------ Khai báo const is valid ------
      const isValid = await validateVideoDuration(video);

      if (!isValid) {
        setReturnModal((prev) => ({
          ...prev,
          error: `Video phải có thời lượng dưới ${MAX_VIDEO_DURATION} giây.`,
        }));
        event.target.value = "";
        return;
      }
    }

    // ------ Hàm/Component files ------
    const files = selectedFiles.map((file) => ({
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "video",
      url: URL.createObjectURL(file),
    }));

    setReturnModal((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
      error: "",
    }));

    event.target.value = "";
  };

  // ------ Hàm xử lý remove return file ------
  const handleRemoveReturnFile = (removeIndex) => {
    setReturnModal((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== removeIndex),
      error: "",
    }));
  };

  // ------ Hàm xử lý submit return ------
  const handleSubmitReturn = () => {
    if (!canReturnProduct(returnModal.order, returnModal.product)) {
      setReturnModal((prev) => ({
        ...prev,
        error: "Sản phẩm đã hết thời gian yêu cầu đổi trả.",
      }));
      return;
    }

    if (!returnModal.reason) {
      setReturnModal((prev) => ({
        ...prev,
        error: "Vui lòng chọn lý do đổi trả.",
      }));
      return;
    }

    if (
      returnModal.reason === "Lý do khác" &&
      !returnModal.customReason.trim()
    ) {
      setReturnModal((prev) => ({
        ...prev,
        error: "Vui lòng nhập lý do đổi trả.",
      }));
      return;
    }

    if (returnModal.files.length === 0) {
      setReturnModal((prev) => ({
        ...prev,
        error: "Vui lòng gửi ít nhất 1 hình ảnh hoặc video minh chứng.",
      }));
      return;
    }

    // ------ Khai báo const reason ------
    const reason =
      returnModal.reason === "Lý do khác"
        ? returnModal.customReason.trim()
        : returnModal.reason;

    dispatch(
      requestReturnProduct({
        orderId: returnModal.order.id,
        productKey: createProductKey(returnModal.product),
        reason,
        files: returnModal.files,
      }),
    );

    closeReturnModal();
    alert("Đã gửi yêu cầu đổi trả sản phẩm");
  };

  // ------ Ham render product ------
  const renderProduct = (order, item, isReturnTab = false) => {

    // ------ Khai báo const request ------
    const request = item.returnRequest;

    // ------ Khai báo const time left ------
    const timeLeft = getReturnTimeLeft(order);

    // ------ Khai báo const can return ------
    const canReturn = canReturnProduct(order, item);

    return (
      <div
        key={createProductKey(item)}
        className="rounded-2xl border bg-white p-4"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <Link to={getProductDetailLink(item)} className="shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-xl bg-slate-100 object-contain transition hover:scale-105"
            />
          </Link>

          <div className="flex-1">
            <Link
              to={getProductDetailLink(item)}
              className="font-black text-black duration-100 hover:text-orange-600"
            >
              {item.name}
            </Link>

            <p className="text-sm text-slate-500">
              Size: {item.selectedSize} | Màu:{" "}
              {item.selectedColor?.name || "Mặc định"}
            </p>

            <p className="text-sm text-slate-500">
              Số lượng: {item.cartQuantity}
            </p>

            <p className="mt-1 font-bold text-red-600">
              {formatPrice(item.price * item.cartQuantity)}
            </p>

            {!isReturnTab && order.status === "Đã giao hàng" && !request && (
              <p
                className={`mt-2 text-sm font-bold ${
                  timeLeft > 0 ? "text-orange-600" : "text-slate-400"
                }`}
              >
                {timeLeft > 0
                  ? `Còn ${formatTimeLeft(timeLeft)} để yêu cầu đổi trả`
                  : "Đã hết thời gian đổi trả"}
              </p>
            )}
          </div>

          {!isReturnTab && canReturn && (
            <button
              onClick={() => openReturnModal(order, item)}
              className="h-fit rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 cursor-pointer duration-100"
            >
              Yêu cầu đổi trả
            </button>
          )}
        </div>

        {request && (
          <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-slate-700">
            <p>
              <span className="text-slate-900">Lý do đổi trả:</span>{" "}
              {request.reason}
            </p>
            <p>
              <span className="text-slate-900">Trạng thái:</span>{" "}
              {request.status}
            </p>
            <p>
              <span className="text-slate-900">Hoàn tiền:</span>{" "}
              {request.refundStatus || "Chưa hoàn tiền"}
            </p>

            {request.rejectReason && (
              <p>
                <span className="text-slate-900">Lý do từ chối:</span>{" "}
                {request.rejectReason}
              </p>
            )}

            {request.adminNote && (
              <p>
                <span className="text-slate-900">Ghi chú admin:</span>{" "}
                {request.adminNote}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // ------ Ham render order ------
  const renderOrder = (order, mode = "PURCHASED") => {

    // ------ Khai báo const is return tab ------
    const isReturnTab = mode === "RETURN";

    // ------ Khai báo const is canceled tab ------
    const isCanceledTab = mode === "CANCELED";

    // ------ Khai báo const customer note ------
    const customerNote = (order.customerNote || order.note || "").trim();

    return (
      <div
        key={`${order.id}-${mode}`}
        className="overflow-hidden rounded-3xl border bg-white shadow-sm"
      >
        <div className="flex flex-col gap-3 border-b bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-black text-black">
              Mã đơn: {order.orderCode || `KS${order.id}`}
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Ngày đặt: {order.createdAt}
            </p>

            {order.deliveredAtText && (
              <p className="mt-1 text-sm font-semibold">
                Đã giao lúc: {order.deliveredAtText}
              </p>
            )}

            {isCanceledTab && (
              <p className="mt-1 text-sm font-semibold text-red-600">
                Đã hủy lúc: {order.cancelAtText || "Chưa có thời gian"}
              </p>
            )}
          </div>

          <span className="w-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
            {order.status}
          </span>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1.5fr]">
          <section className="rounded-2xl bg-slate-50 p-5">
            <h3 className="mb-3 font-black text-slate-800">
              Thông tin nhận hàng
            </h3>

            <p>
              <b>Khách hàng:</b> {order.customer?.fullName}
            </p>

            <p>
              <b>SĐT:</b> {order.customer?.phone}
            </p>

            <p>
              <b>Email:</b> {order.customer?.email || "Chưa có"}
            </p>

            <p>
              <b>Nhận hàng:</b>{" "}
              {order.receiveMethod === "store"
                ? "Nhận tại cửa hàng"
                : "Giao hàng tận nơi"}
            </p>

            <p>
              <b>Thanh toán:</b>{" "}
              {order.paymentMethod === "bank" ? "Ngân hàng/Momo" : "Tiền mặt"}
            </p>

            {customerNote && (
              <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                <h4 className="font-black text-orange-500">
                  Ghi chú của bạn
                </h4>

                <p className="mt-2 whitespace-pre-wrap break-words font-semibold text-slate-700">
                  {customerNote}
                </p>
              </div>
            )}

            {isCanceledTab && (
              <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                <p>Hủy bởi: {order.cancelBy || "Không rõ"}</p>
                <p>Lý do hủy: {order.cancelReason || "Không có"}</p>
              </div>
            )}

            {order.selectedGift && (
              <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                <h4 className="font-black text-orange-700">
                  Quà tặng đơn hàng
                </h4>

                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={order.selectedGift.image}
                    alt={order.selectedGift.name}
                    className="h-16 w-16 rounded-xl bg-white object-contain"
                  />

                  <p className="font-black text-black">
                    {order.selectedGift.name}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-3 font-black text-slate-800">
              {isReturnTab
                ? "Sản phẩm đổi trả"
                : isCanceledTab
                  ? "Sản phẩm trong đơn hủy"
                  : "Sản phẩm đã mua"}
            </h3>

            <div className="space-y-3">
              {order.products.map((item) =>
                renderProduct(order, item, isReturnTab),
              )}
            </div>
          </section>
        </div>

        {!isReturnTab && !isCanceledTab && (
          <div className="flex flex-col gap-3 border-t p-5 md:flex-row md:items-center md:justify-between">
            <p className="text-2xl font-black text-red-600">
              Tổng tiền: {formatPrice(order.totalPrice)}
            </p>

            {order.status === "Đang xử lý" && (
              <button
                onClick={() => handleCancelOrder(order)}
                className="rounded-xl bg-red-500 px-5 py-3 cursor-pointer font-bold text-white hover:bg-red-600 duration-100"
              >
                Hủy đơn hàng
              </button>
            )}
          </div> 
        )}
      </div>
    );
  };

  // ------ Khai báo const current orders ------
  const currentOrders =
    activeTab === "PURCHASED"
      ? purchasedOrders
      : activeTab === "RETURN"
        ? returnOrders
        : canceledOrders;

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-black">
          Kiểm tra đơn hàng
        </h1>

        <p className="mt-2 font-semibold text-slate-500">
          Xin chào {user?.username}, đây là danh sách đơn hàng của bạn.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("PURCHASED")}
          className={`rounded-xl px-5 py-3 cursor-pointer font-bold ${
            activeTab === "PURCHASED"
              ? "bg-black text-white"
              : "bg-white text-slate-700 hover:bg-slate-200 duration-100"
          }`}
        >
          Đơn đã mua ({purchasedOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("RETURN")}
          className={`rounded-xl px-5 py-3 cursor-pointer font-bold ${
            activeTab === "RETURN"
              ? "bg-black text-white"
              : "bg-white text-slate-700 hover:bg-slate-200 duration-100"
          }`}
        >
          Đơn đổi trả ({returnOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("CANCELED")}
          className={`rounded-xl px-5 py-3 cursor-pointer font-bold ${
            activeTab === "CANCELED"
              ? "bg-black text-white"
              : "bg-white text-slate-700 hover:bg-slate-200 duration-100"
          }`}
        >
          Đơn hủy ({canceledOrders.length})
        </button>
      </div>

      {currentOrders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl text-orange-500">
            <i className="fa-solid fa-receipt"></i>
          </div>

          <h2 className="text-2xl font-black text-slate-800">
            {activeTab === "PURCHASED"
              ? "Bạn chưa có đơn hàng nào"
              : activeTab === "RETURN"
                ? "Bạn chưa có đơn đổi trả nào"
                : "Bạn chưa có đơn hủy nào"}
          </h2>

          <Link
            to="/products"
            className="mt-6 inline-block cursor-pointer duration-100 rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-blue-900"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {currentOrders.map((order) => renderOrder(order, activeTab))}
        </div>
      )}

      {returnModal.open && (
        <div
          onClick={closeReturnModal}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 py-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b p-6">
              <h2 className="text-2xl font-black text-slate-900">
                Yêu cầu đổi trả sản phẩm
              </h2>

              <p className="mt-1 font-bold text-slate-500">
                {returnModal.product?.name}
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {returnReasonList.map((reason) => (
                  <label
                    key={reason}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-bold"
                  >
                    <input
                      type="radio"
                      name="returnReason"
                      value={reason}
                      checked={returnModal.reason === reason}
                      onChange={(e) =>
                        setReturnModal((prev) => ({
                          ...prev,
                          reason: e.target.value,
                          error: "",
                        }))
                      }
                    />
                    {reason}
                  </label>
                ))}
              </div>

              {returnModal.reason === "Lý do khác" && (
                <textarea
                  value={returnModal.customReason}
                  onChange={(e) =>
                    setReturnModal((prev) => ({
                      ...prev,
                      customReason: e.target.value,
                    }))
                  }
                  rows="4"
                  className="mt-4 w-full rounded-xl border px-4 py-3"
                  placeholder="Nhập lý do đổi trả"
                />
              )}

              <div className="mt-5">
                <label className="mb-2 block font-bold">
                  Hình ảnh / video minh chứng
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleChooseFiles}
                  className="w-full rounded-xl border px-4 cursor-pointer py-3"
                />

                <p className="mt-2 text-sm font-bold text-slate-400">
                  Tối đa 3 ảnh và 1 video dưới 20 giây.
                </p>
              </div>

              {returnModal.files.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {returnModal.files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative rounded-2xl border p-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveReturnFile(index)}
                        className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
                      >
                        X
                      </button>

                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-32 w-full object-contain"
                        />
                      ) : (
                        <video
                          src={file.url}
                          controls
                          className="h-32 w-full object-contain"
                        />
                      )}

                      <p className="mt-2 line-clamp-1 text-sm font-bold">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {returnModal.error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-red-600">
                  {returnModal.error}
                </p>
              )}
            </div>

            <div className="shrink-0 border-t p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleSubmitReturn}
                  className="flex-1 rounded-xl bg-orange-500 cursor-pointer py-3 font-bold text-white hover:bg-orange-600 duration-100"
                >
                  Gửi yêu cầu
                </button>

                <button
                  onClick={closeReturnModal}
                  className="flex-1 rounded-xl duration-100 bg-slate-200 py-3 cursor-pointer font-bold hover:bg-slate-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-amber-100 overflow-y-auto max-h-[300px]">
        {cancelModal.open && (
          <div
            onClick={closeCancelModal}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-amber-100 rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900">
                Lý do hủy đơn hàng
              </h2>

              <p className="mt-2 text-sm font-bold text-slate-500">
                Mã đơn:{" "}
                {cancelModal.order?.orderCode || `KS${cancelModal.order?.id}`}
              </p>

              <div className="mt-5 space-y-3">
                {customerCancelReasonList.map((reason) => (
                  <label
                    key={reason}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-bold hover:bg-slate-50 ${
                      cancelModal.reason === reason
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="customerCancelReason"
                      value={reason}
                      checked={cancelModal.reason === reason}
                      onChange={(e) =>
                        setCancelModal((prev) => ({
                          ...prev,
                          reason: e.target.value,
                          error: "",
                        }))
                      }
                    />

                    {reason}
                  </label>
                ))}
              </div>

              {cancelModal.reason === "Lý do khác" && (
                <textarea
                  value={cancelModal.customReason}
                  onChange={(e) =>
                    setCancelModal((prev) => ({
                      ...prev,
                      customReason: e.target.value,
                      error: "",
                    }))
                  }
                  rows="4"
                  className="mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
                  placeholder="Nhập lý do hủy đơn..."
                />
              )}

              {cancelModal.error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
                  {cancelModal.error}
                </p>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleConfirmCancelOrder}
                  className="flex-1 rounded-xl bg-red-500 py-3 cursor-pointer font-bold text-white hover:bg-red-600 duration-100"
                >
                  Xác nhận hủy
                </button>

                <button
                  onClick={closeCancelModal}
                  className="flex-1 rounded-xl cursor-pointer bg-slate-200 py-3 font-bold text-slate-700 hover:bg-slate-300 duration-100"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

// ===== EXPORTS =====

export default OrderCheck;