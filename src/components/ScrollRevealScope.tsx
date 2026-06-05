import { useEffect, useRef } from "react";

interface ScrollRevealScopeProps {
  children: React.ReactNode;
  className?: string;
}

const REVEAL_SELECTOR = "section, article, [data-scroll-reveal]";

const ScrollRevealScope = ({ children, className = "" }: ScrollRevealScopeProps) => {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = new WeakSet<Element>();

    const revealNow = (el: HTMLElement) => {
      el.classList.add("scroll-reveal-item", "scroll-reveal-visible");
      el.style.setProperty("--scroll-reveal-delay", el.dataset.scrollDelay || "0ms");
    };

    if (reducedMotion) {
      scope.querySelectorAll(REVEAL_SELECTOR).forEach((node) => {
        if (node instanceof HTMLElement) revealNow(node);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
          revealNow(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const register = (node: Element) => {
      const elements: Element[] = [];
      if (node instanceof HTMLElement && node.matches(REVEAL_SELECTOR)) {
        elements.push(node);
      }
      if (node instanceof HTMLElement) {
        elements.push(...Array.from(node.querySelectorAll(REVEAL_SELECTOR)));
      }

      elements.forEach((element, index) => {
        if (!(element instanceof HTMLElement) || targets.has(element)) return;
        targets.add(element);
        element.classList.add("scroll-reveal-item");
        element.style.setProperty("--scroll-reveal-delay", element.dataset.scrollDelay || `${Math.min(index * 40, 240)}ms`);
        observer.observe(element);
      });
    };

    register(scope);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) register(node);
        });
      });
    });

    mutationObserver.observe(scope, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollRevealScope;
