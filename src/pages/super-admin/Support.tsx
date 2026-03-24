import { useSuperAdmin } from "@/context/SuperAdminContext";
import { 
  Monitor, Clock, ShieldCheck, AlertCircle, 
  Trash2, PlayCircle, History, ExternalLink,
  Loader2, UserCircle2, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function SuperAdminSupport() {
  const { activeSessions, auditLogs } = useSuperAdmin();
  const [isLoading, setIsLoading] = useState(false);

  // Filter audit logs for impersonation events
  const sessionHistory = auditLogs.filter(log => log.actionType === "Impersonate");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl group relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-12 translate-y-[-10px]">
          <Monitor className="h-40 w-40 -rotate-12" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-wider leading-none mb-1">Impersonation Hub</h1>
            <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 italic uppercase opacity-60 leading-none">
               Shadow Session Monitoring and Strategic Diagnostics
            </p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl flex items-center gap-4 shadow-inner">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-white uppercase italic tracking-widest opacity-40 leading-none">Active Probes</span>
                <span className="text-lg font-black font-mono text-amber-500 leading-none mt-1">{activeSessions.length}</span>
             </div>
             <div className="h-8 w-px bg-white/10" />
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-white uppercase italic tracking-widest opacity-40 leading-none">History Scan</span>
                <span className="text-lg font-black font-mono text-primary leading-none mt-1">{sessionHistory.length}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b] italic flex items-center gap-2 ml-1">
            <PlayCircle className="h-4 w-4 animate-pulse" />
            Active Shadow Instances
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map((session) => (
              <div key={session.id} className="bg-[#111113] border border-amber-500/30 p-6 rounded-3xl relative overflow-hidden group shadow-[0_15px_30px_-5px_rgba(245,158,11,0.05)]">
                 <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_15px_rgba(var(--amber-rgb),0.5)]" />
                 
                 <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                         <Building2 className="h-5 w-5" />
                       </div>
                       <div>
                         <h4 className="font-black text-white uppercase italic tracking-wider leading-none">{session.tenantName}</h4>
                         <span className="text-[10px] text-amber-500 font-bold uppercase italic opacity-60">ID: {session.tenantId}</span>
                       </div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded text-[10px] font-black font-mono text-amber-500 animate-pulse">
                      <Countdown target={session.endTime} />
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-muted-foreground uppercase italic tracking-widest">Protocol Agent:</span>
                       <span className="text-white uppercase italic">{session.adminName}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-muted-foreground uppercase italic tracking-widest">Access Root:</span>
                       <span className="text-white uppercase italic truncate max-w-[150px]">{session.reason}</span>
                    </div>
                 </div>

                 <div className="mt-8 flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-10 rounded-xl gap-2 active:scale-95 transition-all outline-none border-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                      <ExternalLink className="h-3.5 w-3.5" /> Launch Probe
                    </Button>
                    <Button variant="destructive" className="bg-[#f87171]/10 border border-[#f87171]/20 hover:bg-[#f87171] text-[#f87171] hover:text-white h-10 w-10 p-0 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            ))}
            {activeSessions.length === 0 && (
              <div className="col-span-full py-20 bg-white/[0.01] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-center group">
                 <Monitor className="h-12 w-12 mb-4 text-muted-foreground opacity-20 group-hover:opacity-40 transition-opacity" />
                 <p className="text-[11px] font-black text-white/30 uppercase italic tracking-widest italic leading-none mb-1">Null Active Connections</p>
                 <p className="text-[10px] text-muted-foreground/20 font-bold max-w-[280px] leading-relaxed uppercase italic">No Shadow sessions are currently established across the platform cluster.</p>
              </div>
            )}
         </div>
      </div>

      {/* Session History */}
      <div className="bg-[#111113] border border-[#1a1a1c] rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="px-6 py-5 border-b border-[#1a1a1c] flex items-center justify-between bg-white/[0.02]">
          <h3 className="font-black text-xs flex items-center gap-2 uppercase tracking-widest italic leading-none">
            <History className="h-4 w-4 text-primary" />
            Historical Access Ledger
          </h3>
          <span className="text-[10px] font-black text-muted-foreground uppercase italic opacity-40">RETENTION: 365 DAYS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono tabular-nums leading-none">
            <thead>
              <tr className="bg-white/[0.01] border-b border-[#1a1a1c] text-muted-foreground text-[10px] uppercase font-black tracking-widest leading-none">
                <th className="px-6 py-5">Diagnostic Instance</th>
                <th className="px-6 py-5">Platform Agent</th>
                <th className="px-6 py-5">Temporal Trace</th>
                <th className="px-6 py-5">Operation Vector</th>
                <th className="px-6 py-5 text-right font-bold italic">Integrity Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1c]">
              {sessionHistory.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1 tracking-tight">
                       <span className="text-[11px] font-black text-white uppercase italic tracking-wider leading-none transition-colors group-hover:text-primary">{log.targetTenantName}</span>
                       <span className="text-[9px] text-[#f59e0b] font-black uppercase italic tracking-tighter opacity-60 leading-none">INSTANCE: {log.targetTenantId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1 leading-none">
                       <span className="text-[11px] font-black text-white uppercase italic tracking-wider leading-none">{log.agentName}</span>
                       <span className="text-[9px] text-muted-foreground font-black tracking-tighter opacity-40 leading-none">{log.agentEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-[11px] font-bold text-muted-foreground/60 transition-colors group-hover:text-white uppercase italic leading-none">
                        {new Date(log.timestamp).toLocaleDateString()} · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex flex-col gap-1.5 min-w-[150px] leading-none">
                        <p className="text-[11px] font-black text-muted-foreground group-hover:text-white truncate uppercase italic italic leading-none">{log.action}</p>
                        <div className="flex items-center gap-2">
                           <div className="h-1 w-8 bg-primary/20 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-primary/60 w-full" />
                           </div>
                           <span className="text-[8px] font-black text-primary/40 leading-none">STAGED</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <div className="flex items-center justify-end gap-2 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-black uppercase italic tracking-[0.2em] leading-none">VERIFIED</span>
                        <ShieldCheck className="h-3.5 w-3.5" />
                     </div>
                  </td>
                </tr>
              ))}
              {sessionHistory.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-24 text-center">
                      <History className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-10" />
                      <h3 className="text-lg font-black text-white uppercase italic tracking-widest mb-1 opacity-20 leading-none italic">History Buffer Purged</h3>
                      <p className="text-xs text-muted-foreground max-w-[300px] mx-auto leading-relaxed font-bold uppercase italic opacity-10">No shadow session records currently exist in this administrative context.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Countdown({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(target).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{timeLeft}</span>;
}
