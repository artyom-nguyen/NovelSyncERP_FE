import { Client, type IMessage } from "@stomp/stompjs";

export interface NotificationDTO {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: "SYSTEM" | "WARNING" | "SUCCESS" | "ERROR";
  referenceId?: number;
  createdAt: any;
  recipient?: any;
}

const LEGACY_NOTIFICATION_STORAGE_KEY = "novel_notifications";
const NOTIFICATION_STORAGE_KEY_PREFIX = "novel_notifications";
const USER_NOTIFICATION_DESTINATION = "/user/queue/notifications";
const NOTIFICATION_REFRESH_COOLDOWN_MS = 10000;

export const useNotifications = () => {
  const config = useRuntimeConfig();
  const { syncFromStorage, token: authToken } = useAuthToken();
  const toast = useToast();

  const isOpenNotificationBox = ref(false);
  const initialNotifs = ref<NotificationDTO[]>([]);
  const notifications = ref<NotificationDTO[]>([]);
  const isFetchingNotifications = ref(false);
  let lastNotificationRefreshAt = 0;
  let stompClient: Client | null = null;

  const getTokenSubject = (token: string) => {
    if (!process.client) return "";

    try {
      const payload = token.split(".")[1];
      if (!payload) return "";

      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const paddedBase64 = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        "=",
      );
      const decoded = JSON.parse(window.atob(paddedBase64)) as {
        sub?: string;
      };

      return decoded.sub || "";
    } catch {
      return "";
    }
  };

  const getStorageKey = () => {
    if (!authToken.value) return "";

    const tokenSubject = getTokenSubject(authToken.value);
    const identity = tokenSubject || authToken.value.slice(-24);
    return `${NOTIFICATION_STORAGE_KEY_PREFIX}:${encodeURIComponent(identity)}`;
  };

  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.isRead).length,
  );
  const notificationSummaryText = computed(() => {
    if (notifications.value.length === 0) return "Không có thông báo nào";
    if (unreadCount.value === 0) return "Tất cả thông báo đã được đọc";
    return `Có ${unreadCount.value} thông báo chưa đọc`;
  });

  const saveToLocal = (notifs: NotificationDTO[]) => {
    if (!process.client) return;
    const storageKey = getStorageKey();
    if (!storageKey) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify(notifs.slice(0, 30)),
    );
  };

  const parseDate = (dateStr: any) => {
    if (!dateStr) return 0;
    if (typeof dateStr === "object" && dateStr.epochSecond != null) return dateStr.epochSecond * 1000;
    if (typeof dateStr === "number") return dateStr < 100000000000 ? dateStr * 1000 : dateStr;
    const time = new Date(dateStr).getTime();
    return isNaN(time) ? 0 : time;
  };

  const sortNotifications = (notifs: NotificationDTO[]) =>
    notifs
      .sort(
        (a, b) =>
          parseDate(b.createdAt) - parseDate(a.createdAt),
      )
      .slice(0, 30);

  const upsertNotification = (noti: NotificationDTO) => {
    const existIdx = notifications.value.findIndex((n) => n.id === noti.id);
    const isNewUnread = existIdx === -1 && !noti.isRead;

    if (existIdx !== -1) {
      notifications.value[existIdx] = {
        ...notifications.value[existIdx],
        ...noti,
      };
    } else {
      notifications.value.unshift(noti);
    }

    notifications.value = sortNotifications([...notifications.value]);
    saveToLocal(notifications.value);

    return isNewUnread;
  };

  const mergeNotifications = (incoming: NotificationDTO[]) => {
    incoming.forEach((noti) => {
      upsertNotification(noti);
    });
  };

  const loadAndMergeLocal = () => {
    if (!process.client) return;

    localStorage.removeItem(LEGACY_NOTIFICATION_STORAGE_KEY);

    const storageKey = getStorageKey();
    if (!storageKey) {
      notifications.value = [];
      return;
    }

    const localData = localStorage.getItem(storageKey);
    const map = new Map<number, NotificationDTO>();

    if (localData) {
      try {
        const parsedLocal = JSON.parse(localData) as NotificationDTO[];
        parsedLocal.forEach((notification) => {
          map.set(notification.id, notification);
        });
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    initialNotifs.value.forEach((notification) => {
      map.set(notification.id, notification);
    });

    notifications.value = sortNotifications(Array.from(map.values()));
    saveToLocal(notifications.value);
  };

  const refreshNotifications = async (options: { force?: boolean } = {}) => {
    if (!process.client || !authToken.value || isFetchingNotifications.value) {
      return;
    }

    const now = Date.now();
    if (
      !options.force &&
      lastNotificationRefreshAt &&
      now - lastNotificationRefreshAt < NOTIFICATION_REFRESH_COOLDOWN_MS
    ) {
      return;
    }

    lastNotificationRefreshAt = now;
    isFetchingNotifications.value = true;
    try {
      syncFromStorage();
      const data = await $fetch<NotificationDTO[]>(
        API_ENDPOINTS.notifications.latest,
        {
          baseURL: config.public.apiBase,
          headers: authToken.value
            ? {
                Authorization: `Bearer ${authToken.value}`,
              }
            : undefined,
        },
      );

      notifications.value = sortNotifications(data || []);
      saveToLocal(notifications.value);
    } catch {
      // Notification refresh is background work; keep the current list if it fails.
    } finally {
      isFetchingNotifications.value = false;
    }
  };

  const toggleNotificationBox = async () => {
    isOpenNotificationBox.value = !isOpenNotificationBox.value;
    if (isOpenNotificationBox.value) {
      await refreshNotifications({ force: true });
    }
  };

  const closeNotificationBox = () => {
    isOpenNotificationBox.value = false;
  };

  const getWebSocketUrl = () => {
    const apiBase = String(config.public.apiBase || "");
    if (!apiBase && import.meta.dev) {
      return "/proxy-ws/ws";
    }

    const backendUrl = new URL(apiBase || "/api", window.location.origin);
    const basePath = backendUrl.pathname.replace(/\/api\/?$/, "");
    backendUrl.protocol = backendUrl.protocol === "https:" ? "https:" : "http:";
    backendUrl.pathname = `${basePath}/ws`.replace(/\/{2,}/g, "/");
    backendUrl.search = "";
    return backendUrl.toString();
  };

  const showRealtimeToast = (noti: NotificationDTO) => {
    const message = [noti.title, noti.message].filter(Boolean).join(" - ");
    toast.success(message || "Bạn có thông báo mới", "Thông báo mới");
  };

  const connectWebSocket = async () => {
    if (!process.client) return;
    syncFromStorage();
    if (!authToken.value || stompClient?.active) return;

    const { default: SockJS } = await import("sockjs-client");

    stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(getWebSocketUrl()) as unknown as WebSocket,
      connectHeaders: {
        "X-Authorization": `Bearer ${authToken.value}`,
        Authorization: `Bearer ${authToken.value}`,
      },
      debug: import.meta.dev ? (message) => console.debug(message) : () => {},
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      onConnect: () => {
        const handleIncoming = (message: IMessage) => {
          try {
            const noti = JSON.parse(message.body) as NotificationDTO;
            const isNewUnread = upsertNotification({
              ...noti,
              isRead: false,
            });

            if (isNewUnread) {
              showRealtimeToast(noti);
            }
          } catch {
            if (import.meta.dev) {
              console.error("Không thể đọc dữ liệu thông báo real-time.");
            }
          }
        };

        stompClient?.subscribe(USER_NOTIFICATION_DESTINATION, handleIncoming);
      },
      onStompError: (frame) => {
        if (import.meta.dev) {
          console.error("Lỗi STOMP:", frame.headers["message"]);
        }
      },
    });

    stompClient.activate();
  };

  const markAsRead = async (ntf: NotificationDTO) => {
    if (ntf.isRead) return;
    const { error } = await useAPI(API_ENDPOINTS.notifications.detail(ntf.id), {
      method: "PATCH",
      body: {
        id: ntf.id,
        isRead: true,
      },
    });
    if (!error.value) {
      ntf.isRead = true;
      saveToLocal(notifications.value);
    }
  };

  const markAllAsRead = async () => {
    const unreadNtfs = notifications.value.filter((n) => !n.isRead);
    for (const ntf of unreadNtfs) {
      await useAPI(API_ENDPOINTS.notifications.detail(ntf.id), {
        method: "PATCH",
        body: {
          id: ntf.id,
          isRead: true,
        },
      });
      ntf.isRead = true;
    }
    saveToLocal(notifications.value);
  };

  const formatDateTime = (dateStr: any) => {
    if (!dateStr) return "---";
    let date;
    if (typeof dateStr === "object" && dateStr.epochSecond != null) {
      date = new Date(dateStr.epochSecond * 1000);
    } else if (typeof dateStr === "number") {
      date = new Date(dateStr < 100000000000 ? dateStr * 1000 : dateStr);
    } else {
      date = new Date(dateStr);
    }
    
    if (isNaN(date.getTime())) return "---";

    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} lúc ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  onMounted(() => {
    loadAndMergeLocal();
    refreshNotifications({ force: true });
    connectWebSocket();
  });

  onUnmounted(() => {
    stompClient?.deactivate();
  });

  return {
    closeNotificationBox,
    formatDateTime,
    isOpenNotificationBox,
    markAllAsRead,
    markAsRead,
    notificationSummaryText,
    notifications,
    refreshNotifications,
    toggleNotificationBox,
    unreadCount,
  };
};
