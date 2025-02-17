import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

export function useResidents(tenantUid: string) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["residents", tenantUid],
    queryFn: () =>
      client
        .GET("/tenants/{tenantUid}/residents", {
          params: { path: { tenantUid } },
        })
        .then((res) => res.data),
  });
}

export function useCreateResident() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      tenantUid,
      data,
    }: {
      tenantUid: string;
      data: components["schemas"]["ResidentCreateInputDto"];
    }) =>
      client
        .POST("/tenants/{tenantUid}/residents", {
          params: { path: { tenantUid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useUpdateResident() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      tenantUid,
      uid,
      data,
    }: {
      tenantUid: string;
      uid: string;
      data: components["schemas"]["ResidentUpdateInputDto"];
    }) =>
      client
        .PATCH("/tenants/{tenantUid}/residents/{uid}", {
          params: { path: { tenantUid, uid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useDeleteResident() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({ tenantUid, uid }: { tenantUid: string; uid: string }) =>
      client
        .DELETE("/tenants/{tenantUid}/residents/{uid}", {
          params: { path: { tenantUid, uid } },
        })
        .then((res) => res.data),
  });
}
