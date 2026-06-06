<template>
  <div class="main-login-homepage pb-50">
    <section class="block-login-page pt-50 pb-50">
      <div class="container">
        <div class="title-homepage mb-4 text-center">
          <h3 class="text-18-rgl mb-2">Quên mật khẩu</h3>
          <p class="text-14-light">
            Nhập email tài khoản để nhận liên kết đặt lại mật khẩu.
          </p>
        </div>

        <div class="main-box-login">
          <template v-if="!isSuccess">
            <div class="box-form-login">
              <div class="ct-input">
                <label class="txt-login-content">Email tài khoản</label>
                <div class="item-choose-filter">
                  <input
                    v-model.trim="email"
                    type="email"
                    maxlength="254"
                    placeholder="Nhập email đã đăng ký"
                    @keyup.enter="requestPasswordReset"
                  />
                </div>
              </div>
            </div>

            <div v-if="errorMsg" class="box-alert-login mb-15">
              <p>{{ errorMsg }}</p>
            </div>

            <div class="btn-next-page">
              <button
                class="btn-bg-dark"
                :disabled="isSubmitting"
                @click="requestPasswordReset"
              >
                <span class="text">
                  {{ isSubmitting ? "Đang gửi..." : "Gửi liên kết đặt lại" }}
                </span>
              </button>
            </div>

            <div class="reset-password-footer">
              <NuxtLink to="/" class="txt-link-nav">Quay lại đăng nhập</NuxtLink>
            </div>
          </template>

          <template v-else>
            <div class="box-form-login text-center mb-15">
              <p class="text-14-light">
                Nếu email tồn tại trong hệ thống, NovelSyncERP đã gửi liên kết
                đặt lại mật khẩu tới hộp thư của bạn.
              </p>
            </div>

            <div class="btn-next-page">
              <button class="btn-bg-dark" @click="goToLogin">
                <span class="text">Quay lại đăng nhập</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "auth",
});

const email = ref("");
const errorMsg = ref("");
const isSubmitting = ref(false);
const isSuccess = ref(false);
const toast = useToast();

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const requestPasswordReset = async () => {
  errorMsg.value = "";

  const validationError = firstValidationError([
    validateRequired(email.value, "Email"),
    validateEmail(email.value),
  ]);

  if (validationError) {
    errorMsg.value = validationError;
    return;
  }

  if (!email.value) {
    errorMsg.value = "Vui lòng nhập email tài khoản.";
    return;
  }

  if (!isValidEmail(email.value)) {
    errorMsg.value = "Email không đúng định dạng.";
    return;
  }

  isSubmitting.value = true;

  try {
    const { error } = await useAPI(API_ENDPOINTS.account.resetPasswordInit, {
      method: "POST",
      body: email.value,
      headers: {
        "content-type": "text/plain",
      },
    });

    if (error.value) {
      errorMsg.value =
        error.value.data?.title ||
        error.value.data?.message ||
        "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.";
      return;
    }

    isSuccess.value = true;
    toast.success("Đã gửi yêu cầu đặt lại mật khẩu.");
  } catch (err) {
    errorMsg.value = "Không thể kết nối đến máy chủ.";
  } finally {
    isSubmitting.value = false;
  }
};

const goToLogin = () => {
  navigateTo("/");
};
</script>
