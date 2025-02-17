import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient, publicFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

// 認証不要のエンドポイント
export function useSignIn() {
  return useMutation({
    mutationFn: (data: components["schemas"]["SignInDto"]) =>
      publicFetchClient
        .POST("/auth/login", { body: data })
        .then((res) => res.data),
  });
}

// 認証が必要なエンドポイント
export function useMe() {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await client.GET("/auth/me", {});
        if (res && res.data !== undefined) {
          return res.data;
        } else {
          return null;
        }
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5分間はキャッシュを使用
    refetchOnWindowFocus: false, // ウィンドウフォーカス時の再フェッチを無効化
    retry: false, // エラー時の再試行を無効化
    enabled: typeof window !== "undefined", // クライアントサイドでのみ実行
  });
}

// ユーザーのロールを定義
export const UserRole = {
  GLOBAL_ADMIN: "GLOBAL_ADMIN",
  TENANT_ADMIN: "TENANT_ADMIN",
  CAREGIVER: "CAREGIVER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
