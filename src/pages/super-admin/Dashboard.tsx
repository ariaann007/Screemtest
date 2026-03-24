import { useSuperAdmin } from "@/context/SuperAdminContext";
import { 
  Users, Building2, TrendingUp, AlertCircle, 
  Activity, ArrowRight, ShieldCheck, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const { tenants, alerts, auditLogs } = useSuperAdmin();

  const metrics = [
    { label: "Total Tenants", value: tenants.length, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active + Trial", value: tenants.filter(t => t.status !== "Suspended").length, icon: Activity, color: "text-success", bg: "bg-success/10" },
    { label: "Workers Under Management", value: tenants.reduce((acc, t) => acc + t.workerCount, 0), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Monthly Recurring Revenue", value: `£${tenants.reduce((acc, t) => acc + t.mrr, 0).toLocaleString()}`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Platform Overview</h1>
        <p className="text-muted-foreground font-semibold flex items-center gap-2 mt-1">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Secure SCREEM Platform Management Dashboard
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#111113] border border-[#1a1a1c] p-6 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className={cn("inline-flex items-center justify-center p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110 duration-300", m.bg, m.color)}>
              <m.icon className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-70 italic">{m.label}</p>
            <h2 className="text-3xl font-black text-white font-mono">{m.value}</h2>
          </div>
        ))}
      </div>

      {/* Mid Section: Alerts + Health Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts Panel */}
        <div className="bg-[#111113] border border-[#1a1a1c] rounded-3xl overflow-hidden flex flex-col h-[400px]">
          <div className="px-6 py-5 border-b border-[#1a1a1c] flex items-center justify-between bg-white/[0.02]">
            <h3 className="font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
              <AlertCircle className="h-4 w-4 text-[#f87171]" />
              Critical Platform Alerts
            </h3>
            <span className="bg-[#f87171]/20 text-[#f87171] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#f87171]/30">2 UNREAD</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {alerts.slice(0, 5).map((a) => (
              <div key={a.id} className="p-4 rounded-2xl hover:bg-white/[0.03] transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-2 w-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_10px_currentColor]",
                    a.severity === "Critical" ? "bg-[#f87171] text-[#f87171]" : "bg-[#fb923c] text-[#fb923c]"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white mb-0.5 group-hover:text-primary transition-colors">{a.tenantName}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{a.description}</p>
                    <p className="text-[9px] text-muted-foreground/40 font-mono mt-2 flex items-center gap-2 uppercase tracking-wider font-bold">
                      <Clock className="h-3 w-3" />
                      {new Date(a.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tenant Health scores Chart (Mock) */}
        <div className="bg-[#111113] border border-[#1a1a1c] rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-48 w-full flex items-end justify-between gap-px px-4 overflow-hidden rounded-2xl bg-white/[0.01] p-4 border border-white/5">
            {tenants.map((t, idx) => (
              <div key={t.id} className="flex-1 group relative flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-1000 group-hover:brightness-125 min-h-2 shadow-[0_4px_20px_-2px_rgba(var(--primary-rgb),0.2)]",
                    t.healthScore > 90 ? "bg-success/50" : t.healthScore > 70 ? "bg-primary/50" : "bg-destructive/50"
                  )} 
                  style={{ height: `${t.healthScore}%` }}
                />
                <span className="text-[8px] font-bold text-muted-foreground rotate-45 origin-left truncate w-12 flex-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.name}
                </span>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                  {t.healthScore}%
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider">Tenant Health Distribution</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">Showing comparative health scores across the platform portfolio.</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-[#111113] border border-[#1a1a1c] rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1a1a1c] bg-white/[0.02]">
          <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Platform Activity Stream
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1a1a1c] text-muted-foreground text-[10px] uppercase font-bold tracking-widest text-left">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4">Action Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Tenant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1c]">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-muted-foreground font-black opacity-60 italic">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-6 py-4 text-white font-bold">{log.agentName}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter uppercase border",
                      log.actionType === "Create" ? "bg-success/10 text-success border-success/20" :
                      log.actionType === "Delete" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      log.actionType === "Impersonate" ? "bg-primary/10 text-primary border-primary/20" :
                      "bg-white/5 text-muted-foreground border-white/10"
                    )}>
                      {log.actionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground group-hover:text-white transition-colors">{log.action}</td>
                  <td className="px-6 py-4 text-muted-foreground italic truncate">{log.targetTenantName || "-"}</td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic opacity-50">No activity recorded for this platform agent yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
