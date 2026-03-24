import { useSuperAdmin } from "@/context/SuperAdminContext";
import { 
  AlertCircle, Building2, Bell, Clock, 
  Trash2, ExternalLink, ShieldCheck, Mail, BellOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SuperAdminAlerts() {
  const { alerts, tenants } = useSuperAdmin();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl group relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-12">
          <Bell className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#f87171]/10 border border-[#f87171]/20 flex items-center justify-center text-[#f87171] shadow-[0_0_20px_rgba(248,113,113,0.1)]">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-wider">Cross-Tenant Alerts</h1>
            <p className="text-xs text-muted-foreground font-bold mt-0.5 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
               Platform Resilience and Risk Mitigation Hub
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="relative z-10 bg-white/[0.02] border-white/5 h-10 px-4 rounded-xl gap-2 font-black italic uppercase tracking-wider transition-all hover:bg-white/5 active:scale-95 leading-none text-[10px] text-muted-foreground">
            <BellOff className="h-3.5 w-3.5" />
            Clear All Read
          </Button>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {alerts.map((a) => (
          <div key={a.id} className="bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl relative overflow-hidden group hover:border-[#f87171]/30 transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-500 group-hover:scale-110",
                a.severity === "Critical" ? "bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20 shadow-[0_0_15px_rgba(248,113,113,0.1)]" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                <AlertCircle className="h-6 w-6" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-3 mb-1">
                   <h3 className="font-black text-white uppercase italic tracking-wider leading-none">{a.tenantName}</h3>
                   <span className={cn(
                     "px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border",
                     a.severity === "Critical" ? "bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                   )}>
                     {a.severity}
                   </span>
                </div>
                <p className="text-sm font-bold text-muted-foreground group-hover:text-[#e1e1e3] transition-colors leading-relaxed">{a.description}</p>
                <div className="flex items-center gap-4 pt-3">
                   <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold tracking-widest uppercase italic opacity-60">
                     <Clock className="h-3.5 w-3.5 opacity-40" />
                     {new Date(a.timestamp).toLocaleString()}
                   </div>
                   <div className="h-1 w-1 rounded-full bg-white/10" />
                   <div className="flex items-center gap-2 text-[10px] text-primary font-black tracking-widest uppercase italic group-hover:translate-x-1 transition-transform">
                     <Building2 className="h-3.5 w-3.5 opacity-40" />
                     INSTANCE: {a.tenantId}
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                 <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest italic rounded-lg h-9 px-4 active:scale-95 transition-all">
                   <Mail className="h-3.5 w-3.5 mr-1.5" />
                   Notify Admin
                 </Button>
                 <Button variant="outline" size="sm" className="bg-white/[0.02] border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest italic rounded-lg h-9 px-4 active:scale-95 transition-all text-muted-foreground">
                   <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                   Dismiss
                 </Button>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="bg-[#111113] border border-[#1a1a1c] border-dashed p-32 rounded-3xl flex flex-col items-center justify-center text-center opacity-30 group hover:opacity-100 transition-all">
            <ShieldCheck className="h-20 w-20 mb-6 text-success animate-pulse" />
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest mb-1">Strategy Optimal</h3>
            <p className="text-xs text-muted-foreground max-w-[400px] leading-relaxed font-bold uppercase italic opacity-60">All architectural instances are operating within nominal compliance thresholds. Platform risk is currently null.</p>
          </div>
        )}
      </div>
    </div>
  );
}
