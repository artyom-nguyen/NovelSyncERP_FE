import type { ComputedRef, Ref } from "vue";
import type { Account } from "./useAccountSession";

type ReadableRef<T> = Ref<T> | ComputedRef<T>;

interface ProfileSettingsOptions {
  account: Ref<Account | null>;
  avatarUrl: ReadableRef<string>;
  closeUserBox: () => void;
  fullName: ReadableRef<string>;
  isAdminAccount: ReadableRef<boolean>;
  refreshAccount: () => Promise<Account | null>;
}

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

export const useProfileSettings = ({
  account,
  avatarUrl,
  closeUserBox,
  fullName,
  isAdminAccount,
  refreshAccount,
}: ProfileSettingsOptions) => {
  const toast = useToast();
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
    closeUserBox();
    profileError.value = "";
    fillProfileForm();
    isProfilePopupOpen.value = true;
  };

  const closeProfilePopup = () => {
    isProfilePopupOpen.value = false;
  };

  const getProfileErrorMessage = (error: unknown) => {
    if (getApiErrorText(error).includes("email")) {
      return "Email này đã được sử dụng, vui lòng chọn email khác.";
    }
    return getApiErrorMessage(
      error,
      "Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.",
    );
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
    } catch (err) {
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
    closeUserBox();
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
        pwdError.value = getApiErrorMessage(
          error.value,
          "Mật khẩu hiện tại không chính xác.",
        );
        toast.error(pwdError.value);
        return;
      }

      toast.success("Đổi mật khẩu thành công.");
      closeChangePasswordPopup();
    } catch (err) {
      pwdError.value = getApiErrorMessage(err, "Lỗi kết nối máy chủ.");
      toast.error(pwdError.value);
    } finally {
      isChangingPwd.value = false;
    }
  };

  return {
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
  };
};
