import { useSuperAdmin } from "@/context/SuperAdminContext";
import { 
  Activity, Zap, ShieldCheck, Database, 
  Mail, HardDrive, Cpu, Wifi, CheckCircle2,
  AlertCircle, XCircle, ChevronRight, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuperAdminHealth() {
  const { tenants } = useSuperAdmin();

  const services = [
    { name: "Core API Cluster", status: "Healthy", latency: "14ms", uptime: "99.99%", icon: Cpu, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { name: "PostgreSQL Strategic", status: "Healthy", latency: "2ms", uptime: "100%", icon: Database, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { name: "STMP Mail Gateway", status: "Healthy", latency: "420ms", uptime: "99.95%", icon: Mail, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { name: "Auth Shadow Protocol", status: "Healthy", latency: "8ms", uptime: "99.99%", icon: ShieldCheck, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { name: "AWS Storage Cluster", status: "Degraded", latency: "140ms", uptime: "99.2%", icon: HardDrive, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { name: "Vercel / Cloudflare Edge", status: "Healthy", latency: "4ms", uptime: "100%", icon: Wifi, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl group relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-12 translate-y-[-10px] scale-150">
          <Zap className="h-40 w-40 -rotate-12" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] group-hover:animate-pulse">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-wider leading-none mb-1">System Health Core</h1>
            <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 italic uppercase opacity-60 leading-none">
               Real-Time Platform Diagnostic Matrix and Infrastructure Sync
            </p>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white uppercase italic tracking-widest opacity-40 leading-none">Diagnostic Pulse</span>
              <span className="text-xl font-black font-mono text-success leading-none mt-1 uppercase italic tracking-widest">Nominal</span>
           </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.name} className={cn(
            "p-6 rounded-3xl border transition-all duration-300 relative group overflow-hidden bg-[#111113] hover:border-white/20 hover:translate-y-[-4px]",
            s.border
          )}>
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
               <s.icon className="h-20 w-20 shrink-0" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
               <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border shrink-0", s.bg, s.color, s.border)}>
                  <s.icon className="h-5 w-5" />
               </div>
               <div className="text-right">
                  <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", s.bg, s.color, s.border)}>
                    {s.status}
                  </span>
               </div>
            </div>

            <div className="space-y-4 relative z-10">
               <div>
                  <h3 className="font-black text-white uppercase italic tracking-wider leading-none transition-colors group-hover:text-primary">{s.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase italic opacity-40 mt-1">AWS_EKS_CLUSTER_NODE v4.2</p>
               </div>
               <div className="flex justify-between items-center py-3 border-y border-white/5 font-mono">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-muted-foreground opacity-40 uppercase tracking-widest leading-none">Latency Trace</span>
                     <span className="text-xs font-black text-white leading-none mt-1">{s.latency}</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-[9px] font-black text-muted-foreground opacity-40 uppercase tracking-widest leading-none">Uptime Sync</span>
                     <span className="text-xs font-black text-white leading-none mt-1">{s.uptime}</span>
                  </div>
               </div>
            </div>

            <div className="mt-4 flex items-center gap-2 group cursor-pointer">
               <span className="text-[9px] font-black text-primary uppercase italic tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">Inspect Diagnostic Trace</span>
               <ChevronRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#111113] border border-[#1a1a1c] p-8 rounded-3xl shadow-xl space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 italic leading-none">
               <Cpu className="h-4 w-4 text-primary" />
               Resource Consumption Matrix
            </h3>
            <div className="space-y-6">
               <UsageItem label="Cluster Compute Util" value={42} color="bg-primary" />
               <UsageItem label="Strategic Memory Peak" value={68} color="bg-[#a855f7]" />
               <UsageItem label="Relational Buffer Scan" value={15} color="bg-success" />
               <UsageItem label="Network Mesh IO" value={31} color="bg-blue-500" />
            </div>
         </div>

         <div className="bg-[#111113] border border-[#1a1a1c] p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center space-y-6 group overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/[0.02] scale-150 rotate-12 opacity-40" />
            
            <div className="h-24 w-24 rounded-full border-2 border-primary/20 flex items-center justify-center relative shadow-[0_0_60px_rgba(var(--primary-rgb),0.1)] group-hover:scale-110 transition-transform duration-700">
               <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{ animationDuration: '4s' }} />
               <Globe className="h-10 w-10 text-primary" />
            </div>
            
            <div className="space-y-2 relative z-10 transition-transform duration-500">
               <h3 className="font-black text-white uppercase italic tracking-widest italic leading-none">Platform Geo-Replication</h3>
               <p className="text-xs text-muted-foreground max-w-[320px] font-bold uppercase italic opacity-60 leading-relaxed">
                  Traffic is distributed across 6 global edge nodes. Data integrity is confirmed in London, New York, and Singapore.
               </p>
            </div>
            
            <div className="flex gap-4 relative z-10">
               <div className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-start min-w-[120px]">
                  <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40 mb-1 leading-none">Edge Load</span>
                  <span className="text-sm font-black text-white font-mono leading-none">38.2K <span className="text-[9px] opacity-40">REQ/S</span></span>
               </div>
               <div className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-start min-w-[120px]">
                  <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40 mb-1 leading-none">Integrity v2</span>
                  <span className="text-sm font-black text-success font-mono leading-none flex items-center gap-2">
                     <CheckCircle2 className="h-3 w-3" />
                     NOMINAL
                  </span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function UsageItem({ label, value, color }: any) {
   return (
      <div className="space-y-2 group">
         <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest italic group-hover:translate-x-1 transition-transform">
            <span className="text-muted-foreground opacity-60 italic">{label}</span>
            <span className="text-white">{value}%</span>
         </div>
         <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden shadow-inner flex">
            <div className={cn("h-full transition-all duration-1000 shadow-[0_0_10px_currentColor]", color)} style={{ width: `${value}%` }} />
         </div>
      </div>
   );
}
