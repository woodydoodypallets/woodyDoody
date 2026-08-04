import type { ReactNode } from "react";

/**
 * Fades content in with a staggered delay. Visibility is handled entirely
 * by CSS (see .reveal / @keyframes fadeUp in globals.css) with
 * animation-fill-mode: both, so content always ends in its normal visible
 * state — there is no JavaScript gate that can leave it stuck hidden.
 * This is now a server component: no "use client", no observer, no state.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
