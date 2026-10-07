import Link from "next/link";
import Image from "next/image";

interface PromoBanner {
  src: string;
  alt: string;
  href?: string;
}

const BANNERS: PromoBanner[] = [
  {
    src: "/promotion/warranty-5-years.webp",
    alt: "Nội thất MOHO - Bảo hành 5 năm, dài nhất ngành nội thất Việt",
  },
  {
    src: "/promotion/italian-design.webp",
    alt: "Thiết kế bởi chuyên gia Italia - Design Director Juanny Barceló Borges",
  },
  {
    src: "/promotion/partnership-contact.webp",
    alt: "Liên hệ hợp tác: 0971 141 140",
    href: "tel:0971141140",
  },
];

function BannerImage({
  banner,
  priority,
}: {
  banner: PromoBanner;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[9/4] w-full overflow-hidden rounded-md bg-muted">
      <Image
        fill
        src={banner.src}
        alt={banner.alt}
        priority={priority}
        sizes="(min-width: 640px) 33vw, 100vw"
        className="object-cover transition-transform duration-300 hover:scale-[1.03]"
      />
    </div>
  );
}

export default function PromoBanners() {
  return (
    <section className="wrapper py-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
        {BANNERS.map((banner) =>
          banner.href ? (
            <Link key={banner.src} href={banner.href} className="block">
              <BannerImage banner={banner} />
            </Link>
          ) : (
            <BannerImage key={banner.src} banner={banner} />
          ),
        )}
      </div>
    </section>
  );
}
