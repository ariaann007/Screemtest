import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSuperAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials as requested
    if (email === "admin@screem.io" && password === "superadmin2024") {
      setTimeout(() => {
        login(email);
        toast({
          title: "Access Granted",
          description: "Welcome to the SCREEM Platform Portal.",
        });
        navigate("/super-admin/dashboard");
      }, 800);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Invalid super admin credentials.",
        });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">SCREEM <span className="text-primary font-light underline-offset-4 decoration-primary/40 underline">PLATFORM</span></h1>
          <p className="text-muted-foreground font-medium text-sm">Restricted Internal Access Only</p>
        </div>

        <div className="bg-[#111113] border border-[#1a1a1c] p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Admin Identity</Label>
              <Input 
                type="email"
                placeholder="email@screem.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0a0a0b] border-[#1a1a1c] text-sm h-12 focus-visible:ring-primary/20 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Key</Label>
              <Input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0a0a0b] border-[#1a1a1c] text-sm h-12 focus-visible:ring-primary/20 rounded-xl"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl transition-all active:scale-95 text-base shadow-[0_8px_20px_rgba(var(--primary-rgb),0.2)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Authorize Access"
              )}
            </Button>
          </form>
        </div>

        <div className="bg-destructive/5 border border-destructive/10 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-[10px] text-destructive font-bold uppercase tracking-wider leading-relaxed">
            Unauthorized entry attempts are strictly monitored and logged for security auditing.
          </p>
        </div>
      </div>
    </div>
  );
}
