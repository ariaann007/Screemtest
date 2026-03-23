import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Building2, Globe, MapPin, ShieldCheck, 
  Users, Briefcase, Plus, ChevronRight, Save, X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrganisationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detemine active tab based on URL or local state
  const path = location.pathname.split("/").pop();
  const activeTab = ["profile", "legal-entities", "group-structure", "sites"].includes(path || "") ? path : "profile";

  const handleTabChange = (tab: string) => {
    navigate(`/organisation/${tab}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organisation Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your tenant's identity and key contacts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm" className="gap-2">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "profile" && <OrganisationProfile />}
          {activeTab === "legal-entities" && <LegalEntities />}
          {activeTab === "group-structure" && <GroupStructure />}
          {activeTab === "sites" && <SitesAndBranches />}
        </div>

        {/* Info / Progress Card */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold text-sm mb-4">Profile Completeness</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>Organisation Data</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "85%" }} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Complete your organisation profile to unlock all compliance automated reporting features.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-primary/5 p-4 border-primary/10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary mb-1">Compliance Shield Active</p>
                <p className="text-[10px] text-primary/70 leading-relaxed font-medium">
                  Your legal identity data is being automatically validated against Companies House records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganisationProfile() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Legal Identity Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-muted/30 px-5 py-4 border-b">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Legal Identity
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">The registered legal details for this organisation as filed at Companies House.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Legal Name</Label>
              <Input defaultValue="Acme Group Holdings Ltd" className="bg-muted/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Trading Name</Label>
              <Input defaultValue="Acme Group" className="bg-muted/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Company Registration Number</Label>
              <Input defaultValue="09991234" className="bg-muted/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">VAT Number</Label>
              <Input defaultValue="GB 123 4567 89" className="bg-muted/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Organisation Type</Label>
              <Select defaultValue="group_holding">
                <SelectTrigger className="bg-muted/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group_holding">Group Holding Company</SelectItem>
                  <SelectItem value="subsidiary">Subsidiary</SelectItem>
                  <SelectItem value="independent">Independent Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Industry</Label>
              <Select defaultValue="recruitment">
                <SelectTrigger className="bg-muted/20">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruitment">Recruitment & Staffing</SelectItem>
                  <SelectItem value="tech">Technology & Software</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Address Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-muted/30 px-5 py-4 border-b">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Registered Address
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">The official registered address as filed with the relevant authority.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Address Line 1</Label>
            <Input defaultValue="14 Portman Square" className="bg-muted/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">City / Town</Label>
              <Input defaultValue="London" className="bg-muted/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Postcode</Label>
              <Input defaultValue="W1H 6LW" className="bg-muted/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalEntities() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Legal Entities</h2>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Entity</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Acme UK Ltd", type: "Main Subsidiary", reg: "01234567", status: "Active" },
          { name: "Acme Global Solutions", type: "Holding", reg: "09991234", status: "Active" },
          { name: "Acme Payroll Services", type: "Service Entity", reg: "05556666", status: "Active" },
        ].map(ent => (
          <div key={ent.name} className="rounded-xl border bg-card p-5 hover:border-primary transition-colors cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-bold text-sm group-hover:text-primary transition-colors">{ent.name}</p>
                <p className="text-xs text-muted-foreground">{ent.type} · Reg: {ent.reg}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                {ent.status}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Sponsor Licence Connected</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupStructure() {
  return (
    <div className="rounded-xl border bg-card p-12 text-center bg-muted/5 border-dashed">
      <div className="max-w-md mx-auto space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Globe className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Organisation Hierarchy</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Visualize and manage reporting lines between legal entities, branches, and departments.
        </p>
        <div className="pt-4">
          <Button variant="outline">Initialize Structure Map</Button>
        </div>
      </div>
    </div>
  );
}

function SitesAndBranches() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Sites & Branches</h2>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Site</Button>
      </div>
      <div className="space-y-3">
        {[
          { name: "London HQ", address: "14 Portman Square, London, W1H 6LW", type: "Headquarters" },
          { name: "Manchester Tech Hub", address: "40 King Street, Manchester, M2 6WT", type: "Branch" },
          { name: "Edinburgh Office", address: "83 Princes St, Edinburgh, EH2 2ER", type: "Remote Hub" },
        ].map(site => (
          <div key={site.name} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/20 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{site.name}</p>
              <p className="text-xs text-muted-foreground">{site.address}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {site.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
