"use client";

import { Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

import { resetPasswordSchema, type ResetPasswordValues } from "@/schemas/auth";

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (values: ResetPasswordValues) => Promise<void>;
}

export const ResetPasswordForm = ({
  token,
  onSubmit,
}: ResetPasswordFormProps) => {
  const { control, handleSubmit, formState } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      token,
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="token"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                type="password"
                startIcon={<Lock />}
                autoComplete="new-password"
                placeholder="Nhập mật khẩu mới"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button size="xl" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Spinner />}

          <p>Đặt lại mật khẩu</p>
        </Button>
      </FieldGroup>
    </form>
  );
};
