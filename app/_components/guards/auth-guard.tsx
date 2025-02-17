import { useMe } from "@/api";
import { useAuthContext } from "@/api/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { components } from "@/api/openapi-generated";

type Role = components["schemas"]["UserListItemDto"]["role"];

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
};

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (!isLoading && me) {
      const hasRequiredRole = allowedRoles
        ? allowedRoles.includes(me.role as Role)
        : true;
      if (!hasRequiredRole) {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, me, isLoading, router, allowedRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated || !me) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(me.role as Role)) {
    return null;
  }

  return <>{children}</>;
}

// 特定のロール用のGuardコンポーネント
export function GlobalAdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["GLOBAL_ADMIN"]} redirectTo="/login">
      {children}
    </AuthGuard>
  );
}

export function TenantAdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      allowedRoles={["GLOBAL_ADMIN", "TENANT_ADMIN"]}
      redirectTo="/login"
    >
      {children}
    </AuthGuard>
  );
}

export function CaregiverGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      allowedRoles={["GLOBAL_ADMIN", "TENANT_ADMIN", "CAREGIVER"]}
      redirectTo="/login"
    >
      {children}
    </AuthGuard>
  );
}
