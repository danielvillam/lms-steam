"use client";

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
    "/images/Slide_01.jpg",
    "/images/Slide_02.jpg",
    "/images/Slide_01.jpg",
    "/images/Slide_02.jpg",
    "/images/Slide_01.jpg"
];

export function CarouselHome() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-4xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={() => plugin.current.play()}
        >
            <CarouselContent>
                {images.map((src, index) => (
                    <CarouselItem key={index} className="basis-full">
                        <div className="p-2">
                            <Card className="rounded-lg overflow-hidden">
                                <CardContent className="flex aspect-[16/5] items-center justify-center p-0">
                                    <img
                                        src={src}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" />
            <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70" />
        </Carousel>
    );
}