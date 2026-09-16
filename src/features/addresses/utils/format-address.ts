import { Address } from "@/types/address";

export const formatAddress = (a: Address) =>
  [a.addressDetail, a.wardName, a.provinceName].filter(Boolean).join(", ");

export const formatPhone = (phone: string) =>
  phone.startsWith("+84") ? "0" + phone.slice(3) : phone;

export const toLocalDigits = (phone: string) =>
  phone.replace(/^\+84/, "").replace(/^0+/, "");
