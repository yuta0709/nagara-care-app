"use client";

import { useMe } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        ようこそ、{me ? `${me.familyName} ${me.givenName}` : "ゲスト"}さん
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* アカウント情報 */}
        <Card>
          <CardHeader>
            <CardTitle>アカウント情報</CardTitle>
            <CardDescription>あなたのアカウント情報</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">ユーザー名：</span>
              <span>{me ? `${me.familyName} ${me.givenName}` : "-"}</span>
            </div>
            <div>
              <span className="font-semibold">権限：</span>
              <span>
                {me?.role === "GLOBAL_ADMIN"
                  ? "システム管理者"
                  : me?.role === "TENANT_ADMIN"
                  ? "施設管理者"
                  : me?.role === "CAREGIVER"
                  ? "介護職員"
                  : "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
