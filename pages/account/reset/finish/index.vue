<template>
  <div class="main-login-homepage pb-50">
    <section class="block-login-page pt-50 pb-50">
      <div class="container">
        <div class="title-homepage mb-4 text-center">
          <h3 class="text-18-rgl mb-2">Thiết lập mật khẩu</h3>
          <p class="text-14-light">
            Vui lòng nhập mật khẩu mới để kích hoạt tài khoản của bạn
          </p>
        </div>

        <div class="main-box-login">
          <template v-if="!isSuccess">
            <div class="box-form-login">
              <div class="ct-input">
                <label class="txt-login-content">Mật khẩu mới</label>
                <div class="item-choose-filter">
                  <input
                    v-model="newPassword"
                    type="password"
                    minlength="4"
                    maxlength="100"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
              </div>

              <div class="ct-input">
                <label class="txt-login-content">Xác nhận mật khẩu</label>
                <div class="item-choose-filter">
                  <input
                    v-model="confirmPassword"
                    type="password"
                    minlength="4"
                    maxlength="100"
                    placeholder="Nhập lại mật khẩu"
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
                @click="handleResetPassword"
                :disabled="isSubmitting"
              >
                <span class="text">
                  {{ isSubmitting ? "Đang xử lý..." : "Lưu mật khẩu" }}
                </span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="box-form-login text-center mb-15">
              <p class="text-14-light">
                Mật khẩu của bạn đã được thiết lập. Tài khoản đã được kích hoạt
                thành công!
              </p>
            </div>

            <div class="btn-next-page">
              <button class="btn-bg-dark" @click="goToLogin">
                <span class="text">Đăng nhập ngay</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "auth",
});

const route = useRoute();
const resetKey = ref<string | null>(null);

const newPassword = ref("");
const confirmPassword = ref("");
const errorMsg = ref("");
const isSubmitting = ref(false);
const isSuccess = ref(false);

onMounted(() => {
  if (route.query.key) {
    resetKey.value = route.query.key as string;
  } else {
    errorMsg.value =
      "Link kích hoạt không hợp lệ hoặc đã hết hạn (Thiếu mã bảo mật).";
  }
});

const handleResetPassword = async () => {
  errorMsg.value = "";

  const validationError = firstValidationError([
    validatePasswordLength(newPassword.value, "Mật khẩu mới"),
    validateRequired(confirmPassword.value, "Xác nhận mật khẩu"),
  ]);

  if (validationError) {
    errorMsg.value = validationError;
    return;
  }

  if (!newPassword.value || !confirmPassword.value) {
    errorMsg.value = "Vui lòng nhập đầy đủ thông tin mật khẩu.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = "Mật khẩu xác nhận không khớp.";
    return;
  }

  if (!resetKey.value) {
    errorMsg.value =
      "Không tìm thấy mã bảo mật từ đường link. Hãy kiểm tra lại email.";
    return;
  }

  isSubmitting.value = true;

  try {
    const { error } = await useAPI(API_ENDPOINTS.account.resetPasswordFinish, {
      method: "POST",
      body: {
        key: resetKey.value,
        newPassword: newPassword.value,
      },
    });

    if (error.value) {
      errorMsg.value =
        error.value.data?.title ||
        error.value.data?.message ||
        "Đã có lỗi xảy ra. Đường link có thể đã hết hạn.";
      return;
    }

    isSuccess.value = true;
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
