import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/");
  }

  redirect(`/?resetToken=${encodeURIComponent(token)}`);
}
