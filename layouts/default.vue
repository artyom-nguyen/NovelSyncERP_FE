<template>
  <div class="wrap">
    <div
      class="wp-site-2025"
      :class="{ 'dashboard-fullscreen-page': shouldUseDashboardFullscreen }"
    >
      <div class="topbar-fixed">
        <div class="layout-topbar-fixed">
          <div class="left">
            <div class="ct-logo-topbar">
              <div class="logo-topbar">
                <img src="/img-fix/icon-novel.png" alt="" />
              </div>
            </div>

            <div class="block-menu-homepage-pc" @click.stop>
              <div
                class="item-menu-homepage"
                :class="{ active: isRouteActive('/dashboard') }"
              >
                <NuxtLink
                  to="/dashboard"
                  class="txt-menu-homepage"
                  @click.prevent.stop="goToRoute('/dashboard')"
                >
                  <span class="txt">Tổng quan</span>
                </NuxtLink>
              </div>
              <div
                class="item-menu-homepage work-menu-homepage"
                :class="{ active: isWorkRouteActive }"
              >
                <NuxtLink
                  :to="firstWorkRoute"
                  class="txt-menu-homepage work-menu-trigger"
                  @click.prevent.stop="goToRoute(firstWorkRoute)"
                >
                  <span class="txt">Làm việc</span>
                </NuxtLink>
              </div>
              <div
                v-if="hasAnyRole(reportRoles)"
                class="item-menu-homepage"
                :class="{ active: isReportRouteActive }"
              >
                <NuxtLink
                  to="/reports"
                  class="txt-menu-homepage"
                  @click.prevent.stop="goToRoute('/reports')"
                >
                  <span class="txt">Báo cáo</span>
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="lst-call-noti-new" @click.stop>
              <div class="lst-call-noti">
                <div
                  class="item-support-topbar"
                  :class="{ active: isOpenNotificationBox }"
                >
                  <a
                    href="javascript:;"
                    class="icon-support-topbar icon-notify"
                    @click.stop.prevent="toggleNotificationBox"
                  >
                    <span v-if="unreadCount > 0" class="number-badge">{{
                      unreadCount
                    }}</span>
                    <img src="/img-fix/icon/icon-bell.svg" alt="" />
                  </a>

                  <div class="box-ntf-header" v-if="isOpenNotificationBox">
                    <div class="block-notification-info">
                      <div class="top-notification-info">
                        <div class="notification-heading">
                          <div>
                            <p class="txt-title">Trung tâm thông báo</p>
                            <p class="number-ntf">
                              {{ notificationSummaryText }}
                            </p>
                          </div>
                          <span
                            class="notification-unread-pill"
                            :class="{ 'is-empty': unreadCount === 0 }"
                          >
                            {{ unreadCount }} mới
                          </span>
                        </div>
                      </div>

                      <div
                        class="content-notification-info custom-scroll-popup"
                      >
                        <div
                          class="lst-imt-ntf-info"
                          v-if="notifications.length > 0"
                        >
                          <div
                            class="imt-ntf-info"
                            v-for="ntf in notifications"
                            :key="ntf.id"
                            :class="{
                              'imt-selected': ntf.isRead,
                              'imt-unread': !ntf.isRead,
                            }"
                          >
                            <div class="icon notification-item-icon">
                              <span class="notification-dot"></span>
                            </div>
                            <div class="content">
                              <div class="notification-row-title">
                                <p class="name">
                                  <a
                                    href="javascript:;"
                                    @click="markAsRead(ntf)"
                                    >{{ ntf.title }}</a
                                  >
                                </p>
                                <span
                                  class="notification-status"
                                  :class="{ read: ntf.isRead }"
                                >
                                  {{ ntf.isRead ? "Đã đọc" : "Mới" }}
                                </span>
                              </div>
                              <p class="txt-small">{{ ntf.message }}</p>
                              <p class="date">
                                {{ formatDateTime(ntf.createdAt) }}
                              </p>
                            </div>
                            <div class="icon-ntf-readed" v-if="ntf.isRead">
                              <img
                                src="/img-fix/icon/icon-checked-chat.svg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div v-else class="notification-empty-state">
                          <div class="notification-empty-icon">
                            <img src="/img-fix/icon/icon-bell-line.svg" alt="" />
                          </div>
                          <p class="notification-empty-title">
                            Chưa có thông báo
                          </p>
                          <p class="notification-empty-text">
                            Các cập nhật mới sẽ xuất hiện tại đây.
                          </p>
                        </div>
                      </div>

                      <div class="bottom-notification-info">
                        <div class="check-all-ntf" v-if="unreadCount > 0">
                          <a href="javascript:;" @click="markAllAsRead"
                            >Đánh dấu tất cả đã đọc</a
                          >
                        </div>
                        <p v-else class="notification-footer-text">
                          Tất cả thông báo đã được đọc.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="icon-close-ntf"
                      @click="closeNotificationBox"
                    >
                      <img src="/img-fix/icon/icon-close.svg" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-menu-new">
              <div class="icon-menu-mb" onclick="javascript: OpenMenuMb();">
                <div class="menu-line">
                  <div class="lines">
                    <div class="line diagonal part-1"></div>
                    <div class="line horizontal"></div>
                    <div class="line diagonal part-2"></div>
                  </div>
                </div>
              </div>
              <div
                class="bg-menu-js"
                onclick="javascript: RemoveMenuMb();"
              ></div>
              <div class="wp-menu-mb-js">
                <div class="header-menu-mb">
                  <h2 class="txt-menu">Menu</h2>
                  <div
                    class="close-menu-mb"
                    onclick="javascript: RemoveMenuMb();"
                  >
                    <img src="/img-fix/icon/icon-close.svg" alt="" />
                  </div>
                </div>
                <div class="box-menu-home-page">
                  <div class="box-menu-mb">
                    <div
                      v-for="item in visibleMobileNavItems"
                      :key="item.to"
                      class="item-menu-mb"
                      :class="{ active: isRouteActive(item.to) }"
                    >
                      <NuxtLink
                        :to="item.to"
                        class="txt-menu-mb"
                        @click.prevent.stop="
                          goToRoute(item.to, { mobile: true })
                        "
                      >
                        {{ item.label }}
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="box-user-login"
              :class="{ 'open-box': isOpenUserBox }"
              @click.stop
            >
              <div class="flex-user" @click="toggleUserBox">
                <div class="avatar-user">
                  <img v-if="avatarUrl" :src="avatarUrl" alt="" />
                  <span v-else class="avatar-initials avatar-initials-sm">
                    {{ userInitials }}
                  </span>
                </div>
              </div>
              <div class="box-popup-user">
                <div class="top-box">
                  <div class="avatar-user-big">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="" />
                    <span v-else class="avatar-initials avatar-initials-lg">
                      {{ userInitials }}
                    </span>
                  </div>
                  <div class="user-popup-info">
                    <p class="name">{{ fullName }}</p>
                    <p class="txt-small">{{ primaryRole }}</p>
                    <p class="user-popup-email">
                      {{ account?.email || account?.login }}
                    </p>
                  </div>
                </div>
                <div class="bottom-box">
                  <div class="lst-imt-cn">
                    <div class="imt-cn">
                      <a
                        href="javascript:;"
                        class="layout"
                        @click.prevent="openProfilePopup"
                      >
                        <span class="icon">
                          <img src="/img-fix/icon/icon-user-black.svg" alt="" />
                        </span>
                        <span class="txt">Cập nhật thông tin cá nhân</span>
                      </a>
                    </div>
                    <div class="imt-cn">
                      <a
                        href="javascript:;"
                        class="layout"
                        @click.prevent="openChangePasswordPopup"
                      >
                        <span class="icon">
                          <img src="/img-fix/icon/icon-lock.svg" alt="" />
                        </span>
                        <span class="txt">Đổi mật khẩu</span>
                      </a>
                    </div>
                    <div class="imt-cn">
                      <a
                        href="javascript:;"
                        class="layout"
                        @click.prevent="logout"
                      >
                        <span class="icon">
                          <img src="/img-fix/icon/icon-signout-white.svg" alt="" />
                        </span>
                        <span class="txt">Đăng xuất</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="main-site-2025 pt-header">
        <div class="box-sidebar-mobile">
          <h3 class="name">Danh mục</h3>
          <div class="icon-sidebar">
            <div class="menu-line">
              <div class="lines">
                <div class="line diagonal part-1"></div>
                <div class="line horizontal"></div>
                <div class="line diagonal part-2"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="layout-site layout-with-sidebar"
          :class="{
            'dashboard-fullscreen-layout': shouldUseDashboardFullscreen,
          }"
        >
          <div class="sidebar-site">
            <div class="layout-sidebar-site">
              <div class="wp-navs-main">
                <div class="lst-navs-group">
                  <div class="item-nav-group-child">
                    <NuxtLink
                      to="/dashboard"
                      class="nav-parent"
                      active-class="active-nav"
                      @click.prevent.stop="
                        goToRoute('/dashboard', { sidebar: true })
                      "
                    >
                      <div class="icon-illus">
                        <img src="/img-fix/icon/icon-overview-black.svg" alt="" />
                      </div>
                      <div class="text">Tổng quan</div>
                    </NuxtLink>
                  </div>

                  <div
                    v-if="hasAnyRole(salesRoles)"
                    class="item-nav-group-child"
                    :class="{ 'open-nav-child': openNav === 'kinh-doanh' }"
                  >
                    <div class="nav-parent" @click="toggleNav('kinh-doanh')">
                      <div class="icon-illus">
                        <img src="/img-fix/icon/icon-bag-black.svg" alt="" />
                      </div>
                      <div class="text">Kinh doanh</div>
                      <span class="icon">
                        <img src="/img-fix/icon/arrow-right.svg" alt="" />
                      </span>
                    </div>
                    <div class="nav-child-lv1">
                      <NuxtLink
                        to="/sales-orders"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/sales-orders', { sidebar: true })
                        "
                      >
                        <div class="text">Đơn bán hàng</div>
                      </NuxtLink>
                      <NuxtLink
                        to="/customers"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/customers', { sidebar: true })
                        "
                      >
                        <div class="text">Khách hàng</div>
                      </NuxtLink>
                    </div>
                  </div>

                  <div
                    v-if="hasAnyRole(supplyChainRoles)"
                    class="item-nav-group-child"
                    :class="{ 'open-nav-child': openNav === 'chuoi-cung-ung' }"
                  >
                    <div
                      class="nav-parent"
                      @click="toggleNav('chuoi-cung-ung')"
                    >
                      <div class="icon-illus">
                        <img src="/img-fix/icon/icon-truck-gray.svg" alt="" />
                      </div>
                      <div class="text">Chuỗi cung ứng</div>
                      <span class="icon">
                        <img src="/img-fix/icon/arrow-right.svg" alt="" />
                      </span>
                    </div>
                    <div class="nav-child-lv1">
                      <NuxtLink
                        v-if="hasAnyRole(purchaseRoles)"
                        to="/purchase-orders"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/purchase-orders', { sidebar: true })
                        "
                      >
                        <div class="text">Đơn nhập hàng</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(transferRoles)"
                        to="/transfer-orders"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/transfer-orders', { sidebar: true })
                        "
                      >
                        <div class="text">Đơn điều chuyển</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(adminManagerRoles)"
                        to="/warehouses"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/warehouses', { sidebar: true })
                        "
                      >
                        <div class="text">Kho hàng</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(inventoryRoles)"
                        to="/inventory-balances"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/inventory-balances', { sidebar: true })
                        "
                      >
                        <div class="text">Số dư tồn kho</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(inventoryRoles)"
                        to="/inventory-transactions"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/inventory-transactions', {
                            sidebar: true,
                          })
                        "
                      >
                        <div class="text">Giao dịch tồn kho</div>
                      </NuxtLink>
                    </div>
                  </div>

                  <div
                    v-if="hasAnyRole(productPartnerRoles)"
                    class="item-nav-group-child"
                    :class="{
                      'open-nav-child': openNav === 'san-pham-doi-tac',
                    }"
                  >
                    <div
                      class="nav-parent"
                      @click="toggleNav('san-pham-doi-tac')"
                    >
                      <div class="icon-illus">
                        <img src="/img-fix/icon/icon-box.svg" alt="" />
                      </div>
                      <div class="text">Sản phẩm và đối tác</div>
                      <span class="icon">
                        <img src="/img-fix/icon/arrow-right.svg" alt="" />
                      </span>
                    </div>
                    <div class="nav-child-lv1">
                      <NuxtLink
                        v-if="hasAnyRole(catalogRoles)"
                        to="/products"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/products', { sidebar: true })
                        "
                      >
                        <div class="text">Sản phẩm</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(catalogRoles)"
                        to="/product-categories"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/product-categories', { sidebar: true })
                        "
                      >
                        <div class="text">Nhóm sản phẩm</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(catalogRoles)"
                        to="/suppliers"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/suppliers', { sidebar: true })
                        "
                      >
                        <div class="text">Nhà cung cấp</div>
                      </NuxtLink>
                    </div>
                  </div>
                  <div
                    v-if="hasAnyRole(financeRoles)"
                    class="item-nav-group-child"
                    :class="{ 'open-nav-child': openNav === 'tai-chinh' }"
                  >
                    <div class="nav-parent" @click="toggleNav('tai-chinh')">
                      <div class="icon-illus">
                        <img src="/img-fix/icon/icon-wallet-black.svg" alt="" />
                      </div>
                      <div class="text">Tài chính</div>
                      <span class="icon">
                        <img src="/img-fix/icon/arrow-right.svg" alt="" />
                      </span>
                    </div>
                    <div class="nav-child-lv1">
                      <NuxtLink
                        to="/payments"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/payments', { sidebar: true })
                        "
                      >
                        <div class="text">Thanh toán</div>
                      </NuxtLink>
                    </div>
                  </div>

                  <div
                    v-if="hasAnyRole(adminManagerRoles)"
                    class="item-nav-group-child"
                    :class="{ 'open-nav-child': openNav === 'quan-tri' }"
                  >
                    <div class="nav-parent" @click="toggleNav('quan-tri')">
                      <div class="icon-illus">
                        <img src="/img-fix/icon/icon-setting-phos.svg" alt="" />
                      </div>
                      <div class="text">Quản trị</div>
                      <span class="icon">
                        <img src="/img-fix/icon/arrow-right.svg" alt="" />
                      </span>
                    </div>
                    <div class="nav-child-lv1">
                      <NuxtLink
                        v-if="hasAnyRole(adminOnlyRoles)"
                        to="/users"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/users', { sidebar: true })
                        "
                      >
                        <div class="text">Tài khoản</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(adminManagerRoles)"
                        to="/employees"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/employees', { sidebar: true })
                        "
                      >
                        <div class="text">Nhân viên</div>
                      </NuxtLink>
                      <NuxtLink
                        v-if="hasAnyRole(adminManagerRoles)"
                        to="/departments"
                        class="nav-parent-child"
                        active-class="active-nav"
                        @click.prevent.stop="
                          goToRoute('/departments', { sidebar: true })
                        "
                      >
                        <div class="text">Phòng ban</div>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="close-popup-sidebar">
              <img src="/img-fix/icon/icon-close-white.svg" alt="" />
            </div>
            <div class="bg-sidebar"></div>
          </div>
          <div class="main-site">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        class="popup-export-file ct-popup-width-540 new-popup-common"
        :class="{ 'open-popup': isProfilePopupOpen }"
      >
        <div class="content-export-file">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-rgl">Cập nhật thông tin cá nhân</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeProfilePopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>

            <div class="main-popup-content">
              <div class="block-update-contract">
                <div class="profile-popup-summary">
                  <div class="avatar-user-big">
                    <img
                      v-if="profilePreviewAvatar"
                      :src="profilePreviewAvatar"
                      alt=""
                    />
                    <span v-else class="avatar-initials avatar-initials-lg">
                      {{ profilePreviewInitials }}
                    </span>
                  </div>
                  <div>
                    <p class="profile-popup-name">{{ profilePreviewName }}</p>
                    <p class="profile-popup-role">{{ primaryRole }}</p>
                  </div>
                </div>

                <div class="form-bm-popup">
                  <div class="form-row-2">
                    <div class="imt-bm-form">
                      <p class="txt-ct-input">Họ</p>
                      <div class="ct-form-input">
                        <input
                          type="text"
                          v-model="profileForm.lastName"
                          maxlength="50"
                          placeholder="Nhập họ"
                        />
                      </div>
                    </div>

                    <div class="imt-bm-form">
                      <p class="txt-ct-input">Tên</p>
                      <div class="ct-form-input">
                        <input
                          type="text"
                          v-model="profileForm.firstName"
                          maxlength="50"
                          placeholder="Nhập tên"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Email</p>
                    <div class="ct-form-input">
                      <input
                        type="email"
                        v-model="profileForm.email"
                        maxlength="254"
                        :disabled="isAdminAccount"
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Số điện thoại</p>
                    <div class="ct-form-input">
                      <input
                        type="tel"
                        v-model="profileForm.phone"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="15"
                        placeholder="Nhập số điện thoại"
                        @input="handleProfilePhoneInput"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Ảnh đại diện</p>
                    <div class="ct-form-input">
                      <input
                        type="text"
                        v-model="profileForm.imageUrl"
                        maxlength="256"
                        placeholder="Nhập đường dẫn ảnh"
                      />
                    </div>
                  </div>

                  <p v-if="profileError" class="txt-error text-red mt-10">
                    {{ profileError }}
                  </p>
                </div>
              </div>
            </div>

            <div class="button-popup-content">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color ad-border"
                  @click="closeProfilePopup"
                >
                  <p class="text-size-13-rgl">Hủy</p>
                </a>
              </div>
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="submitProfile"
                >
                  <p class="text-size-13-medium">
                    {{ isSavingProfile ? "Đang lưu..." : "Lưu thông tin" }}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeProfilePopup"></div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        class="popup-export-file ct-popup-width-540 new-popup-common"
        :class="{ 'open-popup': isChangePasswordPopupOpen }"
      >
        <div class="content-export-file">
          <div class="main-export-file">
            <div class="title-export-file align-items-center">
              <div class="left">
                <p class="text-size-14-rgl">Đổi mật khẩu</p>
              </div>
              <div class="right">
                <div class="icon-close-small" @click="closeChangePasswordPopup">
                  <img src="/img-fix/icon/icon-close.svg" alt="" />
                </div>
              </div>
            </div>

            <div class="main-popup-content">
              <div class="block-update-contract">
                <div class="form-bm-popup">
                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Mật khẩu hiện tại</p>
                    <div class="ct-form-input">
                      <input
                        type="password"
                        v-model="pwdForm.currentPassword"
                        maxlength="100"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Mật khẩu mới</p>
                    <div class="ct-form-input">
                      <input
                        type="password"
                        v-model="pwdForm.newPassword"
                        minlength="4"
                        maxlength="100"
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                  </div>

                  <div class="imt-bm-form">
                    <p class="txt-ct-input">Xác nhận mật khẩu mới</p>
                    <div class="ct-form-input">
                      <input
                        type="password"
                        v-model="pwdForm.confirmNewPassword"
                        minlength="4"
                        maxlength="100"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                    <p v-if="pwdError" class="txt-error text-red mt-10">
                      {{ pwdError }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="button-popup-content">
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color ad-border"
                  @click="closeChangePasswordPopup"
                >
                  <p class="text-size-13-rgl">Hủy</p>
                </a>
              </div>
              <div class="btn-create-group">
                <a
                  href="javascript:;"
                  class="btn-frame-color primary"
                  @click="submitChangePassword"
                >
                  <p class="text-size-13-medium">
                    {{ isChangingPwd ? "Đang xử lý..." : "Lưu" }}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-popup-page" @click="closeChangePasswordPopup"></div>
      </div>
    </Teleport>
    <AppToast />
    <AppConfirmDialog />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const {
  account,
  authToken,
  avatarUrl,
  clearToken,
  fullName,
  hasAnyRole,
  isAdminAccount,
  loadAccount,
  primaryRole,
  refreshAccount,
  userInitials,
} = useAccountSession();

const {
  closeNotificationBox,
  formatDateTime,
  isOpenNotificationBox,
  markAllAsRead,
  markAsRead,
  notificationSummaryText,
  notifications,
  toggleNotificationBox: toggleNotificationBoxBase,
  unreadCount,
} = await useNotifications();

if (!authToken.value && process.client) {
  await navigateTo("/");
}

if (authToken.value) {
  await loadAccount();
}

const isOpenUserBox = ref(false);
const toggleUserBox = () => {
  isOpenUserBox.value = !isOpenUserBox.value;
  isOpenNotificationBox.value = false;
};
const closeUserBox = () => {
  isOpenUserBox.value = false;
};
const toggleNotificationBox = async () => {
  isOpenUserBox.value = false;
  await toggleNotificationBoxBase();
};

const closeSidebarMenu = () => {
  if (!process.client) return;
  document.querySelector(".sidebar-site")?.classList.remove("open-sidebar");
};

const goToRoute = async (
  path: string,
  options: { mobile?: boolean; sidebar?: boolean } = {},
) => {
  closeUserBox();
  isOpenNotificationBox.value = false;

  if (options.mobile) {
    closeMobileMenu();
  }
  if (options.sidebar) {
    closeSidebarMenu();
  }

  if (route.path !== path) {
    await router.push(path);
  }
};

const logout = () => {
  clearToken();
  navigateTo("/");
};

const routeNavGroups = [
  { id: "kinh-doanh", paths: ["/sales-orders", "/customers"] },
  {
    id: "chuoi-cung-ung",
    paths: [
      "/purchase-orders",
      "/transfer-orders",
      "/warehouses",
      "/inventory-balances",
      "/inventory-transactions",
    ],
  },
  {
    id: "san-pham-doi-tac",
    paths: ["/products", "/product-categories", "/suppliers"],
  },
  { id: "tai-chinh", paths: ["/payments"] },
  { id: "quan-tri", paths: ["/users", "/employees", "/departments"] },
];

const openNav = ref<string | null>(
  routeNavGroups.find((group) =>
    group.paths.some(
      (path) => route.path === path || route.path.startsWith(`${path}/`),
    ),
  )?.id || "san-pham-doi-tac",
);
const toggleNav = (navId: string) => {
  openNav.value = openNav.value === navId ? null : navId;
};

interface NavItem {
  label: string;
  to: string;
  roles?: string[];
  description?: string;
}

interface WorkNavGroup {
  id: string;
  label: string;
  roles?: string[];
  items: NavItem[];
}

const {
  adminManagerRoles,
  catalogRoles,
  financeRoles,
  getActionRoles,
  inventoryRoles,
  purchaseRoles,
  reportRoles,
  salesRoles,
  transferRoles,
} = useRoutePermissions();
const adminOnlyRoles = getActionRoles("admin.users");
const supplyChainRoles = [
  ...new Set([...purchaseRoles, ...inventoryRoles, ...transferRoles]),
];
const productPartnerRoles = catalogRoles;

const workNavGroups: WorkNavGroup[] = [
  {
    id: "kinh-doanh",
    label: "Kinh doanh",
    roles: salesRoles,
    items: [
      {
        label: "Đơn bán hàng",
        to: "/sales-orders",
        description: "Theo dõi và tạo đơn bán",
      },
      {
        label: "Khách hàng",
        to: "/customers",
        description: "Danh sách khách hàng và công nợ",
      },
    ],
  },
  {
    id: "chuoi-cung-ung",
    label: "Chuỗi cung ứng",
    roles: supplyChainRoles,
    items: [
      {
        label: "Đơn nhập hàng",
        to: "/purchase-orders",
        roles: purchaseRoles,
        description: "Quản lý nhập hàng",
      },
      {
        label: "Đơn điều chuyển",
        to: "/transfer-orders",
        roles: transferRoles,
        description: "Điều chuyển hàng giữa các kho",
      },
      {
        label: "Kho hàng",
        to: "/warehouses",
        roles: adminManagerRoles,
        description: "Danh mục kho vận hành",
      },
      {
        label: "Số dư tồn kho",
        to: "/inventory-balances",
        roles: inventoryRoles,
        description: "Kiểm tra tồn thực tế",
      },
      {
        label: "Giao dịch tồn kho",
        to: "/inventory-transactions",
        roles: inventoryRoles,
        description: "Lịch sử biến động kho",
      },
    ],
  },
  {
    id: "san-pham-doi-tac",
    label: "Sản phẩm và đối tác",
    roles: catalogRoles,
    items: [
      {
        label: "Sản phẩm",
        to: "/products",
        description: "Thông tin sản phẩm",
      },
      {
        label: "Nhóm sản phẩm",
        to: "/product-categories",
        description: "Nhóm phân loại sản phẩm",
      },
      {
        label: "Nhà cung cấp",
        to: "/suppliers",
        description: "Thông tin nhà cung cấp",
      },
    ],
  },
  {
    id: "tai-chinh",
    label: "Tài chính",
    roles: financeRoles,
    items: [
      {
        label: "Thanh toán",
        to: "/payments",
        description: "Phiếu thu, phiếu chi và duyệt thanh toán",
      },
    ],
  },
  {
    id: "quan-tri",
    label: "Quản trị",
    roles: adminManagerRoles,
    items: [
      {
        label: "Tài khoản",
        to: "/users",
        roles: ["ROLE_ADMIN"],
        description: "Người dùng và phân quyền",
      },
      {
        label: "Nhân viên",
        to: "/employees",
        roles: adminManagerRoles,
        description: "Hồ sơ nhân sự và phân công kho",
      },
      {
        label: "Phòng ban",
        to: "/departments",
        roles: adminManagerRoles,
        description: "Cơ cấu phòng ban",
      },
    ],
  },
];

const mobileNavItems: NavItem[] = [
  { label: "Tổng quan", to: "/dashboard" },
  { label: "Báo cáo", to: "/reports", roles: reportRoles },
  { label: "Đơn bán hàng", to: "/sales-orders", roles: salesRoles },
  { label: "Khách hàng", to: "/customers", roles: salesRoles },
  { label: "Đơn nhập hàng", to: "/purchase-orders", roles: purchaseRoles },
  { label: "Đơn điều chuyển", to: "/transfer-orders", roles: transferRoles },
  { label: "Kho hàng", to: "/warehouses", roles: adminManagerRoles },
  { label: "Số dư tồn kho", to: "/inventory-balances", roles: inventoryRoles },
  {
    label: "Giao dịch tồn kho",
    to: "/inventory-transactions",
    roles: inventoryRoles,
  },
  { label: "Sản phẩm", to: "/products", roles: catalogRoles },
  { label: "Nhóm sản phẩm", to: "/product-categories", roles: catalogRoles },
  { label: "Nhà cung cấp", to: "/suppliers", roles: catalogRoles },
  { label: "Thanh toán", to: "/payments", roles: financeRoles },
  { label: "Tài khoản", to: "/users", roles: ["ROLE_ADMIN"] },
  { label: "Nhân viên", to: "/employees", roles: adminManagerRoles },
  { label: "Phòng ban", to: "/departments", roles: adminManagerRoles },
];

const canShowNavItem = (item: NavItem) =>
  !item.roles || item.roles.length === 0 || hasAnyRole(item.roles);

const visibleWorkNavGroups = computed(() =>
  workNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(canShowNavItem),
    }))
    .filter(
      (group) =>
        group.items.length > 0 &&
        (!group.roles || group.roles.length === 0 || hasAnyRole(group.roles)),
    ),
);

const visibleMobileNavItems = computed(() =>
  mobileNavItems.filter(canShowNavItem),
);

const firstWorkRoute = computed(
  () => visibleWorkNavGroups.value[0]?.items[0]?.to || "/work",
);

const isRouteActive = (path: string) =>
  route.path === path || route.path.startsWith(`${path}/`);

const isDashboardRoute = computed(() => isRouteActive("/dashboard"));
const isReportRouteActive = computed(() => isRouteActive("/reports"));
const isWorkPlaceholderRoute = computed(() => isRouteActive("/work"));
const shouldUseDashboardFullscreen = computed(
  () => isDashboardRoute.value || isWorkPlaceholderRoute.value,
);
const isWorkRouteActive = computed(
  () =>
    isWorkPlaceholderRoute.value ||
    visibleWorkNavGroups.value.some((group) =>
      group.items.some((item) => isRouteActive(item.to)),
    ),
);

const closeMobileMenu = () => {
  if (
    process.client &&
    typeof (window as unknown as { RemoveMenuMb?: () => void }).RemoveMenuMb ===
      "function"
  ) {
    (window as unknown as { RemoveMenuMb: () => void }).RemoveMenuMb();
  }
};

const {
  closeChangePasswordPopup,
  closeProfilePopup,
  handleProfilePhoneInput,
  isChangePasswordPopupOpen,
  isChangingPwd,
  isProfilePopupOpen,
  isSavingProfile,
  openChangePasswordPopup,
  openProfilePopup,
  profileError,
  profileForm,
  profilePreviewAvatar,
  profilePreviewInitials,
  profilePreviewName,
  pwdError,
  pwdForm,
  submitChangePassword,
  submitProfile,
} = useProfileSettings({
  account,
  avatarUrl,
  closeUserBox,
  fullName,
  isAdminAccount,
  refreshAccount,
});

const handleDocumentClick = () => {
  closeUserBox();
  closeNotificationBox();
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
});
</script>
