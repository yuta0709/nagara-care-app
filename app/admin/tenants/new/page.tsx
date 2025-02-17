"use client";

import { useCreateTenant } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const tenantFormSchema = z.object({
  name: z.string().min(1, "テナント名を入力してください"),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

export default function NewTenantPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createTenant } = useCreateTenant();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: TenantFormValues) => {
    createTenant(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tenants"] });
        router.push("/admin/tenants");
      },
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">新しいテナントの追加</h1>
          <p className="text-muted-foreground">新しいテナントを作成します。</p>
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
                  <Button type="submit">作成</Button>
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
