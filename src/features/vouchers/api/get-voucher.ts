interface GetVoucherOptions {
  baseUrl: string;
  cookie?: string;
}

export async function getVoucher(
  id: string,
  { baseUrl, cookie }: GetVoucherOptions,
) {
  const res = await fetch(`${baseUrl}/api/vouchers/${id}`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Voucher not found");
  }

  return res.json();
}
