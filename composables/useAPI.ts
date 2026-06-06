import type { FetchError } from "ofetch";
import type { AsyncData, UseFetchOptions } from "nuxt/app";

type APIResponse<T> = T extends void ? unknown : T;
type APIFetchOptions<T> = UseFetchOptions<
  APIResponse<T>,
  APIResponse<T>,
  any,
  null,
  string,
  any
>;

type APIOptions<T> = APIFetchOptions<T> & {
  auth?: boolean;
};
type APIData<T> = AsyncData<APIResponse<T> | null, FetchError | null>;
type TypedUseFetch<T> = (url: string, options: APIFetchOptions<T>) => APIData<T>;

const publicEndpoints = [
  "/authenticate",
  "/register",
  "/activate",
  "/account/reset-password/init",
  "/account/reset-password/finish",
];

export const useAPI = <T>(
  url: string,
  options: APIOptions<T> = {},
) => {
  const config = useRuntimeConfig();
  const { clearToken, syncFromStorage, token } = useAuthToken();
  const router = useRouter();
  const { auth, ...fetchOptions } = options;
  const shouldUseAuth =
    auth !== false &&
    !publicEndpoints.some((endpoint) => url.startsWith(endpoint));

  const defaults: APIFetchOptions<T> = {
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (process.client) {
        syncFromStorage();
      }

      if (shouldUseAuth && token.value) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token.value}`);
        options.headers = headers;
      }
    },
    onResponseError({ response }) {
      if (response?.status === 401) {
        clearToken();
        if (process.client) {
          router.push("/");
        }
      }
    },
  };

  const typedUseFetch = useFetch as unknown as TypedUseFetch<T>;

  return typedUseFetch(url, {
    ...defaults,
    ...fetchOptions,
  } as APIFetchOptions<T>);
};
