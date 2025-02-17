import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

type ResidentListResponseDto = components["schemas"]["ResidentListResponseDto"];
type CreateResidentDto = components["schemas"]["ResidentCreateInputDto"];
type UpdateResidentDto = components["schemas"]["ResidentUpdateInputDto"];

// 利用者一覧を取得
export function useResidents(tenantUid: string) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["residents", tenantUid],
    queryFn: async () => {
      const response = await client
        .GET("/tenants/{tenantUid}/residents", {
          params: { path: { tenantUid } },
        })
        .then((res) => res.data as ResidentListResponseDto);
      return response.items;
    },
  });
}

// 利用者を作成
export function useCreateResident() {
  const client = useFetchClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantUid,
      data,
    }: {
      tenantUid: string;
      data: CreateResidentDto;
    }) =>
      client
        .POST("/tenants/{tenantUid}/residents", {
          params: { path: { tenantUid } },
          body: data,
        })
        .then((res) => res.data),
    onSuccess: (_, { tenantUid }) => {
      queryClient.invalidateQueries({ queryKey: ["residents", tenantUid] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

// 利用者を更新
export function useUpdateResident() {
  const client = useFetchClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uid,
      tenantUid,
      data,
    }: {
      uid: string;
      tenantUid: string;
      data: UpdateResidentDto;
    }) =>
      client
        .PATCH("/tenants/{tenantUid}/residents/{uid}", {
          params: { path: { tenantUid, uid } },
          body: data,
        })
        .then((res) => res.data),
    onSuccess: (_, { tenantUid }) => {
      queryClient.invalidateQueries({ queryKey: ["residents", tenantUid] });
    },
  });
}

// 利用者を削除
export function useDeleteResident() {
  const client = useFetchClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, tenantUid }: { uid: string; tenantUid: string }) =>
      client
        .DELETE("/tenants/{tenantUid}/residents/{uid}", {
          params: { path: { tenantUid, uid } },
        })
        .then((res) => res.data),
    onSuccess: (_, { tenantUid }) => {
      queryClient.invalidateQueries({ queryKey: ["residents", tenantUid] });
    },
  });
}
