import Link from "next/link";
import Image from "next/image";

import { MapPin, Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const infoLinks = [
  "Chính Sách Bán Hàng",
  "Chính Sách Giao Hàng & Lắp Đặt",
  "Chính Sách Bảo Hành & Bảo Trì",
  "Chính Sách Đổi Trả",
  "Khách Hàng Thân Thiết – MOHOmie",
  "Chính Sách Đối Tác Bán Hàng",
];

export function Footer() {
  return (
    <footer className="w-full bg-slate-50">
      <div className="wrapper py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <h3 className="font-bold tracking-wide">NỘI THẤT MOHO</h3>
          <p className="text-sm leading-relaxed">
            Nội Thất MOHO là thương hiệu đến từ Savimex với gần 40 năm kinh
            nghiệm trong việc sản xuất và xuất khẩu nội thất đạt chuẩn quốc tế.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Image
              src="/logo-bct.png"
              alt="Đã thông báo Bộ Công Thương"
              width={220}
              height={62}
              className="h-16 w-auto object-contain"
            />
            <Image
              src="/dmca-protected.png"
              alt="Protected by DMCA"
              width={160}
              height={54}
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold tracking-wide">THÔNG TIN</h3>
          <ul className="space-y-2.5 text-sm">
            {infoLinks.map((label) => (
              <li key={label}>
                <Link href="/" className="hover:text-secondary transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold tracking-wide">THÔNG TIN LIÊN HỆ</h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0" />
              <p className="leading-relaxed">
                <span className="font-semibold">[Trụ sở chính]</span> 162, Đường
                HT17, Phường Tân Thới Hiệp, TP. HCM (Nằm trong khuôn viên công
                ty SAVIMEX phía sau bến xe buýt Hiệp Thành)
              </p>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0" />
              <div className="leading-relaxed">
                <p>097 114 1140 (Hotline/Zalo)</p>
                <p>0902 415 359 (Đội Giao Hàng)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0" />
              <div className="leading-relaxed">
                <p>cskh@moho.com.vn</p>
                <p className="mt-2">
                  Công Ty Cổ Phần Hợp Tác Kinh Tế Và Xuất Nhập Khẩu Savimex -
                  STK: 0071001303667 - Vietcombank CN HCM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold tracking-wide">FANPAGE</h3>
          <div className="rounded-lg border overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <Image
                src="/avatar-moho.png"
                alt="Nội Thất MOHO"
                width={56}
                height={56}
                className="h-12 w-12 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">Nội Thất MOHO</p>
                <p className="text-xs">106K người theo dõi</p>
              </div>
            </div>
            <div className="px-3 pb-3">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <Image
                  src="/facebook.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                Theo dõi Trang
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-center">
          <Link href="/" className="text-sm">
            Chỉ đường đến showroom trên Google Maps
          </Link>
        </div>
      </div>
    </footer>
  );
}
