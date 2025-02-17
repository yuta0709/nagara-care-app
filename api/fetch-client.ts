import createFetch from "openapi-fetch";
import type { paths } from "./openapi-generated";
import { useAuthContext } from "./auth-context";

export function useFetchClient() {
  const { token } = useAuthContext();

  return createFetch<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
