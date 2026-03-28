import { AnchorHTMLAttributes } from "react";

/**
 * Drop-in <a> replacement with suppressHydrationWarning to silence
 * attribute mismatches injected by browser extensions (e.g. Retriever).
 */
export default function A({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} suppressHydrationWarning>
      {children}
    </a>
  );
}
