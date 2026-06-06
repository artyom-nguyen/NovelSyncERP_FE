import { Client, type IMessage } from "@stomp/stompjs";

interface NotificationDTO {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NOTIFICATION_STORAGE_KEY = "novel_notifications";

export const useNotifications = async () => {
  const config = useRuntimeConfig();
  const { syncFromStorage, token: authToken } = useAuthToken();

  const isOpenNotificationBox = ref(false);
  const initialNotifs = ref<NotificationDTO[]>([]);
  const notifications = ref<NotificationDTO[]>([]);
  const isFetchingNotifications = ref(false);
  let notificationPollTimer: ReturnType<typeof window.setInterval> | null = null;
  let stompClient: Client | null = null;

  if (authToken.value) {
    const { data } = await useAPI<NotificationDTO[]>("/notifications/my-latest");
    initialNotifs.value = data.value || [];
  }

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
    localStorage.setItem(
      NOTIFICATION_STORAGE_KEY,
      JSON.stringify(notifs.slice(0, 30)),
    );
  };

  const sortNotifications = (notifs: NotificationDTO[]) =>
    notifs
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 30);

  const upsertNotification = (noti: NotificationDTO) => {
    const existIdx = notifications.value.findIndex((n) => n.id === noti.id);
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
  };

  const mergeUnreadNotifications = (incoming: NotificationDTO[]) => {
    incoming.forEach((noti) => {
      upsertNotification({
        ...noti,
        isRead: false,
      });
    });
  };

  const loadAndMergeLocal = () => {
    if (!process.client) return;

    const localData = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    const map = new Map<number, NotificationDTO>();

    if (localData) {
      try {
        const parsedLocal = JSON.parse(localData) as NotificationDTO[];
        parsedLocal.forEach((notification) => {
          map.set(notification.id, {
            ...notification,
            isRead: true,
          });
        });
      } catch {
        localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
      }
    }

    initialNotifs.value.forEach((notification) => {
      map.set(notification.id, {
        ...notification,
        isRead: false,
      });
    });

    notifications.value = sortNotifications(Array.from(map.values()));
    saveToLocal(notifications.value);
  };

  const refreshNotifications = async () => {
    if (!process.client || !authToken.value || isFetchingNotifications.value) {
      return;
    }

    isFetchingNotifications.value = true;
    try {
      syncFromStorage();
      const data = await $fetch<NotificationDTO[]>("/notifications/my-latest", {
        baseURL: config.public.apiBase,
        headers: authToken.value
          ? {
              Authorization: `Bearer ${authToken.value}`,
            }
          : undefined,
      });

      mergeUnreadNotifications(data || []);
    } catch {
      // Notification refresh is background work; keep the current list if it fails.
    } finally {
      isFetchingNotifications.value = false;
    }
  };

  const toggleNotificationBox = async () => {
    isOpenNotificationBox.value = !isOpenNotificationBox.value;
    if (isOpenNotificationBox.value) {
      await refreshNotifications();
    }
  };

  const closeNotificationBox = () => {
    isOpenNotificationBox.value = false;
  };

  const startNotificationPolling = () => {
    if (!process.client || notificationPollTimer) return;

    notificationPollTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshNotifications();
      }
    }, 5000);
  };

  const stopNotificationPolling = () => {
    if (!notificationPollTimer) return;
    clearInterval(notificationPollTimer);
    notificationPollTimer = null;
  };

  const getWebSocketUrl = () => {
    const apiBase = String(config.public.apiBase || "");
    const backendUrl = new URL(apiBase || "/api", window.location.origin);
    const basePath = backendUrl.pathname.replace(/\/api\/?$/, "");
    backendUrl.protocol = backendUrl.protocol === "https:" ? "wss:" : "ws:";
    backendUrl.pathname = `${basePath}/websocket/stomp`.replace(/\/{2,}/g, "/");
    backendUrl.search = "";
    backendUrl.searchParams.set("access_token", authToken.value || "");
    return backendUrl.toString();
  };

  const connectWebSocket = () => {
    if (!process.client) return;
    syncFromStorage();
    if (!authToken.value) return;

    stompClient = new Client({
      brokerURL: getWebSocketUrl(),
      connectHeaders: {
        Authorization: `Bearer ${authToken.value}`,
      },
      debug: import.meta.dev ? (message) => console.debug(message) : () => {},
      reconnectDelay: 5000,
      onConnect: () => {
        const handleIncoming = (message: IMessage) => {
          const noti = JSON.parse(message.body) as NotificationDTO;
          upsertNotification({
            ...noti,
            isRead: false,
          });
        };

        stompClient?.subscribe("/topic/notification", handleIncoming);
        stompClient?.subscribe("/user/queue/notification", handleIncoming);
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
    const { error } = await useAPI(`/notifications/${ntf.id}`, {
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
      await useAPI(`/notifications/${ntf.id}`, {
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

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "---";
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} lúc ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      refreshNotifications();
    }
  };

  const handleNotificationRefresh = () => {
    refreshNotifications();
  };

  onMounted(() => {
    loadAndMergeLocal();
    refreshNotifications();
    connectWebSocket();
    startNotificationPolling();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleNotificationRefresh);
    window.addEventListener(
      "novel:notifications-refresh",
      handleNotificationRefresh,
    );
  });

  onUnmounted(() => {
    stompClient?.deactivate();
    stopNotificationPolling();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("focus", handleNotificationRefresh);
    window.removeEventListener(
      "novel:notifications-refresh",
      handleNotificationRefresh,
    );
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
