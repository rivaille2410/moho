"use client";

import { Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/schemas/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

export const ForgotPasswordForm = ({
  onSubmit,
}: {
  onSubmit: (values: ForgotPasswordValues) => void;
}) => {
  const { control, handleSubmit, formState } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                startIcon={<Mail />}
                autoComplete="email"
                placeholder="Nhập email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button size={"xl"} type="submit" disabled={formState.isSubmitting}>
          Tiếp tục
        </Button>
      </FieldGroup>
    </form>
  );
};
