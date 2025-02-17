"use client";

import { useTenants, useDeleteTenant } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function TenantsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: tenants, isLoading } = useTenants();
  const { mutate: deleteTenant } = useDeleteTenant();
  const [selectedTenant, setSelectedTenant] = useState<{
    uid: string;
    name: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Ensure that if not mounted or loading, we show placeholder
  if (!mounted || isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  const handleDelete = (tenant: { uid: string; name: string }) => {
    setSelectedTenant(tenant);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = () => {
    if (selectedTenant) {
      deleteTenant(selectedTenant.uid, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedTenant(null);
          // テナント一覧を再フェッチ
          queryClient.invalidateQueries({ queryKey: ["tenants"] });
        },
      });
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">テナント管理</h1>
            <p className="text-muted-foreground">
              テナントの追加、編集、削除を行うことができます。
            </p>
          </div>
          <Button onClick={() => router.push("/admin/tenants/new")}>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </div>

        {/* テナント一覧 */}
        <div className="grid gap-4">
          {tenants?.items.map((tenant) => (
            <Card key={tenant.uid}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tenant.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/tenants/${tenant.uid}`)
                      }
                      title="ユーザー管理"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/tenants/${tenant.uid}/edit`)
                      }
                      title="テナント編集"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tenant)}
                      title="テナント削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* 削除確認ダイアログ */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>テナントの削除</DialogTitle>
              <DialogDescription>
                テナント「{selectedTenant?.name}
                」を削除します。この操作は取り消せません。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button variant="destructive" onClick={executeDelete}>
                削除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
