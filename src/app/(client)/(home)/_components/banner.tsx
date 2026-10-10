"use client";

import Image from "next/image";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from "@/components/ui/carousel";

const banners = [
  {
    desktop: "/banner/banner-1.webp",
    mobile: "/banner/banner-mobile-1.webp",
    alt: "Banner 1",
  },
  {
    desktop: "/banner/banner-2.webp",
    mobile: "/banner/banner-mobile-2.webp",
    alt: "Banner 2",
  },
  {
    desktop: "/banner/banner-3.webp",
    mobile: "/banner/banner-mobile-3.webp",
    alt: "Banner 3",
  },
  {
    desktop: "/banner/banner-4.webp",
    mobile: "/banner/banner-mobile-4.webp",
    alt: "Banner 4",
  },
  {
    desktop: "/banner/banner-5.webp",
    mobile: "/banner/banner-mobile-5.webp",
    alt: "Banner 5",
  },
  {
    desktop: "/banner/banner-6.webp",
    mobile: "/banner/banner-mobile-6.webp",
    alt: "Banner 6",
  },
  {
    desktop: "/banner/banner-7.webp",
    mobile: "/banner/banner-mobile-7.webp",
    alt: "Banner 7",
  },
  {
    desktop: "/banner/banner-8.webp",
    mobile: "/banner/banner-mobile-8.webp",
    alt: "Banner 8",
  }
];

const Banner = () => {
  return (
    <Carousel
      className="group relative w-full"
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem key={index}>
            {/* Mobile */}
            <div className="relative aspect-square w-full sm:hidden">
              <Image
                fill
                src={banner.mobile}
                alt={banner.alt}
                priority={index === 0}
                className="object-cover"
              />
            </div>

            {/* Desktop */}
            <div className="relative hidden aspect-16/5 w-full sm:block">
              <Image
                fill
                src={banner.desktop}
                alt={banner.alt}
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-background bg-secondary left-4 opacity-0! group-hover:opacity-100!" />
      <CarouselNext className="text-background bg-secondary right-4 opacity-0! group-hover:opacity-100!" />
    </Carousel>
  );
};

export default Banner;
