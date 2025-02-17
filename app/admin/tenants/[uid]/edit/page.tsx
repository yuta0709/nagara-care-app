"use client";

import { useTenants, useUpdateTenant } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { use } from "react";

const tenantFormSchema = z.object({
  name: z.string().min(1, "テナント名を入力してください"),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

export default function EditTenantPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: tenants } = useTenants();
  const { mutate: updateTenant } = useUpdateTenant();

  const tenant = tenants?.items.find((t) => t.uid === uid);

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (tenant) {
      form.reset({ name: tenant.name });
    }
  }, [tenant, form]);

  const onSubmit = (values: TenantFormValues) => {
    updateTenant(
      { uid, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tenants"] });
          router.push("/admin/tenants");
        },
      }
    );
  };

  if (!tenant) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>エラー</CardTitle>
              <CardDescription>
                指定されたテナントが見つかりませんでした。
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">テナントの編集</h1>
          <p className="text-muted-foreground">テナント情報を編集します。</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>テナント名</FormLabel>
                      <FormControl>
                        <Input placeholder="テナント名を入力" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">更新</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/tenants")}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
