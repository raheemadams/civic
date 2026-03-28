"use client";

import { useActionState } from "react";
import { createTopicGroup } from "./actions";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export function CreateGroupForm() {
  const [state, formAction] = useActionState(createTopicGroup, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="text-xs text-red-500">{state.error}</p>
      )}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
          Group Name
        </label>
        <Input
          type="text"
          name="name"
          required
          placeholder="e.g. Education Reform NG"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
          Description
          <span className="text-gray-400 font-normal normal-case ml-1">(optional)</span>
        </label>
        <Textarea
          name="description"
          rows={3}
          placeholder="What is this group about?"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green resize-none"
        />
      </div>
      <Button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-civic-green text-white font-bold text-sm hover:bg-civic-green-mid transition-colors"
      >
        Create Group →
      </Button>
    </form>
  );
}
