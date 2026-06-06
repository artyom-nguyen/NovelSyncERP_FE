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
                  v-if="canCreateSalesOrder"
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
                  @click="openExportPopup"
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
            v-if="filteredSalesOrders.length > 0"
            class="block-main-table-content"
          >
            <div class="box-table-2025">
              <div class="group-table-web">
                <div class="block-table-crm-kh ct-xs-column">
                  <div class="title-table">
                    <div class="imt-title-table">
                      <p class="txt-title-table">Mã đơn xuất</p>
                    </div>
                    <div class="imt-title-table flex-n-2">
                      <p class="txt-title-table">Khách mua</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Số điện thoại</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Người tạo</p>
                    </div>
                    <div class="imt-title-table">
                      <p class="txt-title-table">Tổng thanh toán</p>
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
                      v-for="so in filteredSalesOrders"
                      :key="so.id"
                      class="tr-table tr-vertical-middle"
                    >
                      <div class="imt-content-table">
                        <p class="txt-content-table font-weight-bold">
                          {{ so.orderCode }}
                        </p>
                      </div>
                      <div class="imt-content-table flex-n-2">
                        <p class="txt-content-table">
                          {{ getPartnerInfo(so).name || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ getPartnerInfo(so).phone || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ so.employee?.fullName || "---" }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table text-blue">
                          {{ formatCurrency(so.totalAmount) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <p class="txt-content-table">
                          {{ formatDate(so.createdAt) }}
                        </p>
                      </div>
                      <div class="imt-content-table">
                        <div class="ct-dots-6">
                          <div
                            class="txt-wth-dots"
                            :class="getSalesOrderStatusDotClass(so.status)"
                          >
                            <div class="custom-status-dot"></div>
                            <p class="txt-m-content-table">
                              {{ formatSalesOrderStatus(so.status) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="imt-content-table imt-btn-table">
                        <div class="flex-action-crm">
                          <div class="imt-action-crm">
                            <div
                              class="icon-dots-row no-bg"
                              @click="toggleActionMenu(so.id)"
                            >
                              <img
                                src="/img-fix/icon/icon-horiz-new-black.svg"
                                alt=""
                              />
                            </div>
                            <div
                              class="box-popup-action-imt ct-popup-box"
                              :class="{ 'open-box': openActionId === so.id }"
                            >
                              <div class="imt-action">
                                <a
                                  href="javascript:;"
                                  @click="openDetailPopup(so.id)"
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
                                v-if="so.status === 'DRAFT' && canApproveSalesOrder"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleCompleteOrder(so.id)"
                                >
                                  <span class="icon"
                                    ><img
                                      src="/img-fix/icon/icon-black-checked.svg"
                                      alt=""
                                  /></span>
                                  Duyệt xuất hàng
                                </a>
                              </div>
                              <div
                                class="imt-action delete-action"
                                v-if="so.status === 'DRAFT' && canCancelSalesOrder"
                              >
                                <a
                                  href="javascript:;"
                                  @click="handleDeleteOrder(so.id)"
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
                  Chưa có đơn bán hàng nào
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
        v-if="isExportPopupOpen"
        class="popup-export-file ct-popup-width-540 new-popup-common open-popup overlay-fixed"
      >
        <div class="content-export-file">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-medium">Xuất báo cáo sản phẩm bán chạy</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeExportPopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>
            <div class="main-popup-content">
              <div class="form-popup-grid export-report-grid">
                <div class="imt-popup-form">
                  <p class="txt-ct-input">
                    Tháng <span class="important-text">*</span>
                  </p>
                  <div class="ct-form-select">
                    <select v-model.number="exportForm.month">
                      <option
                        v-for="month in monthOptions"
                        :key="month"
                        :value="month"
                      >
                        Tháng {{ month }}
                      </option>
                    </select>
                    <span class="icon-select">
                      <img
                        src="/img-fix/icon/icon-arrow-down-new.svg"
                        alt=""
                      />
                    </span>
                  </div>
                </div>
                <div class="imt-popup-form">
                  <p class="txt-ct-input">
                    Năm <span class="important-text">*</span>
                  </p>
                  <div class="ct-form-select">
                    <select v-model.number="exportForm.year">
                      <option
                        v-for="year in yearOptions"
                        :key="year"
                        :value="year"
                      >
                        {{ year }}
                      </option>
                    </select>
                    <span class="icon-select">
                      <img
                        src="/img-fix/icon/icon-arrow-down-new.svg"
                        alt=""
                      />
                    </span>
                  </div>
                </div>
              </div>
              <p class="text-size-13-light opacity-6 mt-10">
                File Excel gồm các cột: Mã sản phẩm, Tên sản phẩm, Tổng SL bán, Tổng
                doanh thu.
              </p>
            </div>
            <div class="button-popup-content">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color imt-border"
                  @click="closeExportPopup"
                >
                  <p class="text-size-13-rgl">Hủy</p>
                </a>
              </div>
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="exportTopSellingProducts"
                >
                  <p class="text-size-13-rgl">
                    {{ isExporting ? "Đang xuất..." : "Xuất Excel" }}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeExportPopup"></div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="isCreatePopupOpen"
        class="popup-export-file ct-popup-width-1200 new-popup-common open-popup overlay-fixed"
      >
        <div class="content-export-file custom-scroll-popup">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-medium">Tạo đơn bán hàng mới</p>
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
                    Nhập thông tin đơn hàng và sản phẩm cần bán
                  </p>
                  <div class="form-popup-grid mb-10">
                    <div class="imt-popup-form">
                      <p class="txt-ct-input">Mã đơn xuất</p>
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
                        Khách mua <span class="important-text">*</span>
                      </p>
                      <div class="ct-form-input">
                        <input
                          type="text"
                          class="text-size-14-light"
                          v-model="formData.partnerName"
                          placeholder="Nhập tên khách mua / đối tác"
                        />
                      </div>
                    </div>

                    <div class="imt-popup-form">
                      <p class="txt-ct-input">
                        Địa chỉ đối tác <span class="important-text">*</span>
                      </p>
                      <div class="ct-form-input">
                        <input
                          type="text"
                          class="text-size-14-light"
                          v-model="formData.partnerAddress"
                          placeholder="Nhập địa chỉ đối tác"
                        />
                      </div>
                    </div>

                    <div class="imt-popup-form">
                      <p class="txt-ct-input">
                        Số điện thoại đối tác
                        <span class="important-text">*</span>
                      </p>
                      <div class="ct-form-input">
                        <input
                          type="tel"
                          class="text-size-14-light"
                          v-model="formData.partnerPhone"
                          inputmode="numeric"
                          pattern="[0-9]*"
                          placeholder="Nhập số điện thoại"
                          @input="handlePartnerPhoneInput"
                        />
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
                            <div class="imt-title-table">
                              <p class="txt-title-table">Mã SP</p>
                            </div>
                            <div class="imt-title-table flex-n-2">
                              <p class="txt-title-table">Tên sản phẩm</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">SL</p>
                            </div>
                            <div class="imt-title-table">
                              <p class="txt-title-table">Đơn giá</p>
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
                              <div class="imt-content-table">
                                <div class="ct-form-input bg-gray-ds">
                                  <input
                                    type="text"
                                    :value="getProductCode(item.productId)"
                                    disabled
                                    placeholder="---"
                                  />
                                </div>
                              </div>
                              <div class="imt-content-table flex-n-2">
                                <div class="ct-form-select w-100">
                                  <select
                                    v-model="item.productId"
                                    @change="onProductChange(item)"
                                  >
                                    <option value="" disabled>Chọn sản phẩm</option>
                                    <option
                                      v-for="product in filteredProducts"
                                      :key="product.id"
                                      :value="product.id"
                                    >
                                      {{ product.name }}
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
                          <p class="right">{{ formatCurrency(finalTotal) }}</p>
                        </div>
                        <div class="row-price-flex final-price">
                          <p class="left">Tổng cộng:</p>
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
                    {{ isSubmitting ? "Đang xử lý..." : "Tạo đơn bán hàng" }}
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
                <p class="text-size-14-medium">Thông tin chi tiết đơn hàng</p>
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
                          <p class="text-size-14-medium">Đơn bán hàng</p>
                          <div class="code-label-copy">
                            <p class="text-size-14-light opacity-6">
                              {{ selectedOrder.orderCode }}
                            </p>
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
                          class="label-table-new"
                          :class="getSalesOrderStatusLabelClass(selectedOrder.status)"
                        >
                          <p
                            class="text-size-13-medium"
                            :class="getSalesOrderStatusTextClass(selectedOrder.status)"
                          >
                            {{ formatSalesOrderStatus(selectedOrder.status) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ct-bc-labor-grid">
                  <div class="grid-col-item-4">
                    <div class="imt-school-schedule border-imt">
                      <div class="header-ls-call">
                        <p class="title">Tổng mặt hàng</p>
                      </div>
                      <p class="number">
                        {{ selectedOrder.items?.length || 0 }}
                      </p>
                    </div>
                    <div class="imt-school-schedule border-imt">
                      <div class="header-ls-call">
                        <p class="title">Tổng tiền đơn</p>
                      </div>
                      <p class="number">
                        {{ formatCurrency(selectedOrder.totalAmount) }}
                      </p>
                    </div>
                    <div class="imt-school-schedule border-imt">
                      <div class="header-ls-call">
                        <p class="title">Người tạo</p>
                      </div>
                      <p class="number text-size-14-medium">
                        {{ selectedOrder.employee?.fullName || "---" }}
                      </p>
                    </div>
                    <div class="imt-school-schedule border-imt">
                      <div class="header-ls-call">
                        <p class="title">Trạng thái kho</p>
                      </div>
                      <p class="number">
                        {{
                          selectedOrder.status === "COMPLETED"
                            ? "Đã trừ kho"
                            : "Chưa xử lý"
                        }}
                      </p>
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
                                Mã đơn xuất
                              </p>
                              <p class="text-size-14-rgl">
                                {{ selectedOrder.orderCode }}
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
                                Địa chỉ đối tác
                              </p>
                              <p class="text-size-14-rgl">
                                {{
                                  getPartnerInfo(selectedOrder).address ||
                                  "---"
                                }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="box-border-info-kt">
                      <div class="mb-10">
                        <p class="text-size-14-medium">
                          Thông tin đối tác / Khách mua
                        </p>
                      </div>
                      <div class="box-border-template">
                        <div class="lst-text-columns">
                          <p class="title">
                            {{ getPartnerInfo(selectedOrder).name || "---" }}
                          </p>
                          <div class="content">
                            <p>
                              Địa chỉ:
                              <span>{{
                                getPartnerInfo(selectedOrder).address || "---"
                              }}</span>
                            </p>
                            <p>
                              Số điện thoại:
                              <span>{{
                                getPartnerInfo(selectedOrder).phone || "---"
                              }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="block-kt-wrapper-popup tab-table-scroll"
                    v-else-if="activeDetailTab === 'products'"
                  >
                    <div class="scroll-content-tab">
                      <div class="box-table-2025">
                        <div class="box-table-kt">
                          <div class="group-table-web">
                            <div class="block-table-crm-kh ct-xs-column">
                              <div class="title-table">
                                <div class="imt-title-table">
                                  <p class="txt-title-table">STT</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Mã sản phẩm</p>
                                </div>
                                <div class="imt-title-table flex-n-2">
                                  <p class="txt-title-table">Tên hàng hóa</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Số lượng</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Đơn giá bán</p>
                                </div>
                                <div class="imt-title-table">
                                  <p class="txt-title-table">Thành tiền</p>
                                </div>
                              </div>

                              <div class="content-table">
                                <div
                                  class="tr-table"
                                  v-for="(item, index) in selectedOrder.items"
                                  :key="index"
                                >
                                  <div class="imt-content-table">
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
                                    <p
                                      class="txt-content-table font-weight-bold"
                                    >
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
                v-if="selectedOrder?.status === 'DRAFT' && canApproveSalesOrder"
              >
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="handleCompleteOrder(selectedOrder.id)"
                >
                  <p class="text-size-13-rgl">Duyệt xuất kho</p>
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
  alias: ["/orders/sales"],
});

interface EmployeeLight {
  id: number;
  fullName: string;
}

interface PartnerInfo {
  name: string;
  address: string;
  phone: string;
}

interface SalesOrder {
  id: number;
  orderCode: string;
  code?: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  employee?: EmployeeLight;
  customer?: {
    id: number;
    name: string;
    phone?: string | null;
  } | null;
  warehouse?: {
    id: number;
    name: string;
  } | null;
  partnerName?: string;
  partnerAddress?: string;
  partnerPhone?: string;
  items?: SalesOrderItem[];
  salesOrderLines?: any[];
}

interface SalesOrderItem {
  productId: number | "";
  productName?: string;
  productCode?: string;
  quantity: number;
  price: number;
}

const openActionId = ref<number | null>(null);
const isCreatePopupOpen = ref(false);
const isDetailPopupOpen = ref(false);
const isExportPopupOpen = ref(false);
const isSubmitting = ref(false);
const isExporting = ref(false);
const selectedOrder = ref<SalesOrder | null>(null);
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
      { label: "Đơn nháp", value: "DRAFT" },
      { label: "Đã xuất kho", value: "COMPLETED" },
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

const salesOrderStatusLabels: Record<string, string> = {
  DRAFT: "Đơn nháp",
  APPROVED: "Đã duyệt",
  PROCESSING: "Đang giao",
  COMPLETED: "Đã xuất kho",
  CANCELLED: "Đã hủy",
};

const salesOrderStatusDotClasses: Record<string, string> = {
  DRAFT: "orange-txt",
  APPROVED: "blue",
  PROCESSING: "orange-txt",
  COMPLETED: "blue",
  CANCELLED: "d-red-txt",
};

const salesOrderStatusLabelClasses: Record<string, string> = {
  DRAFT: "bg-fire-orange",
  APPROVED: "gray-blue",
  PROCESSING: "bg-fire-orange",
  COMPLETED: "gray-blue",
  CANCELLED: "bg-label-red-new",
};

const salesOrderStatusTextClasses: Record<string, string> = {
  DRAFT: "text-orange",
  APPROVED: "text-blue",
  PROCESSING: "text-orange",
  COMPLETED: "text-blue",
  CANCELLED: "text-red",
};

const normalizeStatusKey = (status: string | null | undefined) =>
  String(status || "").trim().toUpperCase();

const formatSalesOrderStatus = (status: string | null | undefined) =>
  salesOrderStatusLabels[normalizeStatusKey(status)] || "Không xác định";

const getSalesOrderStatusDotClass = (status: string | null | undefined) =>
  salesOrderStatusDotClasses[normalizeStatusKey(status)] || "d-red-txt";

const getSalesOrderStatusLabelClass = (status: string | null | undefined) =>
  salesOrderStatusLabelClasses[normalizeStatusKey(status)] || "bg-label-red-new";

const getSalesOrderStatusTextClass = (status: string | null | undefined) =>
  salesOrderStatusTextClasses[normalizeStatusKey(status)] || "text-red";

const currentDate = new Date();
const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const exportForm = ref({
  month: currentDate.getMonth() + 1,
  year: currentDate.getFullYear(),
});

const yearOptions = computed(() => {
  const currentYear = currentDate.getFullYear();
  return Array.from({ length: 6 }, (_, index) => currentYear - index);
});

const { data: salesOrders, refresh: refreshOrders } =
  await useAPI<SalesOrder[]>("/sales-orders");
const { data: account } = await useAPI<any>("/account");
const { data: products } = await useAPI<any[]>("/products");
const { data: warehouses } = await useAPI<any[]>("/warehouses");

const userRoles = computed(() => {
  const authorities = account.value?.authorities || [];
  const authority = account.value?.authority ? [account.value.authority] : [];
  return [...new Set([...authorities, ...authority])];
});

const hasAnyRole = (requiredRoles: string[]) =>
  requiredRoles.some((role) => userRoles.value.includes(role));

const canCreateSalesOrder = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_SALES"]),
);
const canApproveSalesOrder = computed(() =>
  hasAnyRole(["ROLE_ADMIN", "ROLE_MANAGER"]),
);
const canCancelSalesOrder = computed(() => hasAnyRole(["ROLE_ADMIN"]));

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

const filteredSalesOrders = computed(() => {
  const keyword = normalizeText(searchQuery.value);

  return (salesOrders.value || []).filter((order) => {
    const partnerInfo = getPartnerInfo(order);
    const matchesSearch =
      !keyword ||
      [
        order.orderCode,
        order.employee?.fullName,
        order.totalAmount,
        order.status,
        partnerInfo.name,
        partnerInfo.phone,
        partnerInfo.address,
      ]
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
  `SO_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${Math.floor(Math.random() * 1000)}`;

const defaultForm = () => ({
  code: generateCode(),
  date: new Date().toISOString().slice(0, 10),
  partnerName: "",
  partnerAddress: "",
  partnerPhone: "",
  note: "",
  items: [{ productId: "", quantity: 1, price: 0 } as SalesOrderItem],
});

const formData = ref(defaultForm());
const SALES_ORDER_PARTNER_STORAGE_KEY = "novelsync:sales-order-partners";
const emptyPartnerInfo = (): PartnerInfo => ({ name: "", address: "", phone: "" });

const normalizePartnerInfo = (partner: PartnerInfo): PartnerInfo => ({
  name: partner.name.trim(),
  address: partner.address.trim(),
  phone: partner.phone.trim(),
});

const readPartnerStore = (): Record<string, PartnerInfo> => {
  if (!process.client) return {};

  try {
    return JSON.parse(
      localStorage.getItem(SALES_ORDER_PARTNER_STORAGE_KEY) || "{}",
    );
  } catch {
    return {};
  }
};

const writePartnerStore = (store: Record<string, PartnerInfo>) => {
  if (!process.client) return;
  localStorage.setItem(SALES_ORDER_PARTNER_STORAGE_KEY, JSON.stringify(store));
};

const getPartnerStoreKeys = (order: Pick<SalesOrder, "id" | "code">) => [
  order.id ? `id:${order.id}` : "",
  order.code ? `code:${order.code}` : "",
];

const savePartnerInfo = (
  order: Pick<SalesOrder, "id" | "code">,
  partner: PartnerInfo,
) => {
  const normalizedPartner = normalizePartnerInfo(partner);
  const store = readPartnerStore();

  getPartnerStoreKeys(order)
    .filter(Boolean)
    .forEach((key) => {
      store[key] = normalizedPartner;
    });

  writePartnerStore(store);
};

const getPartnerInfo = (order: SalesOrder | null): PartnerInfo => {
  if (!order) return emptyPartnerInfo();

  if (order.customer?.name || order.customer?.phone) {
    return normalizePartnerInfo({
      name: order.customer?.name || "",
      address: "",
      phone: order.customer?.phone || "",
    });
  }

  if (order.partnerName || order.partnerAddress || order.partnerPhone) {
    return normalizePartnerInfo({
      name: order.partnerName || "",
      address: order.partnerAddress || "",
      phone: order.partnerPhone || "",
    });
  }

  const store = readPartnerStore();
  const matchedKey = getPartnerStoreKeys(order).find((key) => key && store[key]);
  return matchedKey ? store[matchedKey] : emptyPartnerInfo();
};

const openCreatePopup = () => {
  formData.value = defaultForm();
  isCreatePopupOpen.value = true;
};

const closeCreatePopup = () => {
  isCreatePopupOpen.value = false;
};

const handlePartnerPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const phone = toDigitsOnly(target.value);
  target.value = phone;
  formData.value.partnerPhone = phone;
};

const openExportPopup = () => {
  isExportPopupOpen.value = true;
};

const closeExportPopup = () => {
  if (isExporting.value) return;
  isExportPopupOpen.value = false;
};

const normalizeBaseUrl = (baseUrl: string) =>
  baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

const getReportDownloadUrl = () => {
  const config = useRuntimeConfig();
  const params = new URLSearchParams({
    month: String(exportForm.value.month),
    year: String(exportForm.value.year),
  });

  return `${normalizeBaseUrl(config.public.apiBase || "")}/reports/top-selling-products/download?${params.toString()}`;
};

const getFileNameFromResponse = (response: Response) => {
  const disposition = response.headers.get("content-disposition");
  const fallbackName = `top-selling-products-${exportForm.value.year}-${String(
    exportForm.value.month,
  ).padStart(2, "0")}.xlsx`;

  if (!disposition) return fallbackName;

  const utfFileName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (utfFileName) return decodeURIComponent(utfFileName);

  const fileName = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  return fileName || fallbackName;
};

const triggerBlobDownload = (blob: Blob, fileName: string) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

const getReportErrorMessage = async (response: Response) => {
  try {
    const data = await response.clone().json();
    return data?.title || data?.message || "Không thể xuất file Excel.";
  } catch {
    return "Không thể xuất file Excel.";
  }
};

const exportTopSellingProducts = async () => {
  toast.fromMessage("Backend hiện chưa cung cấp API xuất báo cáo sản phẩm bán chạy.");
  isExportPopupOpen.value = false;
};

const currentUserName = computed(() => {
  if (!account.value) return "";
  return (
    `${account.value.lastName || ""} ${account.value.firstName || ""}`.trim() ||
    account.value.login
  );
});

const filteredProducts = computed(() => products.value || []);

const getProductCode = (productId: number | "") => {
  if (!productId) return "";
  const product = products.value?.find((item) => item.id === Number(productId));
  return product?.sku || "";
};

const addItem = () => {
  formData.value.items.push({ productId: "", quantity: 1, price: 0 });
};

const removeItem = (index: number) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1);
  }
};

const onProductChange = (item: SalesOrderItem) => {
  const product = products.value?.find((entry) => entry.id === Number(item.productId));
  if (product) {
    item.price = product.basePrice || 0;
  }
};

const itemTotal = (item: SalesOrderItem) =>
  (item.quantity || 0) * (item.price || 0);

const finalTotal = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + itemTotal(item), 0);
});

const submitOrder = async () => {
  const validItems = formData.value.items.filter((i) => i.productId);
  const invalidItem = validItems.find((item) =>
    Boolean(validatePositiveInteger(item.quantity, "Số lượng")),
  );
  const invalidPriceItem = validItems.find((item) =>
    Boolean(validateNonNegativeNumber(item.price || 0, "Đơn giá")),
  );
  const validationError = firstValidationError([
    validateRequired(formData.value.code, "Mã đơn bán"),
    validateMaxLength(formData.value.code, 50, "Mã đơn bán"),
    validateRequired(formData.value.partnerName, "Tên đối tác"),
    validateMaxLength(formData.value.partnerName, 255, "Tên đối tác"),
    validateRequired(formData.value.partnerAddress, "Địa chỉ đối tác"),
    validateMaxLength(formData.value.partnerAddress, 500, "Địa chỉ đối tác"),
    validateRequired(formData.value.partnerPhone, "Số điện thoại đối tác"),
    validateDigitsOnly(formData.value.partnerPhone, "Số điện thoại đối tác"),
    validateMaxLength(formData.value.partnerPhone, 30, "Số điện thoại đối tác"),
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
  const partnerInfo = normalizePartnerInfo({
    name: formData.value.partnerName,
    address: formData.value.partnerAddress,
    phone: formData.value.partnerPhone,
  });

  try {
    const { data: createdCustomer, error: customerError } = await useAPI<any>(
      "/customers",
      {
        method: "POST",
        body: {
          code: `CUS-${Date.now()}`,
          name: partnerInfo.name,
          phone: partnerInfo.phone,
          creditLimit: 0,
          currentDebt: 0,
        },
      },
    );

    if (customerError.value || !createdCustomer.value?.id) {
      throw customerError.value || new Error("Không thể tạo khách hàng.");
    }

    const warehouse = warehouses.value?.[0];
    if (!warehouse?.id) {
      throw new Error("Chưa có kho để tạo đơn bán hàng.");
    }

    const payload = {
      orderCode: formData.value.code,
      status: "DRAFT",
      totalAmount: finalTotal.value,
      customer: {
        id: createdCustomer.value.id,
      },
      warehouse: {
        id: warehouse.id,
      },
      salesOrderLines: validItems.map((item) => ({
        quantity: Number(item.quantity),
        unitPrice: Number(item.price) || 0,
        product: {
          id: Number(item.productId),
        },
      })),
    };

    const { data: createdOrder, error } = await useAPI<SalesOrder>(
      "/sales-orders",
      {
        method: "POST",
        body: payload,
      },
    );

    if (error.value) throw error.value;

    savePartnerInfo(
      {
        id: createdOrder.value?.id || 0,
        code: createdOrder.value?.orderCode || formData.value.code,
      },
      partnerInfo,
    );
    toast.fromMessage("Tạo đơn bán hàng nháp thành công!");
    closeCreatePopup();
    await refreshOrders();
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

  const { data: soData, error: soError } = await useAPI<SalesOrder>(
    `/sales-orders/${id}`,
  );
  if (soError.value || !soData.value) {
    toast.fromMessage("Lỗi khi tải chi tiết đơn hàng!");
    return;
  }

  const { data: linesData, error: linesError } = await useAPI<any[]>(
    "/sales-order-lines?size=1000",
  );
  if (linesError.value) {
    toast.fromMessage("Không thể tải danh sách sản phẩm trong đơn.");
    return;
  }

  const matchedLines = (soData.value.salesOrderLines && soData.value.salesOrderLines.length > 0)
    ? soData.value.salesOrderLines
    : (linesData.value || []).filter(
    (line) => line.salesOrder?.id === id,
  );

  selectedOrder.value = {
    ...soData.value,
    items: matchedLines.map((line) => ({
      productId: line.product?.id || "",
      productCode: line.product?.sku || "---",
      productName: line.product?.name || "---",
      quantity: line.quantity || 0,
      price: line.unitPrice || 0,
    })),
  };

  isDetailPopupOpen.value = true;
};

const closeDetailPopup = () => {
  isDetailPopupOpen.value = false;
  selectedOrder.value = null;
};

const handleCompleteOrder = async (id: number) => {
  const isConfirm = await confirm({
    confirmText: "Duyệt đơn",
    message:
      "Bạn có chắc chắn muốn duyệt đơn xuất bán này? Hệ thống sẽ trừ trực tiếp số lượng sản phẩm trong kho.",
    title: "Duyệt đơn xuất bán",
    tone: "warning",
  });
  if (!isConfirm) return;

  const { error: completeError } = await useAPI(
    `/sales-orders/${id}/approve`,
    { method: "PUT" },
  );

  if (completeError.value) {
    const backEndMsg =
      completeError.value.data?.title ||
      completeError.value.data?.message ||
      "Không thể duyệt xuất kho";
    toast.fromMessage(`Lỗi từ máy chủ: ${backEndMsg}`);
    return;
  }

  toast.fromMessage("Duyệt xuất đơn hàng thành công!");
  openActionId.value = null;
  if (isDetailPopupOpen.value) closeDetailPopup();
  await refreshOrders();
};

const handleDeleteOrder = async (id: number) => {
  const isConfirm = await confirmDelete(
    "Bạn có chắc chắn muốn xóa bản nháp đơn hàng này?",
  );
  if (!isConfirm) return;

  const { error: deleteError } = await useAPI(`/sales-orders/${id}/cancel`, {
    method: "PUT",
  });

  if (deleteError.value) {
    toast.fromMessage("Không thể xóa đơn hàng");
    return;
  }

  toast.fromMessage("Xóa đơn nháp thành công!");
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
</script>





