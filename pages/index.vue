<template>
  <div class="main-login-homepage pb-50">
    <section class="block-login-page pt-50 pb-50">
      <div class="container">
        <div class="title-homepage mb-4 text-center">
          <h3 class="text-18-rgl mb-2">Đăng nhập</h3>
          <p class="text-14-light">
            Sử dụng tài khoản được cấp bởi tổ chức của bạn
          </p>
        </div>

        <div class="main-box-login">
          <div class="box-form-login">
            <div class="ct-input">
              <label for="login-username" class="txt-login-content">
                Tên đăng nhập
              </label>
              <div class="item-choose-filter">
                <input
                  id="login-username"
                  v-model="username"
                  type="text"
                  maxlength="50"
                  placeholder="Nhập tên đăng nhập ..."
                />
              </div>
            </div>

            <div class="ct-input">
              <div class="ct-flex-title">
                <label for="login-password" class="txt-login-content">
                  Mật khẩu
                </label>
                <div class="box-password-txt">
                  <NuxtLink to="/account/reset/request">
                    Quên mật khẩu?
                  </NuxtLink>
                </div>
              </div>
              <div class="item-choose-filter">
                <input
                  id="login-password"
                  v-model="password"
                  type="password"
                  minlength="4"
                  maxlength="100"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="box-alert-login">
            <p>{{ errorMessage }}</p>
          </div>

          <div class="box-form-choose mb-15">
            <div class="ct-check-box">
              <input id="terms" v-model="agreedToTerms" type="checkbox" />
              <label for="terms">
                <span class="check">
                  <img src="/img-fix/icon/icon-checkbox-black.svg" alt="" />
                </span>
                <span class="checked">
                  <img src="/img-fix/icon/icon-black-checked.svg" alt="" />
                </span>
                <span class="label-value text-size-13-light">
                  Tôi xác nhận đã đọc, hiểu và đồng ý tuân thủ
                  <span class="txt-link-nav">[Điều khoản sử dụng]</span>
                  của NovelSyncERP. Tôi hiểu rằng đây là hợp đồng pháp lý ràng
                  buộc giữa tôi hoặc tổ chức tôi đại diện và NovelSyncERP.
                </span>
              </label>
            </div>

            <div class="ct-check-box">
              <input id="privacy" v-model="agreedToPrivacy" type="checkbox" />
              <label for="privacy">
                <span class="check">
                  <img src="/img-fix/icon/icon-checkbox-black.svg" alt="" />
                </span>
                <span class="checked">
                  <img src="/img-fix/icon/icon-black-checked.svg" alt="" />
                </span>
                <span class="label-value text-size-13-light">
                  Tôi đồng ý cho phép NovelSyncERP thu thập, lưu trữ và xử lý dữ
                  liệu của tôi để thiết lập tài khoản và cung cấp dịch vụ theo
                  quy định chi tiết tại
                  <span class="txt-link-nav text-size-13-medium">
                    [Chính sách Quyền riêng tư].
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div class="btn-next-page">
            <button
              class="btn-bg-dark"
              :class="{ disable: !canSubmitLogin }"
              :disabled="loading || !canSubmitLogin"
              @click="handleLogin"
            >
              <span class="text">
                {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
              </span>
            </button>
          </div>

          <div class="login-register-link">
            <span class="text-size-13-light">Chưa có tài khoản?</span>
            <NuxtLink to="/account/register" class="txt-link-nav">
              Đăng ký ngay
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "auth",
});

const username = ref("");
const password = ref("");
const rememberMe = ref(true);

const agreedToTerms = ref(false);
const agreedToPrivacy = ref(false);

const loading = ref(false);
const errorMessage = ref("");
const canSubmitLogin = computed(
  () => agreedToTerms.value && agreedToPrivacy.value,
);

const { clearToken, setToken, syncFromStorage, token } = useAuthToken();

if (process.client) {
  syncFromStorage();
}

if (token.value) {
  await navigateTo("/dashboard");
}

const handleLogin = async () => {
  if (!canSubmitLogin.value) {
    errorMessage.value = "Vui lòng đồng ý điều khoản và chính sách bảo mật.";
    return;
  }

  const validationError = firstValidationError([
    validateLogin(username.value),
    validatePasswordLength(password.value),
  ]);

  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = "";
    clearToken();

    const { data, error } = await useAPI<{ id_token: string }>(
      "/authenticate",
      {
        method: "POST",
        body: {
          username: username.value.trim(),
          password: password.value,
          rememberMe: rememberMe.value,
        },
        auth: false,
      },
    );

    if (error.value) {
      throw error.value;
    }

    if (data.value?.id_token) {
      setToken(data.value.id_token);
      await navigateTo("/dashboard");
    }
  } catch (error: any) {
    if (error?.statusCode === 403 || error?.status === 403) {
      errorMessage.value =
        "Tài khoản chưa được kích hoạt hoặc không có quyền đăng nhập.";
      return;
    }

    errorMessage.value = "Tài khoản hoặc mật khẩu không chính xác.";
  } finally {
    loading.value = false;
  }
};
</script>
