import { useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiSave,
  FiShare2,
  FiLink,
} from "react-icons/fi";
import type { TestResult } from "../../services/api";
import InputField from "../../features/load-test/components/InputField";
import LoadTestCoralSubmit from "../../features/load-test/components/LoadTestCoralSubmit";
import MetricsList from "../../features/load-test/components/MetricsList";
import AIInsightPanel from "../../features/load-test/components/AIInsightPanel";

export type WorkspaceTab = {
  id: string;
  requestId: string;
  method: "GET" | "POST";
  name: string;
  folder: string;
};

type BodySub = "params" | "authorization" | "headers" | "body";
type ResponseSub = "overview" | "raw" | "headers";

type RequestMainPanelProps = {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
  urlDisplay: string;
  onUrlChange: (url: string) => void;
  onSend: () => void;
  sendLoading: boolean;
  requestId: string;
  /* POST body */
  targetUrl: string;
  onTargetUrlChange: (v: string) => void;
  numRequests: string;
  onNumRequestsChange: (v: string) => void;
  concurrency: string;
  onConcurrencyChange: (v: string) => void;
  postError: string | null;
  postOk: string | null;
  /* GET / results */
  results: TestResult[];
  resultsLoading: boolean;
  resultsError: string | null;
  selectedResultId: number | null;
  onSelectResult: (id: number) => void;
  selectedResult: TestResult | null;
  onRefreshResults: () => void;
  rawResponseJson: string;
  /* AI */
  insight: string | null;
  insightLoading: boolean;
  insightError: string | null;
  onAnalyze: () => void;
};

const methodPill = (m: "GET" | "POST") =>
  m === "GET"
    ? "text-emerald-400"
    : "text-amber-400";

function RequestMainPanel({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onNewTab,
  urlDisplay,
  onUrlChange,
  onSend,
  sendLoading,
  requestId,
  targetUrl,
  onTargetUrlChange,
  numRequests,
  onNumRequestsChange,
  concurrency,
  onConcurrencyChange,
  postError,
  postOk,
  results,
  resultsLoading,
  resultsError,
  selectedResultId,
  onSelectResult,
  selectedResult,
  onRefreshResults,
  rawResponseJson,
  insight,
  insightLoading,
  insightError,
  onAnalyze,
}: RequestMainPanelProps) {
  const [bodySub, setBodySub] = useState<BodySub>("body");
  const [responseSub, setResponseSub] = useState<ResponseSub>("overview");

  const active = tabs.find((t) => t.id === activeTabId);
  const isPostTest = requestId === "post-test";

  const bodyTabs: { key: BodySub; label: string }[] = [
    { key: "params", label: "Params" },
    { key: "authorization", label: "Authorization" },
    { key: "headers", label: "Headers" },
    { key: "body", label: "Body" },
  ];

  const responseTabs: { key: ResponseSub; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "raw", label: "Raw" },
    { key: "headers", label: "Headers" },
  ];

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#141414]">
      {/* Request tabs */}
      <div className="flex h-9 shrink-0 items-end gap-px overflow-x-auto border-b border-[#1e1e1e] bg-[#1c1c1c] px-1">
        {tabs.map((t) => {
          const sel = t.id === activeTabId;
          return (
            <div
              key={t.id}
              className={[
                "group flex min-w-[120px] max-w-[200px] shrink-0 items-center gap-1.5 rounded-t border border-b-0 px-2.5 pb-1.5 pt-1 text-[11px]",
                sel
                  ? "border-[#2d2d2d] border-b-transparent bg-[#141414]"
                  : "border-transparent bg-transparent hover:bg-[#252525]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => onTabChange(t.id)}
                className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
              >
                <span className={`shrink-0 font-semibold ${methodPill(t.method)}`}>
                  {t.method}
                </span>
                <span className="truncate text-zinc-400">{t.name}</span>
              </button>
              <button
                type="button"
                onClick={() => onTabClose(t.id)}
                className="rounded px-0.5 text-zinc-600 opacity-0 hover:text-zinc-400 group-hover:opacity-100"
                aria-label="Close tab"
              >
                ×
              </button>
            </div>
          );
        })}
        <div className="flex shrink-0 items-center gap-1 px-1 pb-1">
          <button
            type="button"
            className="rounded p-1 text-zinc-500 hover:bg-[#2d2d2d] hover:text-zinc-300"
            aria-label="Previous tab"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1 text-zinc-500 hover:bg-[#2d2d2d] hover:text-zinc-300"
            aria-label="Next tab"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNewTab}
            className="rounded p-1 text-zinc-500 hover:bg-[#2d2d2d] hover:text-zinc-300"
            aria-label="New tab"
          >
            <FiPlus className="h-4 w-4" />
          </button>
        </div>
        <div className="ml-auto flex shrink-0 items-center pr-2 pb-1">
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-[#2d2d2d] bg-[#1c1c1c] px-2 py-1 text-[11px] text-zinc-400 hover:bg-[#252525]"
          >
            No environment
            <FiChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Breadcrumb + actions */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#1e1e1e] px-4">
        <div className="flex min-w-0 items-center gap-2 text-[12px] text-zinc-400">
          <span className="rounded bg-[#2d2d2d] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
            HTTP
          </span>
          <span className="truncate">
            <span className="text-zinc-500">{active?.folder}</span>
            <span className="mx-1 text-zinc-700">/</span>
            <span className="text-zinc-200">{active?.name}</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-[#2d2d2d] bg-[#2d2d2d] px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:bg-[#353535]"
          >
            <FiSave className="h-3.5 w-3.5" />
            Save
            <FiChevronDown className="h-3 w-3 opacity-60" />
          </button>
          <button
            type="button"
            className="rounded bg-[#2d2d2d] px-3 py-1 text-[11px] font-medium text-zinc-200 hover:bg-[#353535]"
          >
            Share
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-zinc-500 hover:bg-[#2d2d2d] hover:text-zinc-300"
            aria-label="Copy link"
          >
            <FiLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* URL bar */}
      <div className="shrink-0 border-b border-[#1e1e1e] px-4 py-3">
        <div className="flex gap-2">
          <div
            className={`flex h-9 shrink-0 items-center rounded-l border border-r-0 border-[#2d2d2d] bg-[#2d2d2d] px-3 text-[12px] font-semibold ${methodPill(active?.method ?? "GET")}`}
            aria-label="HTTP method"
          >
            {active?.method ?? "GET"}
          </div>
          <input
            value={urlDisplay}
            onChange={(e) => onUrlChange(e.target.value)}
            className="h-9 min-w-0 flex-1 border border-[#2d2d2d] bg-[#1c1c1c] px-3 font-mono text-[12px] text-zinc-200 placeholder:text-zinc-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={sendLoading}
            className="h-9 shrink-0 rounded-r bg-[#ff6c37] px-6 text-[12px] font-semibold text-white hover:bg-[#e85f2f] disabled:opacity-50"
          >
            {sendLoading ? "Sending…" : "Send"}
          </button>
        </div>
        <button
          type="button"
          className="mt-2 text-[11px] text-orange-400/90 hover:text-orange-300"
        >
          Cookies
        </button>
      </div>

      {/* Request body section */}
      <div className="min-h-0 shrink-0 border-b border-[#1e1e1e]">
        <div className="flex h-8 items-center gap-4 border-b border-[#1e1e1e] px-4 text-[11px]">
          {bodyTabs.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => setBodySub(b.key)}
              className={[
                "border-b-2 pb-2 pt-1.5 transition-colors",
                bodySub === b.key
                  ? "border-orange-500 font-medium text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-400",
              ].join(" ")}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="max-h-[min(360px,45vh)] overflow-y-auto p-4">
          {bodySub === "body" && isPostTest && (
            <div className="mx-auto max-w-2xl space-y-5">
              {postError && (
                <p className="rounded-lg border border-red-500/25 bg-red-950/30 px-3 py-2 text-[12px] text-red-300">
                  {postError}
                </p>
              )}
              {postOk && !postError && (
                <p className="rounded-lg border border-emerald-500/20 bg-emerald-950/25 px-3 py-2 text-[12px] text-emerald-300/90">
                  {postOk}
                </p>
              )}
              <InputField
                variant="coral"
                label="Target URL"
                placeholder="https://api.example.com/health"
                name="targetUrl"
                value={targetUrl}
                onChange={(e) => onTargetUrlChange(e.target.value)}
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField
                  variant="coral"
                  label="Number of request"
                  name="numRequests"
                  type="number"
                  min={1}
                  value={numRequests}
                  onChange={(e) => onNumRequestsChange(e.target.value)}
                />
                <InputField
                  variant="coral"
                  label="Concurrency"
                  name="concurrency"
                  type="number"
                  min={1}
                  value={concurrency}
                  onChange={(e) => onConcurrencyChange(e.target.value)}
                />
              </div>
              <LoadTestCoralSubmit
                disabled={
                  !targetUrl.trim() ||
                  !numRequests ||
                  !concurrency ||
                  Number(numRequests) <= 0 ||
                  Number(concurrency) <= 0
                }
                loading={sendLoading}
                onClick={onSend}
                label="Submit"
              />
            </div>
          )}
          {bodySub === "body" && !isPostTest && (
            <p className="text-center text-[12px] text-zinc-600">
              No body for this request. Click <strong className="text-zinc-500">Send</strong>{" "}
              to fetch results.
            </p>
          )}
          {bodySub !== "body" && (
            <p className="text-[12px] text-zinc-600">
              {bodySub === "params" && "Query params — optional for these requests."}
              {bodySub === "authorization" && "Authorization — configure when your gateway requires it."}
              {bodySub === "headers" && "Headers — defaults are fine for local gateway calls."}
            </p>
          )}
        </div>
      </div>

      {/* Response */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-8 shrink-0 items-center gap-4 border-b border-[#1e1e1e] px-4 text-[11px]">
          <span className="font-medium text-zinc-500">Response</span>
          {responseTabs.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => setResponseSub(b.key)}
              className={[
                "border-b-2 pb-2 pt-1.5",
                responseSub === b.key
                  ? "border-orange-500 font-medium text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-400",
              ].join(" ")}
            >
              {b.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onRefreshResults}
            disabled={resultsLoading}
            className="ml-auto text-[11px] text-orange-400/90 hover:text-orange-300 disabled:opacity-40"
          >
            Refresh data
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {resultsError && (
            <p className="mb-4 rounded border border-amber-500/20 bg-amber-950/20 px-3 py-2 text-[12px] text-amber-200">
              {resultsError}
            </p>
          )}

          {responseSub === "raw" && (
            <pre className="rounded border border-[#2d2d2d] bg-[#0d0d0d] p-4 font-mono text-[11px] leading-relaxed text-zinc-400">
              {rawResponseJson}
            </pre>
          )}

          {responseSub === "headers" && (
            <pre className="rounded border border-[#2d2d2d] bg-[#0d0d0d] p-4 font-mono text-[11px] text-zinc-500">
              {`HTTP/1.1 200 OK\nContent-Type: application/json`}
            </pre>
          )}

          {responseSub === "overview" && (
            <div className="space-y-6">
              {results.length === 0 && !resultsLoading && !isPostTest && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 text-zinc-600" aria-hidden>
                    <svg
                      width="120"
                      height="100"
                      viewBox="0 0 120 100"
                      fill="none"
                      className="mx-auto opacity-40"
                    >
                      <ellipse cx="60" cy="88" rx="40" ry="6" fill="#2d2d2d" />
                      <path
                        d="M45 75 L55 45 L65 45 L75 75 Z"
                        stroke="#52525b"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <circle cx="60" cy="38" r="12" stroke="#52525b" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-zinc-500">
                    Click Send to get a response
                  </p>
                </div>
              )}

              {(results.length > 0 || resultsLoading) && (
                <>
                  <div className="overflow-hidden rounded border border-[#2d2d2d]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] border-collapse text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-[#2d2d2d] bg-[#1c1c1c] text-zinc-500">
                            <th className="px-3 py-2 font-medium">ID</th>
                            <th className="px-3 py-2 font-medium">URL</th>
                            <th className="px-3 py-2 text-right font-medium">Req</th>
                            <th className="px-3 py-2 text-right font-medium">Avg</th>
                            <th className="px-3 py-2 text-right font-medium">P95</th>
                            <th className="px-3 py-2 text-right font-medium">RPS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultsLoading && results.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                                Loading…
                              </td>
                            </tr>
                          )}
                          {results.map((row) => {
                            const sel = row.id === selectedResultId;
                            return (
                              <tr
                                key={row.id}
                                onClick={() => onSelectResult(row.id)}
                                className={[
                                  "cursor-pointer border-b border-[#252525]",
                                  sel ? "bg-[#2d2d2d]" : "hover:bg-[#1f1f1f]",
                                ].join(" ")}
                              >
                                <td className="px-3 py-2 font-mono text-zinc-500">{row.id}</td>
                                <td className="max-w-[200px] truncate px-3 py-2 text-zinc-300">
                                  {row.url}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-zinc-500">
                                  {row.total_requests}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-zinc-500">
                                  {row.avg_latency.toFixed(1)}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-zinc-500">
                                  {row.p95_latency.toFixed(1)}
                                </td>
                                <td className="px-3 py-2 text-right font-mono text-zinc-300">
                                  {row.rps.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <MetricsList result={selectedResult} />
                    <AIInsightPanel
                      insight={insight}
                      loading={insightLoading}
                      error={insightError}
                      onAnalyze={onAnalyze}
                      analyzeDisabled={selectedResultId === null}
                    />
                  </div>
                </>
              )}

              {isPostTest && postOk && results.length === 0 && (
                <p className="text-[12px] text-zinc-500">
                  Job queued. Switch to <strong className="text-zinc-400">Get results</strong>{" "}
                  and Send to poll the results table.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestMainPanel;
