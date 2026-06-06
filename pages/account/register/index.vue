<template>
  <div class="main-login-homepage pb-50">
    <section class="block-login-page pt-50 pb-50">
      <div class="container">
        <div class="title-homepage mb-4 text-center">
          <h3 class="text-18-rgl mb-2">Đăng ký tài khoản</h3>
          <p class="text-14-light">
            Tạo tài khoản NovelSyncERP để bắt đầu sử dụng hệ thống.
          </p>
        </div>

        <div class="main-box-login">
          <template v-if="!isSuccess">
            <div class="box-form-login">
              <div class="ct-input">
                <label class="txt-login-content">Tên đăng nhập</label>
                <div class="item-choose-filter">
                  <input
                    v-model.trim="form.login"
                    type="text"
                    maxlength="50"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              <div class="ct-input">
                <label class="txt-login-content">Email</label>
                <div class="item-choose-filter">
                  <input
                    v-model.trim="form.email"
                    type="email"
                    maxlength="254"
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              <div class="register-form-grid">
                <div class="ct-input">
                  <label class="txt-login-content">Họ</label>
                  <div class="item-choose-filter">
                    <input
                      v-model.trim="form.lastName"
                      type="text"
                      maxlength="50"
                      placeholder="Nhập họ"
                    />
                  </div>
                </div>

                <div class="ct-input">
                  <label class="txt-login-content">Tên</label>
                  <div class="item-choose-filter">
                    <input
                      v-model.trim="form.firstName"
                      type="text"
                      maxlength="50"
                      placeholder="Nhập tên"
                    />
                  </div>
                </div>
              </div>

              <div class="ct-input">
                <label class="txt-login-content">Số điện thoại</label>
                <div class="item-choose-filter">
                  <input
                    v-model.trim="form.phone"
                    type="tel"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    maxlength="15"
                    placeholder="Nhập số điện thoại"
                    @input="handlePhoneInput"
                  />
                </div>
              </div>

              <div class="ct-input">
                <label class="txt-login-content">Mật khẩu</label>
                <div class="item-choose-filter">
                  <input
                    v-model="form.password"
                    type="password"
                    minlength="4"
                    maxlength="100"
                    placeholder="Nhập mật khẩu"
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
                    @keyup.enter="handleRegister"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
            </div>

            <div v-if="errorMessage" class="box-alert-login mb-15">
              <p>{{ errorMessage }}</p>
            </div>

            <div class="box-form-choose mb-15">
              <div class="ct-check-box">
                <input type="checkbox" id="register-terms" v-model="accepted" />
                <label for="register-terms">
                  <span class="check">
                    <img src="/img-fix/icon/icon-checkbox-black.svg" alt="" />
                  </span>
                  <span class="checked">
                    <img src="/img-fix/icon/icon-black-checked.svg" alt="" />
                  </span>
                  <span class="label-value text-size-13-light">
                    Tôi đồng ý với điều khoản sử dụng và chính sách quyền riêng
                    tư của NovelSyncERP.
                  </span>
                </label>
              </div>
            </div>

            <div class="btn-next-page">
              <button
                class="btn-bg-dark"
                :class="{ disable: !accepted }"
                :disabled="isSubmitting || !accepted"
                @click="handleRegister"
              >
                <span class="text">
                  {{ isSubmitting ? "Đang đăng ký..." : "Đăng ký" }}
                </span>
              </button>
            </div>

            <div class="register-footer">
              <span class="text-size-13-light">Đã có tài khoản?</span>
              <NuxtLink to="/" class="txt-link-nav">Đăng nhập</NuxtLink>
            </div>
          </template>

          <template v-else>
            <div class="box-form-login text-center mb-15">
              <p class="text-14-light">
                Tài khoản đã được tạo. Vui lòng kiểm tra email để kích hoạt tài
                khoản trước khi đăng nhập.
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

const form = ref({
  login: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  password: "",
});
const confirmPassword = ref("");
const accepted = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);
const isSuccess = ref(false);
const toast = useToast();

const loginPattern =
  /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateForm = () => {
  const validationError = firstValidationError([
    validateLogin(form.value.login),
    validateMaxLength(form.value.firstName, 50, "Tên"),
    validateMaxLength(form.value.lastName, 50, "Họ"),
    validateRequired(form.value.email, "Email"),
    validateEmail(form.value.email),
    validatePasswordLength(form.value.password),
    validateDigitsOnly(form.value.phone, "Số điện thoại"),
    validateMaxLength(form.value.phone, 15, "Số điện thoại"),
  ]);

  if (validationError) return validationError;

  if (!form.value.login || !form.value.email || !form.value.password) {
    return "Vui lòng nhập tên đăng nhập, email và mật khẩu.";
  }

  if (!loginPattern.test(form.value.login)) {
    return "Tên đăng nhập chỉ được chứa chữ, số và các ký tự . _ - @.";
  }

  if (form.value.login.length > 50) {
    return "Tên đăng nhập không được vượt quá 50 ký tự.";
  }

  if (!isValidEmail(form.value.email)) {
    return "Email không đúng định dạng.";
  }

  if (form.value.password.length < 4 || form.value.password.length > 100) {
    return "Mật khẩu phải từ 4 đến 100 ký tự.";
  }

  if (form.value.password !== confirmPassword.value) {
    return "Mật khẩu xác nhận không khớp.";
  }

  if (form.value.phone && form.value.phone.length > 15) {
    return "Số điện thoại không được vượt quá 15 ký tự.";
  }

  if (!accepted.value) {
    return "Vui lòng đồng ý với điều khoản sử dụng.";
  }

  return "";
};

const getRegisterErrorMessage = (error: any) => {
  const type = error?.data?.type || "";

  if (type.includes("login-already-used")) {
    return "Tên đăng nhập đã được sử dụng.";
  }

  if (type.includes("email-already-used")) {
    return "Email đã được sử dụng.";
  }

  return (
    error?.data?.title ||
    error?.data?.message ||
    "Không thể đăng ký tài khoản. Vui lòng thử lại."
  );
};

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const phone = toDigitsOnly(target.value);
  target.value = phone;
  form.value.phone = phone;
};

const handleRegister = async () => {
  errorMessage.value = validateForm();
  if (errorMessage.value) return;

  isSubmitting.value = true;

  try {
    const { error } = await useAPI("/register", {
      method: "POST",
      body: {
        login: form.value.login.trim(),
        email: form.value.email.trim(),
        firstName: form.value.firstName.trim(),
        lastName: form.value.lastName.trim(),
        phone: form.value.phone.trim(),
        password: form.value.password,
        langKey: "en",
      },
    });

    if (error.value) {
      errorMessage.value = getRegisterErrorMessage(error.value);
      return;
    }

    isSuccess.value = true;
    toast.success("Đăng ký tài khoản thành công.");
  } catch (err) {
    errorMessage.value = "Không thể kết nối đến máy chủ.";
  } finally {
    isSubmitting.value = false;
  }
};

const goToLogin = () => {
  navigateTo("/");
};
</script>
