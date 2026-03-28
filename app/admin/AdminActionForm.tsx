"use client";

import { useActionState } from "react";

type ActionState = { error?: string } | null;
type BoundAction = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

export function AdminActionForm({
  action,
  children,
}: {
  action: BoundAction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction}>
      {state?.error && (
        <p className="text-xs text-red-500 mb-1">{state.error}</p>
      )}
      {children}
    </form>
  );
}
