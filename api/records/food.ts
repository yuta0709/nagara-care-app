import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

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
