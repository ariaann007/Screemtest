import { Tenant, UserRole } from "./index";

export type PlatformTenantStatus = "Active" | "Trial" | "Suspended" | "Dormant";
export type PlatformPlan = "Starter" | "Pro" | "Enterprise";

export interface PlatformTenant extends Tenant {
  plan: PlatformPlan;
  status: PlatformTenantStatus;
  entityCount: number;
  workerCount: number;
  healthScore: number;
  lastLogin: string;
  mrr: number;
  adminEmail: string;
  adminName: string;
  subdomain: string;
  country: string;
  industry: string;
  trialPeriodDays: number;
  internalNotes?: string;
  limits: {
    entities: number;
    sites: number;
    workers: number;
  };
}

export interface PlatformAlert {
  id: string;
  tenantId: string;
  tenantName: string;
  severity: "Critical" | "Warning" | "Info";
  description: string;
  timestamp: string;
  isRead: boolean;
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  agentName: string;
  agentEmail: string;
  action: string;
  actionType: "Create" | "Update" | "Delete" | "Impersonate" | "Suspend" | "PlanChange" | "Login";
  targetTenantId?: string;
  targetTenantName?: string;
  details: string;
}

export interface ImpersonationSession {
  id: string;
  tenantId: string;
  tenantName: string;
  adminName: string;
  adminEmail: string;
  startTime: string;
  durationMinutes: number;
  endTime: string;
  reason: string;
  notes?: string;
  status: "Active" | "Completed" | "Terminated";
}

export interface SystemServiceStatus {
  name: string;
  status: "Healthy" | "Degraded" | "Down";
  latency?: string;
  uptime: string;
  icon: string;
}

export interface SuperAdminSession {
  email: string;
  name: string;
  token: string;
  loginTime: string;
}
