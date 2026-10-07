import Image from "next/image";

interface PartnerLogo {
  name: string;
  src: string;
  scale?: number;
}

const LOGOS: PartnerLogo[] = [
  { name: "Estella Heights", src: "/partner/estella-heights.webp" },
  { name: "Celadon City", src: "/partner/celadon-city.webp" },
  { name: "Cantavil", src: "/partner/cantavil.webp" },
  { name: "Masterise Homes", src: "/partner/masterise-homes.webp" },
  { name: "Mizuki Park", src: "/partner/mizuki-park.webp" },
  { name: "Ecopark", src: "/partner/ecopark.webp" },
  { name: "Phú Đông Premier", src: "/partner/phu-dong-premier.webp" },
  { name: "River Park", src: "/partner/river-park.webp" },
  { name: "Vinhomes Central Park", src: "/partner/vinhomes-central-park.webp" },
  { name: "Vinhomes Grand Park", src: "/partner/vinhomes-grand-park.webp" },
];

function LogoItem({ logo }: { logo: PartnerLogo }) {
  return (
    <div className="relative mx-5 h-12 w-32 shrink-0 sm:mx-8 sm:h-14 sm:w-40">
      <Image
        fill
        src={logo.src}
        alt={logo.name}
        sizes="160px"
        className="object-contain"
        style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
      />
    </div>
  );
}

export default function PartnerLogos({
  title = "Khách hàng MOHO tại",
}: {
  title?: string;
}) {
  return (
    <section className="wrapper py-6">
      <h2 className="mb-6 text-lg font-bold tracking-tight sm:text-xl md:text-[22px]">
        {title}
      </h2>

      <div
        className="group relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        style={{ "--marquee-duration": "60s" } as React.CSSProperties}
      >
        <div className="flex w-max animate-logo-marquee group-hover:paused">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {LOGOS.map((logo) => (
                <LogoItem key={logo.name} logo={logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
