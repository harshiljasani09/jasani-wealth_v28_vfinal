import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import founderPhoto from "@/assets/founder.webp";
import jwLogo from "@/assets/jw-logo.webp";
import heroTexture from "@/assets/hero-texture.webp";
import { SipCalculator } from "@/components/SipCalculator";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jasani Wealth — Mutual Fund Advisory" },
      {
        name: "description",
        content:
          "Private mutual fund advisory and goal-based wealth planning for HNI families. Disciplined investing, tax-efficient portfolios, and personal guidance.",
      },
      {
        property: "og:title",
        content: "Jasani Wealth — Mutual Fund Advisory",
      },
      {
        property: "og:description",
        content:
          "Stewarding wealth across generations through disciplined investing, thoughtful planning, and personalised advisory.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Jasani Wealth",
          url: "/",
          description:
            "Private mutual fund advisory and goal-based wealth planning for HNI families. Disciplined investing, tax-efficient portfolios, and personal guidance.",
        }),
      },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "Assets Under Management", prefix: "₹", target: 5, suffix: "+ Cr" },
  { label: "ADVISORY EXPERIENCE", prefix: "", target: 4, suffix: "+ Yrs" },
  { label: "Clients Served", prefix: "", target: 20, suffix: "+" },
];




function CountUp({ target, prefix, suffix }: { target: number; prefix: string; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return;
        done.current = true;
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <p ref={ref} className="mt-2 flex min-h-[1.2em] items-center justify-center font-display text-4xl text-gold tabular-nums sm:text-5xl">
      {prefix}
      {Math.round(value)}
      {suffix}
    </p>
  );
}

const services = [
  {
    title: "Mutual Fund Advisory",
    body: "Curated fund selection aligned with your objectives, risk profile, and investment horizon for long-term wealth creation.",
  },
  {
    title: "SIP & Wealth Planning",
    body: "Systematic, goal-based investment plans designed for steady and disciplined compounding.",
  },
  {
    title: "GIFT City Mutual Funds for Global Investing",
    body: "Gain access to developed and emerging international markets, including the US, China, Taiwan, Brazil, and beyond.",
  },
  {
    title: "Tax-Efficient Investment Solutions",
    body: "Combine tax savings from Section 80C with the growth potential of equities through carefully selected ELSS funds.",
  },
  {
    title: "Retirement & Wealth Accumulation",
    body: "Structured planning for financial independence and consistent wealth accumulation to support your retirement.",
  },
  {
    title: "Structured Portfolio Reviews",
    body: "Get an unbiased, professional review of your existing mutual fund investment portfolio\u00A0— no strings attached.",
  },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#top");

  useScrollAnchor();

  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setCompact(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const [talkExpanded, setTalkExpanded] = useState(false);

  useEffect(() => {
    const onTalkScroll = () => setTalkExpanded(window.scrollY > 60);
    onTalkScroll();
    window.addEventListener("scroll", onTalkScroll, { passive: true });
    return () => window.removeEventListener("scroll", onTalkScroll);
  }, []);

  useEffect(() => {
    const ids = ["top", "philosophy", "advisor", "services", "calculator", "why-us", "contact"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: "Home", href: "#top" },
    { label: "Our Philosophy", href: "#philosophy" },
    { label: "About Us", href: "#advisor" },
    { label: "Services", href: "#services" },
    { label: "SIP Calculator", href: "#calculator" },
    { label: "Why Work With Us", href: "#why-us" },
    { label: "Contact Us", href: "#contact" },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
          scrolled || menuOpen ? "glass-cream !shadow-[var(--shadow-header)]" : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl lg:max-w-7xl items-center justify-between gap-8 px-6 transition-[padding] duration-300 ease-out md:px-8 lg:px-10 ${
            compact ? "py-3" : "py-5"
          }`}
        >
          <a
            href="#top"
            className={`flex items-center gap-1.5 transition-colors ${
              scrolled || menuOpen ? "text-navy-deep" : "text-cream"
            }`}
          >
            <span className="relative -top-[2px] font-display text-2xl leading-none tracking-wide">
              Jasani
            </span>
            <span className={`eyebrow ${scrolled || menuOpen ? "text-burgundy" : "text-gold"}`}>Wealth</span>
          </a>


          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={`eyebrow-title relative whitespace-nowrap pb-1 -mb-1 transition-colors hover:text-burgundy ${
                  active === l.href
                    ? scrolled
                      ? "text-burgundy after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-burgundy"
                      : "text-gold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold"
                    : scrolled
                      ? "text-navy-deep/70"
                      : "text-cream/70"
                }`}
              >
                {l.label}
              </a>
            ))}

          </nav>

          <a
            href="https://partners.creso.in/mfd/harshiljasani"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden shrink-0 self-center whitespace-nowrap px-5 py-2.5 text-[0.6875rem] tracking-[0.16em] transition-[padding] duration-300 ease-out lg:inline-flex ${scrolled ? "btn-royal" : "btn-outline-royal"}`}
          >
            Start With Us
          </a>


          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`inline-flex lg:hidden ${scrolled || menuOpen ? "text-navy-deep" : "text-cream"}`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-6xl lg:max-w-7xl flex-col gap-1 px-6 md:px-8 lg:px-10 pb-6">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active === l.href ? "true" : undefined}
                className={`eyebrow rounded-md px-3 py-3 transition-colors hover:bg-navy-deep/5 hover:text-navy-deep ${
                  active === l.href
                    ? "border-l-2 border-burgundy bg-navy-deep/5 text-burgundy"
                    : "text-navy-deep/80"
                }`}
              >
                {l.label}
              </a>
            ))}

            <a
              href="https://partners.creso.in/mfd/harshiljasani"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal mt-4 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Start With Us
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative isolate min-h-[calc(100svh+12rem)] overflow-hidden [clip-path:inset(0)] sm:min-h-[calc(100svh+6rem)]">
        <div
          aria-hidden
          className="fixed left-0 top-0 -z-10 h-[100lvh] w-screen transform-gpu bg-cover bg-center bg-no-repeat [backface-visibility:hidden]"
          style={{ backgroundImage: `url(${heroTexture})` }}
        />
        <div className="absolute inset-0 -z-10 bg-navy-deep/70" />
        <div className="mx-auto flex min-h-[calc(100svh+12rem)] sm:min-h-[calc(100svh+6rem)] max-w-6xl lg:max-w-7xl flex-col justify-center px-6 pb-96 pt-32 sm:pb-72 sm:pt-40 md:px-8 lg:px-10">
          
          <h1 className="font-display text-6xl leading-[1.1] text-cream sm:text-7xl lg:text-8xl xl:text-8xl">
            <span className="block">Guiding Wealth with <span className="text-gilt italic">Purpose</span>.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/70">
            We focus on curating well-diversified portfolios aligned with each client's objectives. Whether you are starting your investment journey or growing an existing portfolio —{"\u00a0"}we bring personalized attention and considered guidance to every stage of your wealth creation journey.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a href="https://partners.creso.in/mfd/harshiljasani" target="_blank" rel="noopener noreferrer" className="btn-royal">
              Start With Us
            </a>
            <a href="#calculator" className="btn-outline-royal">
              Plan Your SIP
            </a>
          </div>
        </div>
      </section>

      {/* Stats — floating glass card centered on the hero / philosophy boundary */}
      <div className="relative z-10 h-0">
        <div className="mx-auto max-w-6xl lg:max-w-7xl -translate-y-1/2 px-6 md:px-8 lg:px-10">
          <div
            className="grid overflow-hidden rounded-xl border border-gold/30 shadow-[var(--shadow-royal)] backdrop-blur-xl sm:grid-cols-3"
            style={{
              background:
                "linear-gradient(160deg, color-mix(in oklab, var(--navy) 72%, transparent), color-mix(in oklab, var(--navy-deep) 78%, transparent))",
            }}
          >

            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center px-6 py-5 text-center border-b border-gold/20 last:border-b-0 sm:border-b-0 sm:border-r sm:border-gold/20 sm:py-8 sm:last:border-r-0"
              >
                <p className="eyebrow flex min-h-[2.5em] items-center justify-center text-cream/60">{s.label}</p>
                <CountUp target={s.target} prefix={s.prefix} suffix={s.suffix} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <section id="philosophy" className="relative bg-cream pb-16 pt-56 text-navy-deep sm:pt-28">

        <div className="mx-auto max-w-4xl lg:max-w-5xl px-6 md:px-8 lg:px-10 text-center">
          <h2 className="font-display text-4xl leading-tight text-navy-deep sm:text-5xl">Our Philosophy</h2>
          <div className="rule-gold mx-auto mt-6 w-40" />
          <div className="mx-auto mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-navy-deep/70">
            <p>
              We believe enduring wealth is built through patience, discipline, and a long-term perspective. Our philosophy is simple: to bring clarity to complex investment decisions and the conviction to remain focused on long-term financial goals.
            </p>
            <p>
              We combine rigorous research with thoughtful portfolio construction, ensuring every investment decision is aligned with our clients’ objectives, risk appetite, and time horizon. By focusing on the journey rather than the next market cycle, we help our clients stay disciplined through periods of uncertainty and opportunity alike.
            </p>
          </div>
        </div>
      </section>

      {/* Advisor */}
      <section id="advisor" className="bg-cream-deep py-16">
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-6 md:px-8 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative">
              <div className="rounded-lg shadow-[var(--shadow-royal)]">
                <figure className="relative h-[420px] overflow-hidden sm:h-[500px]">
                  <img
                    src={founderPhoto}
                    alt="Harshil Jasani, Founder of Jasani Wealth"
                    width={1100}
                    height={815}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent px-7 pb-6 pt-4">
                    <p className="font-display text-xl text-cream">Harshil Kirti Jasani</p>
                    <p className="eyebrow mt-1 text-gold">Founder</p>
                  </figcaption>
                </figure>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-gold" aria-hidden />
                <p className="eyebrow-lg text-burgundy">About the Advisor</p>
              </div>
              <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
                Experience Rooted in Finance and Research
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                He brings over 4 years of dedicated experience in mutual fund research, advising individuals
                and high net-worth families with a practical understanding of investors’ goals, risk profiles
                and long-term wealth creation needs.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                His foundation includes 2+ years of experience in investment banking and a core degree in finance — a background that
                embeds a rigorous, research-led approach to preserving and compounding wealth across generations.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Services — navy band */}
      <section id="services" className="relative isolate overflow-hidden bg-navy-deep py-16 [clip-path:inset(0)]">
        <div
          aria-hidden
          className="fixed left-0 top-0 -z-10 h-[100lvh] w-screen transform-gpu bg-cover bg-center bg-no-repeat [backface-visibility:hidden]"
          style={{ backgroundImage: `url(${heroTexture})` }}
        />
        <div className="absolute inset-0 -z-10 bg-navy-deep/65" aria-hidden />
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-6 md:px-8 lg:px-10">
          <div className="max-w-none">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" aria-hidden />
              <p className="eyebrow-lg text-gold">What We Offer</p>
            </div>
            <h2 className="mt-6 font-display text-3xl leading-tight text-cream sm:text-4xl lg:whitespace-nowrap lg:text-5xl">
              A Considered Suite of Advisory Services
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/65 lg:whitespace-nowrap">
              Personalized investment and wealth management solutions designed to simplify financial decision-making
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <article
                key={s.title}
                className="glass-navy group flex h-full flex-col rounded-lg p-8 transition-all duration-500 hover:-translate-y-1"
              >
                <span className="font-display text-2xl text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 min-h-[5rem] font-display text-3xl leading-snug text-cream">{s.title}</h3>
                <div className="rule-gold mt-5 w-12 transition-all duration-500 group-hover:w-24" />
                <p className="mt-5 flex-1 text-lg leading-relaxed text-cream/60">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="relative isolate overflow-hidden bg-cream-deep py-16">
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-6 md:px-8 lg:px-10">
          <div className="text-center">
            <p className="eyebrow-lg text-burgundy">Plan With Precision</p>
            <h2 className="mt-6 font-display text-4xl text-navy-deep sm:text-5xl">SIP / Lump Sum Calculator</h2>
            <div className="rule-gold mx-auto mt-8 w-40" />
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Compounding — the eighth wonder of the world.
            </p>
            <p className="mx-auto mt-3 max-w-none text-lg leading-relaxed text-muted-foreground">
              Adjust the dials to see how patient and systematic investing may compound over time.
            </p>
          </div>

          <div className="mt-10">
            <SipCalculator />
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section id="why-us" className="bg-navy-deep py-16">
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-6 md:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" aria-hidden />
            <p className="eyebrow-lg text-gold">Why Work With Us</p>
          </div>
          <h2 className="mt-6 max-w-2xl font-display text-4xl leading-tight text-cream sm:text-5xl">
            An Advisor in Your Corner, Not an App on Your Phone
          </h2>

          <div className="mt-14 overflow-hidden rounded-xl border border-cream/25 shadow-[var(--shadow-royal)]">
            <div className="grid grid-cols-2 bg-navy/80">
              <div className="min-w-0 border-r border-cream/20 px-4 py-4 sm:px-7 sm:py-5">
                <p className="eyebrow text-gold">Working With Us</p>
              </div>
              <div className="min-w-0 px-4 py-4 sm:px-7 sm:py-5">
                <p className="eyebrow text-cream/55">Other Online Apps</p>
              </div>
            </div>
            {[
              ["Personalised and relationship-led advisory", "Platform-driven, self-serve"],
              ["In-depth research & analysis", "Generic and non-conclusive insights"],
              ["Multigenerational, legacy-first planning", "Single-transaction focus"],
              ["Direct access to your advisor", "Call-centre support queues"],
            ].map(([ours, theirs], i) => (
              <div
                key={ours}
                className={`grid grid-cols-2 backdrop-blur-md ${
                  i % 2 ? "bg-cream/70" : "bg-cream/55"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5 border-r border-navy-deep/10 px-4 py-4 text-navy-deep min-h-[5rem] sm:gap-3 sm:px-7 sm:py-5">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="min-w-0 hyphens-none break-words text-[0.85rem] leading-snug sm:text-lg lg:whitespace-nowrap lg:break-normal">{ours}</span>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 px-4 py-4 text-navy-deep/55 min-h-[5rem] sm:gap-3 sm:px-7 sm:py-5">
                  <span className="h-px w-3 shrink-0 bg-navy-deep/40" aria-hidden />
                  <span className="min-w-0 hyphens-none break-words text-[0.85rem] leading-snug sm:text-lg lg:whitespace-nowrap lg:break-normal">{theirs}</span>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section id="contact" className="bg-background py-12 lg:py-16">
        <div className="mx-auto grid max-w-6xl lg:max-w-7xl items-center gap-14 px-6 md:px-8 lg:px-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden />
              <p className="eyebrow-lg text-navy-deep">Let's Connect</p>
            </div>
            <h3 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
              Begin a conversation about <span className="italic text-burgundy">your</span> wealth.
            </h3>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              First conversation is unhurried and without obligation — simply an understanding of where you are and
              where you would like to be.
            </p>


            <ul className="mt-10 space-y-6">
              {[
                {
                  key: "phone",
                  href: "tel:+919967293915",
                  text: "+91 9967293915",
                  icon: (
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  ),
                },
                {
                  key: "email",
                  href: "mailto:harshil.k.jasani@gmail.com",
                  text: "harshil.k.jasani@gmail.com",
                  icon: (
                    <>
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m2 7 10 6 10-6" />
                    </>
                  ),
                },
                {
                  key: "address",
                  href: "https://maps.app.goo.gl/dzhXN2i9n3dHL9Bf7",
                  text: (
                    <>
                      The Garden Commercial, Sadhuvasvani Road,{" "}
                      <br className="hidden lg:inline" />
                      Rajkot, Gujarat, 360005
                    </>
                  ),
                  icon: (
                    <>
                      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </>
                  ),
                },
              ].map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 text-left text-navy-deep/85 transition-colors hover:text-burgundy"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/60 text-navy-deep">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {item.icon}
                      </svg>
                    </span>
                    <span className="text-lg leading-relaxed">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-cream rounded-lg p-10 shadow-[var(--shadow-royal)] sm:p-12">
            <h3 className="font-display text-3xl">Ready to begin?</h3>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Onboarding with us in a few simple steps and start from investment journey with a plan built around your goals.
            </p>
            <a
              href="https://partners.creso.in/mfd/harshiljasani"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal mt-9 w-full justify-center text-center"
            >
              Start With Us
            </a>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-navy-deep">
        <div className="mx-auto max-w-6xl lg:max-w-7xl px-6 md:px-8 lg:px-10 pt-10">
          <div className="grid grid-cols-3 gap-3 text-center sm:gap-6 sm:text-left">
            {[
              { mobile: ["SEBI-Compliant", "Advisory"], desktop: "SEBI-Compliant Advisory" },
              { mobile: ["4+ years in", "MF research"], desktop: "4+ years in MF research" },
              { mobile: ["AMFI Registered", "ARN-356666"], desktop: "AMFI Registered ARN-356666" },
            ].map((item) => (
              <div
                key={item.desktop}
                className="flex items-center justify-center gap-1.5 text-cream/80 sm:gap-2.5 sm:justify-start"
              >
                <span className="h-2 w-2 shrink-0 rotate-45 bg-gold" aria-hidden />
                <span className="text-sm sm:text-base">
                  <span className="sm:hidden">
                    {item.mobile[0]}<br />{item.mobile[1]}
                  </span>
                  <span className="hidden sm:inline">{item.desktop}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 h-px w-full bg-cream/10" />

          <div className="grid gap-10 py-10 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src={jwLogo}
                  alt="Jasani Wealth monogram"
                  className="h-11 w-11 rounded-md object-cover"
                />
                <span className="flex items-center gap-1.5 text-cream">
                  <span className="relative -top-[2px] font-display text-2xl leading-none tracking-wide">Jasani</span>
                  <span className="eyebrow text-gold">Wealth</span>
                </span>
              </div>
              <p className="mt-6 max-w-xs text-base leading-relaxed text-cream/60">
                Helping you invest with confidence, grow with discipline, and achieve your financial goals—one step at
                a time.
              </p>
            </div>

            <div>
              <p className="eyebrow text-gold">Navigate</p>
              <ul className="mt-6 space-y-3">
                {navLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      aria-current={active === l.href ? "true" : undefined}
                      className="text-base text-cream/70 transition-colors hover:text-gold"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}

              </ul>
            </div>

            <div>
              <p className="eyebrow text-gold">CONNECT WITH US</p>
              <div className="mt-6 flex gap-4">
                <a
                  href="https://www.linkedin.com/in/harshil-jasani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-cream/25 text-cream/70 transition-colors duration-500 hover:border-gold"
                >
                  <span
                    className="absolute inset-0 rounded-full bg-gold opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
                    aria-hidden
                  />
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="relative z-10 h-5 w-5 transition-colors duration-500 group-hover:text-navy-deep"
                    aria-hidden
                  >
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/919967293915"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-cream/25 text-cream/70 transition-colors duration-500 hover:border-gold"
                >
                  <span
                    className="absolute inset-0 rounded-full bg-gold opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
                    aria-hidden
                  />
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="relative z-10 h-6 w-6 transition-colors duration-500 group-hover:text-navy-deep"
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-cream/10" />

          <div className="py-6 text-center">
            <p className="text-base text-gold">AMFI Registered Mutual Fund Distributor: ARN-356666</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/45">
              Mutual fund investments are subject to market risks; please read all scheme related documents carefully.
            </p>
            <p className="mt-4 text-sm text-cream/60">© 2026 Harshil Jasani. All rights reserved.</p>
          </div>
        </div>
      </footer>


      {/* Talk to us — bottom right */}
      <a
        href="https://wa.me/919967293915"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Talk to Us"
        className={`glass-cream fixed bottom-6 right-6 z-40 inline-flex items-center justify-center overflow-hidden rounded-md transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          talkExpanded
            ? "h-11 w-[9rem] gap-2 px-3 py-2.5"
            : "h-11 w-11 gap-0 p-0"
        } lg:w-[9rem] lg:gap-2 lg:px-3 lg:py-2.5`}
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-burgundy">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <span
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            talkExpanded ? "max-w-[6rem] opacity-100" : "max-w-0 opacity-0"
          } lg:max-w-[6rem] lg:opacity-100`}
        >
          <span className="eyebrow whitespace-nowrap text-navy-deep">Talk to Us</span>
        </span>
      </a>
    </div>
  );
}
