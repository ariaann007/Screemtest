import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  Clock, MapPin, ListFilter, Search, Calendar,
  CheckCircle2, AlertCircle, PlayCircle, StopCircle, 
  ArrowLeftRight, Filter, ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type AttendanceStatus = "Present" | "Absent" | "Half Day" | "On Leave" | "On Duty" | "Work From Home";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  shift?: string;
}

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: "a1", employeeName: "Priya Sharma", date: "2026-03-23", status: "Present", checkIn: "08:55 AM", checkOut: "05:10 PM", shift: "Morning Shift" },
  { id: "a2", employeeName: "James Okafor", date: "2026-03-23", status: "On Leave", shift: "Morning Shift" },
  { id: "a3", employeeName: "Maria Kowalski", date: "2026-03-23", status: "Work From Home", checkIn: "09:05 AM", checkOut: "05:45 PM", shift: "Standard Shift" },
  { id: "a4", employeeName: "David Owusu", date: "2026-03-23", status: "Present", checkIn: "08:30 AM", checkOut: "04:30 PM", shift: "Standard Shift" },
  { id: "a5", employeeName: "Lakshmi Nair", date: "2026-03-23", status: "Half Day", checkIn: "09:00 AM", checkOut: "01:00 PM", shift: "Morning Shift" },
  { id: "a6", employeeName: "Tom Hutchins", date: "2026-03-23", status: "Present", checkIn: "09:15 AM", shift: "Standard Shift" },
];

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: "bg-success/10 text-success border-success/20",
  Absent: "bg-destructive/10 text-destructive border-destructive/20",
  "Half Day": "bg-warning/10 text-warning border-warning/20",
  "On Leave": "bg-info/10 text-info border-info/20",
  "On Duty": "bg-primary/10 text-primary border-primary/20",
  "Work From Home": "bg-secondary/10 text-secondary border-secondary/20",
};

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"log" | "requests" | "stats">("log");
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState("09:15 AM");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "On Time", value: 4, color: "text-success" },
    { label: "WFH", value: 1, color: "text-secondary" },
    { label: "Half Day", value: 1, color: "text-warning" },
    { label: "On Leave", value: 1, color: "text-info" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage daily employee check-ins and attendance requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsRequestModalOpen(true)}>
            <ArrowLeftRight className="h-4 w-4 mr-1.5" />Request
          </Button>
          <Button className={cn(isCheckedIn ? "bg-destructive hover:bg-destructive/90" : "bg-success hover:bg-success/90")}
                  onClick={() => setIsCheckInModalOpen(true)}>
            {isCheckedIn ? <><StopCircle className="h-4 w-4 mr-1.5" />Check Out</> : <><PlayCircle className="h-4 w-4 mr-1.5" />Check In</>}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Stats & Current Status */}
        <div className="space-y-6">
          {/* User Status Card */}
          <div className="rounded-2xl border bg-card/50 p-6 relative overflow-hidden group shadow-sm active:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4">
              <div className={cn("h-3 w-3 rounded-full animate-pulse", isCheckedIn ? "bg-success shadow-[0_0_8px_hsl(142,71%,45%)]" : "bg-muted")} />
            </div>
            
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Current Status</p>
            <h2 className="text-3xl font-black mb-1">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</h2>
            <p className="text-sm text-muted-foreground mb-6 font-medium">{currentTime.toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center text-success">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none mb-1">Check In</p>
                    <p className="text-sm font-bold leading-none">{isCheckedIn ? lastCheckIn : "--:--"}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
              </div>

              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none mb-1">Location</p>
                    <p className="text-sm font-bold leading-none">Standard Shift</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
                <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Monthly Attendance Card (Placeholder) */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Attendance Summary</h3>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Average Working Hours</span>
                <span className="font-bold">8h 15m</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Late Check-ins</span>
                <span className="font-bold text-destructive">2</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Present Days</span>
                <span className="font-bold text-success">18/20</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Log Table and Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-1 border-b">
            {[
              { id: "log", label: "Attendance Log" },
              { id: "requests", label: "Attendance Requests" },
              { id: "stats", label: "Shift Timing" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "log" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search employee..." className="pl-9 text-sm" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-10 px-3">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" /> Mar 23, 2026
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30 border-b">
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Employee</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-center">In</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-center">Out</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Shift</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {records.map(record => (
                        <tr key={record.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {record.employeeName.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="font-medium text-xs">{record.employeeName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", STATUS_COLORS[record.status])}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-muted-foreground font-medium">{record.checkIn || "-"}</td>
                          <td className="px-4 py-3 text-center text-xs text-muted-foreground font-medium">{record.checkOut || "-"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{record.shift}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="rounded-xl border border-dashed p-12 text-center bg-card">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-sm">No Pending Requests</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-6">Attendance request feature syncs with Leave Management.</p>
              <Button size="sm" onClick={() => setIsRequestModalOpen(true)}>Create New Request</Button>
            </div>
          )}
          {/* Shift Timing Tab */}
          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-bold mb-4">Standard Shift Policy</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm font-medium">Shift Start Time</span>
                    <span className="text-sm font-bold">09:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm font-medium">Shift End Time</span>
                    <span className="text-sm font-bold">05:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm font-medium">Late Entry Threshold</span>
                    <span className="text-sm font-bold text-warning">15 Minutes</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm font-medium">Half Day Calculation</span>
                    <span className="text-sm font-bold">4 Hours worked</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      <Dialog open={isCheckInModalOpen} onOpenChange={setIsCheckInModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {isCheckedIn ? "Check Out" : "Employee Check In"}
            </DialogTitle>
            <DialogDescription>
              {isCheckedIn ? "You are about to check out for today." : "Confirm your attendance for today."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="text-center p-6 bg-muted/30 rounded-2xl border border-border/50">
              <p className="text-4xl font-black mb-1">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-none">
                {currentTime.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Work Location</Label>
              <Select defaultValue="Office">
                <SelectTrigger className="h-10 text-sm font-medium"><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office" className="text-sm">Main Office</SelectItem>
                  <SelectItem value="WFH" className="text-sm">Work From Home</SelectItem>
                  <SelectItem value="Site" className="text-sm">On-site Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Shift</Label>
              <p className="text-sm font-bold pl-1">Standard Shift (09:00 AM - 05:00 PM)</p>
            </div>
          </div>

          <DialogFooter className="sm:justify-start gap-2 pt-2">
            <Button className={cn("w-full transition-all active:scale-95", isCheckedIn ? "bg-destructive hover:bg-destructive/90 shadow-[0_4px_12px_rgba(239,68,68,0.2)]" : "bg-success hover:bg-success/90 shadow-[0_4px_12px_rgba(34,197,94,0.2)]")}
                    onClick={() => {
                      const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      if (!isCheckedIn) {
                        setLastCheckIn(timeStr);
                        // Add or update record for the user (Alex Screem)
                        setRecords(prev => {
                          const existing = prev.find(r => r.employeeName === "Alex Screem" && r.date === "2026-03-23");
                          if (existing) return prev;
                          return [...prev, { id: `a${Date.now()}`, employeeName: "Alex Screem", date: "2026-03-23", status: "Present", checkIn: timeStr, shift: "Standard Shift" }];
                        });
                      } else {
                        setRecords(prev => prev.map(r => r.employeeName === "Alex Screem" && r.date === "2026-03-23" ? { ...r, checkOut: timeStr } : r));
                      }
                      setIsCheckedIn(!isCheckedIn);
                      setIsCheckInModalOpen(false);
                    }}>
              {isCheckedIn ? "Finish Day" : "Start Working"}
            </Button>
            <Button variant="ghost" className="w-full text-xs" onClick={() => setIsCheckInModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Request Modal (Simplified version of Frappe HR style) */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance Request</DialogTitle>
            <DialogDescription>Apply for attendance regularization or specific work types.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" defaultValue="2026-03-24" />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" defaultValue="2026-03-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select defaultValue="WFH">
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WFH">Work From Home</SelectItem>
                  <SelectItem value="On Duty">On Duty</SelectItem>
                  <SelectItem value="Regularization">Attendance Regularization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Explanation</Label>
              <Textarea placeholder="Details..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsRequestModalOpen(false)}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
