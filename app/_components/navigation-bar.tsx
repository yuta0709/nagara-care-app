"use client";

import { useMe, UserRole } from "@/api";
import { useAuthContext } from "@/api/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { useState, useEffect } from "react";

// 全体管理者用のメニュー項目
const globalAdminMenuItems = [
  {
    title: "ダッシュボード",
    href: "/admin",
  },
  {
    title: "テナント管理",
    href: "/admin/tenants",
  },
];

// テナント管理者用のメニュー項目
const tenantAdminMenuItems = [
  {
    title: "ダッシュボード",
    href: "/dashboard",
  },
  {
    title: "スタッフ管理",
    href: "/staff",
  },
  {
    title: "利用者一覧",
    href: "/residents",
  },
  {
    title: "記録一覧",
    href: "/records",
  },
];

// 介護スタッフ用のメニュー項目
const caregiverMenuItems = [
  {
    title: "利用者一覧",
    href: "/residents",
  },
  {
    title: "記録一覧",
    href: "/records",
  },
];

function NavigationBarContent() {
  const pathname = usePathname();
  const { data: me, isLoading } = useMe();
  const { logout } = useAuthContext();

  // ロールに基づいてメニュー項目を取得
  const getMenuItems = () => {
    if (!me) return [];

    switch (me.role) {
      case UserRole.GLOBAL_ADMIN:
        return globalAdminMenuItems;
      case UserRole.TENANT_ADMIN:
        return tenantAdminMenuItems;
      case UserRole.CAREGIVER:
        return caregiverMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // ローディング中は何も表示しない
  if (isLoading) {
    return null;
  }

  // ログインしていない場合は何も表示しない
  if (!me) {
    return null;
  }

  // ロールに基づいてホームページのリンク先を決定
  const homeLink =
    me?.role === UserRole.GLOBAL_ADMIN
      ? "/admin"
      : me?.role === UserRole.TENANT_ADMIN
      ? "/dashboard"
      : "/residents";

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href={homeLink} className="font-semibold">
          ながらかいご
          {me?.role === UserRole.GLOBAL_ADMIN && (
            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              全体管理者
            </span>
          )}
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {/* デスクトップメニュー */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.title}
              </Link>
            ))}
            <Button variant="ghost" onClick={() => logout()}>
              ログアウト
            </Button>
          </div>

          {/* モバイルメニュー */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 py-4">
                {me?.role === UserRole.GLOBAL_ADMIN && (
                  <div className="text-sm font-medium text-primary mb-2">
                    全体管理者
                  </div>
                )}
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
                <Separator />
                <Button
                  variant="ghost"
                  className="justify-start px-2"
                  onClick={() => logout()}
                >
                  ログアウト
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function NavigationBarFallback() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="font-semibold">ながらかいご</div>
      </div>
    </nav>
  );
}

export function NavigationBar() {
  const [mounted, setMounted] = useState(false);
  const { data: me } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with a fixed height
    return <div className="h-16" />;
  }

  if (!me) return null;

  return (
    <ErrorBoundary FallbackComponent={NavigationBarFallback}>
      <NavigationBarContent />
    </ErrorBoundary>
  );
}
