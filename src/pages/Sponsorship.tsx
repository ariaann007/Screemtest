import { useState } from "react";
import { Link } from "react-router-dom";
import { DEMO_CASES, DEMO_WORKERS } from "@/data/demo";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { SLATimer } from "@/components/SLATimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ChevronRight, ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import CosWizard from "@/components/sponsorship/CosWizard";
import { ReportMigrant } from "@/components/reporting/ReportMigrant";
import { ReportBusiness } from "@/components/reporting/ReportBusiness";

export default function SponsorshipPage() {
  const { currentTenant } = useApp();
  const [view, setView] = useState<"landing" | "cos" | "migrant" | "business">("landing");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showWizard, setShowWizard] = useState<false | "list" | "draft" | "assisted">(false);

  // Filter logic for CoS
  const cases = DEMO_CASES.filter(c =>
    c.type === "cos_draft" &&
    (currentTenant ? c.tenantId === currentTenant.id : true)
  );

  const filtered = cases.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.caseNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (view === "landing") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Sponsorship</h1>
          <p className="text-sm text-muted-foreground">Manage CoS drafts and UKVI reporting obligations</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl">
          <button onClick={() => setView("cos")} className="rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 p-5 text-left transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-xl">📄</span>
            </div>
            <h3 className="font-semibold">Certificate of Sponsorship</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage new sponsorships and CoS drafts</p>
          </button>
          <button onClick={() => setView("migrant")} className="rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 p-5 text-left transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-xl">👤</span>
            </div>
            <h3 className="font-semibold">Report a Migrant</h3>
            <p className="text-sm text-muted-foreground mt-1">Stop, continue, or report changes for a worker</p>
          </button>
          <button onClick={() => setView("business")} className="rounded-xl border-2 border-border hover:border-secondary hover:bg-secondary/5 p-5 text-left transition-colors">
            <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
              <span className="text-xl">🏢</span>
            </div>
            <h3 className="font-semibold">Report a Business</h3>
            <p className="text-sm text-muted-foreground mt-1">Organisation changes, AO replacements, updates</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => { setView("landing"); setShowWizard(false); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Sponsorship Options
          </button>
          <h1 className="text-2xl font-bold">
            {view === "cos" && "Certificate of Sponsorship"}
            {view === "migrant" && "Report a Migrant"}
            {view === "business" && "Report a Business"}
          </h1>
        </div>
      </div>

      {view === "cos" && (
        <div className="space-y-4">
          {showWizard === "draft" || showWizard === "assisted" ? (
            <div className="space-y-4 animate-fade-in mt-4">
              <button onClick={() => setShowWizard(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to options
              </button>
              <CosWizard onComplete={() => setShowWizard(false)} initialPath={showWizard === "assisted" ? "assisted" : "client"} />
            </div>
          ) : showWizard === "list" ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setShowWizard(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to options
                </button>
                <Button onClick={() => setShowWizard("draft")}>
                  <Plus className="h-4 w-4 mr-2" /> New CoS Draft
                </Button>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search cases…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="awaiting_client">Awaiting Client</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="filed">Filed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cases table */}
              <div className="rounded-xl border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-3 font-medium text-muted-foreground">Case</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Worker</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Due Date</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">SLA</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No cases found</td></tr>
                    )}
                    {filtered.map(c => {
                      const worker = DEMO_WORKERS.find(w => w.id === c.workerId);
                      return (
                        <tr key={c.id} className={cn("border-b last:border-0 hover:bg-muted/20 transition-colors", c.isOverdue && "overdue-indicator")}>
                          <td className="p-3">
                            <p className="font-medium">{c.title}</p>
                            <p className="text-xs text-muted-foreground">{c.caseNumber}</p>
                          </td>
                          <td className="p-3">
                            {worker ? (
                              <span className="text-sm">{worker.givenName} {worker.familyName}</span>
                            ) : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="p-3"><StatusBadge status={c.status} /></td>
                          <td className="p-3 text-sm">{c.dueDate ? new Date(c.dueDate).toLocaleDateString("en-GB") : "—"}</td>
                          <td className="p-3">{c.dueDate && <SLATimer dueDate={c.dueDate} isOverdue={c.isOverdue} compact />}</td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/sponsorship/${c.id}`}><ChevronRight className="h-4 w-4" /></Link>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mt-6">
              <button
                onClick={() => setShowWizard("draft")}
                className="rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 p-5 text-left transition-colors flex flex-col items-start"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Prepare New CoS Draft</h3>
                <p className="text-sm text-muted-foreground">You complete the full CoS pre-draft form yourself.</p>
              </button>

              <button
                onClick={() => setShowWizard("assisted")}
                className="rounded-xl border-2 border-border hover:border-secondary hover:bg-secondary/5 p-5 text-left transition-colors flex flex-col items-start"
              >
                <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-semibold mb-1">Ask Screem to Prepare</h3>
                <p className="text-sm text-muted-foreground">Upload details and we'll prepare the CoS Draft for you.</p>
              </button>

              <button
                onClick={() => setShowWizard("list")}
                className="rounded-xl border-2 border-border hover:border-accent hover:bg-accent/5 p-5 text-left transition-colors flex flex-col items-start"
              >
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Search className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold mb-1">View CoS Drafts</h3>
                <p className="text-sm text-muted-foreground">View and manage your current and previous drafted CoS.</p>
              </button>
            </div>
          )}
        </div>
      )}

      {view === "migrant" && <ReportMigrant />}
      {view === "business" && <ReportBusiness />}
    </div>
  );
}
