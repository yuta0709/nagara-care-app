import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

export function useBathRecords(residentUid: string) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["bath-records", residentUid],
    queryFn: () =>
      client
        .GET("/residents/{residentUid}/bath-records", {
          params: { path: { residentUid } },
        })
        .then((res) => res.data),
  });
}

export function useCreateBathRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      data,
    }: {
      residentUid: string;
      data: components["schemas"]["BathRecordCreateInputDto"];
    }) =>
      client
        .POST("/residents/{residentUid}/bath-records", {
          params: { path: { residentUid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useUpdateBathRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      uid,
      data,
    }: {
      residentUid: string;
      uid: string;
      data: components["schemas"]["BathRecordUpdateInputDto"];
    }) =>
      client
        .PATCH("/residents/{residentUid}/bath-records/{uid}", {
          params: { path: { residentUid, uid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useDeleteBathRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({ residentUid, uid }: { residentUid: string; uid: string }) =>
      client
        .DELETE("/residents/{residentUid}/bath-records/{uid}", {
          params: { path: { residentUid, uid } },
        })
        .then((res) => res.data),
  });
}
