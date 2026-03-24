import { useSuperAdmin } from "@/context/SuperAdminContext";
import { 
  FileText, Search, Filter, ShieldCheck, 
  Activity, ArrowDownAz, Calendar, Clock,
  MoreVertical, RefreshCcw, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SuperAdminAudit() {
  const { auditLogs } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.targetTenantName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl group relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-12 translate-y-[-10px]">
          <FileText className="h-40 w-40 -rotate-12" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center text-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-wider leading-none mb-1">Audit Ledger</h1>
            <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 italic uppercase opacity-60">
               Cryptographically Immutable Platform Traceability Hub
            </p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button 
             variant="outline" 
             className="bg-white/[0.02] border-white/5 h-10 px-4 rounded-xl gap-2 font-black italic uppercase tracking-wider transition-all hover:bg-white/5 active:scale-95 text-[10px] text-muted-foreground transition-all"
             onClick={handleRefresh}
             disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
            Refresh Trace
          </Button>
          <Button className="bg-[#a855f7] hover:bg-[#a855f7]/90 text-white text-[10px] font-black uppercase tracking-widest italic rounded-xl h-10 px-6 active:scale-95 transition-all shadow-[0_4px_15px_rgba(168,85,247,0.3)]">
            Export .CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#a855f7] transition-colors" />
          <Input 
            placeholder="Search the audit stream: agent, action, or organisational context..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 bg-[#111113] border-[#1a1a1c] rounded-2xl text-[10px] font-black italic uppercase italic tracking-wider focus-visible:ring-[#a855f7]/20 transition-all font-mono shadow-inner"
          />
        </div>
        <div className="flex gap-2 bg-[#111113] border border-[#1a1a1c] p-1.5 rounded-2xl shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 text-muted-foreground italic active:scale-95 transition-all">
            <Calendar className="h-3.5 w-3.5" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 text-muted-foreground italic active:scale-95 transition-all border border-transparent hover:border-white/10">
            <Filter className="h-3.5 w-3.5" />
            Action: All
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#111113] border border-[#1a1a1c] rounded-3xl overflow-hidden shadow-2xl relative group">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#a855f7]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono tabular-nums leading-none">
            <thead>
              <tr className="bg-white/[0.02] border-b border-[#1a1a1c] text-muted-foreground text-[10px] uppercase font-black tracking-widest">
                <th className="px-6 py-5">Index & Timestamp</th>
                <th className="px-6 py-5">Platform Agent</th>
                <th className="px-6 py-5">Operation Vector</th>
                <th className="px-6 py-5">Structural Context</th>
                <th className="px-6 py-5 text-right italic font-bold">Trace Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1c]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.01] transition-all group border-l-2 border-l-transparent hover:border-l-[#a855f7]">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-muted-foreground tracking-tighter uppercase italic opacity-40 leading-none">ID: {log.id.split("-").pop()}</span>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-white tracking-widest uppercase italic font-mono leading-none">
                        <Clock className="h-3.5 w-3.5 text-[#a855f7]" />
                        {new Date(log.timestamp).toLocaleDateString()} · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-[11px] uppercase italic tracking-wider">{log.agentName}</span>
                      <span className="text-[10px] text-muted-foreground font-bold tracking-tighter opacity-40">{log.agentEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        log.actionType === "Create" ? "bg-success/10 text-success border-success/20" :
                        log.actionType === "Suspend" ? "bg-destructive/10 text-destructive border-destructive/20" :
                        log.actionType === "Impersonate" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]" :
                        "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20 shadow-inner"
                      )}>
                        {log.actionType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-black text-[11px] uppercase italic tracking-wider leading-none">{log.targetTenantName || "PLATFORM_SYSTEM"}</span>
                      {log.targetTenantId && <span className="text-[9px] text-[#a855f7] font-black uppercase tracking-tighter opacity-60 italic">UID: {log.targetTenantId}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right max-w-[300px]">
                    <p className="text-[11px] text-muted-foreground font-bold uppercase italic leading-relaxed line-clamp-2 truncate opacity-70 group-hover:opacity-100 group-hover:text-white transition-all transition-all duration-300">
                      {log.action}
                      <span className="ml-2 opacity-30 group-hover:opacity-60 transition-opacity">({log.details})</span>
                    </p>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                 <tr>
                    <td colSpan={5} className="py-24 text-center">
                       <ShieldCheck className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-10 animate-pulse" />
                       <h3 className="text-lg font-black text-white uppercase italic tracking-widest mb-1 opacity-40 leading-none">Empty Trace Ledger</h3>
                       <p className="text-xs text-muted-foreground max-w-[300px] mx-auto leading-relaxed font-bold uppercase italic opacity-20">No system actions have been committed to this audit buffer.</p>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity">
        <div className="bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl flex items-start gap-4 shadow-xl">
          <Activity className="h-6 w-6 text-primary shrink-0 opacity-40" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] mb-2 leading-none">Ledger Integrity Status</h4>
            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase italic">Every action recorded in this view is signed with SHA-256 and replicated across redundant platform storage nodes for compliance and verification.</p>
          </div>
        </div>
        <div className="bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl flex items-start gap-4 shadow-xl">
           <ArrowDownAz className="h-6 w-6 text-[#a855f7] shrink-0 opacity-40" />
           <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 leading-none">Automated Lifecycle</h4>
            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase italic">Retention policy is currently set to 7 years for all administrative actions. Records are cryptographically frozen after 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
