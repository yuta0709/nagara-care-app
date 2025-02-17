import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

export function useUsers(tenantUid: string) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["users", tenantUid],
    queryFn: () =>
      client
        .GET("/tenants/{tenantUid}/users", {
          params: { path: { tenantUid } },
        })
        .then((res) => res.data),
  });
}

export function useCreateUser() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      tenantUid,
      data,
    }: {
      tenantUid: string;
      data: components["schemas"]["TenantUserCreateInputDto"];
    }) =>
      client
        .POST("/tenants/{tenantUid}/users", {
          params: { path: { tenantUid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useUpdateUser() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      uid,
      data,
    }: {
      uid: string;
      data: components["schemas"]["UserUpdateInputDto"];
    }) =>
      client
        .PATCH("/users/{uid}", {
          params: { path: { uid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useDeleteUser() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: (uid: string) =>
      client
        .DELETE("/users/{uid}", {
          params: { path: { uid } },
        })
        .then((res) => res.data),
  });
}
