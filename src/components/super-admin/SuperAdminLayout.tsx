import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, AlertCircle, FileText, 
  HelpCircle, CreditCard, Activity, LogOut, ShieldCheck,
  Building2, Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { useEffect, useState } from "react";

export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { currentSession, logout, activeSessions } = useSuperAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Basic guard: redirect to login if not authenticated
    if (!currentSession && location.pathname !== "/super-admin/login") {
      navigate("/super-admin/login");
    }
  }, [currentSession, location.pathname, navigate]);

  if (!currentSession && location.pathname !== "/super-admin/login") return null;

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-[#e1e1e3] font-sans selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1a1a1c] bg-[#111113] flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#1a1a1c] gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">SCREEM<span className="text-primary">ADMIN</span></span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 opacity-50">Platform Management</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/super-admin/dashboard" active={location.pathname === "/super-admin/dashboard"} />
          <SidebarItem icon={Building2} label="Tenants" href="/super-admin/tenants" active={location.pathname === "/super-admin/tenants"} />
          <SidebarItem icon={AlertCircle} label="Alerts" href="/super-admin/alerts" active={location.pathname === "/super-admin/alerts"} badge="2" />
          <SidebarItem icon={FileText} label="Audit Logs" href="/super-admin/audit" active={location.pathname === "/super-admin/audit"} />
          <SidebarItem icon={Monitor} label="Support Sessions" href="/super-admin/support" active={location.pathname === "/super-admin/support"} />
          <SidebarItem icon={CreditCard} label="Billing Overview" href="/super-admin/billing" active={location.pathname === "/super-admin/billing"} />
          <SidebarItem icon={Activity} label="System Health" href="/super-admin/health" active={location.pathname === "/super-admin/health"} />
        </nav>

        <div className="p-4 border-t border-[#1a1a1c]">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="h-8 w-8 rounded-full bg-[#1c1c1e] border border-[#2c2c2e] flex items-center justify-center text-xs font-bold">SA</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentSession?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{currentSession?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate("/super-admin/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-[#f87171] hover:bg-[#1c0d0d] transition-colors mt-2"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Banner for Support Sessions */}
        {activeSessions.length > 0 && activeSessions[0].status === "Active" && (
          <div className="bg-[#f59e0b] text-[#451a03] h-10 flex items-center justify-center gap-4 text-sm font-bold shadow-lg z-50 animate-in fade-in slide-in-from-top duration-500">
            <Monitor className="h-4 w-4 animate-pulse" />
            <span>SUPPORT SESSION ACTIVE — Viewing as {activeSessions[0].tenantName}</span>
            <div className="bg-[#451a03]/10 px-2 py-0.5 rounded text-xs font-mono tabular-nums">
              <Countdown target={activeSessions[0].endTime} />
            </div>
            <button className="underline hover:no-underline text-xs">Terminate Session</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, href, active, badge }: any) {
  return (
    <Link 
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative",
        active 
          ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]" 
          : "text-muted-foreground hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground")} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-[#f87171] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-[#111113]">
          {badge}
        </span>
      )}
      {active && (
        <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
      )}
    </Link>
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
        setTimeLeft("00:00");
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
