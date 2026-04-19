"use client";

import { Carousel } from "@ark-ui/react/carousel";

const SLIDES = [
  {
    title: "Location & benchmark",
    body: "Geocode an address or drop a map pin. The engine matches illustrative circle-rate rows and tier fallbacks so your band starts from a transparent benchmark — not a black box.",
    tag: "Maps · circle rates",
  },
  {
    title: "Collateral documents",
    body: "Upload papers (PDF) and internal / external photos in the flow. Files stay in your browser; counts nudge confidence so stakeholders see a serious dossier without a separate upload service.",
    tag: "PDFs · photos",
  },
  {
    title: "Property & comparables",
    body: "Capture type, size, age, tenure, and legal context. Comps combine bundled seed listings with optional portal feeds inside a Haversine radius you control — with clear counts and error surfacing.",
    tag: "Comps · portals",
  },
  {
    title: "Infra & neighbourhood",
    body: "Rate proximity to metro, rail, highways, hubs, schools, and hospitals. Describe land use and planning. Both feed composite indices that move value bands and liquidity like the PDF framework expects.",
    tag: "Proximity · quality",
  },
  {
    title: "Results you can defend",
    body: "Market and distress ranges, resale index, time-to-sell band, and confidence — with info icons on every line. Ranges and indices, not a single hidden price: built for demos and integration tests.",
    tag: "Ranges · tooltips",
  },
  {
    title: "Collateral text & AI signals",
    body: "Location, legal/RERA, and document-summary text fields are scanned for transit, connectivity, and legal cues that become explainable drivers alongside the rule engine — structured intelligence, not a second black-box price.",
    tag: "NLP-style · drivers",
  },
  {
    title: "Listing & landmark intelligence",
    body: "Optional portal feeds and seed comps inside your radius; landmark metadata from listings can nudge amenity scoring with labeled signals. Sanity checks flag extreme sizes and model-vs-median mismatches.",
    tag: "Portals · landmarks · QA",
  },
];

export function FeaturesCarousel() {
  const count = SLIDES.length;

  return (
    <section
      id="feature-carousel"
      aria-labelledby="feature-carousel-heading"
      className="scroll-mt-24"
    >
      <div className="mb-8 text-center">
        <h2
          id="feature-carousel-heading"
          className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          Feature tour
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Swipe or use the arrows — seven highlights including AI-assisted signals and explainable outputs.
        </p>
      </div>

      <Carousel.Root
        slideCount={count}
        slidesPerPage={1}
        loop
        spacing="0px"
        autoplay={{ delay: 6000 }}
        allowMouseDrag
        className="relative w-full"
      >
        <div className="flex min-w-0 items-stretch gap-2 sm:gap-3">
          <Carousel.PrevTrigger
            type="button"
            className="inline-flex w-9 shrink-0 items-center justify-center self-center rounded-full border border-neutral-200 bg-white text-lg leading-none text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:h-11 sm:w-11 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Previous slide"
          >
            ‹
          </Carousel.PrevTrigger>

          <Carousel.ItemGroup className="min-h-[min(240px,48vh)] min-w-0 flex-1 overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/80 to-emerald-50/40 shadow-inner dark:border-neutral-700 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/30 sm:min-h-[min(280px,55vh)]">
            {SLIDES.map((slide, index) => (
              <Carousel.Item
                key={slide.title}
                index={index}
                className="flex h-full flex-col justify-center px-6 py-8 sm:px-10"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {slide.tag}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {slide.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {slide.body}
                </p>
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>

          <Carousel.NextTrigger
            type="button"
            className="inline-flex w-9 shrink-0 items-center justify-center self-center rounded-full border border-neutral-200 bg-white text-lg leading-none text-neutral-700 shadow-sm transition hover:bg-neutral-50 sm:h-11 sm:w-11 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Next slide"
          >
            ›
          </Carousel.NextTrigger>
        </div>

        <Carousel.IndicatorGroup className="mt-6 flex justify-center gap-2">
          {SLIDES.map((_, index) => (
            <Carousel.Indicator
              key={index}
              index={index}
              className="h-2 w-2 rounded-full bg-neutral-300 transition data-[state=checked]:w-6 data-[state=checked]:bg-emerald-600 dark:bg-neutral-600 dark:data-[state=checked]:bg-emerald-500"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Carousel.IndicatorGroup>
      </Carousel.Root>
    </section>
  );
}
