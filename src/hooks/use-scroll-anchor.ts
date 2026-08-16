import { useEffect } from "react";

const HEADER_OFFSET = 96;
const IDLE_MS = 200;

/**
 * Keeps the section currently under the header anchored in place while the
 * window is being resized, instead of letting the page slide up/down.
 */
const SECTION_IDS = [
  "top",
  "philosophy",
  "advisor",
  "services",
  "calculator",
  "why-us",
  "contact",
];

export function useScrollAnchor(ids: string[] = SECTION_IDS) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let anchorId: string | null = null;
    let anchorRatio = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let frame = 0;

    const capture = () => {
      const y = window.scrollY + HEADER_OFFSET;
      let current: { id: string; top: number; height: number } | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const height = el.offsetHeight || 1;
        if (top <= y) current = { id, top, height };
      }
      if (!current) {
        anchorId = null;
        return;
      }
      anchorId = current.id;
      anchorRatio = (y - current.top) / current.height;
    };

    const restore = () => {
      if (!anchorId) return;
      const el = document.getElementById(anchorId);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const target = top + anchorRatio * (el.offsetHeight || 1) - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(0, target), behavior: "instant" as ScrollBehavior });
    };

    const onScroll = () => {
      if (idleTimer) return; // ignore programmatic scrolls during resize
      capture();
    };

    let lastWidth = window.innerWidth;

    const onResize = () => {
      // Mobile browsers fire resize when the URL bar collapses/expands during
      // fast scrolling. Re-anchoring then yanks the page back, so only react to
      // real width changes (orientation change / desktop window resize).
      if (window.innerWidth === lastWidth) {
        capture();
        return;
      }
      lastWidth = window.innerWidth;
      if (!idleTimer) {
        document.documentElement.classList.add("is-resizing");
      } else {
        clearTimeout(idleTimer);
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(restore);
      idleTimer = setTimeout(() => {
        restore();
        requestAnimationFrame(() => {
          restore();
          idleTimer = null;
          document.documentElement.classList.remove("is-resizing");
          capture();
        });
      }, IDLE_MS);
    };

    capture();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("is-resizing");
    };
  }, [ids.join(",")]);
}
