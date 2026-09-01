"use client";

import { useState } from "react";
import { Bot, Play, CheckCircle, XCircle, AlertTriangle, RotateCcw, Clock } from "lucide-react";
import { AdminActionForm } from "./AdminActionForm";
import { overrideHermesDecision } from "./actions";

interface HermesDecision {
  id: string;
  target_type: string;
  target_id: string;
  action: string;
  reasoning: string;
  confidence: number;
  escalated: boolean;
  overridden_by: string | null;
  override_note: string | null;
  created_at: string;
  target_label?: string;
}

interface HermesStats {
  total: number;
  approved: number;
  rejected: number;
  escalated: number;
  overridden: number;
  avgConfidence: number;
}

export function HermesPanel({
  decisions,
  stats,
}: {
  decisions: HermesDecision[];
  stats: HermesStats;
}) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function triggerHermes() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/hermes", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        const p = data.processed || {};
        setResult(`Processed: ${p.nominees ?? 0} nominees, ${p.videos ?? 0} videos, ${p.flags ?? 0} flags`);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch {
      setResult("Failed to connect to Hermes");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats + Trigger */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Decisions" value={stats.total} />
        <StatCard label="Approved" value={stats.approved} color="text-green-600" />
        <StatCard label="Rejected" value={stats.rejected} color="text-red-600" />
        <StatCard label="Escalated" value={stats.escalated} color="text-amber-600" />
        <StatCard label="Overridden" value={stats.overridden} color="text-purple-600" />
        <StatCard label="Avg Confidence" value={`${Math.round(stats.avgConfidence * 100)}%`} />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={triggerHermes}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-md"
        >
          {running ? (
            <><Clock size={16} className="animate-spin" /> Running...</>
          ) : (
            <><Bot size={16} /> Run Hermes Now</>
          )}
        </button>
        {result && (
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
            {result}
          </span>
        )}
      </div>

      {/* Decision Log */}
      <div className="space-y-3">
        <h2 className="font-display font-bold uppercase text-civic-green-dark text-lg">
          Decision Log
        </h2>
        {!decisions.length ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Bot size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No decisions yet. Run Hermes to review pending content.</p>
          </div>
        ) : (
          decisions.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
      <p className={`text-2xl font-bold ${color || "text-gray-800"}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function DecisionCard({ decision: d }: { decision: HermesDecision }) {
  const [showOverride, setShowOverride] = useState(false);

  const actionIcon = {
    approve: <CheckCircle size={14} className="text-green-500" />,
    reject: <XCircle size={14} className="text-red-500" />,
    escalate: <AlertTriangle size={14} className="text-amber-500" />,
  }[d.action] || null;

  const actionColor = {
    approve: "bg-green-50 text-green-700 border-green-200",
    reject: "bg-red-50 text-red-700 border-red-200",
    escalate: "bg-amber-50 text-amber-700 border-amber-200",
  }[d.action] || "bg-gray-50 text-gray-700 border-gray-200";

  const confidenceColor = d.confidence >= 0.8
    ? "text-green-600"
    : d.confidence >= 0.6
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm ${d.overridden_by ? "border-l-4 border-purple-400" : ""}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${actionColor}`}>
              {actionIcon} {d.action.toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {d.target_type}
            </span>
            <span className={`text-xs font-bold ${confidenceColor}`}>
              {Math.round(d.confidence * 100)}% confidence
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{d.reasoning}</p>

          {d.overridden_by && (
            <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
              <RotateCcw size={11} /> Overridden: {d.override_note}
            </p>
          )}

          <p className="text-xs text-gray-300 mt-2">
            {new Date(d.created_at).toLocaleString("en-US", {
              month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
            })}
            {d.target_label && <> &middot; {d.target_label}</>}
          </p>
        </div>

        {!d.overridden_by && (d.action === "escalate" || d.action === "reject" || d.action === "approve") && (
          <div className="shrink-0">
            <button
              onClick={() => setShowOverride(!showOverride)}
              className="text-xs text-purple-600 font-semibold hover:text-purple-800 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Override
            </button>
          </div>
        )}
      </div>

      {showOverride && !d.overridden_by && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          {d.action !== "approve" && (
            <AdminActionForm action={overrideHermesDecision.bind(null, d.id, "approve", "Admin override: approved")}>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-green text-white text-xs font-bold hover:bg-civic-green-mid transition-colors">
                <CheckCircle size={14} /> Approve Instead
              </button>
            </AdminActionForm>
          )}
          {d.action !== "reject" && (
            <AdminActionForm action={overrideHermesDecision.bind(null, d.id, "reject", "Admin override: rejected")}>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors border border-red-200">
                <XCircle size={14} /> Reject Instead
              </button>
            </AdminActionForm>
          )}
          <button
            onClick={() => setShowOverride(false)}
            className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
