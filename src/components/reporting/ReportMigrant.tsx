import { useState } from "react";
import { DEMO_WORKERS, DEMO_COUNTRIES } from "@/data/demo";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const REPORT_TYPES = [
  { id: "stop", label: "Stop sponsoring worker", desc: "The sponsorship has ended" },
  { id: "continue", label: "Continue sponsoring worker", desc: "Absence without permission" },
  { id: "change", label: "Change in worker circumstances", desc: "Location, salary, or role changes" },
  { id: "withdraw", label: "Previous notification withdrawn", desc: "Retract an earlier report" },
];

const STOP_REASONS = [
  "Failed to take up position", "Resigned after commencing", "Dismissed", "Made redundant",
  "Work completed early", "Moved to another sponsor", "Moved to another immigration category",
  "Extended unpaid leave", "Left UK/offshore",
];
const CHANGE_TYPES = ["Work location changed", "Job title/duties changed", "Salary/hours changed"];

export function ReportMigrant() {
  const { currentTenant } = useApp();
  const [view, setView] = useState<"worker_select" | "migrant">("worker_select");
  const [reportType, setReportType] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [workerSearch, setWorkerSearch] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const workers = DEMO_WORKERS.filter(w => currentTenant ? w.tenantId === currentTenant.id : true);
  const filteredWorkers = workers.filter(w =>
    !workerSearch || `${w.givenName} ${w.familyName}`.toLowerCase().includes(workerSearch.toLowerCase())
  );

  const update = (k: string, v: string) => setFormData(p => ({ ...p, [k]: v }));
  const selectedWorkerObj = DEMO_WORKERS.find(w => w.id === selectedWorker);

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-bold mb-2">Report Submitted</h2>
        <p className="text-muted-foreground text-sm mb-6">Your migrant report has been submitted and assigned to a Screem caseworker.</p>
        <Button onClick={() => { setSubmitted(false); setView("worker_select"); setFormData({}); setSelectedWorker(null); setReportType(""); }}>
          Submit Another Report
        </Button>
      </div>
    );
  }

  if (view === "worker_select") {
    return (
      <div className="max-w-xl space-y-5 animate-fade-in mt-6">
        <div><h2 className="text-xl font-bold">Report Migrant</h2><p className="text-sm text-muted-foreground">Select the worker to report on</p></div>
        <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search workers…" className="pl-9" value={workerSearch} onChange={e => setWorkerSearch(e.target.value)} /></div>
        <div className="space-y-2">
          {filteredWorkers.map(w => (
            <button key={w.id} onClick={() => { setSelectedWorker(w.id); setView("migrant"); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-left">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {w.givenName[0]}{w.familyName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{w.givenName} {w.familyName}</p>
                <p className="text-xs text-muted-foreground">{w.jobTitle} · Visa expires {w.visaExpiry ? new Date(w.visaExpiry).toLocaleDateString("en-GB") : "N/A"}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
          {filteredWorkers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg">No workers found</div>
          )}
        </div>
      </div>
    );
  }

  if (view === "migrant" && selectedWorkerObj) {
    if (!reportType) {
      return (
        <div className="max-w-xl space-y-5 animate-fade-in mt-6">
          <button onClick={() => setView("worker_select")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to workers</button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {selectedWorkerObj.givenName[0]}{selectedWorkerObj.familyName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedWorkerObj.givenName} {selectedWorkerObj.familyName}</h2>
              <p className="text-sm text-muted-foreground">{selectedWorkerObj.jobTitle} · CoS: {selectedWorkerObj.cosReference}</p>
            </div>
          </div>
          <p className="text-sm font-medium">Choose report type:</p>
          <div className="space-y-2">
            {REPORT_TYPES.map(r => (
              <button key={r.id} onClick={() => setReportType(r.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-xl space-y-5 animate-fade-in mt-6">
        <button onClick={() => setReportType("")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to report types</button>
        <h2 className="text-xl font-bold">{REPORT_TYPES.find(r => r.id === reportType)?.label}</h2>

        <div className="space-y-4">
          {reportType === "stop" && (<>
            <div><Label>Reason *</Label>
              <Select value={formData.reason ?? ""} onValueChange={v => update("reason", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select reason…" /></SelectTrigger>
                <SelectContent>{STOP_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date Sponsorship Ended *</Label><Input type="date" value={formData.endDate ?? ""} onChange={e => update("endDate", e.target.value)} className="mt-1" /></div>
            <div><Label>Detailed Explanation</Label><Textarea value={formData.explanation ?? ""} onChange={e => update("explanation", e.target.value)} className="mt-1" rows={4} /></div>
            <div><Label>Last Known Address</Label><Input placeholder="Address" value={formData.lastAddress ?? ""} onChange={e => update("lastAddress", e.target.value)} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={formData.phone ?? ""} onChange={e => update("phone", e.target.value)} className="mt-1" /></div>
              <div><Label>Email</Label><Input type="email" value={formData.email ?? ""} onChange={e => update("email", e.target.value)} className="mt-1" /></div>
            </div>
          </>)}

          {reportType === "continue" && (<>
            <div><Label>Why are you continuing to sponsor?</Label><Textarea value={formData.reason ?? ""} onChange={e => update("reason", e.target.value)} className="mt-1" rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Worker Start Date</Label><Input type="date" value={formData.startDate ?? ""} onChange={e => update("startDate", e.target.value)} className="mt-1" /></div>
              <div><Label>Date Absent Without Permission</Label><Input type="date" value={formData.absentDate ?? ""} onChange={e => update("absentDate", e.target.value)} className="mt-1" /></div>
            </div>
            <div><Label>Is worker offshore?</Label>
              <Select value={formData.offshore ?? ""} onValueChange={v => update("offshore", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Full Details</Label><Textarea value={formData.details ?? ""} onChange={e => update("details", e.target.value)} className="mt-1" rows={4} /></div>
          </>)}

          {reportType === "change" && (<>
            <div><Label>Change Type *</Label>
              <Select value={formData.changeType ?? ""} onValueChange={v => update("changeType", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select change…" /></SelectTrigger>
                <SelectContent>{CHANGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date of Change *</Label><Input type="date" value={formData.changeDate ?? ""} onChange={e => update("changeDate", e.target.value)} className="mt-1" /></div>
            <div><Label>Details</Label><Textarea value={formData.details ?? ""} onChange={e => update("details", e.target.value)} className="mt-1" rows={4} /></div>
          </>)}

          {reportType === "withdraw" && (<>
            <div><Label>Date of Previous Notification *</Label><Input type="date" value={formData.prevDate ?? ""} onChange={e => update("prevDate", e.target.value)} className="mt-1" /></div>
            <div><Label>Details</Label><Textarea value={formData.details ?? ""} onChange={e => update("details", e.target.value)} className="mt-1" rows={4} /></div>
          </>)}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm mb-3">Report Filed?</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Filed Date</Label><Input type="date" value={formData.filedDate ?? ""} onChange={e => update("filedDate", e.target.value)} className="mt-1" /></div>
          </div>
          <div className="mt-3"><Label>Outcome Notes</Label><Textarea value={formData.outcome ?? ""} onChange={e => update("outcome", e.target.value)} className="mt-1" rows={2} /></div>
          <div className="mt-3 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors">
            <p className="text-sm text-muted-foreground">📎 Attach proof of submission</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => setReportType("")}>Cancel</Button>
          <Button className="flex-1" onClick={() => setSubmitted(true)}>Submit Report</Button>
        </div>
      </div>
    );
  }

  return null;
}
