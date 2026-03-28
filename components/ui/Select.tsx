import { SelectHTMLAttributes } from "react";

export default function Select({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} suppressHydrationWarning>
      {children}
    </select>
  );
}
