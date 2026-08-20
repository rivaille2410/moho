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
  { src: "/banner/banner-1.webp", alt: "Banner 1" },
  { src: "/banner/banner-2.webp", alt: "Banner 2" },
  { src: "/banner/banner-3.webp", alt: "Banner 3" },
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
            <div className="relative aspect-16/5 w-full">
              <Image
                fill
                src={banner.src}
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
