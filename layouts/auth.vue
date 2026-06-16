<template>
  <div>
    <div class="wrap">
      <div class="wp-homepage-login">
        <div class="ct-header-new">
          <div class="wp-menu-homepage">
            <div class="container">
              <div class="layout-menu-homepage">
                <div class="left-menu">
                  <div class="logo-new">
                    <NuxtLink to="/">
                      <img src="/img-fix/icon-novel-auth.png" alt="" />
                    </NuxtLink>
                  </div>
                </div>
                <div class="right-menu">
                  <div class="lst-btn-header">
                    <div class="btn-header">
                      <NuxtLink :to="authLink.to" class="btn-bg-login">
                        <span class="text">{{ authLink.text }}</span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-popup-page"></div>
        </div>
        <slot></slot>
        <div class="footer-login-page">
          <div class="container">
            <div class="layout-footer-login-page">
              <div class="left">
                <div class="language-menu-ft">
                  <div class="icon-logo">
                    <img src="/img-fix/icon-novel-auth.png" alt="" />
                  </div>
                </div>
                <div class="list-menu-bottom-ft">
                  <a href="javascript:;" class="item-menu-ft"
                    >Giới thiệu về NovelSync</a
                  >
                  <a href="javascript:;" class="item-menu-ft">Bảo mật</a>
                  <a href="javascript:;" class="item-menu-ft">Pháp lý</a>
                </div>
              </div>
              <div class="right">
                <div class="btn-language-change">
                  <span class="icon"
                    ><img src="/img-fix/icon/icon-ngon-ngu.svg" alt=""
                  /></span>
                  <p class="text-size-14-rgl">Tiếng Việt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppToast />
    <AppConfirmDialog />
  </div>
</template>
<script setup lang="ts">
const route = useRoute();

const authLink = computed(() => {
  if (route.path === "/") {
    return {
      text: "Đăng ký",
      to: "/account/register",
    };
  }

  return {
    text: "Đăng nhập",
    to: "/",
  };
});
</script>
