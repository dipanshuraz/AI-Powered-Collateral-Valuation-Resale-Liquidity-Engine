"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BRAND_NAME } from "@/lib/brand";
import { FeaturesCarousel } from "@/components/landing/FeaturesCarousel";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const navLinkClass =
  "text-xs font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white";

export function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const heroGlow = useRef<HTMLDivElement>(null);
  const heroGlow2 = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const q = gsap.utils.selector(root);

      if (reduced) {
        q("[data-anim]").forEach((el) => {
          gsap.set(el, { clearProps: "all" });
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.visibility = "visible";
          (el as HTMLElement).style.transform = "none";
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q("[data-hero-stagger]"), {
        y: 36,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.08,
      }).from(
        q("[data-check-stagger]"),
        {
          x: -12,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.35"
      );

      if (heroGlow.current && heroGlow2.current) {
        gsap.to(heroGlow.current, {
          y: 18,
          x: 8,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(heroGlow2.current, {
          y: -14,
          x: -10,
          duration: 6.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      gsap.utils.toArray<HTMLElement>(q("[data-scroll-section]")).forEach((section) => {
        const heading = section.querySelector("[data-section-heading]");
        const body = section.querySelectorAll("[data-section-body]");

        if (heading) {
          gsap.from(heading, {
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
            y: 28,
            autoAlpha: 0,
            duration: 0.65,
            ease: "power2.out",
          });
        }

        if (body.length) {
          gsap.from(body, {
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
            y: 32,
            autoAlpha: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "power2.out",
          });
        }
      });

      gsap.utils.toArray<HTMLElement>(q("[data-card]")).forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          autoAlpha: 0,
          duration: 0.6,
          delay: i * 0.04,
          ease: "power2.out",
        });
      });

      const stepsEl = q("[data-steps-section]")[0];
      if (stepsEl) {
        gsap.from(q("[data-step]"), {
          scrollTrigger: {
            trigger: stepsEl,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          x: -16,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.12,
          ease: "power2.out",
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgb(16_185_129/0.12),transparent_50%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgb(16_185_129/0.08),transparent_50%)]"
    >
      <header
        data-anim
        className="sticky top-0 z-30 border-b border-neutral-200/70 bg-white/85 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/90"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-neutral-900 dark:text-neutral-100"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-sm font-bold text-white shadow-md shadow-emerald-900/20">
              EE
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Estimate<span className="text-emerald-600 dark:text-emerald-400">Engine</span>
            </span>
          </Link>
          <nav
            className="-mx-1 flex max-w-[55vw] min-w-0 flex-1 items-center gap-4 overflow-x-auto px-1 md:max-w-none md:justify-center"
            aria-label="Primary"
          >
            <a href="#feature-carousel" className={`${navLinkClass} shrink-0 whitespace-nowrap`}>
              Tour
            </a>
            <a href="#problem-context" className={`${navLinkClass} shrink-0 whitespace-nowrap`}>
              Why
            </a>
            <a href="#what-you-get" className={`${navLinkClass} shrink-0 whitespace-nowrap`}>
              Capabilities
            </a>
            <a href="#ai-features" className={`${navLinkClass} shrink-0 whitespace-nowrap`}>
              AI
            </a>
            <a href="#how-it-works" className={`${navLinkClass} shrink-0 whitespace-nowrap`}>
              Flow
            </a>
            <a href="#brief-alignment" className={`${navLinkClass} shrink-0 whitespace-nowrap`}>
              Rubric
            </a>
            <a href="#limitations" className={`${navLinkClass} shrink-0 whitespace-nowrap`}>
              Scope
            </a>
          </nav>
          <Link
            href="/estimate"
            className="rounded-full bg-gradient-to-r from-neutral-900 to-neutral-800 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-neutral-900/25 transition hover:from-neutral-800 hover:to-neutral-700 dark:from-emerald-600 dark:to-teal-700 dark:shadow-emerald-900/30 dark:hover:from-emerald-500 dark:hover:to-teal-600"
          >
            Start estimate
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-gradient-to-b from-white via-neutral-50/90 to-white px-6 py-12 shadow-xl shadow-neutral-900/5 dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 sm:px-12 sm:py-16">
          <div
            ref={heroGlow}
            className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-emerald-400/30 blur-3xl dark:bg-emerald-500/12"
            aria-hidden
          />
          <div
            ref={heroGlow2}
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.025)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-3xl text-center sm:mx-0 sm:text-left">
            <p
              data-hero-stagger
              data-anim
              className="inline-flex rounded-full border border-emerald-200/80 bg-emerald-50/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              Collateral intelligence
            </p>
            <h1
              data-hero-stagger
              data-anim
              className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl sm:leading-[1.1]"
            >
              Valuation &amp; resale liquidity,{" "}
              <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                explained end to end
              </span>
            </h1>
            <p
              data-hero-stagger
              data-anim
              className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              {BRAND_NAME} combines a <strong className="font-medium text-neutral-800 dark:text-neutral-200">transparent rule engine</strong> with{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">location intelligence</strong>,{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">collateral text signals</strong>, and{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">listing-aware comps</strong> — so you get{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">market</strong> and{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">distress</strong> bands,{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">resale index</strong>, time-to-sell
              range, and <strong className="font-medium text-neutral-800 dark:text-neutral-200">confidence</strong> with
              explainable drivers, not a single hidden price.
            </p>

            <ul className="mx-auto mt-10 max-w-xl space-y-4 text-left text-sm text-neutral-700 dark:text-neutral-300 sm:mx-0">
              <li data-check-stagger data-anim className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  ✓
                </span>
                <span>
                  <strong className="text-neutral-900 dark:text-neutral-100">AI &amp; intelligence:</strong> smart
                  geocoding, text-derived drivers from your notes, landmark signals from portals, sanity flags, and
                  tooltips on every metric — see the{" "}
                  <a href="#ai-features" className="font-medium text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:text-emerald-800 dark:text-emerald-400">
                    full list
                  </a>
                  .
                </span>
              </li>
              <li data-check-stagger data-anim className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  ✓
                </span>
                <span>
                  <strong className="text-neutral-900 dark:text-neutral-100">Guided wizard:</strong> location →
                  documents → property → details → infra &amp; area → review → results.
                </span>
              </li>
              <li data-check-stagger data-anim className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  ✓
                </span>
                <span>
                  <strong className="text-neutral-900 dark:text-neutral-100">Transparent math:</strong> circle-rate
                  anchor, Haversine comps, optional portal feeds — errors surface clearly.
                </span>
              </li>
              <li data-check-stagger data-anim className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  ✓
                </span>
                <span>
                  <strong className="text-neutral-900 dark:text-neutral-100">API-ready:</strong> use the UI for demos
                  or POST JSON to <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[13px] dark:bg-neutral-800">/api/estimate</code>.
                </span>
              </li>
            </ul>

            <div
              data-hero-stagger
              data-anim
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-start"
            >
              <Link
                href="/estimate"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-neutral-900 to-neutral-800 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-neutral-800 hover:to-neutral-700 dark:from-emerald-600 dark:to-teal-700 sm:w-auto"
              >
                Launch full estimate
              </Link>
              <a
                href="#feature-carousel"
                className="inline-flex w-full items-center justify-center rounded-full border border-neutral-300 bg-white/80 px-6 py-3.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-white dark:border-neutral-600 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:bg-neutral-900 sm:w-auto"
              >
                Browse features
              </a>
            </div>
          </div>
        </section>

        <section
          data-scroll-section
          id="problem-context"
          aria-labelledby="problem-context-heading"
          className="mt-16 rounded-2xl border border-neutral-200/90 bg-white px-6 py-10 shadow-sm sm:mt-20 sm:px-10"
        >
          <h2
            data-section-heading
            id="problem-context-heading"
            className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            Why NBFCs need more than a point estimate
          </h2>
          <p
            data-section-body
            className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            For secured lenders, property-backed credit rests on two questions:{" "}
            <strong className="font-medium text-neutral-800 dark:text-neutral-200">what the asset is worth today</strong>,
            and{" "}
            <strong className="font-medium text-neutral-800 dark:text-neutral-200">
              how easily it can be liquidated
            </strong>{" "}
            if needed. Most workflows still lean on manual inspections, broker opinion (subjective and uneven), and
            circle rates that can lag the market — driving valuation variance, mispriced risk, conservative lending, and
            slower credit decisions.
          </p>
          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">What you are actually solving</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              This is <strong className="font-medium text-neutral-900 dark:text-neutral-100">not just a pricing model</strong>.
              The brief asks for a <strong className="font-medium text-neutral-900 dark:text-neutral-100">market-aware collateral intelligence layer</strong> that combines{" "}
              <strong className="font-medium text-neutral-900 dark:text-neutral-100">intrinsic value</strong> (what the asset should sell for) with{" "}
              <strong className="font-medium text-neutral-900 dark:text-neutral-100">liquidity</strong> (how fast and reliably it can be sold). In practice, exit certainty matters as much as headline value.
            </p>
          </div>
          <p
            data-section-body
            className="mt-8 text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            Target outputs (mandatory shape from the brief)
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-neutral-600 dark:text-neutral-400 sm:grid-cols-2">
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">→</span>
              Estimated market value — <strong className="font-medium text-neutral-800 dark:text-neutral-200">₹ range</strong>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">→</span>
              Distress sale value — <strong className="font-medium text-neutral-800 dark:text-neutral-200">₹ range</strong>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">→</span>
              Resale potential index — <strong className="font-medium text-neutral-800 dark:text-neutral-200">0–100</strong>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">→</span>
              Time to liquidate — <strong className="font-medium text-neutral-800 dark:text-neutral-200">days range</strong>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">→</span>
              Confidence score — <strong className="font-medium text-neutral-800 dark:text-neutral-200">0–1</strong>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">→</span>
              Key risk flags &amp; value drivers — <strong className="font-medium text-neutral-800 dark:text-neutral-200">explainable</strong>
            </li>
          </ul>
        </section>

        <div className="mt-20 sm:mt-24">
          <FeaturesCarousel />
        </div>

        <div className="mt-24 space-y-24 border-t border-neutral-200/80 pt-24 dark:border-neutral-800">
          <section
            data-scroll-section
            id="ai-features"
            aria-labelledby="ai-features-heading"
            className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 to-white px-6 py-10 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-neutral-950 sm:px-10"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
              Intelligence layer
            </p>
            <h2
              data-section-heading
              id="ai-features-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              AI &amp; smart features in {BRAND_NAME}
            </h2>
            <p
              data-section-body
              className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              The demo pairs a deterministic valuation core with intelligent helpers — geospatial search, text cues from
              your collateral notes, listing metadata, and guardrails — so outputs stay{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">explainable</strong> and traceable.
            </p>
            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div data-card className="rounded-xl border border-emerald-100/90 bg-white/90 p-5 dark:border-emerald-900/30 dark:bg-neutral-900/40">
                <dt className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Location intelligence (geospatial AI)
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Server-side <strong className="font-medium text-neutral-800 dark:text-neutral-200">forward geocoding</strong>{" "}
                  (addresses &amp; Indian PIN codes), <strong className="font-medium text-neutral-800 dark:text-neutral-200">reverse geocoding</strong>{" "}
                  after map pin moves, and circle-rate / tier matching from resolved place text — so coordinates and
                  benchmarks stay consistent with what you typed or picked.
                </dd>
              </div>
              <div data-card className="rounded-xl border border-emerald-100/90 bg-white/90 p-5 dark:border-emerald-900/30 dark:bg-neutral-900/40">
                <dt className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Collateral text intelligence
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Free-text <strong className="font-medium text-neutral-800 dark:text-neutral-200">location</strong>,{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">legal / RERA</strong>, and{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">documents summary</strong> fields
                  are scanned for cues (transit, connectivity, legal keywords) that become{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">explainable drivers</strong> — a
                  structured signal layer, not a second hidden pricing model.
                </dd>
              </div>
              <div data-card className="rounded-xl border border-emerald-100/90 bg-white/90 p-5 dark:border-emerald-900/30 dark:bg-neutral-900/40">
                <dt className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Listing &amp; landmark intelligence
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Optional <strong className="font-medium text-neutral-800 dark:text-neutral-200">portal JSON feeds</strong>{" "}
                  and seed comps inside your km radius; when listings carry landmark metadata,{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">landmark signals</strong> nudge
                  amenity scoring with transparent labels in the response.
                </dd>
              </div>
              <div data-card className="rounded-xl border border-emerald-100/90 bg-white/90 p-5 dark:border-emerald-900/30 dark:bg-neutral-900/40">
                <dt className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Infra &amp; neighbourhood models
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  User-rated <strong className="font-medium text-neutral-800 dark:text-neutral-200">infrastructure proximity</strong>{" "}
                  and <strong className="font-medium text-neutral-800 dark:text-neutral-200">neighbourhood quality</strong>{" "}
                  (land use, planning) feed composite indices that adjust liquidity and value bands with clear driver tags.
                </dd>
              </div>
              <div data-card className="rounded-xl border border-emerald-100/90 bg-white/90 p-5 dark:border-emerald-900/30 dark:bg-neutral-900/40">
                <dt className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Explainable outputs (XAI-style)
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Every run returns <strong className="font-medium text-neutral-800 dark:text-neutral-200">key drivers</strong>,{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">risk flags</strong>,{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">confidence</strong>, data sources,
                  and UI <strong className="font-medium text-neutral-800 dark:text-neutral-200">tooltips</strong> on metrics
                  — ranges and indices you can walk through in a review or API payload.
                </dd>
              </div>
              <div data-card className="rounded-xl border border-emerald-100/90 bg-white/90 p-5 dark:border-emerald-900/30 dark:bg-neutral-900/40">
                <dt className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Sanity &amp; document-aware signals
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Lightweight checks for <strong className="font-medium text-neutral-800 dark:text-neutral-200">extreme sizes</strong>{" "}
                  and <strong className="font-medium text-neutral-800 dark:text-neutral-200">model vs local listing median</strong>{" "}
                  mismatch; <strong className="font-medium text-neutral-800 dark:text-neutral-200">collateral upload counts</strong>{" "}
                  (browser-side) nudge confidence — honest guardrails, not a fraud engine.
                </dd>
              </div>
            </dl>
          </section>

          <section
            data-scroll-section
            id="model-depth"
            aria-labelledby="model-depth-heading"
            className="rounded-2xl border border-neutral-200/90 bg-white px-6 py-10 shadow-sm sm:px-10"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              From the problem brief — feature &amp; modeling lens
            </p>
            <h2
              data-section-heading
              id="model-depth-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              Signals, valuation logic &amp; resale interpretation
            </h2>
            <p
              data-section-body
              className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              The specification outlines a full <strong className="font-medium text-neutral-800 dark:text-neutral-200">feature-engineering framework</strong>: location drives the benchmark; property, legal, income, and market-dynamics layers adjust value and exit risk. {BRAND_NAME} implements the spirit of that stack in a deployable demo — ranges everywhere, not a single opaque number.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div data-card className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  1. Location intelligence
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Address / lat-long; optional photos. Derived: <strong className="font-medium text-neutral-800 dark:text-neutral-200">circle-rate benchmark</strong>, market-activity proxies (listings, density where available),{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">infrastructure proximity</strong>, and{" "}
                  <strong className="font-medium text-neutral-800 dark:text-neutral-200">neighbourhood quality</strong> (residential vs mixed-use, planned vs unplanned).
                </p>
              </div>
              <div data-card className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  2. Property characteristics
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Type / sub-type, size (built-up or carpet), <strong className="font-medium text-neutral-800 dark:text-neutral-200">vintage bands</strong> (new / mid / old), floor and lift access — shaping depreciation, demand, and usable life.
                </p>
              </div>
              <div data-card className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  3. Legal &amp; ownership
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Freehold vs leasehold and <strong className="font-medium text-neutral-800 dark:text-neutral-200">title clarity proxies</strong> — liquidity and conservative LTV behaviour track legal complexity.
                </p>
              </div>
              <div data-card className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  4. Income &amp; usage
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Occupancy (self / rented / vacant) and <strong className="font-medium text-neutral-800 dark:text-neutral-200">rental yield</strong> where applicable — investor demand and resale certainty.
                </p>
              </div>
              <div data-card className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 sm:col-span-2 lg:col-span-2 dark:border-neutral-800 dark:bg-neutral-900/40">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  5. Market dynamics
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Supply–demand balance, optional momentum, and <strong className="font-medium text-neutral-800 dark:text-neutral-200">asset fungibility</strong> — standard formats (e.g. typical apartments) vs niche stock — mapped to liquidity in the engine.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 border-t border-neutral-200 pt-10 dark:border-neutral-800 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Valuation &amp; liquidity (brief)</h3>
                <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>
                    <strong className="font-medium text-neutral-800 dark:text-neutral-200">Market value</strong> from circle-rate anchor, location premium, type/size, age/depreciation, infra score, rental yield where relevant — output is always a <strong className="font-medium text-neutral-800 dark:text-neutral-200">range</strong>.
                  </li>
                  <li>
                    <strong className="font-medium text-neutral-800 dark:text-neutral-200">Distress value</strong> ≈ market value × liquidity discount (asset type, micro-market demand, legal clarity).
                  </li>
                  <li>
                    <strong className="font-medium text-neutral-800 dark:text-neutral-200">Resale index</strong> consolidates prime location, standard configuration, demand, age, legal risk, and niche profile.
                  </li>
                  <li>
                    <strong className="font-medium text-neutral-800 dark:text-neutral-200">Time to sell</strong> as a function of resale index, property type, and market-activity indicators — expressed as a <strong className="font-medium text-neutral-800 dark:text-neutral-200">time range</strong>, not one day count.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Resale index — how to read bands</h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li>
                    <span className="font-mono text-emerald-800 dark:text-emerald-400">80–100</span> — highly liquid
                  </li>
                  <li>
                    <span className="font-mono text-emerald-800 dark:text-emerald-400">50–80</span> — moderate liquidity
                  </li>
                  <li>
                    <span className="font-mono text-emerald-800 dark:text-emerald-400">&lt;50</span> — illiquid or specialised
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Fraud &amp; risk considerations (brief)</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                The spec flags overstated size, bad geotags, and misclassified property types — mitigated by{" "}
                <strong className="font-medium text-neutral-800 dark:text-neutral-200">size sanity vs locality norms</strong>,{" "}
                <strong className="font-medium text-neutral-800 dark:text-neutral-200">location–property mismatch</strong> style checks, and configuration plausibility — aligned with the demo&apos;s guardrails.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Sample API shape (illustrative)</h3>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-950 p-4 text-left text-[11px] leading-relaxed text-emerald-100/95 dark:border-neutral-700">
                {`{
  "market_value_range": [9500000, 11500000],
  "distress_value_range": [7500000, 9000000],
  "resale_potential_index": 72,
  "estimated_time_to_sell_days": [45, 90],
  "confidence_score": 0.68,
  "key_drivers": [
    "proximity_to_metro",
    "standard_2bhk_configuration",
    "mid_age_building"
  ],
  "risk_flags": [
    "high_micro_market_competition",
    "moderate_building_age"
  ]
}`}
              </pre>
            </div>
          </section>

          <section data-scroll-section id="what-you-get" aria-labelledby="what-you-get-heading">
            <h2
              data-section-heading
              id="what-you-get-heading"
              className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              Everything in one run
            </h2>
            <p
              data-section-body
              className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              Like consumer home-value tools, {BRAND_NAME} is explicit about{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">ranges</strong> and{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">indices</strong> — tuned for
              collateral and pre-credit storytelling, not a single hidden number.
            </p>
            <dl className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div
                data-card
                className="group rounded-2xl border border-neutral-200/90 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 transition hover:border-emerald-300/60 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:ring-white/5 dark:hover:border-emerald-700/40"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Market value range
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Orderly-sale band from circle-rate logic and comparable ₹/sqft in your radius.
                </dd>
              </div>
              <div
                data-card
                className="group rounded-2xl border border-neutral-200/90 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 transition hover:border-emerald-300/60 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:ring-white/5 dark:hover:border-emerald-700/40"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Distress value range
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Stress scenario band with a liquidity discount — not a predicted auction price.
                </dd>
              </div>
              <div
                data-card
                className="group rounded-2xl border border-neutral-200/90 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 transition hover:border-emerald-300/60 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:ring-white/5 dark:hover:border-emerald-700/40"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Resale &amp; time to sell
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  0–100 resale index plus a days band for directional exit planning.
                </dd>
              </div>
              <div
                data-card
                className="group rounded-2xl border border-neutral-200/90 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 transition hover:border-emerald-300/60 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:ring-white/5 dark:hover:border-emerald-700/40"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  Confidence &amp; comps
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Evidence score and comp count inside your km radius — including seed + portals.
                </dd>
              </div>
            </dl>
          </section>

          <section data-scroll-section data-steps-section id="how-it-works" aria-labelledby="how-it-works-heading">
            <h2
              data-section-heading
              id="how-it-works-heading"
              className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              How the engine works
            </h2>
            <ol className="mt-8 max-w-3xl list-decimal space-y-5 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              <li data-step>
                <strong className="font-medium text-neutral-900 dark:text-neutral-100">Location</strong> — Geocode or
                map pin; match to circle-rate rows and tier fallbacks.
              </li>
              <li data-step>
                <strong className="font-medium text-neutral-900 dark:text-neutral-100">Documents &amp; property</strong>{" "}
                — Upload collateral, then capture type, size, age, tenure, and legal context.
              </li>
              <li data-step>
                <strong className="font-medium text-neutral-900 dark:text-neutral-100">Details &amp; feeds</strong> —
                Optional MagicBricks / portal URLs with clear error handling when feeds fail.
              </li>
              <li data-step>
                <strong className="font-medium text-neutral-900 dark:text-neutral-100">Infra &amp; neighbourhood</strong>{" "}
                — Proximity scores and land-use planning inputs move composite indices.
              </li>
              <li data-step>
                <strong className="font-medium text-neutral-900 dark:text-neutral-100">Review &amp; run</strong> —
                Confirm, then get ranges, indices, tooltips, and drivers from one rule engine.
              </li>
            </ol>
          </section>

          <section
            data-scroll-section
            id="brief-alignment"
            aria-labelledby="brief-alignment-heading"
            className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white px-6 py-10 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950 sm:px-10"
          >
            <h2
              data-section-heading
              id="brief-alignment-heading"
              className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              Strong solution framing &amp; evaluation rubric
            </h2>
            <blockquote className="mt-6 border-l-4 border-emerald-500 pl-5 text-sm italic leading-relaxed text-neutral-700 dark:text-neutral-300">
              Not: “We trained a regression to predict price.” Instead: a{" "}
              <strong className="font-medium not-italic text-neutral-900 dark:text-neutral-100">
                structured valuation and liquidity framework
              </strong>{" "}
              where location sets the base, property attributes adjust value, market forces define exit risk, and outputs are{" "}
              <strong className="font-medium not-italic text-neutral-900 dark:text-neutral-100">transparent and range-based</strong>.
            </blockquote>
            <p
              data-section-body
              className="mt-6 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              The brief positions this as evolving toward a{" "}
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">
                “Bloomberg Terminal for real-estate collateral”
              </strong>{" "}
              — where lenders see <strong className="font-medium text-neutral-800 dark:text-neutral-200">price, risk, and liquidity together</strong>, not in silos: core underwriting for LAP-style products, real-time valuation APIs for fintechs, and a credit-focused India property intelligence layer.
            </p>

            <h3 className="mt-10 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Evaluation criteria (weights)</h3>
            <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-100/80 dark:border-neutral-800 dark:bg-neutral-900/50">
                    <th className="px-4 py-2 font-semibold text-neutral-800 dark:text-neutral-200">Dimension</th>
                    <th className="px-4 py-2 font-semibold text-neutral-800 dark:text-neutral-200">Weight</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400">
                  <tr className="border-b border-neutral-100 dark:border-neutral-800/80">
                    <td className="px-4 py-2">Valuation logic</td>
                    <td className="px-4 py-2 font-mono">25%</td>
                  </tr>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800/80">
                    <td className="px-4 py-2">Liquidity modeling</td>
                    <td className="px-4 py-2 font-mono">25%</td>
                  </tr>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800/80">
                    <td className="px-4 py-2">Feature depth</td>
                    <td className="px-4 py-2 font-mono">20%</td>
                  </tr>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800/80">
                    <td className="px-4 py-2">Practical deployability</td>
                    <td className="px-4 py-2 font-mono">15%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Explainability</td>
                    <td className="px-4 py-2 font-mono">15%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-10 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Constraints (from the brief)</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>No proprietary transaction database assumed.</li>
              <li>
                Allowed inputs: <strong className="font-medium text-neutral-800 dark:text-neutral-200">circle rates</strong>,{" "}
                <strong className="font-medium text-neutral-800 dark:text-neutral-200">public listings</strong> (optional),{" "}
                <strong className="font-medium text-neutral-800 dark:text-neutral-200">reasoned synthetic assumptions</strong>.
              </li>
            </ul>
          </section>

          <section
            data-scroll-section
            id="limitations"
            aria-labelledby="limitations-heading"
            className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-8"
          >
            <h2
              data-section-heading
              id="limitations-heading"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
            >
              Scope &amp; limitations
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              <li data-section-body>
                Demo engine — not a licensed appraisal, BPO, or credit decision. Institutional workflows need licensed
                valuation and policy controls.
              </li>
              <li data-section-body>
                Outputs depend on input quality and bundled seed data; optional feeds may fail (cookies, rate limits).
              </li>
              <li data-section-body>
                Markets move; static tables and snapshot comps are point-in-time — use ranges as structured inputs, not
                transaction prices.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-gradient-to-r from-neutral-900 to-neutral-800 px-6 py-10 text-center dark:from-emerald-950 dark:to-neutral-950 sm:px-10">
            <p className="text-lg font-medium text-white">Ready to run a full collateral estimate?</p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-300">
              Walk through the wizard or integrate the JSON API — same deterministic engine. Built in the spirit of the
              brief: <strong className="font-medium text-white">value + liquidity + explainability</strong> in one view.
            </p>
            <Link
              href="/estimate"
              className="mt-6 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 shadow-lg transition hover:bg-neutral-100"
            >
              Open {BRAND_NAME}
            </Link>
          </section>
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/estimate" className="hover:text-neutral-900 dark:hover:text-white">
                  New estimate
                </Link>
              </li>
              <li>
                <a href="#feature-carousel" className="hover:text-neutral-900 dark:hover:text-white">
                  Feature tour
                </a>
              </li>
              <li>
                <a href="#what-you-get" className="hover:text-neutral-900 dark:hover:text-white">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#ai-features" className="hover:text-neutral-900 dark:hover:text-white">
                  AI &amp; intelligence
                </a>
              </li>
              <li>
                <a href="#problem-context" className="hover:text-neutral-900 dark:hover:text-white">
                  Lender problem (brief)
                </a>
              </li>
              <li>
                <a href="#model-depth" className="hover:text-neutral-900 dark:hover:text-white">
                  Modeling &amp; JSON shape
                </a>
              </li>
              <li>
                <a href="#brief-alignment" className="hover:text-neutral-900 dark:hover:text-white">
                  Rubric &amp; vision
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Disclaimer</p>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Not financial, appraisal, or legal advice. Estimates are illustrative; real lending requires licensed
              valuation and compliance.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Brand</p>
            <p className="mt-4 text-sm font-medium text-neutral-800 dark:text-neutral-200">{BRAND_NAME}</p>
            <p className="mt-2 text-xs text-neutral-500">Collateral valuation &amp; liquidity demo</p>
          </div>
        </div>
        <div className="border-t border-neutral-200/80 py-6 text-center text-[11px] text-neutral-500 dark:border-neutral-800">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
