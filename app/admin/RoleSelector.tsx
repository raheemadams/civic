"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "./actions";
import Select from "@/components/ui/Select";

export function RoleSelector({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const roles = ["user", "moderator", "admin", "super_admin"];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const role = e.target.value;
    setError("");
    startTransition(async () => {
      const result = await updateUserRole(userId, role);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Select
        defaultValue={currentRole}
        disabled={isPending}
        onChange={handleChange}
        className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white focus:outline-none disabled:opacity-50"
      >
        {roles.map((r) => (
          <option key={r} value={r}>{r.replace("_", " ")}</option>
        ))}
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {isPending && <p className="text-xs text-gray-400">Saving…</p>}
    </div>
  );
}
