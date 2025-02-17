"use client";

import { useMe, UserRole } from "@/api";
import { useUpdateResident } from "@/api/residents";
import { ResidentForm } from "../../components/resident-form";
import type { ResidentFormData } from "../../components/resident-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

interface EditResidentPageProps {
  params: {
    uid: string;
  };
}

export default function EditResidentPage({ params }: EditResidentPageProps) {
  const router = useRouter();
  const { data: me, isLoading: isMeLoading } = useMe();
  const { mutate: updateResident, isPending } = useUpdateResident();

  // ローディング中の表示
  if (isMeLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TENANT_ADMIN以外はアクセス不可
  if (!me || me.role !== UserRole.TENANT_ADMIN) {
    redirect("/residents");
  }

  const handleSubmit = (data: ResidentFormData) => {
    if (!me) return;

    updateResident(
      {
        uid: params.uid,
        tenantUid: me.uid,
        data,
      },
      {
        onSuccess: () => {
          toast.success("利用者情報を更新しました");
          router.push("/residents");
        },
        onError: () => {
          toast.error("利用者情報の更新に失敗しました");
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">利用者情報の編集</h1>
      <Card>
        <CardHeader>
          <CardTitle>利用者情報</CardTitle>
        </CardHeader>
        <CardContent>
          <ResidentForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
