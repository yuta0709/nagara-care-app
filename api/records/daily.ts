import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

export function useDailyRecords(residentUid: string) {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["daily-records", residentUid],
    queryFn: () =>
      client
        .GET("/residents/{residentUid}/daily-records", {
          params: { path: { residentUid } },
        })
        .then((res) => res.data),
  });
}

export function useCreateDailyRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      data,
    }: {
      residentUid: string;
      data: components["schemas"]["DailyRecordCreateInputDto"];
    }) =>
      client
        .POST("/residents/{residentUid}/daily-records", {
          params: { path: { residentUid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useUpdateDailyRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({
      residentUid,
      uid,
      data,
    }: {
      residentUid: string;
      uid: string;
      data: components["schemas"]["DailyRecordUpdateInputDto"];
    }) =>
      client
        .PATCH("/residents/{residentUid}/daily-records/{uid}", {
          params: { path: { residentUid, uid } },
          body: data,
        })
        .then((res) => res.data),
  });
}

export function useDeleteDailyRecord() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: ({ residentUid, uid }: { residentUid: string; uid: string }) =>
      client
        .DELETE("/residents/{residentUid}/daily-records/{uid}", {
          params: { path: { residentUid, uid } },
        })
        .then((res) => res.data),
  });
}
