<template>
  <div class="top-layout-site">
    <div class="main-layout-site">
      <div class="block-lead-view">
        <div class="main-tab">
          <div class="block-utility-topbar">
            <div class="lst-utility-wrapper">
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  v-if="canCreatePurchaseOrder"
                  @click="openCreatePopup"
                >
                  <img src="/img-fix/icon/icon-topbar-add.svg" alt="" />
                  <span class="topbar-tooltip">Thêm sản phẩm</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="openFilterPopup"
                >
                  <img src="/img-fix/icon/icon-topbar-filter.svg" alt="" />
                  <span class="topbar-tooltip">Bộ lọc</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                >
                  <img src="/img-fix/icon/icon-download-black.svg" alt="" />
                  <span class="topbar-tooltip">Xuất báo cáo</span>
                </a>
              </div>
              <div class="item-utility-topbar">
                <a
                  href="javascript:;"
                  class="icon-item-utility wth-tooltip"
                  @click="() => refreshOrders()"
                >
                  <img src="/img-fix/icon/icon-topbar-reload.svg" alt="" />
                  <span class="topbar-tooltip">Load lại danh sách</span>
                </a>
              </div>
            </div>
            <div class="group-filter-utility-topbar">
              <div class="form-search-work">
                <div class="icon-search">
                  <img src="/img-fix/icon/icon-topbar-search.svg" alt="" />
                </div>
                <input v-model="searchQuery" type="text" placeholder="Tìm kiếm mã đơn" />
              </div>
            </div>
          </div>

          <div
            v-if="filteredPurchaseOrders.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã đơn hàng</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Người tạo</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tổng tiền</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Ngày tạo</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Trạng thái</p>
                    </div>
                    <div class="imt-title-table imt-btn-table">
                      <p class="txt-title-table"></p>
                    </div>
                  </div>

                  <div class="content-table">
                    <div
                      v-for="po in filteredPurchaseOrders"
                      :key="po.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ po.poCode }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ po.employee?.fullName || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table text-blue">
                          {{ formatCurrency(po.totalAmount) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatDate(po.createdAt) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <div class="ct-dots-6" v-if="po.status === 'COMPLETED'">
                          <div class="txt-wth-dots blue">
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">Đã hoàn thành</p>
                          </div>
                        </div>
                        <div
                          class="ct-dots-6"
                          v-else-if="po.status === 'DRAFT'"
                        >
                          <div class="txt-wth-dots orange-txt">
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">
                              Bản nháp
                            </p>
                          </div>
                        </div>
                        <div class="ct-dots-6" v-else>
                          <div class="txt-wth-dots d-red-txt">
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">{{ po.status }}</p>
                          </div>
                        </div>
                      </div>

                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(po.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{ 'open-box': openActionId === po.id }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openDetailPopup(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-warning-phos.svg"
                                      alt=""
                                  /></span>
                                  Xem chi tiết
                                </a>
                              </div>

                              <div
                                class="imt-action"
                                v-if="po.status === 'DRAFT' && canApprovePurchaseOrder"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleCompleteOrder(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-black-checked.svg"
                                      alt=""
                                  /></span>
                                  Duyệt đơn
                                </a>
                              </div>

                              <div
                                class="imt-action delete-action"
                                v-if="po.status === 'DRAFT' && canCancelPurchaseOrder"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleDeleteOrder(po.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-delete-popup.svg"
                                      alt=""
                                  /></span>
                                  Xóa đơn nháp
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="main-empty-page">
            <div class="block-empty-page">
              <div class="box-empty-sidebar icon-empty">
                <div class="icon-empty">
                  <img src="/img-fix/empty-notify.svg" alt="" />
                </div>
                <p class="text-size-14-light opacity-6">
                  Chưa có đơn nhập hàng nào
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <TopbarFilterPopup
      v-model:open="isFilterPopupOpen"
      v-model="filters"
      :anchor-rect="filterAnchorRect"
      title="Bộ lọc danh sách"
      :fields="filterFields"
    />

    <Teleport to="body">
      <div
        v-if="isCreatePopupOpen"
        class="popup-export-file ct-popup-width-1200 new-popup-common open-popup overlay-fixed"
      >
        <div class="content-export-file custom-scroll-popup">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-medium">Tạo đơn mua hàng mới</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeCreatePopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>
            <div class="main-popup-content">
              <div class="block-kt-sales">
                <div
                  class="block-kt-wrapper-popup tab-create tab-table-scroll block-table-fix"
                >
                  <p class="text-size-14-rgl mb-10">
                    Nhập thông tin đơn hàng và sản phẩm cần mua
                  </p>
                  <div class="form-popup-grid mb-10">
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">Mã đơn nhập</p>
                      <div class="ct-form-input bg-gray-ds">
                        <input
                          type="text"
                          class="text-size-14-light"
                          v-model="formData.code"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">Người lập đơn</p>
                      <div class="ct-form-input bg-gray-ds">
                        <input
                          type="text"
                          class="text-size-14-light"
                          :value="currentUserName"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">
                        Ngày <span class="important-text">*</span>
                      </p>
                      <div class="ct-form-input">
                        <input
                          type="date"
                          class="text-size-14-light"
                          v-model="formData.date"
                        />
                      </div>
                    </div>

                    <div class="imt-popup-form">
                      <p class="txt-ct-input">
                        Nhà cung cấp <span class="important-text">*</span>
                      </p>
                      <div class="ct-form-select">
                        <select v-model="formData.supplierId">
                          <option value="" disabled>Chọn nhà cung cấp</option>
                          <option
                            v-for="pub in suppliers"
                            :key="pub.id"
                            :value="pub.id"
                          >
                            {{ pub.name }}
                          </option>
                        </select>
                        <span class="icon-select"
                          ><img
                            src="/img-fix/icon/icon-arrow-down-new.svg"
                            alt=""
                        /></span>
                      </div>

                      <div
                        v-if="currentSupplier"
                        class="box-supplier-search bg-box-l-blue mt-5px"
                      >
                        <p class="text-size-13-light">
                          {{
                            currentSupplier.code || "Chưa cập nhật mã"
                          }}
                        </p>
                        <p class="text-size-13-light">
                          {{ currentSupplier.phone || "Chưa cập nhật SĐT" }}
                        </p>
                      </div>
                    </div>

                    <div class="imt-popup-form">
                      <p class="txt-ct-input">Điều khoản thanh toán</p>
                      <div class="ct-form-select">
                        <select v-model="formData.paymentTerm">
                          <option value="TM">Tiền mặt</option>
                          <option value="CK">Chuyển khoản</option>
                          <option value="CN">Công nợ</option>
                        </select>
                        <span class="icon-select"
                          ><img
                            src="/img-fix/icon/icon-arrow-down-new.svg"
                            alt=""
                        /></span>
                      </div>
                    </div>

                    <div class="imt-popup-form w-100">
                      <p class="txt-ct-input">Ghi chú</p>
                      <div class="ct-form-textarea">
                        <textarea
                          v-model="formData.note"
                          placeholder="Ghi chú thêm về đơn hàng..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div
                    class="box-table-purchased-order scroll-content-tab mt-15"
                  >
                    <div class="box-info-product">
                      <div class="title">
                        <div class="txt-wth-icon">
                          <div class="icon">
                            <img
                              src="/img-fix/icon/icon-info-duetone.svg"
                              alt=""
                            />
                          </div>
                          <p class="text-size-14-medium">Danh sách sản phẩm</p>
                        </div>
                      </div>
                      <div class="button-add-pd">
                        <a
                          href="javascript:;"
                          class="btn-frame-color primary"
                          @click="addItem"
                        >
                          <div class="icon">
                            <img
                              src="/img-fix/icon/icon-bold-plus-white.svg"
                              alt=""
                            />
                          </div>
                          <p class="text-size-13-medium">Thêm sản phẩm</p>
                        </a>
                      </div>
                    </div>

                    <div class="box-table-2025 table-no-action">
                      <div class="group-table-web">
                        <div class="block-table-crm-kh ct-xs-column">
                          <div class="title-table">
                            <div class="imt-title-table flex-n-2">
                              <p class="txt-title-table">Sản phẩm</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">ĐVT</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Tồn hiện tại</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">SL</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Đơn giá</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Giảm giá %</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Thuế %</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Thành tiền</p>
                            </div>
                            <div class="imt-title-table imt-btn-table"></div>
                          </div>

                          <div class="content-table">
                            <div
                              class="tr-table"
                              v-for="(item, index) in formData.items"
                              :key="index"
                            >
                              <div class="imt-content-table flex-n-2">
                                <div class="ct-form-select w-100">
                                  <select
                                    v-model="item.productId"
                                    @change="onProductChange(item)"
                                  >
                                    <option value="" disabled>Chọn sản phẩm</option>
                                    <option
                                      v-for="product in products"
                                      :key="product.id"
                                      :value="product.id"
                                    >
                                      {{ product.sku }} - {{ product.name }}
                                    </option>
                                  </select>
                                  <span class="icon-select"
                                    ><img
                                      src="/img-fix/icon/icon-arrow-down-new.svg"
                                      alt=""
                                  /></span>
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <div class="ct-form-input">
                                  <input type="text" v-model="item.unit" />
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <p
                                  class="txt-m-content-table"
                                  :class="getInventoryStatusClass(item.productId)"
                                  v-if="item.productId"
                                >
                                  {{
                                    formatNumber(getQuantityOnHand(item.productId))
                                  }}
                                  đơn vị
                                </p>

                                <p v-else class="txt-content-table">---</p>
                              </div>
                              <div class="imt-content-table">
                                <div class="ct-form-input">
                                  <input
                                    type="number"
                                    v-model="item.quantity"
                                    min="1"
                                  />
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <div class="ct-form-input">
                                  <input
                                    type="number"
                                    v-model="item.price"
                                    min="0"
                                  />
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <div class="ct-form-input">
                                  <input
                                    type="number"
                                    v-model="item.discount"
                                    min="0"
                                    max="100"
                                  />
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <div class="ct-form-input">
                                  <input
                                    type="number"
                                    v-model="item.tax"
                                    min="0"
                                    max="100"
                                  />
                                </div>
                              </div>
                              <div class="imt-content-table">
                                <div class="box-view-inf-dis">
                                  <p class="text-13-smb text-blue">
                                    {{ formatCurrency(itemTotal(item)) }}
                                  </p>
                                </div>
                              </div>
                              <div class="imt-content-table imt-btn-table">
                                <div class="btn-action-end-modal">
                                  <div class="btn-edit-del-table">
                                    <div class="btn-nv-dh">
                                      <a
                                        href="javascript:;"
                                        class="layout-btn wth-tooltip"
                                        @click="removeItem(index)"
                                      >
                                        <span class="icon"
                                          ><img
                                            src="/img-fix/icon/icon-delete-dt.svg"
                                            alt=""
                                        /></span>
                                        <span class="topbar-tooltip">Xóa</span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="kt-summary-price mt-10">
                      <div class="box-summary-price-pos">
                        <p class="text-size-14-medium mb-10">Tổng hợp</p>
                        <div class="row-price-flex">
                          <p class="left">Tạm tính</p>
                          <p class="right">{{ formatCurrency(subTotal) }}</p>
                        </div>
                        <div class="row-price-flex">
                          <p class="left">Giảm giá</p>
                          <p class="right text-blue">
                            -{{ formatCurrency(totalDiscount) }}
                          </p>
                        </div>
                        <div class="row-price-flex">
                          <p class="left">Thuế VAT</p>
                          <p class="right">{{ formatCurrency(totalTax) }}</p>
                        </div>
                        <div class="row-price-flex final-price">
                          <p class="left">Tổng thanh toán:</p>
                          <p class="right text-blue">
                            {{ formatCurrency(finalTotal) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="button-popup-content">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color imt-border"
                  @click="closeCreatePopup"
                >
                  <p class="text-size-13-rgl">Hủy</p>
                </a>
              </div>
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="submitOrder"
                >
                  <p class="text-size-13-rgl">
                    {{ isSubmitting ? "Đang xử lý..." : "Tạo đơn nháp" }}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeCreatePopup"></div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="isDetailPopupOpen"
        class="popup-export-file ct-popup-width-1200 new-popup-common open-popup overlay-fixed"
      >
        <div class="content-export-file custom-scroll-popup">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-medium">Thông tin chi tiết</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeDetailPopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>

            <div class="main-popup-content" v-if="selectedOrder">
              <div class="block-kt-sales">
                <div class="ct-header-storage">
                  <div class="box-pay-period">
                    <div class="left">
                      <div class="box-info-contract-labor">
                        <div class="title-flex-copy">
                          <p class="text-size-14-medium">Đơn mua hàng</p>
                          <div class="code-label-copy">
                            <p class="text-size-14-light opacity-6">
                              {{ selectedOrder.poCode }}
                            </p>
                            <button class="btn-copy-ic">
                              <img
                                src="/img-fix/icon/icon-round-copy.svg"
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                        <p class="text-size-13-light">
                          {{ formatFullDate(selectedOrder.createdAt) }}
                        </p>
                      </div>
                    </div>
                    <div class="right ct-product-title">
                      <div class="ct-label-new">
                        <div
                          class="label-table-new gray-blue"
                          v-if="selectedOrder.status === 'COMPLETED'"
                        >
                          <p class="text-size-13-medium text-blue">Đã duyệt</p>
                        </div>
                        <div
                          class="label-table-new bg-orange-light"
                          v-else-if="selectedOrder.status === 'DRAFT'"
                        >
                          <p class="text-size-13-medium text-orange">
                            Đơn nháp
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="nav-pill-tab">
                  <div
                    class="item-pill-tab"
                    :class="{ active: activeDetailTab === 'general' }"
                    @click="activeDetailTab = 'general'"
                  >
                    <a href="javascript:;" class="txt-pill">Thông tin chung</a>
                  </div>
                  <div
                    class="item-pill-tab"
                    :class="{ active: activeDetailTab === 'products' }"
                    @click="activeDetailTab = 'products'"
                  >
                    <a href="javascript:;" class="txt-pill"
                      >Chi tiết sản phẩm
                      <span class="number-count">{{
                        selectedOrder.items?.length || 0
                      }}</span></a
                    >
                  </div>
                  <div
                    class="item-pill-tab"
                    :class="{ active: activeDetailTab === 'history' }"
                    @click="activeDetailTab = 'history'"
                  >
                    <a href="javascript:;" class="txt-pill">Lịch sử</a>
                  </div>
                </div>

                <div class="box-dc--content">
                  <div
                    class="block-kt-wrapper-popup"
                    v-if="activeDetailTab === 'general'"
                  >
                    <div class="box-border-info-kt">
                      <div class="mb-10">
                        <p class="text-size-14-medium">Thông tin giao dịch</p>
                      </div>
                      <div class="box-border-template">
                        <div class="content-box-labor">
                          <div class="grid-imt-info-2">
                            <div class="imt-info-hs">
                              <p class="text-size-14-light opacity-6 mb-4px">
                                Mã đơn hàng
                              </p>
                              <p class="text-size-14-rgl">
                                {{ selectedOrder.poCode }}
                              </p>
                            </div>
                            <div class="imt-info-hs">
                              <p class="text-size-14-light opacity-6 mb-4px">
                                Ngày đặt hàng
                              </p>
                              <p class="text-size-14-rgl">
                                {{ formatDate(selectedOrder.createdAt) }}
                              </p>
                            </div>
                            <div class="imt-info-hs w-100">
                              <p class="text-size-14-light opacity-6 mb-4px">
                                Địa chỉ giao hàng
                              </p>
                              <p class="text-size-14-rgl">
                                Kho trung tâm - Mặc định
                              </p>
                            </div>
                            <div class="imt-info-hs w-100">
                              <p class="text-size-14-light opacity-6 mb-4px">
                                Ghi chú
                              </p>
                              <p class="text-size-14-rgl">
                                Giao hàng trong giờ hành chính
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="box-border-info-kt">
                      <div class="mb-10">
                        <p class="text-size-14-medium">
                          Thông tin nhà cung cấp
                        </p>
                      </div>
                      <div class="box-border-template">
                        <div class="lst-text-columns">
                          <p class="title">
                            {{
                              getFirstSupplier(selectedOrder)?.name ||
                              "Chưa xác định"
                            }}
                          </p>
                          <div class="content">
                            <p>
                              Mã NCC:
                              <span>{{
                                getFirstSupplier(selectedOrder)?.code ||
                                "---"
                              }}</span>
                            </p>
                            <p>
                              Số điện thoại:
                              <span>{{
                                getFirstSupplier(selectedOrder)?.phone || "---"
                              }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="box-border-info-kt">
                      <div class="mb-10">
                        <p class="text-size-14-medium">Tổng hợp giá trị</p>
                      </div>
                      <div class="ct-border-table">
                        <div class="group-table-web">
                          <div class="block-table-crm-kh ct-xs-column">
                            <div class="title-table">
                              <div class="imt-title-table">
                                <p class="txt-title-table">Tổng sản phẩm</p>
                              </div>
                              <div class="imt-title-table imt-align-right">
                                <p class="txt-title-table">
                                  {{ selectedOrder.items?.length || 0 }} mặt
                                  hàng
                                </p>
                              </div>
                            </div>
                            <div class="content-table">
                              <div class="tr-table">
                                <div class="imt-content-table">
                                  <p class="txt-content-table">Tạm tính</p>
                                </div>
                                <div class="imt-content-table imt-align-right">
                                  <p class="txt-content-table">
                                    {{
                                      formatCurrency(selectedOrder.totalAmount)
                                    }}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="summary-table">
                              <div class="imt-summary-table">
                                <p class="txt-summary-table">Tổng cộng</p>
                              </div>
                              <div class="imt-summary-table imt-align-right">
                                <p class="txt-summary-table">
                                  {{
                                    formatCurrency(selectedOrder.totalAmount)
                                  }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="block-kt-wrapper-popup tab-table-scroll"
                    v-else-if="activeDetailTab === 'products'"
                  >
                    <div class="box-recruitment mb-15">
                      <p class="text-size-14-rgl txt-d-blue-2 light-blue-bg">
                        Chi tiết sản phẩm: Danh sách
                        {{ selectedOrder.items?.length || 0 }} sản phẩm trong
                        đơn hàng này.
                      </p>
                    </div>
                    <div class="scroll-content-tab">
                      <div class="box-table-2025">
                        <div class="box-table-kt">
                          <div class="group-table-web">
                            <div class="block-table-crm-kh ct-xs-column">
                              <div class="title-table">
                                <div class="imt-title-table width-stt">
                                  <p class="txt-title-table">STT</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Mã sản phẩm</p>
                                </div>
                                <div class="imt-title-table flex-n-2">
                                  <p class="txt-title-table">
                                    Tên sản phẩm, hàng hóa
                                  </p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Số lượng</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Đơn giá</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Tổng cộng</p>
                                </div>
                              </div>

                              <div class="content-table">
                                <div
                                  class="tr-table"
                                  v-for="(item, index) in selectedOrder.items"
                                  :key="index"
                                >
                                  <div class="imt-content-table width-stt">
                                    <p class="txt-content-table">
                                      {{ index + 1 }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p class="txt-content-table">
                                      {{ item.productCode || "---" }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table flex-n-2">
                                    <p class="txt-content-table">
                                      {{ item.productName || "---" }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p class="txt-content-table">
                                      {{ item.quantity }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p class="txt-content-table">
                                      {{ formatCurrency(item.price) }}
                                    </p>
                                  </div>
                                  <div class="imt-content-table">
                                    <p
                                      class="txt-m-content-table font-weight-bold"
                                    >
                                      {{
                                        formatCurrency(
                                          (item.quantity || 0) *
                                            (item.price || 0),
                                        )
                                      }}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div class="ct-summary-kt mt-15">
                                <div class="box-summary-invoice no-border">
                                  <div
                                    class="box-summary-invoice--content max-w-400"
                                  >
                                    <div class="imt-sum-inv">
                                      <div class="left">
                                        <p class="text-size-14-medium">
                                          Tổng tiền trước thuế:
                                        </p>
                                      </div>
                                      <div class="right">
                                        <p class="text-size-14-medium">
                                          {{
                                            formatCurrency(
                                              selectedOrder.totalAmount,
                                            )
                                          }}
                                        </p>
                                      </div>
                                    </div>
                                    <div class="imt-sum-inv imt-sum-blue">
                                      <div class="left">
                                        <p class="text-size-14-medium">
                                          TỔNG THANH TOÁN:
                                        </p>
                                      </div>
                                      <div class="right">
                                        <p
                                          class="text-size-14-medium text-blue"
                                        >
                                          {{
                                            formatCurrency(
                                              selectedOrder.totalAmount,
                                            )
                                          }}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="block-kt-wrapper-popup"
                    v-else-if="activeDetailTab === 'history'"
                  >
                    <div class="box-border-info-kt">
                      <p class="text-size-14-medium mb-10">Lịch sử đơn hàng</p>
                      <div class="lst-inv-out lst-scroll">
                        <div class="box-border-template">
                          <div
                            class="imt-ls-order-nv"
                            v-for="(hist, index) in orderHistory"
                            :key="index"
                          >
                            <p class="text-14-smb mb-5px">
                              {{ hist.action }}
                            </p>
                            <div class="lst-contract-meta ct-kt-lst">
                              <p class="txt-contract-meta">{{ hist.user }}</p>
                              <p class="txt-contract-meta">{{ hist.date }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="button-popup-content">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color imt-border"
                  @click="closeDetailPopup"
                >
                  <p class="text-size-13-rgl">Đóng</p>
                </a>
              </div>
              <div
                class="btn-create-group"
                v-if="selectedOrder?.status === 'DRAFT' && canApprovePurchaseOrder"
              >
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="handleCompleteOrder(selectedOrder.id)"
                >
                  <p class="text-size-13-rgl">Duyệt đơn</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeDetailPopup"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
const toast = useToast();
const { confirm, confirmDelete } = useConfirmDialog();

definePageMeta({
  alias: ["/orders/purchase"],
});

interface EmployeeLight {
  id: number;
  fullName: string;
}

interface Supplier {
  id: number;
  code: string;
  name: string;
  phone: string | null;
  currentDebt?: number | null;
}

interface PurchaseOrder {
  id: number;
  poCode: string;
  code?: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  employee?: EmployeeLight;
  supplier?: Supplier | null;
  warehouse?: {
    id: number;
    name: string;
  } | null;
  items?: PurchaseOrderItem[];
  purchaseOrderLines?: any[];
}

interface PurchaseOrderItem {
  productId: number | "";
  productName?: string;
  productCode?: string;
  supplier?: Supplier;
  unit: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
}

interface InventoryBalance {
  id: number;
  quantity: number;
  product: {
    id: number;
  } | null;
}

const openActionId = ref<number | null>(null);
const isCreatePopupOpen = ref(false);
const isDetailPopupOpen = ref(false);
const isSubmitting = ref(false);
const selectedOrder = ref<PurchaseOrder | null>(null);
const activeDetailTab = ref("general");
const searchQuery = ref("");
const isFilterPopupOpen = ref(false);
const filterAnchorRect = ref<DOMRectReadOnly | null>(null);
const filters = ref<Record<string, string | number>>({
  status: "",
  createdFrom: "",
  createdTo: "",
});
const filterFields = [
  {
    key: "status",
    label: "Trạng thái",
    type: "select" as const,
    options: [
      { label: "Bản nháp", value: "DRAFT" },
      { label: "Đã hoàn thành", value: "COMPLETED" },
    ],
  },
  {
    key: "createdFrom",
    label: "Từ ngày",
    type: "date" as const,
  },
  {
    key: "createdTo",
    label: "Đến ngày",
    type: "date" as const,
  },
];

const { data: purchaseOrders, refresh: refreshOrders } =
  await useAPI<PurchaseOrder[]>("/purchase-orders");
const { data: account } = await useAPI<any>("/account");
const { data: products } = await useAPI<any[]>("/products");
const { data: suppliers } = await useAPI<any[]>("/suppliers");
const { data: warehouses } = await useAPI<any[]>("/warehouses");
const { data: inventoryBalances, refresh: refreshInventoryBalances } =
  await useAPI<InventoryBalance[]>("/inventory-balances?size=1000");

const userRoles = computed(() => {
  const authorities = account.value?.authorities || [];
  const authority = account.value?.authority ? [account.value.authority] : [];
  return [...new Set([...authorities, ...authority])];
});

const hasAnyRole = (requiredRoles: string[]) =>
  requiredRoles.some((role) => userRoles.value.includes(role));

const canCreatePurchaseOrder = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_PURCHASER"]),
);
const canApprovePurchaseOrder = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_MANAGER"]),
);
const canCancelPurchaseOrder = computed(() => hasAnyRole(["ROLE_ADMIN"]));

const normalizeText = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase();

const toDateValue = (value: string | number) =>
  value ? new Date(String(value)).getTime() : null;

const openFilterPopup = (event?: MouseEvent) => {
  if (event?.currentTarget instanceof HTMLElement) {
    filterAnchorRect.value = event.currentTarget.getBoundingClientRect();
  }
  isFilterPopupOpen.value = true;
};

const isInDateRange = (dateStr: string | null | undefined) => {
  if (!filters.value.createdFrom && !filters.value.createdTo) return true;
  if (!dateStr) return false;

  const time = new Date(dateStr).getTime();
  const fromTime = toDateValue(filters.value.createdFrom);
  const toTime = toDateValue(filters.value.createdTo);
  const endOfToDate = toTime ? toTime + 24 * 60 * 60 * 1000 - 1 : null;

  return (!fromTime || time >= fromTime) && (!endOfToDate || time <= endOfToDate);
};

const filteredPurchaseOrders = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return (purchaseOrders.value || []).filter((order) => {
    const matchesSearch =
      !keyword ||
      [order.poCode, order.employee?.fullName, order.supplier?.name, order.warehouse?.name, order.totalAmount, order.status]
        .map(normalizeText)
        .join(" ")
        .includes(keyword);
    const matchesStatus =
      !filters.value.status || order.status === filters.value.status;

    return matchesSearch && matchesStatus && isInDateRange(order.createdAt);
  });
});

const toggleActionMenu = (id: number) => {
  openActionId.value = openActionId.value === id ? null : id;
};

const generateCode = () =>
  `PO_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${Math.floor(Math.random() * 1000)}`;

const defaultForm = () => ({
  code: generateCode(),
  date: new Date().toISOString().slice(0, 10),
  supplierId: "",
  paymentTerm: "TM",
  note: "",
  items: [
    {
      productId: "",
      unit: "Đơn vị",
      quantity: 1,
      price: 0,
      discount: 0,
      tax: 0,
    } as PurchaseOrderItem,
  ],
});

const formData = ref(defaultForm());

const openCreatePopup = () => {
  formData.value = defaultForm();
  isCreatePopupOpen.value = true;
  refreshInventoryBalances();
};

const closeCreatePopup = () => {
  isCreatePopupOpen.value = false;
};

const currentUserName = computed(() => {
  if (!account.value) return "";
  return (
    `${account.value.lastName || ""} ${account.value.firstName || ""}`.trim() ||
    account.value.login
  );
});

const currentSupplier = computed(() => {
  return suppliers.value?.find(
    (p) => p.id === Number(formData.value.supplierId),
  );
});

const getProductCode = (productId: number | "") => {
  if (!productId) return "";
  const product = products.value?.find((item) => item.id === Number(productId));
  return product?.sku || "";
};

const inventoryByProductId = computed(() => {
  const map = new Map<number, InventoryBalance>();

  (inventoryBalances.value || []).forEach((balance) => {
    if (balance.product?.id) {
      map.set(balance.product.id, balance);
    }
  });

  return map;
});

const getQuantityOnHand = (productId: number | "") => {
  if (!productId) return 0;
  return inventoryByProductId.value.get(Number(productId))?.quantity || 0;
};

const getInventoryStatusClass = (productId: number | "") => {
  const quantity = getQuantityOnHand(productId);
  if (quantity <= 0) return "red";
  if (quantity < 20) return "orange";
  return "blue";
};

const formatNumber = (value: number | null | undefined) =>
  Number(value || 0).toLocaleString("vi-VN");

const addItem = () => {
  formData.value.items.push({
    productId: "",
    unit: "Đơn vị",
    quantity: 1,
    price: 0,
    discount: 0,
    tax: 0,
  });
};

const removeItem = (index: number) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1);
  }
};

const onProductChange = (item: PurchaseOrderItem) => {
  const product = products.value?.find((entry) => entry.id === Number(item.productId));
  if (product) {
    item.price = product.basePrice || 0;
  }
};

const itemTotal = (item: PurchaseOrderItem) => {
  const base = (item.quantity || 0) * (item.price || 0);
  const discounted = base - (base * (item.discount || 0)) / 100;
  const afterTax = discounted + (discounted * (item.tax || 0)) / 100;
  return afterTax;
};

const subTotal = computed(() =>
  formData.value.items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0,
  ),
);

const totalDiscount = computed(() =>
  formData.value.items.reduce((sum, item) => {
    const base = (item.quantity || 0) * (item.price || 0);
    return sum + (base * (item.discount || 0)) / 100;
  }, 0),
);

const totalTax = computed(() =>
  formData.value.items.reduce((sum, item) => {
    const base = (item.quantity || 0) * (item.price || 0);
    const discounted = base - (base * (item.discount || 0)) / 100;
    return sum + (discounted * (item.tax || 0)) / 100;
  }, 0),
);

const finalTotal = computed(() =>
  formData.value.items.reduce((sum, item) => sum + itemTotal(item), 0),
);

const submitOrder = async () => {
  const validItems = formData.value.items.filter((i) => i.productId);
  const invalidItem = validItems.find((item) =>
    Boolean(validatePositiveInteger(item.quantity, "Số lượng")),
  );
  const invalidPriceItem = validItems.find((item) =>
    Boolean(validateNonNegativeNumber(item.price || 0, "Đơn giá")),
  );
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã đơn nhập"),
    validateMaxLength(formData.value.code, 50, "Mã đơn nhập"),
    validateRequired(formData.value.supplierId, "Nhà cung cấp"),
    validItems.length > 0 ? "" : "Vui lòng chọn ít nhất 1 sản phẩm hợp lệ!",
    invalidItem ? "Số lượng sản phẩm phải là số nguyên lớn hơn 0." : "",
    invalidPriceItem ? "Đơn giá không được nhỏ hơn 0." : "",
  ]);

  if (validationError) {
    toast.fromMessage(validationError);
    return;
  }

  if (validItems.length === 0) {
    toast.fromMessage("Vui lòng chọn ít nhất 1 sản phẩm hợp lệ!");
    return;
  }
  isSubmitting.value = true;

  try {
    const warehouse = warehouses.value?.[0];
    if (!warehouse?.id) {
      throw new Error("Chưa có kho để tạo đơn nhập hàng.");
    }

    const payload = {
      poCode: formData.value.code,
      status: "DRAFT",
      totalAmount: finalTotal.value,
      supplier: {
        id: Number(formData.value.supplierId),
      },
      warehouse: {
        id: warehouse.id,
      },
      purchaseOrderLines: validItems.map((item) => ({
        quantity: Number(item.quantity),
        unitPrice: Number(item.price) || 0,
        product: {
          id: Number(item.productId),
        },
      })),
    };

    const { error } = await useAPI<any>("/purchase-orders", {
      method: "POST",
      body: payload,
    });

    if (error.value) throw error.value;

    if (process.client) {
      window.dispatchEvent(new Event("novel:notifications-refresh"));
      window.setTimeout(() => {
        window.dispatchEvent(new Event("novel:notifications-refresh"));
      }, 600);
    }

    toast.fromMessage("Tạo đơn nháp thành công!");
    closeCreatePopup();
    await refreshOrders();
    await refreshInventoryBalances();
  } catch (err: any) {
    const msg =
      err.data?.title ||
      err.data?.message ||
      "Có lỗi xảy ra trong quá trình xử lý";
    toast.fromMessage(`Lỗi từ máy chủ: ${msg}`);
  } finally {
    isSubmitting.value = false;
  }
};

const openDetailPopup = async (id: number) => {
  openActionId.value = null;
  activeDetailTab.value = "general";

  const { data: poData, error: poError } = await useAPI<PurchaseOrder>(
    `/purchase-orders/${id}`,
  );

  if (poError.value || !poData.value) {
    toast.fromMessage("Lỗi khi tải chi tiết đơn hàng!");
    return;
  }

  const { data: linesData, error: linesError } = await useAPI<any[]>(
    `/purchase-order-lines?size=1000`,
  );

  if (linesError.value) {
    toast.fromMessage("Không thể tải danh sách sản phẩm trong đơn.");
    return;
  }

  const matchedLines = (poData.value.purchaseOrderLines && poData.value.purchaseOrderLines.length > 0)
    ? poData.value.purchaseOrderLines
    : (linesData.value || []).filter(
    (line) => line.purchaseOrder?.id === id,
  );

  selectedOrder.value = {
    ...poData.value,
    items: matchedLines.map((line) => ({
      productId: line.product?.id || "",
      productCode: line.product?.sku || "---",
      productName: line.product?.name || "---",
      supplier: poData.value?.supplier || null,
      unit: "Đơn vị",
      quantity: line.quantity || 0,
      price: line.unitPrice || 0,
      discount: 0,
      tax: 0,
    })),
  };

  isDetailPopupOpen.value = true;
};

const closeDetailPopup = () => {
  isDetailPopupOpen.value = false;
  selectedOrder.value = null;
};

const getFirstSupplier = (order: PurchaseOrder | null) => {
  if (!order || !order.items || order.items.length === 0) return null;
  return order.items[0].supplier;
};

const handleCompleteOrder = async (id: number) => {
  const isConfirm = await confirm({
    confirmText: "Hoàn thành",
    message:
      "Bạn có chắc chắn muốn hoàn thành đơn này? Hành động này sẽ cộng số lượng vào kho và không thể hoàn tác.",
    title: "Hoàn thành đơn nhập",
    tone: "warning",
  });
  if (!isConfirm) return;

  const { error: completeError } = await useAPI(
    `/purchase-orders/${id}/approve`,
    { method: "PUT" },
  );

  if (completeError.value) {
    const backEndMsg =
      completeError.value.data?.title ||
      completeError.value.data?.message ||
      "Không thể hoàn thành đơn hàng";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Hoàn thành đơn hàng thành công!");
  openActionId.value = null;
  if (isDetailPopupOpen.value) closeDetailPopup();
  await refreshOrders();
  await refreshInventoryBalances();
};

const handleDeleteOrder = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa bản nháp đơn nhập hàng này?",
  );
  if (!isConfirm) return;

  const { error: deleteError } = await useAPI(`/purchase-orders/${id}/cancel`, {
    method: "PUT",
  });

  if (deleteError.value) {
    toast.fromMessage("Không thể xóa đơn hàng");
    return;
  }

  toast.fromMessage("Xóa đơn hàng thành công!");
  openActionId.value = null;
  await refreshOrders();
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount == null) return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(0);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatFullDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
const orderHistory = computed(() => {
  if (!selectedOrder.value) return [];

  const history = [];

  history.push({
    action: "Tạo đơn hàng",
    user: selectedOrder.value.employee?.fullName || "Hệ thống",
    date: formatDateTimeHistory(selectedOrder.value.createdAt),
  });

  if (selectedOrder.value.status === "COMPLETED") {
    history.push({
      action: "Duyệt đơn hàng",
      user: selectedOrder.value.employee?.fullName || "Hệ thống",
      date: formatDateTimeHistory(selectedOrder.value.createdAt),
    });
  }

  return history;
});

const formatDateTimeHistory = (dateStr: string | null | undefined) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};
</script>





