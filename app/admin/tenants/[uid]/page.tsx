"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useUsers, useCreateUser } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const userFormSchema = z.object({
  loginId: z.string().min(1, "ログインIDは必須です"),
  password: z.string().min(8, "パスワードは8文字以上必要です"),
  familyName: z.string().min(1, "姓は必須です"),
  givenName: z.string().min(1, "名は必須です"),
  familyNameFurigana: z.string().min(1, "姓（フリガナ）は必須です"),
  givenNameFurigana: z.string().min(1, "名（フリガナ）は必須です"),
  role: z.enum(["GLOBAL_ADMIN", "TENANT_ADMIN", "CAREGIVER"]),
});

export default function TenantDetailPage() {
  const params = useParams();
  const tenantUid = params.uid as string;
  const queryClient = useQueryClient();
  const { data: usersResponse, isLoading } = useUsers(tenantUid);
  const createUser = useCreateUser();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      loginId: "",
      password: "",
      familyName: "",
      givenName: "",
      familyNameFurigana: "",
      givenNameFurigana: "",
      role: "CAREGIVER",
    },
  });

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      await createUser.mutateAsync({
        tenantUid,
        data: values,
      });
      queryClient.invalidateQueries({ queryKey: ["users", tenantUid] });
      setIsOpen(false);
      form.reset();
      toast.success("ユーザーを作成しました");
    } catch (error) {
      console.error("ユーザー作成エラー:", error);
      toast.error("ユーザーの作成に失敗しました");
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>テナントユーザー一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>新規ユーザー作成</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新規ユーザー作成</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="loginId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ログインID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>パスワード</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="familyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>姓</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="givenName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>名</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="familyNameFurigana"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>姓（フリガナ）</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="givenNameFurigana"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>名（フリガナ）</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>権限</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                              <option value="CAREGIVER">介護者</option>
                              <option value="TENANT_ADMIN">
                                テナント管理者
                              </option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">作成</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>フリガナ</TableHead>
                <TableHead>ログインID</TableHead>
                <TableHead>権限</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersResponse?.items.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    {user.familyName} {user.givenName}
                  </TableCell>
                  <TableCell>
                    {user.familyNameFurigana} {user.givenNameFurigana}
                  </TableCell>
                  <TableCell>{user.loginId}</TableCell>
                  <TableCell>
                    {user.role === "CAREGIVER" && "介護者"}
                    {user.role === "TENANT_ADMIN" && "テナント管理者"}
                    {user.role === "GLOBAL_ADMIN" && "システム管理者"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
