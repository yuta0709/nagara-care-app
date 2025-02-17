import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

export function useTenants() {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["tenants"],
    queryFn: () => client.GET("/tenants", {}).then((res) => res.data),
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
