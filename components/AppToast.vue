<template>
  <Teleport to="body">
    <div class="app-toast-stack" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="app-toast-list" tag="div" class="app-toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="app-toast"
          :class="`app-toast-${toast.type}`"
          :style="{ '--toast-duration': `${toast.duration}ms` }"
        >
          <div class="app-toast-accent"></div>
          <div class="app-toast-icon">
            <svg
              v-if="toast.type === 'success'"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'error'"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8V12.5M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'warning'"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.53 21H20.47A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="app-toast-content">
            <p class="app-toast-title">{{ toast.title }}</p>
            <p class="app-toast-message">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            class="app-toast-close"
            aria-label="Đóng thông báo"
            @click="remove(toast.id)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <div class="app-toast-progress"></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const { fromMessage, remove, toasts } = useToast();

onMounted(() => {
  if (!process.client || (window as any).__novelToastAlertInstalled) return;

  const nativeAlert = window.alert.bind(window);
  (window as any).__novelNativeAlert = nativeAlert;
  (window as any).__novelToastAlertInstalled = true;

  window.alert = (message?: any) => {
    fromMessage(String(message ?? ""));
  };
});
</script>

<style scoped>
.app-toast-stack {
  max-width: min(440px, calc(100vw - 32px));
  position: fixed;
  right: 22px;
  top: 22px;
  width: 440px;
  z-index: 99999;
}

.app-toast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-toast {
  --toast-color: #2563eb;
  --toast-soft: #eff6ff;
  align-items: flex-start;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 14px;
  box-shadow:
    0 20px 45px rgba(15, 23, 42, 0.16),
    0 6px 16px rgba(15, 23, 42, 0.08);
  display: flex;
  gap: 12px;
  min-height: 82px;
  overflow: hidden;
  padding: 14px 44px 16px 14px;
  position: relative;
}

.app-toast-success {
  --toast-color: #059669;
  --toast-soft: #ecfdf5;
}

.app-toast-error {
  --toast-color: #dc2626;
  --toast-soft: #fef2f2;
}

.app-toast-warning {
  --toast-color: #d97706;
  --toast-soft: #fffbeb;
}

.app-toast-info {
  --toast-color: #2563eb;
  --toast-soft: #eff6ff;
}

.app-toast-accent {
  background: var(--toast-color);
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  width: 4px;
}

.app-toast-icon {
  align-items: center;
  background: var(--toast-soft);
  border: 1px solid color-mix(in srgb, var(--toast-color) 24%, transparent);
  border-radius: 12px;
  color: var(--toast-color);
  display: flex;
  flex: 0 0 auto;
  height: 38px;
  justify-content: center;
  width: 38px;
}

.app-toast-content {
  flex: 1;
  min-width: 0;
  padding-top: 1px;
}

.app-toast-title {
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.35;
  margin: 0 0 4px;
}

.app-toast-message {
  color: #475569;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  margin: 0;
  overflow-wrap: anywhere;
}

.app-toast-close {
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: 12px;
  top: 12px;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
  width: 28px;
}

.app-toast-close:hover {
  background: #eef2f7;
  color: #0f172a;
  transform: translateY(-1px);
}

.app-toast-progress {
  animation: app-toast-progress var(--toast-duration) linear forwards;
  background: var(--toast-color);
  bottom: 0;
  height: 3px;
  left: 4px;
  opacity: 0.9;
  position: absolute;
  transform-origin: left center;
  width: calc(100% - 4px);
}

.app-toast-list-enter-active,
.app-toast-list-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.app-toast-list-enter-from,
.app-toast-list-leave-to {
  opacity: 0;
  transform: translateX(18px) translateY(-4px);
}

.app-toast-list-move {
  transition: transform 0.22s ease;
}

@keyframes app-toast-progress {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

@media (max-width: 575px) {
  .app-toast-stack {
    left: 12px;
    max-width: none;
    right: 12px;
    top: 12px;
    width: auto;
  }

  .app-toast {
    min-height: 0;
    padding: 12px 42px 14px 12px;
  }
}
</style>
