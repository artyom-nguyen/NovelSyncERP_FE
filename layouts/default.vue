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
                    v-if="
                      hasAnyRole([
                        'ROLE_ADMIN',
                        'ROLE_PURCHASER',
                        'ROLE_WAREHOUSE',
                        'ROLE_MANAGER',
                        'ROLE_ACCOUNTANT',
                        'ROLE_THU_KHO',
                      ])
                    "
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
                    v-if="
                      hasAnyRole([
                        'ROLE_ADMIN',
                        'ROLE_PURCHASER',
                        'ROLE_WAREHOUSE',
                        'ROLE_MANAGER',
                        'ROLE_THU_KHO',
                      ])
                    "
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
                    v-if="hasAnyRole(['ROLE_ADMIN'])"
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
import { ref, computed, onMounted, onUnmounted } from "vue";

import { Client } from "@stomp/stompjs";
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const toast = useToast();

const isOpenUserBox = ref(false);
const toggleUserBox = () => {
  isOpenUserBox.value = !isOpenUserBox.value;
  isOpenNotificationBox.value = false;
};
const closeUserBox = () => {
  isOpenUserBox.value = false;
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

interface Account {
  id: number;
  login: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string | null;
  phone?: string | null;
  langKey?: string | null;
  activated?: boolean;
  status?: string;
  authority?: string;
  authorities?: string[];
}
const { clearToken, syncFromStorage, token: authToken } = useAuthToken();

if (process.client) {
  syncFromStorage();
}

if (!authToken.value && process.client) {
  await navigateTo("/");
}

const account = ref<Account | null>(null);

if (authToken.value) {
  const { data: accountData } = await useAPI<Account>("/account");
  account.value = (accountData.value as Account | null | undefined) || null;
}

const userRoles = computed(() => {
  const authorities = account.value?.authorities || [];
  const authority = account.value?.authority ? [account.value.authority] : [];
  return [...new Set([...authorities, ...authority])];
});

const hasAnyRole = (allowedRoles: string[]) => {
  if (!allowedRoles.length) return true;
  if (!userRoles.value.length) return false;
  if (userRoles.value.includes("ROLE_ADMIN")) return true;
  return allowedRoles.some((role) => userRoles.value.includes(role));
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

const salesRoles = [
  "ROLE_ADMIN",
  "ROLE_SALES",
  "ROLE_MANAGER",
  "ROLE_ACCOUNTANT",
];
const purchaseRoles = [
  "ROLE_ADMIN",
  "ROLE_PURCHASER",
  "ROLE_MANAGER",
  "ROLE_ACCOUNTANT",
  "ROLE_THU_KHO",
];
const transferRoles = [
  "ROLE_ADMIN",
  "ROLE_WAREHOUSE",
  "ROLE_MANAGER",
  "ROLE_SHIPPER",
  "ROLE_THU_KHO",
];
const inventoryRoles = [
  "ROLE_ADMIN",
  "ROLE_WAREHOUSE",
  "ROLE_MANAGER",
  "ROLE_ACCOUNTANT",
  "ROLE_THU_KHO",
];
const catalogRoles = [
  "ROLE_ADMIN",
  "ROLE_PURCHASER",
  "ROLE_WAREHOUSE",
  "ROLE_MANAGER",
  "ROLE_THU_KHO",
];
const financeRoles = ["ROLE_ADMIN", "ROLE_ACCOUNTANT"];
const adminManagerRoles = ["ROLE_ADMIN", "ROLE_MANAGER"];

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
    roles: [...purchaseRoles, ...inventoryRoles, ...transferRoles],
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

const fullName = computed(() => {
  if (!account.value) return "User";
  const first = account.value.firstName || "";
  const last = account.value.lastName || "";
  const full = `${last} ${first}`.trim();
  return full || account.value.login;
});

const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const source = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return (
    source
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "NS"
  );
};

const userInitials = computed(() => getInitials(fullName.value));

const primaryRole = computed(() => {
  if (!userRoles.value.length) return "Chưa phân quyền";
  const roles: Record<string, string> = {
    ROLE_ADMIN: "Admin",
    ROLE_USER: "User",
    ROLE_THU_KHO: "Thủ kho",
    ROLE_WAREHOUSE: "Thủ kho",
    ROLE_PURCHASER: "Nhân viên mua hàng",
    ROLE_SALES: "Sales",
    ROLE_MANAGER: "Quản lý",
    ROLE_ACCOUNTANT: "Kế toán",
  };
  const primary =
    userRoles.value.find((role) => role !== "ROLE_USER") || userRoles.value[0];
  return roles[primary] || primary;
});

const isAdminAccount = computed(() => userRoles.value.includes("ROLE_ADMIN"));

const avatarUrl = computed(() => account.value?.imageUrl?.trim() || "");

const emptyProfileForm = () => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  imageUrl: "",
  langKey: "vi",
});

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const isProfilePopupOpen = ref(false);
const isSavingProfile = ref(false);
const profileError = ref("");
const profileForm = ref(emptyProfileForm());
const profilePreviewAvatar = computed(
  () => profileForm.value.imageUrl.trim() || avatarUrl.value,
);
const profilePreviewName = computed(() => {
  const first = profileForm.value.firstName.trim();
  const last = profileForm.value.lastName.trim();
  return `${last} ${first}`.trim() || fullName.value;
});
const profilePreviewInitials = computed(() =>
  getInitials(profilePreviewName.value),
);

const fillProfileForm = () => {
  profileForm.value = {
    firstName: account.value?.firstName || "",
    lastName: account.value?.lastName || "",
    email: account.value?.email || "",
    phone: account.value?.phone || "",
    imageUrl: account.value?.imageUrl || "",
    langKey: account.value?.langKey || "vi",
  };
};

const handleProfilePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const phone = toDigitsOnly(target.value);
  target.value = phone;
  profileForm.value.phone = phone;
};

const openProfilePopup = () => {
  isOpenUserBox.value = false;
  profileError.value = "";
  fillProfileForm();
  isProfilePopupOpen.value = true;
};

const closeProfilePopup = () => {
  isProfilePopupOpen.value = false;
};

const refreshAccount = async () => {
  if (!authToken.value) return;
  const freshAccount = await $fetch<Account>("/account", {
    baseURL: config.public.apiBase,
    headers: {
      Authorization: `Bearer ${authToken.value}`,
    },
  });
  account.value = freshAccount;
};

const getProfileErrorMessage = (error: any) => {
  const message =
    `${error?.data?.title || ""} ${error?.data?.detail || ""} ${error?.message || ""}`.toLowerCase();
  if (message.includes("email")) {
    return "Email này đã được sử dụng, vui lòng chọn email khác.";
  }
  return "Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.";
};

const submitProfile = async () => {
  if (!account.value || isSavingProfile.value) return;

  profileError.value = "";
  const validationError = firstValidationError([
    validateMaxLength(profileForm.value.firstName, 50, "Tên"),
    validateMaxLength(profileForm.value.lastName, 50, "Họ"),
    !isAdminAccount.value && validateRequired(profileForm.value.email, "Email"),
    !isAdminAccount.value && validateEmail(profileForm.value.email),
    validateDigitsOnly(profileForm.value.phone, "Số điện thoại"),
    validateMaxLength(profileForm.value.phone, 15, "Số điện thoại"),
    validateMaxLength(profileForm.value.imageUrl, 256, "Ảnh đại diện"),
    validateMinMaxLength(profileForm.value.langKey || "vi", 2, 10, "Ngôn ngữ"),
  ]);

  if (validationError) {
    profileError.value = validationError;
    return;
  }

  isSavingProfile.value = true;
  try {
    const { error } = await useAPI("/account", {
      method: "POST",
      body: {
        ...account.value,
        firstName: trimOrNull(profileForm.value.firstName),
        lastName: trimOrNull(profileForm.value.lastName),
        email: isAdminAccount.value
          ? account.value.email
          : profileForm.value.email.trim(),
        imageUrl: trimOrNull(profileForm.value.imageUrl),
        phone: trimOrNull(profileForm.value.phone),
        langKey: profileForm.value.langKey.trim() || "vi",
      },
    });

    if (error.value) {
      profileError.value = getProfileErrorMessage(error.value);
      toast.error(profileError.value);
      return;
    }

    await refreshAccount();
    closeProfilePopup();
    toast.success("Cập nhật thông tin cá nhân thành công.");
  } catch (err: any) {
    profileError.value = getProfileErrorMessage(err);
    toast.error(profileError.value);
  } finally {
    isSavingProfile.value = false;
  }
};

const isChangePasswordPopupOpen = ref(false);
const isChangingPwd = ref(false);
const pwdError = ref("");
const pwdForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const openChangePasswordPopup = () => {
  isOpenUserBox.value = false;
  pwdForm.value = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  pwdError.value = "";
  isChangePasswordPopupOpen.value = true;
};

const closeChangePasswordPopup = () => {
  isChangePasswordPopupOpen.value = false;
};

const submitChangePassword = async () => {
  pwdError.value = "";

  const validationError = firstValidationError([
    validateRequired(pwdForm.value.currentPassword, "Mật khẩu hiện tại"),
    validatePasswordLength(pwdForm.value.newPassword, "Mật khẩu mới"),
    validateRequired(pwdForm.value.confirmNewPassword, "Xác nhận mật khẩu mới"),
  ]);

  if (validationError) {
    pwdError.value = validationError;
    return;
  }

  if (
    !pwdForm.value.currentPassword ||
    !pwdForm.value.newPassword ||
    !pwdForm.value.confirmNewPassword
  ) {
    pwdError.value = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }
  if (pwdForm.value.newPassword !== pwdForm.value.confirmNewPassword) {
    pwdError.value = "Mật khẩu xác nhận không khớp.";
    return;
  }

  isChangingPwd.value = true;
  try {
    const { error } = await useAPI("/account/change-password", {
      method: "POST",
      body: {
        currentPassword: pwdForm.value.currentPassword,
        newPassword: pwdForm.value.newPassword,
      },
    });

    if (error.value) {
      pwdError.value =
        error.value.data?.title || "Mật khẩu hiện tại không chính xác.";
      toast.error(pwdError.value);
      return;
    }
    toast.success("Đổi mật khẩu thành công.");
    closeChangePasswordPopup();
  } catch (err) {
    pwdError.value = "Lỗi kết nối máy chủ.";
    toast.error(pwdError.value);
  } finally {
    isChangingPwd.value = false;
  }
};

interface NotificationDTO {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const isOpenNotificationBox = ref(false);

const initialNotifs = ref<NotificationDTO[]>([]);

if (authToken.value) {
  const { data: initialNotifData } = await useAPI<NotificationDTO[]>(
    "/notifications/my-latest",
  );
  initialNotifs.value = initialNotifData.value || [];
}

const notifications = ref<NotificationDTO[]>([]);
const unreadCount = computed(
  () => notifications.value.filter((n) => !n.isRead).length,
);
const notificationSummaryText = computed(() => {
  if (notifications.value.length === 0) return "Không có thông báo nào";
  if (unreadCount.value === 0) return "Tất cả thông báo đã được đọc";
  return `Có ${unreadCount.value} thông báo chưa đọc`;
});
let stompClient: Client | null = null;

const toggleNotificationBox = async () => {
  isOpenNotificationBox.value = !isOpenNotificationBox.value;
  isOpenUserBox.value = false;
  if (isOpenNotificationBox.value) {
    await refreshNotifications();
  }
};

const closeNotificationBox = () => {
  isOpenNotificationBox.value = false;
};

const saveToLocal = (notifs: NotificationDTO[]) => {
  if (process.client) {
    localStorage.setItem(
      "novel_notifications",
      JSON.stringify(notifs.slice(0, 30)),
    );
  }
};

const sortNotifications = (notifs: NotificationDTO[]) =>
  notifs
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 30);

const upsertNotification = (noti: NotificationDTO) => {
  const existIdx = notifications.value.findIndex((n) => n.id === noti.id);
  if (existIdx !== -1) {
    notifications.value[existIdx] = {
      ...notifications.value[existIdx],
      ...noti,
    };
  } else {
    notifications.value.unshift(noti);
  }

  notifications.value = sortNotifications([...notifications.value]);
  saveToLocal(notifications.value);
};

const mergeUnreadNotifications = (incoming: NotificationDTO[]) => {
  incoming.forEach((noti) => {
    upsertNotification({
      ...noti,
      isRead: false,
    });
  });
};

const loadAndMergeLocal = () => {
  if (process.client) {
    const localData = localStorage.getItem("novel_notifications");
    const map = new Map();

    if (localData) {
      try {
        const parsedLocal = JSON.parse(localData) as NotificationDTO[];
        parsedLocal.forEach((n) => {
          n.isRead = true;
          map.set(n.id, n);
        });
      } catch (e) {
        console.error("Lỗi đọc localStorage:", e);
      }
    }

    if (initialNotifs.value) {
      initialNotifs.value.forEach((n) => {
        n.isRead = false;
        map.set(n.id, n);
      });
    }

    notifications.value = Array.from(map.values())
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 30);

    saveToLocal(notifications.value);
  }
};

const isFetchingNotifications = ref(false);
let notificationPollTimer: any = null;

const refreshNotifications = async () => {
  if (!process.client || !authToken.value || isFetchingNotifications.value) {
    return;
  }

  isFetchingNotifications.value = true;
  try {
    syncFromStorage();
    const data = await $fetch<NotificationDTO[]>("/notifications/my-latest", {
      baseURL: config.public.apiBase,
      headers: authToken.value
        ? {
            Authorization: `Bearer ${authToken.value}`,
          }
        : undefined,
    });

    mergeUnreadNotifications(data || []);
  } catch (err) {
    console.error("Không thể tải thông báo mới:", err);
  } finally {
    isFetchingNotifications.value = false;
  }
};

const startNotificationPolling = () => {
  if (!process.client || notificationPollTimer) return;

  notificationPollTimer = window.setInterval(() => {
    if (document.visibilityState === "visible") {
      refreshNotifications();
    }
  }, 5000);
};

const stopNotificationPolling = () => {
  if (!notificationPollTimer) return;
  clearInterval(notificationPollTimer);
  notificationPollTimer = null;
};

const connectWebSocket = () => {
  syncFromStorage();
  if (!authToken.value) return;

  stompClient = new Client({
    brokerURL: `ws://localhost:8080/websocket/stomp?access_token=${authToken.value}`,

    connectHeaders: {
      Authorization: `Bearer ${authToken.value}`,
    },

    reconnectDelay: 5000,
    debug: (str) => console.log(str),

    onConnect: (frame) => {
      console.log("Đã kết nối Notification WebSocket thành công.");

      const handleIncoming = (message: any) => {
        const noti = JSON.parse(message.body) as NotificationDTO;
        noti.isRead = false;

        console.log("Nhận thông báo mới real-time:", noti);

        upsertNotification(noti);
      };

      stompClient?.subscribe("/topic/notification", handleIncoming);
      stompClient?.subscribe("/user/queue/notification", handleIncoming);
    },
    onStompError: (frame) => {
      console.error("Lỗi STOMP:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

const markAsRead = async (ntf: NotificationDTO) => {
  if (ntf.isRead) return;
  const { error } = await useAPI(`/notifications/${ntf.id}`, {
    method: "PATCH",
    body: {
      id: ntf.id,
      isRead: true,
    },
  });
  if (!error.value) {
    ntf.isRead = true;
    saveToLocal(notifications.value);
  }
};

const markAllAsRead = async () => {
  const unreadNtfs = notifications.value.filter((n) => !n.isRead);
  for (const ntf of unreadNtfs) {
    await useAPI(`/notifications/${ntf.id}`, {
      method: "PATCH",
      body: {
        id: ntf.id,
        isRead: true,
      },
    });
    ntf.isRead = true;
  }
  saveToLocal(notifications.value);
};

const formatDateTime = (dateStr: string | null) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} lúc ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const handleDocumentClick = () => {
  closeUserBox();
  closeNotificationBox();
};

const handleVisibilityChange = () => {
  if (document.visibilityState === "visible") {
    refreshNotifications();
  }
};

const handleNotificationRefresh = () => {
  refreshNotifications();
};

onMounted(() => {
  loadAndMergeLocal();
  refreshNotifications();
  connectWebSocket();
  startNotificationPolling();

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleNotificationRefresh);
  window.addEventListener(
    "novel:notifications-refresh",
    handleNotificationRefresh,
  );
});

onUnmounted(() => {
  if (stompClient) {
    stompClient.deactivate();
  }
  stopNotificationPolling();
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("focus", handleNotificationRefresh);
  window.removeEventListener(
    "novel:notifications-refresh",
    handleNotificationRefresh,
  );
});
</script>