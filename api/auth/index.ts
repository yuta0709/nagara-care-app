import { useQuery, useMutation } from "@tanstack/react-query";
import { useFetchClient } from "../fetch-client";
import type { components } from "../openapi-generated";

export function useSignIn() {
  const client = useFetchClient();
  return useMutation({
    mutationFn: (data: components["schemas"]["SignInDto"]) =>
      client.POST("/auth/login", { body: data }).then((res) => res.data),
  });
}

export function useMe() {
  const client = useFetchClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => client.GET("/auth/me", {}).then((res) => res.data),
  });
}
