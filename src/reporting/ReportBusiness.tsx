import { useState } from "react";
import { DEMO_COUNTRIES } from "@/data/demo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const BIZ_OPTIONS = [
    { id: "replace_ao", label: "Replace Authorising Officer", icon: "🔄" },
    { id: "amend_ao", label: "Amend AO Details", icon: "✏️" },
    { id: "replace_contact", label: "Replace Key Contact Person", icon: "👤" },
    { id: "amend_org", label: "Amend Organisation Details", icon: "🏢" },
    { id: "other", label: "Other Sponsor Changes", icon: "📋" },
];
const ORG_REASONS = [
    "Merger", "Demerger", "Takeover", "Acquisition", "Sale of business", "Rebranding",
    "Business incorporated under new name", "Branch closed", "Downsized premises",
    "Expanded premises", "Lease expired", "Moved premises", "Property reason change",
    "Update company house number", "Other",
];

export function ReportBusiness() {
    const [reportType, setReportType] = useState("");
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const update = (k: string, v: string) => setFormData(p => ({ ...p, [k]: v }));

    if (submitted) {
        return (
            <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
                <div className="h-16 w-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-xl font-bold mb-2">Report Submitted</h2>
                <p className="text-muted-foreground text-sm mb-6">Your business report has been submitted and assigned to a Screem caseworker.</p>
                <Button onClick={() => { setSubmitted(false); setFormData({}); setReportType(""); }}>
                    Submit Another Report
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl space-y-5 animate-fade-in mt-6">
            <div><h2 className="text-xl font-bold">Report Business</h2><p className="text-sm text-muted-foreground">Organisation and sponsor licence changes</p></div>
            {!reportType ? (
                <div className="space-y-2">
                    {BIZ_OPTIONS.map(o => (
                        <button key={o.id} onClick={() => setReportType(o.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border hover:border-secondary hover:bg-secondary/5 transition-colors text-left">
                            <span className="text-xl">{o.icon}</span>
                            <span className="font-medium">{o.label}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
                        </button>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setReportType("")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" />Back
                        </button>
                        <h2 className="font-semibold">{BIZ_OPTIONS.find(o => o.id === reportType)?.label}</h2>
                    </div>

                    {(reportType === "replace_ao" || reportType === "amend_ao") && (
                        <div className="rounded-lg bg-info-light border border-info/20 p-4 text-sm text-info">
                            ℹ This will create an internal support ticket with instructions for Screem to process the AO change.
                            <Button size="sm" className="mt-3 w-full" onClick={() => setSubmitted(true)}>Create Support Ticket</Button>
                        </div>
                    )}

                    {reportType === "replace_contact" && (<>
                        <div className="grid grid-cols-3 gap-2">
                            <div><Label>Title</Label><Input value={formData.title ?? ""} onChange={e => update("title", e.target.value)} className="mt-1" /></div>
                            <div><Label>Given Name</Label><Input value={formData.givenName ?? ""} onChange={e => update("givenName", e.target.value)} className="mt-1" /></div>
                            <div><Label>Family Name</Label><Input value={formData.familyName ?? ""} onChange={e => update("familyName", e.target.value)} className="mt-1" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Email</Label><Input type="email" value={formData.email ?? ""} onChange={e => update("email", e.target.value)} className="mt-1" /></div>
                            <div><Label>Phone</Label><Input value={formData.phone ?? ""} onChange={e => update("phone", e.target.value)} className="mt-1" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Date of Birth</Label><Input type="date" value={formData.dob ?? ""} onChange={e => update("dob", e.target.value)} className="mt-1" /></div>
                            <div><Label>Nationality</Label>
                                <Select value={formData.nationality ?? ""} onValueChange={v => update("nationality", v)}>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                                    <SelectContent>{DEMO_COUNTRIES.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div><Label>Position in Organisation</Label><Input value={formData.position ?? ""} onChange={e => update("position", e.target.value)} className="mt-1" /></div>
                        <div><Label>Has NI Number?</Label>
                            <Select value={formData.hasNI ?? ""} onValueChange={v => update("hasNI", v)}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                            </Select>
                        </div>
                        {formData.hasNI === "yes" && <div><Label>NI Number</Label><Input value={formData.niNumber ?? ""} onChange={e => update("niNumber", e.target.value)} className="mt-1" /></div>}
                        <div><Label>Criminal Convictions?</Label>
                            <Select value={formData.convictions ?? ""} onValueChange={v => update("convictions", v)}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                            </Select>
                        </div>
                        {formData.convictions === "yes" && <div><Label>Details</Label><Textarea value={formData.convDetails ?? ""} onChange={e => update("convDetails", e.target.value)} className="mt-1" rows={3} /></div>}
                        <Button className="w-full" onClick={() => setSubmitted(true)}>Submit Report</Button>
                    </>)}

                    {reportType === "amend_org" && (<>
                        <div><Label>Reason *</Label>
                            <Select value={formData.orgReason ?? ""} onValueChange={v => update("orgReason", v)}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select reason…" /></SelectTrigger>
                                <SelectContent>{ORG_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        {formData.orgReason === "Other" && <div><Label>Reason (max 250 chars)</Label><Input value={formData.orgOtherReason ?? ""} onChange={e => update("orgOtherReason", e.target.value.slice(0, 250))} className="mt-1" /></div>}
                        <div><Label>Date of Change</Label><Input type="date" value={formData.changeDate ?? ""} onChange={e => update("changeDate", e.target.value)} className="mt-1" /></div>
                        <div><Label>Explanation (max 2000 chars)</Label><Textarea value={formData.explanation ?? ""} onChange={e => update("explanation", e.target.value.slice(0, 2000))} className="mt-1" rows={5} /><p className="text-xs text-muted-foreground mt-1">{(formData.explanation ?? "").length}/2000</p></div>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/30"><p className="text-sm text-muted-foreground">📎 Attach evidence documents</p></div>
                        <Button className="w-full" onClick={() => setSubmitted(true)}>Submit Report</Button>
                    </>)}
                </div>
            )}
        </div>
    );
}
