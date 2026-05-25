import { Link } from "@tanstack/react-router";
import { FileText, History, X, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import type { Report } from "@/lib/supabase";

export function HistorySidebar({ reports, currentId }: { reports: Report[]; currentId?: string }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Persist desktop collapsed state
  useEffect(() => {
    const v = localStorage.getItem("history-collapsed");
    if (v === "1") setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("history-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed left-4 bottom-4 z-40 glass rounded-full px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-white/5 transition-colors"
      >
        <History size={14} className="text-accent" /> History
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70" onClick={() => setOpen(false)}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-[280px] bg-background border-r border-border/60 p-4 overflow-y-auto animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">History</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={16}/></button>
            </div>
            <Items reports={reports} currentId={currentId} onPick={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-border/60 sticky top-[69px] self-start max-h-[calc(100vh-69px)] ${collapsed ? "w-14" : "w-[260px]"}`}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          {!collapsed && (
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <History size={12} className="text-accent" /> History
            </h3>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-white/5 transition ${collapsed ? "mx-auto" : ""}`}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft size={14} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto px-2 pb-4 ${collapsed ? "px-1" : ""}`}>
          {collapsed ? <ItemsCollapsed reports={reports} currentId={currentId} /> : <Items reports={reports} currentId={currentId} />}
        </div>
      </aside>
    </>
  );
}

function Items({ reports, currentId, onPick }: { reports: Report[]; currentId?: string; onPick?: () => void }) {
  if (reports.length === 0) {
    return <p className="text-xs text-muted-foreground px-2">No reports yet.</p>;
  }
  return (
    <div className="space-y-1">
      {reports.map((r) => {
        const flagged = r.analysis?.values?.filter(v => v.status !== "normal").length ?? 0;
        const active = r.id === currentId;
        return (
          <Link
            key={r.id}
            to="/report/$id"
            params={{ id: r.id }}
            onClick={onPick}
            className={`block px-3 py-2.5 rounded-xl text-sm transition group ${active ? "bg-accent/10 border border-accent/30" : "hover:bg-white/[0.04] border border-transparent"}`}
          >
            <div className="flex items-start gap-2">
              <FileText size={13} className={`mt-0.5 shrink-0 ${active ? "text-accent" : "text-muted-foreground group-hover:text-accent"}`} />
              <div className="min-w-0 flex-1">
                <div className={`truncate text-[13px] ${active ? "text-foreground font-medium" : "text-foreground/90"}`}>
                  {r.title || r.file_name || "Untitled"}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  {flagged > 0 && (
                    <span className="inline-flex items-center gap-1 text-warning">
                      <span className="w-1 h-1 rounded-full bg-warning"/> {flagged}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ItemsCollapsed({ reports, currentId }: { reports: Report[]; currentId?: string }) {
  return (
    <div className="space-y-1">
      {reports.slice(0, 20).map((r) => {
        const active = r.id === currentId;
        const flagged = r.analysis?.values?.filter(v => v.status !== "normal").length ?? 0;
        return (
          <Link
            key={r.id}
            to="/report/$id"
            params={{ id: r.id }}
            title={r.title || r.file_name}
            className={`grid place-items-center w-10 h-10 mx-auto rounded-xl transition relative ${active ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
          >
            <FileText size={14}/>
            {flagged > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-warning"/>}
          </Link>
        );
      })}
    </div>
  );
}
