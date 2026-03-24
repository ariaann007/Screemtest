import { useSuperAdmin } from "@/context/SuperAdminContext";
import { 
  CreditCard, TrendingUp, DollarSign, Calendar, 
  ArrowUpRight, Building2, ShieldCheck, ListFilter,
  CheckCircle2, XCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SuperAdminBilling() {
  const { tenants } = useSuperAdmin();

  const totalMRR = tenants.reduce((acc, t) => acc + t.mrr, 0);
  const projectedARR = totalMRR * 12;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#111113] border border-[#1a1a1c] p-8 rounded-3xl relative overflow-hidden group shadow-2xl lg:col-span-2">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-12 translate-y-[-10px] scale-150">
             <TrendingUp className="h-40 w-40 -rotate-12" />
           </div>
           
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
              <div className="space-y-6">
                 <div>
                    <h1 className="text-2xl font-black text-white uppercase italic tracking-wider leading-none mb-1">Revenue Distribution</h1>
                    <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 italic uppercase opacity-60 leading-none">
                       Strategic Platform Monetization Ledger
                    </p>
                 </div>
                 <div className="flex gap-12">
                    <div>
                       <span className="text-[10px] font-black text-primary uppercase italic tracking-widest leading-none mb-2 block">Monthly Recurring</span>
                       <h2 className="text-4xl font-black text-white font-mono tabular-nums leading-none">£{totalMRR.toLocaleString()}</h2>
                    </div>
                    <div className="hidden sm:block">
                       <span className="text-[10px] font-black text-success uppercase italic tracking-widest leading-none mb-2 block">Projected Annual</span>
                       <h2 className="text-4xl font-black text-white font-mono opacity-40 tabular-nums leading-none italic">£{projectedARR.toLocaleString()}</h2>
                    </div>
                 </div>
              </div>

              <div className="flex gap-2">
                 <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest italic rounded-xl h-12 px-8 active:scale-95 transition-all shadow-[0_8px_20px_rgba(var(--primary-rgb),0.2)]">
                   Strategic Report Launch
                 </Button>
              </div>
           </div>
        </div>

        <div className="bg-[#111113] border border-[#1a1a1c] p-8 rounded-3xl flex flex-col justify-center gap-6 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/5 blur-3xl -translate-y-16 translate-x-16 group-hover:bg-[#a855f7]/10 transition-colors" />
           
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                 <Building2 className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase italic tracking-tighter opacity-60 leading-none">Platform ARPU</p>
                 <p className="text-xl font-black text-white font-mono leading-none mt-1">£{(totalMRR / Math.max(tenants.length, 1)).toFixed(0)}</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase italic tracking-tighter opacity-60 leading-none">Payment Success</p>
                 <p className="text-xl font-black text-white font-mono leading-none mt-1">100.0%</p>
              </div>
           </div>
        </div>
      </div>

      {/* Tenant Billing Listing */}
      <div className="bg-[#111113] border border-[#1a1a1c] rounded-3xl overflow-hidden shadow-2xl">
         <div className="px-6 py-5 border-b border-[#1a1a1c] flex items-center justify-between bg-white/[0.02]">
            <h3 className="font-black text-xs flex items-center gap-2 uppercase tracking-[0.2em] italic leading-none">
               <CreditCard className="h-4 w-4 text-primary" />
               Client Strategic Billing Cycle
            </h3>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black text-muted-foreground uppercase italic opacity-40">SORT_ORDER: REVENUE_DESC</span>
               <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 active:scale-90 transition-all">
                  <ListFilter className="h-4 w-4 opacity-40" />
               </Button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums leading-none">
               <thead>
                  <tr className="bg-white/[0.01] border-b border-[#1a1a1c] text-muted-foreground text-[10px] uppercase font-black tracking-widest leading-none">
                     <th className="px-6 py-5">Instance Alias & Domain</th>
                     <th className="px-6 py-5">Platform Tier</th>
                     <th className="px-6 py-5">Recurring MRR</th>
                     <th className="px-6 py-5">Strategic Cycle</th>
                     <th className="px-6 py-5 text-right font-bold italic">Diagnostic Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#1a1a1c]">
                  {tenants.sort((a,b) => b.mrr - a.mrr).map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.01] transition-all group">
                       <td className="px-6 py-5">
                          <div className="flex flex-col gap-1 tracking-tight">
                             <span className="text-[11px] font-black text-white uppercase italic tracking-wider leading-none transition-colors group-hover:text-primary">{t.name}</span>
                             <p className="text-[9px] text-muted-foreground font-black uppercase italic tracking-tighter opacity-40 leading-none mt-0.5">{t.subdomain}.screem.io</p>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner transition-all group-hover:px-4",
                            t.plan === "Enterprise" ? "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20" :
                            t.plan === "Pro" ? "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20" :
                            "bg-white/5 text-muted-foreground border-white/10"
                          )}>
                             {t.plan}
                          </span>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                             <span className="text-[11px] font-black text-white leading-none">£{t.mrr.toLocaleString()}</span>
                             <div className="h-1 w-6 bg-primary/20 rounded-full overflow-hidden shadow-inner hidden sm:block">
                                <div className="h-full bg-primary/60" style={{ width: t.plan === "Enterprise" ? '100%' : t.plan === "Pro" ? '40%' : '15%' }} />
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex flex-col gap-1 leading-none uppercase">
                             <span className="text-[11px] font-black text-white uppercase italic tracking-wider leading-none flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground opacity-40" />
                                April 01, 2026
                             </span>
                             <span className="text-[9px] text-muted-foreground font-black tracking-tighter opacity-40 italic">Invoicing via platform stripe root</span>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 text-success opacity-40 group-hover:opacity-100 transition-opacity">
                             <span className="text-[9px] font-black uppercase italic tracking-[0.2em] leading-none">PAYMENT_NOMINAL</span>
                             <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
