"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import {
  X,
  Flag,
  Copy,
  Check,
  Wallet,
  XCircle,
  ArrowLeft,
  ImagePlus,
  CheckCircle2,
  PackageCheck,
  ChevronsUpDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { type ReturnRequest } from "@/types/return-request";
import { useVietQrBanks } from "../../hooks/use-vietqr-banks";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import {
  statusIcon,
  statusLabel,
  statusStyle,
} from "@/features/return-requests/utils/return-request-status";
import { useRejectReturnRequest } from "@/features/return-requests/hooks/use-reject-return-request";
import { useProcessReturnRefund } from "@/features/return-requests/hooks/use-process-return-refund";
import { useApproveReturnRequest } from "@/features/return-requests/hooks/use-approve-return-request";
import { useCompleteReturnRequest } from "@/features/return-requests/hooks/use-complete-return-request";
import { useMarkReturnItemReceived } from "@/features/return-requests/hooks/use-mark-return-item-received";

const refundMethodItems = [
  { label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER" },
  {
    label: "Hoàn về phương thức thanh toán gốc",
    value: "ORIGINAL_PAYMENT_METHOD",
  },
];

function ApproveAction({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const approve = useApproveReturnRequest();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className="bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/30"
          >
            <CheckCircle2 className="size-4" />
            Duyệt yêu cầu
          </Button>
        }
      />
      <DialogContent className="w-[95vw] md:min-w-lg">
        <DialogHeader>
          <DialogTitle>Duyệt yêu cầu trả hàng</DialogTitle>
          <DialogDescription>
            Xác nhận duyệt yêu cầu này. Bạn có thể để lại ghi chú nội bộ (tuỳ
            chọn).
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel>Ghi chú nội bộ</FieldLabel>
          <Textarea
            rows={3}
            placeholder="VD: Đã kiểm tra hình ảnh, sản phẩm lỗi rõ ràng..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button
            disabled={approve.isPending}
            onClick={() =>
              approve.mutate(
                { id, input: { adminNote: adminNote.trim() || undefined } },
                { onSuccess: () => setOpen(false) },
              )
            }
          >
            {approve.isPending && <Spinner className="size-4" />}
            Xác nhận duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectAction({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const reject = useRejectReturnRequest();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg" variant="destructive">
            <XCircle className="size-4" />
            Từ chối
          </Button>
        }
      />
      <DialogContent className="w-[95vw] md:min-w-lg">
        <DialogHeader>
          <DialogTitle>Từ chối yêu cầu trả hàng</DialogTitle>
          <DialogDescription>
            Vui lòng nêu rõ lý do từ chối để khách hàng được thông báo.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel>Lý do từ chối</FieldLabel>
          <Textarea
            rows={3}
            placeholder="VD: Sản phẩm không nằm trong chính sách đổi trả..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          {!rejectReason.trim() && (
            <FieldError>Vui lòng nhập lý do từ chối</FieldError>
          )}
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button
            variant="destructive"
            disabled={!rejectReason.trim() || reject.isPending}
            onClick={() =>
              reject.mutate(
                { id, input: { rejectReason: rejectReason.trim() } },
                { onSuccess: () => setOpen(false) },
              )
            }
          >
            {reject.isPending && <Spinner className="size-4" />}
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MarkReceivedAction({ id }: { id: string }) {
  const markReceived = useMarkReturnItemReceived();

  return (
    <Button
      size="lg"
      disabled={markReceived.isPending}
      onClick={() => markReceived.mutate(id)}
    >
      {markReceived.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <PackageCheck className="size-4" />
      )}
      Xác nhận đã nhận hàng
    </Button>
  );
}

function ProcessRefundAction({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [refundMethod, setRefundMethod] = useState<
    "BANK_TRANSFER" | "ORIGINAL_PAYMENT_METHOD"
  >("BANK_TRANSFER");
  const [bankBin, setBankBin] = useState("");
  const [bankPopoverOpen, setBankPopoverOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processRefund = useProcessReturnRefund();
  const { data: banks, isLoading: isBanksLoading } = useVietQrBanks();

  const isBankTransfer = refundMethod === "BANK_TRANSFER";
  const selectedBank = banks?.find((b) => b.bin === bankBin);
  const isValid = isBankTransfer
    ? !!proofImage && bankBin && accountNumber.trim() && accountHolder.trim()
    : true;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofImage(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setProofImage(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (isBankTransfer && !proofImage) return;

    processRefund.mutate(
      {
        id,
        refundMethod,
        refundBankName: isBankTransfer ? selectedBank?.shortName : undefined,
        refundBankAccountNumber: isBankTransfer
          ? accountNumber.trim()
          : undefined,
        refundBankAccountHolder: isBankTransfer
          ? accountHolder.trim()
          : undefined,
        proofImage: isBankTransfer ? proofImage! : undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg">
            <Wallet className="size-4" />
            Xử lý hoàn tiền
          </Button>
        }
      />
      <DialogContent className="w-[95vw] md:min-w-lg">
        <DialogHeader>
          <DialogTitle>Xử lý hoàn tiền</DialogTitle>
          <DialogDescription>
            Chọn phương thức hoàn tiền cho khách hàng.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel>Phương thức hoàn tiền</FieldLabel>
          <Select
            items={refundMethodItems}
            value={refundMethod}
            onValueChange={(value) =>
              value && setRefundMethod(value as typeof refundMethod)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {refundMethodItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {isBankTransfer && (
          <>
            <Field>
              <FieldLabel>Ngân hàng</FieldLabel>
              <Popover open={bankPopoverOpen} onOpenChange={setBankPopoverOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={bankPopoverOpen}
                      disabled={isBanksLoading}
                      className="w-full justify-between font-normal"
                    >
                      {selectedBank ? (
                        <span className="flex min-w-0 items-center gap-2 truncate">
                          <img
                            src={selectedBank.logo}
                            alt=""
                            className="size-5 shrink-0 rounded object-contain"
                          />
                          <span className="truncate">
                            {selectedBank.shortName} — {selectedBank.name}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Chọn ngân hàng
                        </span>
                      )}
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  }
                />
                <PopoverContent className="w-(--anchor-width) p-0">
                  <Command>
                    <CommandInput placeholder="Tìm ngân hàng..." />
                    <CommandList className="max-h-72">
                      <CommandEmpty>Không tìm thấy ngân hàng.</CommandEmpty>
                      <CommandGroup>
                        {banks?.map((bank) => (
                          <CommandItem
                            key={bank.bin}
                            value={`${bank.shortName} ${bank.name}`}
                            onSelect={() => {
                              setBankBin(bank.bin);
                              setBankPopoverOpen(false);
                            }}
                          >
                            <img
                              src={bank.logo}
                              alt=""
                              className="size-5 shrink-0 rounded object-contain"
                            />
                            <span className="truncate">
                              {bank.shortName} — {bank.name}
                            </span>
                            <Check
                              className={cn(
                                "ms-auto size-4",
                                bankBin === bank.bin
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel>Số tài khoản</FieldLabel>
              <Input
                placeholder="Số tài khoản"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Chủ tài khoản</FieldLabel>
              <Input
                placeholder="Tên chủ tài khoản"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Ảnh chứng minh đã chuyển tiền</FieldLabel>
              {proofPreview ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={proofPreview}
                    alt="Ảnh chứng minh chuyển tiền"
                    className="h-64 w-64 rounded-lg border object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={resetForm}
                  >
                    <X className="size-3.5" />
                    Xóa ảnh
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-muted-foreground transition-colors hover:bg-accent"
                >
                  <ImagePlus className="size-5" />
                  <span className="text-xs">Tải ảnh lên</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Field>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button
            disabled={!isValid || processRefund.isPending}
            onClick={handleSubmit}
          >
            {processRefund.isPending && <Spinner className="size-4" />}
            Xác nhận hoàn tiền
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompleteAction({ id }: { id: string }) {
  const complete = useCompleteReturnRequest();

  return (
    <Button
      size="lg"
      disabled={complete.isPending}
      onClick={() => complete.mutate(id)}
    >
      {complete.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <Flag className="size-4" />
      )}
      Hoàn tất yêu cầu
    </Button>
  );
}

interface Props {
  returnRequest: ReturnRequest;
}

export function ReturnRequestDetailHeader({ returnRequest }: Props) {
  const StatusIcon = statusIcon[returnRequest.status];

  function handleCopyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.add({ type: "success", description: "Đã sao chép mã yêu cầu" });
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/return-requests"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách yêu cầu trả hàng
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">
              {returnRequest.code}
            </h1>
            <button
              type="button"
              onClick={() => handleCopyCode(returnRequest.code)}
              className="text-muted-foreground hover:text-secondary transition"
            >
              <Copy className="size-4" />
            </button>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 font-medium",
                statusStyle[returnRequest.status],
              )}
            >
              {StatusIcon ? <StatusIcon className="size-3.5" /> : null}
              {statusLabel[returnRequest.status] ?? returnRequest.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={`/dashboard/orders/${returnRequest.orderId}`}
              className="hover:text-secondary transition"
            >
              Đơn hàng {returnRequest.orderNumber}
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {returnRequest.status === "PENDING" && (
            <>
              <ApproveAction id={returnRequest.id} />
              <RejectAction id={returnRequest.id} />
            </>
          )}
          {returnRequest.status === "APPROVED" && (
            <MarkReceivedAction id={returnRequest.id} />
          )}
          {returnRequest.status === "ITEM_RECEIVED" && (
            <ProcessRefundAction id={returnRequest.id} />
          )}
          {returnRequest.status === "REFUNDED" && (
            <CompleteAction id={returnRequest.id} />
          )}
        </div>
      </div>
    </div>
  );
}
