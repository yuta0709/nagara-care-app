"use client";

import { useMe, UserRole } from "@/api/auth";
import { useDeleteResident, useResidents } from "@/api/residents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResidentsPage() {
  const router = useRouter();
  const { data: me } = useMe();
  const { data: residents, isLoading } = useResidents(me?.tenantUid ?? "");
  const { mutate: deleteResident } = useDeleteResident();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>利用者一覧</CardTitle>
          <CardDescription>利用者の一覧を表示します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const handleDelete = (uid: string) => {
    if (!me) return;

    deleteResident(
      {
        uid,
        tenantUid: me.uid,
      },
      {
        onSuccess: () => {
          toast.success("利用者を削除しました");
        },
        onError: () => {
          toast.error("利用者の削除に失敗しました");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>利用者一覧</CardTitle>
        <CardDescription>利用者の一覧を表示します。</CardDescription>
      </CardHeader>
      <CardContent>
        {me?.role === UserRole.TENANT_ADMIN && (
          <div className="mb-4">
            <Button onClick={() => router.push("/residents/new")}>
              新規作成
            </Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>名前（カナ）</TableHead>
              <TableHead>生年月日</TableHead>
              <TableHead>性別</TableHead>
              <TableHead>入所日</TableHead>
              {me?.role === UserRole.TENANT_ADMIN && (
                <TableHead>操作</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {residents?.map((resident) => (
              <TableRow key={resident.uid}>
                <TableCell>
                  {resident.familyName} {resident.givenName}
                </TableCell>
                <TableCell>
                  {resident.familyNameFurigana} {resident.givenNameFurigana}
                </TableCell>
                <TableCell>{resident.dateOfBirth}</TableCell>
                <TableCell>{resident.gender}</TableCell>
                <TableCell>{resident.admissionDate}</TableCell>
                {me?.role === UserRole.TENANT_ADMIN && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(`/residents/${resident.uid}/edit`)
                        }
                      >
                        編集
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">削除</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              利用者を削除しますか？
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は取り消せません。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(resident.uid)}
                            >
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
