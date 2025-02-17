import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

export function useBeverageRecords(residentUid: string) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["beverage-records", residentUid],
    queryFn: () =>
      client
        .GET("/residents/{residentUid}/beverage-records", {
          params: { path: { residentUid } },
        })
        .then((res) => res.data),
  });
}

export function useCreateBeverageRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      data,
    }: {
      residentUid: string;
      data: components["schemas"]["BeverageRecordCreateInputDto"];
    }) =>
      client
        .POST("/residents/{residentUid}/beverage-records", {
          params: { path: { residentUid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useUpdateBeverageRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      uid,
      data,
    }: {
      residentUid: string;
      uid: string;
      data: components["schemas"]["BeverageRecordUpdateInputDto"];
    }) =>
      client
        .PATCH("/residents/{residentUid}/beverage-records/{uid}", {
          params: { path: { residentUid, uid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useDeleteBeverageRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({ residentUid, uid }: { residentUid: string; uid: string }) =>
      client
        .DELETE("/residents/{residentUid}/beverage-records/{uid}", {
          params: { path: { residentUid, uid } },
        })
        .then((res) => res.data),
  });
}
