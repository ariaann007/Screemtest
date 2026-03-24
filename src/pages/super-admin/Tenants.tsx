import { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { 
  Search, Plus, Filter, MoreHorizontal, Eye, 
  ShieldCheck, AlertCircle, TrendingUp, Users,
  Globe, Briefcase, Mail, Phone, Calendar,
  CreditCard, Loader2, Info, Building2
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PlatformTenant, PlatformPlan, PlatformTenantStatus } from "@/types/super-admin";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminTenants() {
  const { tenants, createTenant, suspendTenant, impersonate, changePlan } = useSuperAdmin();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlatformTenantStatus | "All">("All");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<PlatformTenant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: PlatformTenantStatus) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Trial": return "bg-primary/10 text-primary border-primary/20";
      case "Suspended": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Dormant": return "bg-white/5 text-muted-foreground border-white/10";
    }
  };

  const getPlanColor = (plan: PlatformPlan) => {
    switch (plan) {
      case "Enterprise": return "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20";
      case "Pro": return "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20";
      case "Starter": return "bg-white/5 text-muted-foreground border-white/10";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Building2 className="h-32 w-32 rotate-12" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-wider">Tenant Portfolio</h1>
            <p className="text-xs text-muted-foreground font-bold mt-0.5 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              {tenants.length} Managed Organisations across 3 Regions
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="relative z-10 h-12 px-6 rounded-2xl gap-2 font-black italic uppercase italic tracking-wider shadow-[0_8px_20px_rgba(var(--primary-rgb),0.2)] hover:translate-y-[-2px] transition-all active:scale-95 leading-none">
          <Plus className="h-5 w-5" />
          Create New Tenant
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by instance ID, name, or lead administrator..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 bg-[#111113] border-[#1a1a1c] rounded-2xl text-xs font-bold font-mono focus-visible:ring-primary/20"
          />
        </div>
        <div className="flex bg-[#111113] border border-[#1a1a1c] p-1 rounded-2xl shrink-0">
          {(["All", "Active", "Trial", "Suspended"] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                statusFilter === f ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-[#111113] border border-[#1a1a1c] rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] border-b border-[#1a1a1c] text-muted-foreground text-[10px] uppercase font-black tracking-widest leading-none">
                <th className="px-6 py-5">Tenant Identity</th>
                <th className="px-6 py-5">Plan & Tier</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Efficiency</th>
                <th className="px-6 py-5 text-center">Scale</th>
                <th className="px-6 py-5 text-right">Revenue</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1c]">
              {filteredTenants.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-sm group-hover:text-primary transition-colors">{t.name}</span>
                      <span className="text-[10px] text-muted-foreground font-bold tracking-tighter uppercase tabular-nums opacity-60">ID: {t.id} · {t.adminEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner", getPlanColor(t.plan))}>
                      {t.plan}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", getStatusColor(t.status))}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000 shadow-[0_0_10px_currentColor]", 
                            t.healthScore > 90 ? "bg-success text-success" : t.healthScore > 70 ? "bg-primary text-primary" : "bg-[#f87171] text-[#f87171]"
                          )} 
                          style={{ width: `${t.healthScore}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground/50 italic">{t.healthScore}% Health</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-bold">{t.workerCount} Workers</span>
                      <span className="text-[10px] text-muted-foreground font-medium opacity-60">Across {t.entityCount} Hubs</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-white font-black text-sm">£{(t.mrr).toLocaleString()}</span>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase opacity-60">PER MONTH</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="bg-transparent border-[#1a1a1c] hover:bg-white/5 h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all italic active:scale-95 group-hover:border-primary/40"
                         onClick={() => {
                            setSelectedTenant(t);
                            setIsDetailModalOpen(true);
                         }}
                       >
                         <Eye className="h-3 w-3 mr-1.5" />
                         Inspect
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                         onClick={() => {
                            setSelectedTenant(t);
                            setIsImpersonateModalOpen(true);
                         }}
                       >
                         <ShieldCheck className="h-4 w-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTenants.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
              <Building2 className="h-16 w-16 mb-4 text-muted-foreground" />
              <p className="text-sm font-bold uppercase italic tracking-widest mb-1">No Tenants Found</p>
              <p className="text-xs text-muted-foreground max-w-[300px] font-medium leading-relaxed uppercase italic opacity-60">Refine your strategic filters or search query to locate targeted organisational instances.</p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE TENANT MODAL */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-xl bg-[#0a0a0b] border-[#1a1a1c] p-0 overflow-hidden rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="bg-primary/5 p-8 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                 <Building2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-white uppercase italic tracking-widest">Deploy Instance</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-bold mt-1 uppercase italic opacity-60">Provisioning a new client environment on SCREEM Cloud Infrastructure.</DialogDescription>
              </div>
            </div>
            <DialogHeader className="p-0 space-y-0" />
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            createTenant({
              name: fd.get("name") as string,
              subdomain: fd.get("slug") as string,
              adminName: fd.get("adminName") as string,
              adminEmail: fd.get("adminEmail") as string,
              plan: fd.get("plan") as PlatformPlan,
              country: fd.get("country") as string,
              industry: fd.get("industry") as string,
              trialPeriodDays: parseInt(fd.get("trial") as string),
              internalNotes: fd.get("notes") as string,
            });
            setIsCreateModalOpen(false);
            toast({ title: "Tenant created", description: "Environment initialized. Welcome invite dispatched." });
          }} className="p-8 space-y-8 bg-[#0a0a0b]">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Organisational Name</Label>
                <Input name="name" required placeholder="Acme Global Inc." className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Slug / Subdomain</Label>
                <div className="relative group">
                  <Input name="slug" required placeholder="acme" className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 pr-24 h-12" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/30 italic">.screem.io</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Root Admin Full Name</Label>
                <Input name="adminName" required placeholder="Alexander Screem" className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Root Admin Email</Label>
                <Input name="adminEmail" type="email" required placeholder="alex@acme.com" className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 h-12" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Platform Strategic Plan</Label>
                <Select name="plan" defaultValue="Starter">
                  <SelectTrigger className="bg-white/[0.03] border-white/5 rounded-xl h-12 text-xs font-bold font-mono focus:ring-primary/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111113] border-[#1a1a1c] text-white">
                    <SelectItem value="Starter" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Starter Tier</SelectItem>
                    <SelectItem value="Pro" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Pro Enterprise</SelectItem>
                    <SelectItem value="Enterprise" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Strategic Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Trial Duration (Days)</Label>
                <Input name="trial" type="number" defaultValue="30" className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 h-12" />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Origin Country</Label>
                <Input name="country" required defaultValue="United Kingdom" className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Target Industry</Label>
                <Input name="industry" required defaultValue="Recruitment" className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#f0f0f2]/50 ml-1 italic">Internal Deployment Notes</Label>
              <Input name="notes" placeholder="Onboarding phase 1 targeted for Q2." className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono focus-visible:ring-primary/20 h-12" />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl h-12 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-colors">Abort</Button>
              <Button type="submit" className="rounded-xl h-12 px-8 text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)] transition-all active:scale-95">Initiate Cluster</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TENANT DETAIL SLIDE-OVER (Implemented as Dialog for simplicity) */}
      {selectedTenant && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl bg-[#0a0a0b] border-[#1a1a1c] p-0 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full max-h-[90vh]">
              {/* Left Column: Metadata */}
              <div className="bg-[#111113] border-r border-[#1a1a1c] p-8 space-y-8 overflow-y-auto">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/10">
                    <Building2 className="h-10 w-10 shrink-0" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase italic tracking-wider">{selectedTenant.name}</h2>
                    <p className="text-[10px] text-primary font-black uppercase tracking-tighter tabular-nums opacity-80 mt-1">INSTANCE_ID: {selectedTenant.id}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <DetailItem icon={Globe} label="Subdomain" value={`${selectedTenant.subdomain}.screem.io`} />
                  <DetailItem icon={Mail} label="Root Administrator" value={selectedTenant.adminName} subValue={selectedTenant.adminEmail} />
                  <DetailItem icon={Calendar} label="Registered On" value={new Date(selectedTenant.createdAt).toLocaleDateString()} />
                  <DetailItem icon={Briefcase} label="Industry Sector" value={selectedTenant.industry} />
                  <DetailItem icon={ShieldCheck} label="Sponsor Licence" value={selectedTenant.sponsorLicenceNumber} />
                </div>

                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full bg-white/[0.02] border-white/5 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest italic group hover:border-primary/40 transition-all" onClick={() => setIsPlanModalOpen(true)}>
                    <TrendingUp className="h-3.5 w-3.5 mr-2 text-primary" />
                    Modify Strategic Tier
                  </Button>
                  <Button variant="outline" className="w-full bg-white/[0.02] border-white/5 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest italic group hover:border-[#f87171]/40 transition-all" onClick={() => setIsSuspendModalOpen(true)}>
                    <AlertCircle className="h-3.5 w-3.5 mr-2 text-[#f87171]" />
                    Execute Suspension
                  </Button>
                </div>
              </div>

              {/* Right Column: Usage & Analytics */}
              <div className="lg:col-span-2 p-8 space-y-8 overflow-y-auto bg-[#0a0a0b]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground italic flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Strategic Resource Utilization
                  </h3>
                   <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", getStatusColor(selectedTenant.status))}>
                      {selectedTenant.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <UsageCard label="Legal Entities" current={selectedTenant.entityCount} limit={selectedTenant.limits.entities} color="text-amber-500" />
                  <UsageCard label="Managed Sites" current={1} limit={selectedTenant.limits.sites} color="text-blue-500" />
                  <UsageCard label="Sponsored Workers" current={selectedTenant.workerCount} limit={selectedTenant.limits.workers} color="text-primary" />
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 opacity-60">Revenue Contribution</p>
                    <p className="text-2xl font-black text-white font-mono">£{selectedTenant.mrr.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-primary italic uppercase tracking-widest mt-1">Strategic recurring</p>
                  </div>
                </div>

                <div className="bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-success" />
                        Infrastructure Actions
                      </h4>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="bg-transparent border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-11 rounded-xl gap-2 active:scale-95 transition-all outline-none border-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" onClick={() => setIsImpersonateModalOpen(true)}>
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Impersonate
                      </Button>
                      <Button variant="outline" className="bg-transparent border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-11 rounded-xl gap-2 active:scale-95 transition-all outline-none border-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" onClick={() => setIsExportModalOpen(true)}>
                        <CreditCard className="h-3.5 w-3.5 text-[#a855f7]" /> Strategic Export
                      </Button>
                   </div>
                </div>

                {selectedTenant.internalNotes && (
                  <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl relative">
                    <Info className="absolute top-4 right-4 h-4 w-4 text-primary opacity-30" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 italic">Internal Strategist Annotations</p>
                    <p className="text-[11px] text-primary/80 leading-relaxed font-bold">{selectedTenant.internalNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* IMPERSONATE MODAL */}
      {selectedTenant && (
        <Dialog open={isImpersonateModalOpen} onOpenChange={setIsImpersonateModalOpen}>
           <DialogContent className="max-w-md bg-[#0a0a0b] border-[#1a1a1c] p-0 overflow-hidden rounded-3xl shadow-2xl">
              <div className="bg-amber-500/10 p-6 border-b border-amber-500/20 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase italic tracking-widest leading-none mb-1">Secure Support Protocol</h3>
                  <p className="text-[10px] text-amber-500/70 font-black uppercase tracking-tighter italic leading-none">Establishing shadow session: {selectedTenant.name}</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                 <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                   <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-amber-500 font-bold leading-relaxed uppercase italic">
                     This action will grant full strategic access to the client instance. All interactions will be cryptographically logged to the platform audit trace.
                   </p>
                 </div>

                 <div className="space-y-4">
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 italic">Protocol Reason</Label>
                     <Select defaultValue="Support Request">
                       <SelectTrigger className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono outline-none border-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] text-white">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-[#111113] border-[#1a1a1c] text-white">
                         <SelectItem value="Support Request" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Reported Technical Incident</SelectItem>
                         <SelectItem value="Strategic Review" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Strategic Internal Review</SelectItem>
                         <SelectItem value="Onboarding" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Deployment Onboarding Support</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 italic">Session TTL (Minutes)</Label>
                     <Select defaultValue="30">
                        <SelectTrigger className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono outline-none border-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111113] border-[#1a1a1c] text-white">
                          <SelectItem value="30" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">30 Minutes (Core Analysis)</SelectItem>
                          <SelectItem value="60" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">60 Minutes (Extended Support)</SelectItem>
                          <SelectItem value="120" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">120 Minutes (Critical Incident)</SelectItem>
                        </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <Button 
                   className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black uppercase italic italic h-12 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                   onClick={() => {
                     impersonate(selectedTenant.id, 30, "Support Request", "");
                     setIsImpersonateModalOpen(false);
                     setIsDetailModalOpen(false);
                   }}
                 >
                   Establish Shadow Session
                 </Button>
              </div>
           </DialogContent>
        </Dialog>
      )}

      {/* PLAN CHANGE MODAL */}
      {selectedTenant && (
        <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
          <DialogContent className="max-w-xl bg-[#0a0a0b] border-[#1a1a1c] p-0 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-primary/10 p-8 border-b border-primary/20">
               <h3 className="text-xl font-black text-white uppercase italic tracking-widest leading-none mb-1">Modify Strategic Tier</h3>
               <p className="text-[10px] text-primary/70 font-black uppercase tracking-tighter italic leading-none mt-1">Adjusting market positioning for: {selectedTenant.name}</p>
            </div>
            <div className="p-8 space-y-8 bg-[#0a0a0b]">
               <div className="grid grid-cols-3 gap-4">
                  {(["Starter", "Pro", "Enterprise"] as PlatformPlan[]).map(p => (
                    <div 
                      key={p} 
                      onClick={() => changePlan(selectedTenant.id, p)}
                      className={cn(
                        "p-5 rounded-2xl border cursor-pointer transition-all hover:scale-105 group active:scale-95",
                        selectedTenant.plan === p 
                          ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]" 
                          : "bg-white/[0.02] border-white/5 hover:border-white/20"
                      )}
                    >
                       <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", selectedTenant.plan === p ? "text-primary" : "text-muted-foreground")}>{p} Tier</p>
                       <p className="text-xl font-black text-white italic transition-all group-hover:translate-x-1">£{p === "Starter" ? '150' : p === "Pro" ? '450' : '2,500'}</p>
                       <p className="text-[8px] font-bold text-muted-foreground/40 uppercase mt-2">PER_MONTH</p>
                    </div>
                  ))}
               </div>

               <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsPlanModalOpen(false)} className="rounded-xl h-12 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-colors">Abort</Button>
                  <Button onClick={() => setIsPlanModalOpen(false)} className="rounded-xl h-12 px-8 text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg active:scale-95 transition-all">Commit Tier Update</Button>
               </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* SUSPEND MODAL */}
      {selectedTenant && (
        <Dialog open={isSuspendModalOpen} onOpenChange={setIsSuspendModalOpen}>
           <DialogContent className="max-w-md bg-[#0a0a0b] border-[#1a1a1c] p-0 overflow-hidden rounded-3xl shadow-2xl">
              <div className="bg-[#f87171]/10 p-6 border-b border-[#f87171]/20">
                 <h3 className="font-black text-white uppercase italic tracking-widest leading-none mb-1">Administrative Prohibition</h3>
                 <p className="text-[10px] text-[#f87171]/70 font-black uppercase tracking-tighter italic leading-none mt-1">Executing suspension protocol for: {selectedTenant.name}</p>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 italic">Violation Category</Label>
                      <Select defaultValue="Payment Failure">
                        <SelectTrigger className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-xs font-bold font-mono outline-none border-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111113] border-[#1a1a1c] text-white">
                          <SelectItem value="Payment Failure" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Default: Recurring Payment Failure</SelectItem>
                          <SelectItem value="Terms Violation" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Terms of Service Violation</SelectItem>
                          <SelectItem value="Security Risk" className="text-xs font-bold focus:bg-primary/20 focus:text-primary transition-all">Anomalous Infrastructure Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>

                 <Button 
                   className="w-full bg-[#f87171] hover:bg-[#ef4444] text-white font-black uppercase italic italic h-12 rounded-xl shadow-[0_8px_20px_rgba(239,68,68,0.3)] transition-all active:scale-95"
                   onClick={() => {
                      suspendTenant(selectedTenant.id, "Payment Failure", "System auto-suspension triggered.");
                      setIsSuspendModalOpen(false);
                      setIsDetailModalOpen(false);
                      toast({ variant: "destructive", title: "Tenant Suspended", description: "Instance deactivated. Network access killed." });
                   }}
                 >
                   Confirm Deactivation Protocol
                 </Button>
              </div>
           </DialogContent>
        </Dialog>
      )}

      {/* EXPORT MODAL */}
      {selectedTenant && (
        <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
          <DialogContent className="max-w-md bg-[#0a0a0b] border-[#1a1a1c] p-0 overflow-hidden rounded-3xl shadow-2xl">
            <div className="bg-primary/10 p-6 border-b border-primary/20">
               <h3 className="font-black text-white uppercase italic tracking-widest leading-none mb-1">Strategic Data Export</h3>
               <p className="text-[10px] text-primary/70 font-black uppercase tracking-tighter italic leading-none mt-1">Staging instance extraction for: {selectedTenant.name}</p>
            </div>
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-2 gap-3">
                  {["entities.csv", "sites.csv", "workers.csv", "licences.csv", "users.csv", "audit.csv"].map(file => (
                    <div key={file} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                       <span className="text-[10px] font-black font-mono text-muted-foreground group-hover:text-white transition-colors uppercase italic">{file}</span>
                       <div className="h-2 w-2 rounded-full bg-primary/30 group-hover:bg-primary shadow-inner transition-colors" />
                    </div>
                  ))}
               </div>

               <Button 
                 className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase italic italic h-12 rounded-xl shadow-lg active:scale-95 transition-all outline-none border-none"
                 onClick={() => {
                   setIsExportModalOpen(false);
                   toast({ title: "Export queued", description: "Data bundle generation in progress. Download link will follow via admin email." });
                 }}
               >
                 Queue Extraction Cluster
               </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, subValue }: any) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="h-9 w-9 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-muted-foreground shrink-0 group-hover:text-primary transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50 italic">{label}</span>
        <span className="text-xs font-black text-[#e1e1e3] whitespace-nowrap overflow-hidden transition-colors">{value}</span>
        {subValue && <span className="text-[10px] text-muted-foreground font-bold italic opacity-40">{subValue}</span>}
      </div>
    </div>
  );
}

function UsageCard({ label, current, limit, color }: any) {
  const percentage = Math.min((current / limit) * 100, 100);
  return (
    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-3 group hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 italic">{label}</p>
        <span className={cn("text-xs font-black font-mono", color)}>{current} / <span className="opacity-40">{limit}</span></span>
      </div>
      <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden shadow-inner flex">
        <div 
          className={cn("h-full transition-all duration-1000 shadow-[0_0_10px_currentColor]", color.replace("text-", "bg-"))} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
