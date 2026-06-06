<template>
  <Teleport to="body">
    <Transition name="app-confirm-fade">
      <div
        v-if="state.isOpen"
        class="app-confirm-overlay"
        role="presentation"
        @click.self="cancel"
      >
        <div
          class="app-confirm-dialog"
          :class="`app-confirm-${state.tone}`"
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-confirm-title"
          aria-describedby="app-confirm-message"
        >
          <div class="app-confirm-icon" aria-hidden="true">
            <svg
              width="22"
              height="22"
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
          </div>

          <div class="app-confirm-content">
            <p id="app-confirm-title" class="app-confirm-title">
              {{ state.title }}
            </p>
            <p id="app-confirm-message" class="app-confirm-message">
              {{ state.message }}
            </p>
          </div>

          <div class="app-confirm-actions">
            <button type="button" class="app-confirm-btn secondary" @click="cancel">
              {{ state.cancelText }}
            </button>
            <button type="button" class="app-confirm-btn primary" @click="proceed">
              {{ state.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const { cancel, proceed, state } = useConfirmDialog();

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && state.value.isOpen) {
    cancel();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
