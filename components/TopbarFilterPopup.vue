<template>
  <Teleport to="body">
    <div v-if="open" class="filter-popover-layer" @click.self="closePopup">
      <div
        ref="panelRef"
        class="filter-popover"
        :class="{ 'is-positioned': isPositioned }"
        :style="popoverStyle"
      >
        <div class="filter-popover__header">
          <div>
            <p class="text-size-14-medium">{{ title }}</p>
            <p class="text-size-13-light opacity-6">
              Chọn điều kiện để thu hẹp danh sách
            </p>
          </div>
          <button
            type="button"
            class="filter-popover__close"
            @click="closePopup"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.86321 3.86358C4.21469 3.51211 4.78453 3.51211 5.13601 3.86358L8.99961 7.72719L12.8632 3.86358C13.2147 3.51211 13.7845 3.51211 14.136 3.86358C14.4874 4.21505 14.4874 4.7849 14.136 5.13637L10.2724 8.99998L14.136 12.8636C14.4874 13.215 14.4874 13.7849 14.136 14.1364C13.7845 14.4878 13.2147 14.4878 12.8632 14.1364L8.99961 10.2728L5.13601 14.1364C4.78453 14.4878 4.21469 14.4878 3.86321 14.1364C3.51174 13.7849 3.51174 13.215 3.86321 12.8636L7.72682 8.99998L3.86321 5.13637C3.51174 4.7849 3.51174 4.21505 3.86321 3.86358Z"
                fill="#121212"
              />
            </svg>
          </button>
        </div>

        <div class="filter-popover__content">
          <div v-for="field in fields" :key="field.key" class="imt-popup-form">
            <p class="txt-ct-input">{{ field.label }}</p>

            <div v-if="field.type === 'select'" class="ct-form-select">
              <select v-model="draft[field.key]">
                <option value="">{{ field.placeholder || "Tất cả" }}</option>
                <option
                  v-for="option in field.options || []"
                  :key="String(option.value)"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <span class="icon-select">
                <img src="/img-fix/icon/icon-arrow-down-new.svg" alt="" />
              </span>
            </div>

            <div v-else class="ct-form-input">
              <input
                v-model="draft[field.key]"
                :type="field.type || 'text'"
                :placeholder="field.placeholder || ''"
              />
            </div>
          </div>
        </div>

        <div class="filter-popover__footer">
          <a
            href="javascript:;"
            class="btn-frame-color imt-border"
            @click="resetFilters"
          >
            <p class="text-size-13-rgl">Đặt lại</p>
          </a>
          <a
            href="javascript:;"
            class="btn-frame-color primary"
            @click="applyFilters"
          >
            <p class="text-size-13-rgl">Áp dụng</p>
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterField {
  key: string;
  label: string;
  type?: "text" | "select" | "date" | "number";
  placeholder?: string;
  options?: FilterOption[];
}

interface AnchorRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    fields: FilterField[];
    modelValue: Record<string, string | number>;
    anchorRect?: AnchorRect | null;
  }>(),
  {
    title: "Bộ lọc",
    anchorRect: null,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  "update:modelValue": [value: Record<string, string | number>];
}>();

const draft = ref<Record<string, string | number>>({});
const panelRef = ref<HTMLElement | null>(null);
const isPositioned = ref(false);
const popoverTop = ref(0);
const popoverLeft = ref(0);
const arrowLeft = ref(24);

const popoverStyle = computed(() => ({
  "--filter-popover-top": `${popoverTop.value}px`,
  "--filter-popover-left": `${popoverLeft.value}px`,
  "--filter-popover-arrow-left": `${arrowLeft.value}px`,
}));

const buildEmptyFilters = () =>
  props.fields.reduce<Record<string, string>>((result, field) => {
    result[field.key] = "";
    return result;
  }, {});

const getFallbackAnchorRect = (): AnchorRect | null => {
  if (!process.client) return null;

  const activeElement = document.activeElement;
  if (!(activeElement instanceof HTMLElement)) return null;

  const rect = activeElement.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
};

const calculatePosition = async () => {
  if (!process.client || !props.open) return;

  isPositioned.value = false;
  await nextTick();

  const anchor = props.anchorRect || getFallbackAnchorRect();
  const panel = panelRef.value;
  if (!anchor || !panel) return;

  const margin = 12;
  const panelRect = panel.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const preferredLeft = anchor.left;
  const maxLeft = viewportWidth - panelRect.width - margin;
  const nextLeft = Math.min(
    Math.max(preferredLeft, margin),
    Math.max(maxLeft, margin),
  );
  const bottomTop = anchor.bottom + 10;
  const topTop = anchor.top - panelRect.height - 10;
  const nextTop =
    bottomTop + panelRect.height + margin <= viewportHeight
      ? bottomTop
      : Math.max(topTop, margin);

  popoverLeft.value = nextLeft;
  popoverTop.value = nextTop;
  arrowLeft.value = Math.min(
    Math.max(anchor.left + anchor.width / 2 - nextLeft, 18),
    panelRect.width - 18,
  );
  isPositioned.value = true;
};

const closePopup = () => {
  emit("update:open", false);
};

const applyFilters = () => {
  emit("update:modelValue", { ...draft.value });
  closePopup();
};

const resetFilters = () => {
  const emptyFilters = buildEmptyFilters();
  draft.value = emptyFilters;
  emit("update:modelValue", emptyFilters);
  closePopup();
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      draft.value = {
        ...buildEmptyFilters(),
        ...props.modelValue,
      };
      calculatePosition();
    }
  },
  { immediate: true },
);

watch(
  () => props.anchorRect,
  () => {
    calculatePosition();
  },
);

if (process.client) {
  window.addEventListener("resize", calculatePosition);
  window.addEventListener("scroll", calculatePosition, true);
}

onBeforeUnmount(() => {
  if (!process.client) return;
  window.removeEventListener("resize", calculatePosition);
  window.removeEventListener("scroll", calculatePosition, true);
});
</script>
