import createFetch from "openapi-fetch";
import type { paths } from "./openapi-generated";
import { useAuthContext } from "./auth-context";

// 認証が必要なエンドポイント用のフェッチャー
export function useFetchClient() {
  const { token } = useAuthContext();

  return createFetch<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 認証が不要なエンドポイント用のフェッチャー
export function usePublicFetchClient() {
  return createFetch<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  });
}

// 認証が不要なエンドポイント用の単一のインスタンス
export const publicFetchClient = createFetch<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});
