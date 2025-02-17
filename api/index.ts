import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient, publicFetchClient } from "./fetch-client";
import type { components } from "./openapi-generated";

// Auth
export function useSignIn() {
  return useMutation({
    mutationFn: (data: components["schemas"]["SignInDto"]) =>
      publicFetchClient
        .POST("/auth/login", { body: data })
        .then((res) => res.data),
  });
}

export function useMe() {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => client.GET("/auth/me", {}).then((res) => res.data),
  });
}

// Users
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

// Tenants
export { useTenants } from "./tenants";

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

// Residents
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

// Records
export function useFoodRecords(residentUid: string) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["food-records", residentUid],
    queryFn: () =>
      client
        .GET("/residents/{residentUid}/food-records", {
          params: { path: { residentUid } },
        })
        .then((res) => res.data),
  });
}

export function useCreateFoodRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      data,
    }: {
      residentUid: string;
      data: components["schemas"]["FoodRecordCreateInputDto"];
    }) =>
      client
        .POST("/residents/{residentUid}/food-records", {
          params: { path: { residentUid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useUpdateFoodRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      uid,
      data,
    }: {
      residentUid: string;
      uid: string;
      data: components["schemas"]["FoodRecordUpdateInputDto"];
    }) =>
      client
        .PATCH("/residents/{residentUid}/food-records/{uid}", {
          params: { path: { residentUid, uid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useDeleteFoodRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({ residentUid, uid }: { residentUid: string; uid: string }) =>
      client
        .DELETE("/residents/{residentUid}/food-records/{uid}", {
          params: { path: { residentUid, uid } },
        })
        .then((res) => res.data),
  });
}

// 他の記録（入浴、排泄、日常、飲料）も同様のパターンで実装できます
// 必要に応じて追加実装してください

export * from "./auth";
export * from "./users";
export * from "./tenants";
export * from "./residents";
export * from "./records/food";
export * from "./records/bath";
export * from "./records/elimination";
export * from "./records/daily";
export * from "./records/beverage";
export * from "./auth-context";
export * from "./fetch-client";
