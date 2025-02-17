"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const formSchema = z.object({
  familyName: z.string().min(1, "姓を入力してください"),
  givenName: z.string().min(1, "名を入力してください"),
  familyNameFurigana: z
    .string()
    .min(1, "姓（フリガナ）を入力してください")
    .regex(/^[ァ-ヶー]*$/, "カタカナで入力してください"),
  givenNameFurigana: z
    .string()
    .min(1, "名（フリガナ）を入力してください")
    .regex(/^[ァ-ヶー]*$/, "カタカナで入力してください"),
  dateOfBirth: z.string().min(1, "生年月日を入力してください"),
  gender: z.enum(["MALE", "FEMALE"]),
  admissionDate: z.string().min(1, "入所日を入力してください"),
});

export type ResidentFormData = z.infer<typeof formSchema>;

interface ResidentFormProps {
  defaultValues?: ResidentFormData;
  onSubmit: (data: ResidentFormData) => void;
  isSubmitting?: boolean;
}

export function ResidentForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: ResidentFormProps) {
  const form = useForm<ResidentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      familyName: "",
      givenName: "",
      familyNameFurigana: "",
      givenNameFurigana: "",
      dateOfBirth: format(new Date(), "yyyy-MM-dd"),
      gender: "MALE",
      admissionDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="familyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓</FormLabel>
                <FormControl>
                  <Input placeholder="山田" {...field} />
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
                  <Input placeholder="太郎" {...field} />
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
                  <Input placeholder="ヤマダ" {...field} />
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
                  <Input placeholder="タロウ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>生年月日</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>性別</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">男性</SelectItem>
                    <SelectItem value="FEMALE">女性</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>入所日</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
