import { useCallback, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Photo {
  src: string;
  alt: string;
}

interface Props {
  photos: Photo[];
}

export default function PhotoCarousel({ photos }: Props) {
  if (photos.length === 0) return null;

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    prefersReducedMotion ? [] : [autoplayPlugin.current]
  );

  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);

  const togglePlayback = useCallback(() => {
    const ap = emblaApi?.plugins()?.autoplay;
    if (!ap) return;
    if (ap.isPlaying()) {
      ap.stop();
      setIsPlaying(false);
    } else {
      ap.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Pause on focus within the carousel
  const handleFocus = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.stop();
  }, [emblaApi]);

  const handleBlur = useCallback(() => {
    if (isPlaying) emblaApi?.plugins()?.autoplay?.play();
  }, [emblaApi, isPlaying]);

  return (
    <section
      aria-label="Portland Bike Polo photo gallery"
      role="region"
      className="relative bg-bg"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleFocus}
      onMouseLeave={() => {
        if (isPlaying) emblaApi?.plugins()?.autoplay?.play();
      }}
    >
      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div style={{ display: "flex" }}>
          {photos.map((photo, i) => (
            <div key={i} style={{ flex: "0 0 100%", minWidth: 0 }}>
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ width: "100%", height: "480px", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={scrollPrev}
          aria-label="Previous photo"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "#e8e4d8",
            border: "none",
            width: "44px",
            height: "44px",
            fontSize: "1.5rem",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          ‹
        </button>

        {!prefersReducedMotion && (
          <button
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            style={{
              background: "rgba(0,0,0,0.6)",
              color: "#e8e4d8",
              border: "none",
              width: "44px",
              height: "44px",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        )}

        <button
          onClick={scrollNext}
          aria-label="Next photo"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "#e8e4d8",
            border: "none",
            width: "44px",
            height: "44px",
            fontSize: "1.5rem",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          ›
        </button>
      </div>
    </section>
  );
}
