<template>
  <div v-if="serverStatus !== 'online'" class="server-gate">
    <div class="server-gate__shell">
      <img
        class="server-gate__logo"
        src="/img-fix/icon-novel.png"
        alt="NovelSync ERP"
      />
      <div class="server-gate__loader" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="server-gate__eyebrow">NovelSync ERP</p>
      <h1>Đang kiểm tra kết nối hệ thống</h1>
      <p class="server-gate__message">
        Vui lòng chờ trong giây lát để hệ thống xác nhận trạng thái máy chủ.
      </p>
    </div>

    <div
      v-if="serverStatus === 'offline'"
      class="server-gate__modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="server-gate-title"
    >
      <div class="server-gate__dialog">
        <div class="server-gate__warning" aria-hidden="true">!</div>
        <h2 id="server-gate-title">Server đang gặp vấn đề</h2>
        <p>
          Không thể kết nối tới backend. Hãy kiểm tra lại server rồi thử kết
          nối lại.
        </p>
        <button
          class="server-gate__retry"
          type="button"
          :disabled="isRetrying"
          @click="checkServer"
        >
          {{ isRetrying ? "Đang kiểm tra..." : "Kiểm tra lại" }}
        </button>
      </div>
    </div>
  </div>

  <NuxtLayout v-else>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<script setup lang="ts">
type ServerStatus = "checking" | "online" | "offline";

const config = useRuntimeConfig();
const serverStatus = ref<ServerStatus>("checking");
const isRetrying = ref(false);

const getHealthUrl = () => {
  const apiBase = String(config.public.apiBase || "");
  const fallbackUrl = "/management/health";

  if (!process.client) {
    return fallbackUrl;
  }

  try {
    const backendUrl = new URL(apiBase || fallbackUrl, window.location.origin);
    const basePath = backendUrl.pathname.replace(/\/api\/?$/, "");
    backendUrl.pathname = `${basePath}/management/health`.replace(
      /\/{2,}/g,
      "/",
    );
    backendUrl.search = `t=${Date.now()}`;
    return backendUrl.toString();
  } catch {
    return fallbackUrl;
  }
};

const checkServer = async () => {
  isRetrying.value = true;
  serverStatus.value = "checking";

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(getHealthUrl(), {
      cache: "no-store",
      method: "GET",
      signal: controller.signal,
    });

    serverStatus.value = response.ok ? "online" : "offline";
  } catch {
    serverStatus.value = "offline";
  } finally {
    window.clearTimeout(timeoutId);
    isRetrying.value = false;
  }
};

onMounted(() => {
  checkServer();
});
</script>

<style scoped>
.server-gate {
  align-items: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(22, 163, 116, 0.16), transparent 34%),
    radial-gradient(circle at 82% 18%, rgba(37, 99, 235, 0.12), transparent 32%),
    #f6f8fb;
  color: #142033;
  display: flex;
  min-height: 100vh;
  justify-content: center;
  padding: 24px;
}

.server-gate__shell {
  align-items: center;
  display: flex;
  flex-direction: column;
  max-width: 560px;
  text-align: center;
}

.server-gate__logo {
  height: 76px;
  margin-bottom: 28px;
  object-fit: contain;
  width: 76px;
}

.server-gate__loader {
  display: flex;
  gap: 8px;
  height: 18px;
  margin-bottom: 22px;
}

.server-gate__loader span {
  animation: serverGatePulse 0.9s ease-in-out infinite;
  background: #0f8f75;
  border-radius: 999px;
  display: block;
  height: 10px;
  width: 10px;
}

.server-gate__loader span:nth-child(2) {
  animation-delay: 0.14s;
}

.server-gate__loader span:nth-child(3) {
  animation-delay: 0.28s;
}

.server-gate__eyebrow {
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 10px;
  text-transform: uppercase;
}

.server-gate h1 {
  color: #111827;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

.server-gate__message {
  color: #536274;
  font-size: 16px;
  line-height: 1.6;
  margin: 16px 0 0;
  max-width: 460px;
}

.server-gate__modal {
  align-items: center;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 9999;
}

.server-gate__dialog {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  max-width: 420px;
  padding: 28px;
  text-align: center;
  width: 100%;
}

.server-gate__warning {
  align-items: center;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 999px;
  color: #dc2626;
  display: inline-flex;
  font-size: 22px;
  font-weight: 800;
  height: 46px;
  justify-content: center;
  margin-bottom: 18px;
  width: 46px;
}

.server-gate__dialog h2 {
  color: #111827;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
  margin: 0;
}

.server-gate__dialog p {
  color: #4b5563;
  font-size: 15px;
  line-height: 1.55;
  margin: 12px 0 22px;
}

.server-gate__retry {
  background: #0f766e;
  border: 0;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  min-height: 44px;
  padding: 0 18px;
}

.server-gate__retry:disabled {
  cursor: wait;
  opacity: 0.72;
}

@keyframes serverGatePulse {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateY(-6px);
  }
}

@media (max-width: 640px) {
  .server-gate {
    padding: 18px;
  }

  .server-gate h1 {
    font-size: 25px;
  }

  .server-gate__dialog {
    padding: 24px 20px;
  }
}
</style>
