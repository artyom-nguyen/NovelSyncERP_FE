<template>
  <div class="main-login-homepage pb-50">
    <section class="block-login-page pt-50 pb-50">
      <div class="container">
        <div class="title-homepage mb-4 text-center">
          <h3 class="text-18-rgl mb-2">Kích hoạt tài khoản</h3>
          <p class="text-14-light">
            NovelSyncERP đang xác thực liên kết kích hoạt của bạn.
          </p>
        </div>

        <div class="main-box-login">
          <div v-if="isLoading" class="box-form-login text-center mb-15">
            <p class="text-14-light">Đang kích hoạt tài khoản...</p>
          </div>

          <template v-else-if="isSuccess">
            <div class="box-form-login text-center mb-15">
              <p class="text-14-light">
                Tài khoản đã được kích hoạt thành công. Bạn có thể đăng nhập
                ngay bây giờ.
              </p>
            </div>

            <div class="btn-next-page">
              <button type="button" class="btn-bg-dark" @click="goToLogin">
                <span class="text">Đăng nhập</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="box-alert-login mb-15">
              <p>{{ errorMessage }}</p>
            </div>

            <div class="btn-next-page">
              <button type="button" class="btn-bg-dark" @click="goToRegister">
                <span class="text">Đăng ký lại</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import { onMounted, ref } from "vue";

definePageMeta({
  layout: "auth",
});

type ActivationError = {
  title?: string;
  message?: string;
};

const route = useRoute();
const toast = useToast();
const config = useRuntimeConfig();
const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref("");

const getActivationErrorMessage = (error: unknown) => {
  const fetchError = error as FetchError<ActivationError>;
  return (
    fetchError.data?.title ||
    fetchError.data?.message ||
    "Liên kết kích hoạt không hợp lệ hoặc đã hết hạn."
  );
};

const activateAccount = async (key: string) => {
  await $fetch.raw("/activate", {
    baseURL: config.public.apiBase,
    method: "GET",
    query: { key },
  });
};

const goToLogin = () => {
  navigateTo("/");
};

const goToRegister = () => {
  navigateTo("/account/register");
};

onMounted(async () => {
  const key = typeof route.query.key === "string" ? route.query.key : "";

  if (!key) {
    errorMessage.value =
      "Liên kết kích hoạt không hợp lệ hoặc thiếu mã bảo mật.";
    isLoading.value = false;
    return;
  }

  try {
    await activateAccount(key);
    isSuccess.value = true;
    toast.success("Kích hoạt tài khoản thành công.");
  } catch (err) {
    errorMessage.value = getActivationErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
});

</script>
