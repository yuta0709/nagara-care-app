"use client";

import { useMe } from "@/api";
import { GlobalAdminGuard } from "@/app/_components/guards/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <GlobalAdminGuard>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>管理者ダッシュボード</CardTitle>
              <CardDescription>
                ようこそ、{me?.familyName} {me?.givenName}さん
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    ログインID
                  </h3>
                  <p className="mt-1">{me?.loginId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">氏名</h3>
                  <p className="mt-1">
                    {me?.familyName} {me?.givenName}（{me?.familyNameFurigana}{" "}
                    {me?.givenNameFurigana}）
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ロール</h3>
                  <p className="mt-1">{me?.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GlobalAdminGuard>
  );
}
