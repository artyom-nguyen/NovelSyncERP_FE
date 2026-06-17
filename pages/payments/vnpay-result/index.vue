<template>
  <div class="payment-result-page">
    <section class="payment-result-panel" :class="resultClass">
      <div class="result-icon">
        <span v-if="isSuccess">✓</span>
        <span v-else>!</span>
      </div>

      <div class="result-content">
        <p class="result-eyebrow">VNPay</p>
        <h1>{{ title }}</h1>
        <p class="result-message">{{ description }}</p>

        <div class="result-meta">
          <div>
            <span>Mã phản hồi</span>
            <strong>{{ responseCode }}</strong>
          </div>
          <div v-if="orderId">
            <span>Đơn bán hàng</span>
            <strong>#{{ orderId }}</strong>
          </div>
        </div>

        <div class="result-actions">
          <button type="button" class="btn-primary-result" @click="goToSalesOrders">
            Về đơn bán hàng
          </button>
          <button type="button" class="btn-secondary-result" @click="goToPayments">
            Xem phiếu thanh toán
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const status = computed(() => String(route.query.status || ""));
const responseCode = computed(() => String(route.query.code || "---"));
const rawMessage = computed(() => String(route.query.message || ""));
const orderId = computed(() => {
  const value = route.query.orderId;
  return typeof value === "string" && value !== "null" ? value : "";
});

const isSuccess = computed(() => status.value === "success" && responseCode.value === "00");
const resultClass = computed(() => (isSuccess.value ? "is-success" : "is-failed"));

const title = computed(() =>
  isSuccess.value ? "Thanh toán thành công" : "Thanh toán chưa hoàn tất",
);

const description = computed(() => {
  if (isSuccess.value) {
    return "Hệ thống đã ghi nhận giao dịch VNPay và tạo phiếu thanh toán tương ứng.";
  }
  if (rawMessage.value) {
    return rawMessage.value;
  }
  return "Giao dịch chưa được xác nhận thành công. Vui lòng kiểm tra lại đơn hàng hoặc thử thanh toán lại.";
});

const goToSalesOrders = () => {
  navigateTo("/sales-orders");
};

const goToPayments = () => {
  navigateTo("/payments");
};
</script>

<style scoped>
.payment-result-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: #f5f7fb;
}

.payment-result-panel {
  width: min(640px, 100%);
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 24px;
  padding: 32px;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 48px rgba(17, 24, 39, 0.08);
}

.result-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 34px;
  font-weight: 700;
}

.is-success .result-icon {
  color: #0f9f6e;
  background: #e8f8f1;
}

.is-failed .result-icon {
  color: #c81e1e;
  background: #fde8e8;
}

.result-eyebrow {
  margin: 0 0 8px;
  color: #3864f4;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #111827;
  font-size: 28px;
  line-height: 1.25;
  font-weight: 700;
}

.result-message {
  margin: 12px 0 0;
  color: #5b6575;
  font-size: 15px;
  line-height: 1.6;
}

.result-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.result-meta div {
  padding: 14px;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  background: #f8fafc;
}

.result-meta span {
  display: block;
  color: #748094;
  font-size: 12px;
}

.result-meta strong {
  display: block;
  margin-top: 4px;
  color: #111827;
  font-size: 15px;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.btn-primary-result,
.btn-secondary-result {
  height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary-result {
  border: 1px solid #2f5cf6;
  color: #ffffff;
  background: #2f5cf6;
}

.btn-secondary-result {
  border: 1px solid #d6deea;
  color: #111827;
  background: #ffffff;
}

@media (max-width: 640px) {
  .payment-result-panel {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .result-meta {
    grid-template-columns: 1fr;
  }

  .result-actions button {
    width: 100%;
  }
}
</style>
