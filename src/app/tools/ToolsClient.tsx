"use client";

import { useState } from "react";
import { Tool, Department } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { cn, DEPARTMENTS } from "@/lib/utils";

type ToolStatus = "Access Granted" | "Restricted" | "Open";

const TAB_LABELS: Record<Department, string> = {
  ALL: "All Systems",
  IT: "IT",
  ENGINEERING: "Engineering",
  PEOPLE: "HR & Benefits",
  FINANCE: "Finance",
  GTM: "GTM",
};

const DEPT_ICONS: Record<Department, string> = {
  ALL: "apps",
  IT: "computer",
  ENGINEERING: "code",
  PEOPLE: "group",
  FINANCE: "payments",
  GTM: "campaign",
};

const STATUS_STYLES: Record<ToolStatus, string> = {
  "Access Granted": "bg-success-green/10 text-success-green",
  "Restricted": "bg-error/10 text-error",
  "Open": "bg-tertiary/10 text-tertiary",
};

function getToolStatus(tool: Tool): ToolStatus {
  if (tool.department === "FINANCE") return "Restricted";
  if (tool.department === "IT" || tool.department === "ENGINEERING") return "Access Granted";
  return "Open";
}

function getToolIcon(tool: Tool): string {
  return DEPT_ICONS[tool.department] ?? "apps";
}

interface Props {
  initialData: Tool[];
}

export function ToolsClient({ initialData }: Props) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Department>("ALL");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const featuredTools = initialData.slice(0, 2);

  const filtered = initialData.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(q) ||
      t.ownerName.toLowerCase().includes(q);
    const matchesDept = activeTab === "ALL" || t.department === activeTab;
    return matchesSearch && matchesDept;
  });

  const showFeatured = !search && activeTab === "ALL" && featuredTools.length > 0;

  return (
    <div className="p-6 lg:p-10 bg-background min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-lg text-sm font-mono"
        >
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold -tracking-[0.01em] text-on-surface">
            Internal Directory
          </h1>
          <p className="text-[16px] text-on-surface-variant mt-1 max-w-2xl">
            Access all corporate tools, system platforms, and support systems in one
            central place. Manage your permissions and discover new resources.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs shrink-0">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search tools or owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tools"
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-sans"
          />
        </div>
      </div>

      {/* Featured Platform Cards */}
      {showFeatured && (
        <section aria-label="Featured Platforms" className="mb-8">
          <h2 className="text-[13px] font-mono text-on-surface-variant uppercase tracking-wider mb-4">
            Featured Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTools.map((tool) => {
              const status = getToolStatus(tool);
              return (
                <div
                  key={tool.id}
                  className="bg-primary/5 rounded-xl border border-outline-variant p-6 flex flex-col gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shrink-0">
                      <Icon
                        name={getToolIcon(tool)}
                        className="text-on-primary text-[24px]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[18px] font-semibold text-on-surface">
                          {tool.name}
                        </h3>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[11px] font-mono font-medium",
                            STATUS_STYLES[status]
                          )}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-[14px] text-on-surface-variant mt-1 line-clamp-2">
                        {tool.description ||
                          `Core ${TAB_LABELS[tool.department]} platform for the organization.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 bg-primary text-on-primary rounded-lg text-[14px] font-mono font-medium hover:opacity-90 transition-opacity"
                      >
                        Go to Dashboard
                      </a>
                    ) : (
                      <button
                        onClick={() => showToast(`Opening ${tool.name} login…`)}
                        className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-[14px] font-mono font-medium hover:opacity-90 transition-opacity"
                      >
                        View Login
                      </button>
                    )}
                    <button
                      onClick={() => showToast(`Access request sent for ${tool.name}`)}
                      className="flex-1 py-2 border border-outline-variant text-on-surface rounded-lg text-[14px] font-mono font-medium hover:bg-surface-container transition-colors"
                    >
                      Request Access
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Department Tabs */}
      <div
        role="tablist"
        aria-label="Filter by department"
        className="flex flex-wrap gap-2 mb-6"
      >
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            role="tab"
            aria-selected={activeTab === dept}
            onClick={() => setActiveTab(dept)}
            className={cn(
              "px-4 py-2 rounded-full text-[14px] font-mono font-medium transition-colors",
              activeTab === dept
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            )}
          >
            {TAB_LABELS[dept]}
          </button>
        ))}
      </div>

      {/* System Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center" role="status">
          <Icon
            name="search_off"
            className="text-[48px] text-on-surface-variant mb-4"
          />
          <p className="text-[18px] font-semibold text-on-surface mb-1">
            No tools found
          </p>
          <p className="text-[14px] text-on-surface-variant">
            Can&apos;t find &ldquo;{search}&rdquo;? It may not be listed yet.
            <br />
            Contact IT:{" "}
            <a href="mailto:it@company.com" className="text-primary hover:underline">
              it@company.com
            </a>
          </p>
        </div>
      ) : (
        <div
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map((tool) => {
            const status = getToolStatus(tool);
            return (
              <div
                key={tool.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 flex flex-col hover:border-primary transition-colors duration-200"
              >
                {/* Top: icon + name + status badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 flex-1">
                    <Icon
                      name={getToolIcon(tool)}
                      className="text-primary text-[32px]"
                    />
                    <h3 className="font-semibold text-[18px] mt-2 text-on-surface">
                      {tool.name}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "ml-2 shrink-0 px-2 py-1 rounded-full text-[12px] font-mono font-medium",
                      STATUS_STYLES[status]
                    )}
                  >
                    {status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[14px] text-on-surface-variant mb-4 line-clamp-2 flex-1">
                  {tool.description || `${tool.name} — internal platform tool.`}
                </p>

                {/* Owner */}
                <p className="text-[12px] text-on-surface-variant font-mono mb-4">
                  Owner: {tool.ownerName}
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-2">
                  {tool.url ? (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-primary text-on-primary rounded-lg text-[14px] font-mono font-medium hover:opacity-90 transition-opacity"
                    >
                      Go to Tool
                    </a>
                  ) : (
                    <span className="flex-1 text-center py-2 bg-surface-container-low text-on-surface-variant rounded-lg text-[14px] font-mono font-medium cursor-default">
                      No URL
                    </span>
                  )}
                  <button
                    onClick={() =>
                      showToast(`Access request sent for ${tool.name}`)
                    }
                    className="flex-1 py-2 border border-outline-variant text-on-surface rounded-lg text-[14px] font-mono font-medium hover:bg-surface-container transition-colors"
                  >
                    Request Access
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
