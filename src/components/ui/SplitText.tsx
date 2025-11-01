"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register plugins with client check
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);
}

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "words",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!mounted || !ref.current || !text) return;

      try {
        const el = ref.current;

        // Kill previous animations
        gsap.killTweensOf(el.children);

        // Create split text
        const splitInstance = new GSAPSplitText(el, {
          type: splitType,
          smartWrap: true,
          reduceWhiteSpace: false,
        });

        // Get targets
        let targets: Element[] = [];
        if (splitType === "chars" && splitInstance.chars?.length) {
          targets = splitInstance.chars;
        } else if (splitType === "words" && splitInstance.words?.length) {
          targets = splitInstance.words;
        } else if (splitType === "lines" && splitInstance.lines?.length) {
          targets = splitInstance.lines;
        } else {
          targets = splitInstance.words || splitInstance.chars || [];
        }

        if (targets.length === 0) return;

        // Set initial state
        gsap.set(targets, from);

        // Create timeline with scroll trigger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: `top ${(1 - threshold) * 100}%${rootMargin}`,
            once: true,
            markers: false,
          },
        });

        // Add animation
        tl.to(targets, {
          ...to,
          duration,
          ease,
          stagger: {
            amount: (delay / 1000) * targets.length,
          },
          onComplete: () => {
            onLetterAnimationComplete?.();
          },
        });

        // Cleanup
        return () => {
          tl.kill();
          try {
            splitInstance.revert();
          } catch (e) {
            // Ignore
          }
        };
      } catch (error) {
        console.warn("SplitText error:", error);
      }
    },
    {
      dependencies: [
        text,
        mounted,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
      ],
    }
  );

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    overflow: "hidden",
  };
  const classes = `split-parent overflow-hidden ${className}`;

  const renderTag = () => {
    const props = {
      ref: ref as React.RefObject<any>,
      style,
      className: classes,
      children: text,
    };

    if (tag === "h1") return <h1 {...props} />;
    if (tag === "h2") return <h2 {...props} />;
    if (tag === "h3") return <h3 {...props} />;
    if (tag === "h4") return <h4 {...props} />;
    if (tag === "h5") return <h5 {...props} />;
    if (tag === "h6") return <h6 {...props} />;
    if (tag === "span") return <span {...props} />;
    return <p {...props} />;
  };

  return renderTag();
};

export default SplitText;
