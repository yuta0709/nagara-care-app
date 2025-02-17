import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components, paths } from "../openapi-generated";

type TenantsResponse = NonNullable<
  paths["/tenants"]["get"]["responses"]["200"]["content"]["application/json"]
>;

export function useTenants(
  options?: Partial<UseQueryOptions<TenantsResponse>>
) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await client.GET("/tenants", {});
      return res.data!;
    },
    staleTime: 1000 * 60 * 5, // 5分間はキャッシュを使用
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
}

export function useCreateTenant() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: (data: components["schemas"]["TenantCreateInputDto"]) =>
      client.POST("/tenants", { body: data }).then((res) => res.data),
  });
}

export function useUpdateTenant() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      uid,
      data,
    }: {
      uid: string;
      data: components["schemas"]["TenantUpdateInputDto"];
    }) =>
      client
        .PATCH("/tenants/{uid}", {
          params: { path: { uid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useDeleteTenant() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: (uid: string) =>
      client
        .DELETE("/tenants/{uid}", {
          params: { path: { uid } },
        })
        .then((res) => res.data),
  });
}
